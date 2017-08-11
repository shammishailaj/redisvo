package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/BurntSushi/toml"
	"github.com/garyburd/redigo/redis"
	"github.com/xuyu/goredis"
	"io/ioutil"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

// serverPoolMap storage redis connnect
var serverPoolMap = make(map[string]*redis.Pool, 0)

// goRedisMap storage redis connnect
var goRedisMap = make(map[string]*goredis.Redis, 0)

// MonitorMessage the data output by the monitor command is pushed to
// the front end via websockets
var MonitorMessage = make(chan MonitorInfo, 0)

// serverMessage
var serverMessage = make(chan string, 0)

// ctrlcMessage the font end active close websockets connect via ctr+c or ctrl+z
var ctrlcMessage = make(chan string, 0)

// receiveOver when the font end active close websockets connect via ctr+c or ctrl+z
// send message to realMonitorTime of goroutine will exit actively
var receiveOver = make(chan string, 0)

// clientActiveClose when the font end active close websockets connect via close browser
// send message to realMonitorTime of goroutine will exit actively
var clientActiveClose = make(chan bool, 0)

// redisConfMap
var redisConfMap = make(map[string]string, 0)

// cacheRedisConf
var cacheRedisConf = make(map[string]map[string]string, 0)

// dir
var dir string

var needUpdateVersion bool = false

// MAXFIELDNUMBER only show the max of key and
// SELF_CONF_FILE is relative path
// UpdateURL new version pull url
const (
	MAXFIELDNUMBER = 100000
	SELF_CONF_FILE = `.` + string(os.PathSeparator) + `redisvo.toml`
	UpdateURL      = `https://api.github.com/repos/taomin597715379/redisvo/tags`
	Version        = `1.0`
)

// Len interface int64Slice struct implement
func (c Int64Slice) Len() int {
	return len(c)
}

// Swap interface int64Slice struct implement
func (c Int64Slice) Swap(i, j int) {
	c[i], c[j] = c[j], c[i]
}

// Less interface int64Slice struct implement
func (c Int64Slice) Less(i, j int) bool {
	return c[i] < c[j]
}

// Len interface StringSlice struct implement
func (s StringSlice) Len() int {
	return len(s)
}

// Swap interface StringSlice struct implement
func (s StringSlice) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}

// Less interface StringSlice struct implement
func (s StringSlice) Less(i, j int) bool {
	return s[i] < s[j]
}

// Len interface KeyNameSlice struct implement
func (s KeyNameSlice) Len() int {
	return len(s)
}

// Swap interface KeyNameSlice struct implement
func (s KeyNameSlice) Swap(i, j int) {
	s[i].Name, s[j].Name = s[j].Name, s[i].Name
	s[i].Score, s[j].Score = s[j].Score, s[i].Score
}

// Less interface KeyNameSlice struct implement
func (s KeyNameSlice) Less(i, j int) bool {
	return s[i].Name < s[j].Name
}

// getConnectFromPool Each redis-server: ip, port and a redis-connect mapping
func getConnectFromPool(server string) redis.Conn {
	if _, ok := serverPoolMap[server]; !ok {
		rdsPool := newRdsPool(server, "")
		serverPoolMap[server] = rdsPool
	}
	return serverPoolMap[server].Get()
}

// newRdsPool connection estabish
func newRdsPool(server, auth string) *redis.Pool {
	return &redis.Pool{
		MaxIdle:     100,
		MaxActive:   30,
		IdleTimeout: 60 * time.Second,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", server)
			if err != nil {
				return nil, err
			}
			if auth == "" {
				return c, err
			}
			if _, err := c.Do("AUTH", auth); err != nil {
				c.Close()
				return nil, err
			}
			return c, err
		},
		TestOnBorrow: func(c redis.Conn, t time.Time) error {
			_, err := c.Do("PING")
			return err
		},
	}
}

// Dial connection estabish
func Dial(server, auth string) (*goredis.Redis, error) {
	connect, err := goredis.Dial(&goredis.DialConfig{
		Network: "tcp",
		Address: server,
		Timeout: 10 * time.Second,
		MaxIdle: 10,
	})
	return connect, err
}

// saveContent
func saveContent(rdsConn redis.Conn, style, name, field, content string, idx int64) (err error) {
	switch style {
	case `string`:
		_, err = redis.String(rdsConn.Do("set", name, content))
		break
	case `hash`:
		_, err = redis.String(rdsConn.Do("hset", name, field, content))
		break
	case `list`:
		_, err = redis.String(rdsConn.Do("lset", name, idx, content))
		break
	case `set`:
		_, err = redis.String(rdsConn.Do("srem", name, field))
		_, err = redis.String(rdsConn.Do("sadd", name, content))
		break
	case `zset`:
		_, err = redis.String(rdsConn.Do("zrem", name, field))
		_, err = redis.String(rdsConn.Do("zadd", name, idx, content))
		break
	default:
		break
	}
	return err
}

// setKeyOrFieldByStyle
func setKeyOrFieldByStyle(rdsConn redis.Conn, style, name, field string) (content string, err error) {
	var value string
	switch style {
	case `string`:
		content, err = redis.String(rdsConn.Do("set", name, field))
		break
	case `hash`:
		if field == `` {
			field = `New Key`
		}
		content, err = redis.String(rdsConn.Do("hset", name, field, "New Member"))
		break
	case `list`:
		if field == `` {
			field = `New Item`
			content, err = redis.String(rdsConn.Do("lpush", name, field))
			return content, err
		}
		splitField := strings.Split(field, `_`)
		value = splitField[1]
		if splitField[0] == `` {
			value = `New Item`
		}
		if splitField[0] == `head` {
			content, err = redis.String(rdsConn.Do("lpush", name, value))
		}
		if splitField[0] == `tail` {
			content, err = redis.String(rdsConn.Do("rpush", name, value))
		}
		break
	case `set`:
		if field == `` {
			field = `New Member`
		}
		content, err = redis.String(rdsConn.Do("sadd", name, field))
		return content, err
	case `zset`:
		if field == `` {
			field = `New Zmember`
			content, err = redis.String(rdsConn.Do("zadd", name, 0, field))
			return ``, nil
		}
		splitField := strings.Split(field, `_`)
		value = splitField[1]
		if splitField[1] == `` {
			value = `New Item`
		}
		score, _ := strconv.ParseInt(splitField[0], 10, 0)
		content, err = redis.String(rdsConn.Do("zadd", name, score, value))
		break
	default:
		break
	}
	return content, err
}

// getContentByTypeNameAnd according type, name, key_name to get content
func getContentByTypeNameAnd(rdsConn redis.Conn, typ, name, keyName string) (content string) {
	switch typ {
	case `string`:
		content, _ = redis.String(rdsConn.Do("get", name))
		break
	case `hash`:
		content, _ = redis.String(rdsConn.Do("hget", name, keyName))
		break
	case `list`:
		content = keyName
		break
	case `set`:
		content = keyName
		break
	case `zset`:
		content = keyName
		break
	default:
		break
	}
	return content
}

// getKeysByTypeName according type, name to key and content
func getKeysByTypeName(rdsConn redis.Conn, typ, name string) (keyNames []KeyName, content string) {
	var i, l int
	switch typ {
	case `string`:
		content, _ = redis.String(rdsConn.Do("get", name))
		break
	case `hash`:
		fields, _ := redis.Strings(rdsConn.Do("hkeys", name))
		if len(fields) > 0 {
			for k, field := range fields {
				if i < MAXFIELDNUMBER {
					keyNames = append(keyNames, KeyName{Name: field, Score: k})
					i++
				}
			}
		}
		if len(keyNames) > 0 {
			content, _ = redis.String(rdsConn.Do("hget", name, keyNames[0].Name))
		}
		break
	case `list`:
		fields, _ := redis.Strings(rdsConn.Do("lrange", name, 0, -1))
		if len(fields) > 0 {
			for k, field := range fields {
				keyNames = append(keyNames, KeyName{Name: field, Score: k})
			}
		}
		if len(keyNames) > 0 {
			content = keyNames[0].Name
		}
		break
	case `set`:
		fields, _ := redis.Strings(rdsConn.Do("smembers", name))
		if len(fields) > 0 {
			for k, field := range fields {
				keyNames = append(keyNames, KeyName{Name: field, Score: k})
			}
		}
		if len(keyNames) > 0 {
			content = keyNames[0].Name
		}
		break
	case `zset`:
		fields, _ := redis.Strings(rdsConn.Do("zrange", name, 0, -1, "WITHSCORES"))
		if len(fields) > 0 {
			for i := 0; i < len(fields); i = i + 2 {
				j, _ := strconv.Atoi(fields[i+1])
				keyNames = append(keyNames, KeyName{Name: fields[i], Score: j})
				l++
			}
		}
		if len(keyNames) > 0 {
			content = keyNames[0].Name
		}
		break
	default:
		break
	}
	return keyNames, content
}

// getServerInfos get server info for example redis-version, clients and so on
// others server info will be sort by ip
func getServerInfos() string {
	var buf []byte
	var wg sync.WaitGroup
	var l0, l1 sync.RWMutex
	var conf ConfigInfo
	var serverInfosIncVersion ServerExtInfoIncVersion
	var serverInfos []ServerExtInfo
	var serverOnline = make(map[int64]ServerExtInfo, 0)
	var serverNoOnline = make(map[int64]ServerExtInfo, 0)
	_, err := toml.DecodeFile(dir+SELF_CONF_FILE, &conf)
	if err != nil {
		return ``
	}
	wg.Add(len(conf.ServerInfo))
	for _, serverInfo := range conf.ServerInfo {
		go func(serverInfo Info) {
			timeout := time.Duration(100) * time.Millisecond
			if c, err := redis.DialTimeout("tcp", serverInfo.Host+":"+serverInfo.Port, timeout, timeout, timeout); err == nil {
				version, memory, clients, commands, count := getInfoByField(c)
				s := ServerExtInfo{ServerAddr: serverInfo.Host + ":" + serverInfo.Port,
					UserMemory:   memory,
					ClientOnline: clients,
					ExeCommand:   commands,
					RedisVer:     version,
					KeyNumber:    count}
				c.Close()
				l0.Lock()
				serverOnline[ipToInteger(serverInfo.Host)+portToInteger(serverInfo.Port)] = s
				l0.Unlock()
			} else {
				s := ServerExtInfo{ServerAddr: serverInfo.Host + ":" + serverInfo.Port,
					UserMemory:   "-",
					ClientOnline: "-",
					ExeCommand:   "-",
					RedisVer:     "-",
					KeyNumber:    "-"}
				l1.Lock()
				serverNoOnline[ipToInteger(serverInfo.Host)+portToInteger(serverInfo.Port)] = s
				l1.Unlock()
			}
			wg.Done()
		}(serverInfo)
	}
	wg.Wait()
	tmpInfo := sortServerInfo(serverOnline)
	serverInfos = append(serverInfos, tmpInfo...)
	tmpInfo = sortServerInfo(serverNoOnline)
	serverInfos = append(serverInfos, tmpInfo...)
	serverInfosIncVersion.ServerExtInfos = serverInfos
	isneed, now_version, update_verison := checkUpdate()
	serverInfosIncVersion.IsUpdateVersion = isneed
	serverInfosIncVersion.NowVersion = now_version
	serverInfosIncVersion.UpdateVersion = update_verison
	buf, _ = json.Marshal(serverInfosIncVersion)
	return string(buf)
}

// removeServerInfo delete server info from toml file
func removeServerInfo(name string) string {
	var conf ConfigInfo
	var sBuffer bytes.Buffer
	_, err := toml.DecodeFile(dir+SELF_CONF_FILE, &conf)
	if err != nil {
		return "Error"
	}
	for i, serverInfo := range conf.ServerInfo {
		if name == serverInfo.Host+":"+serverInfo.Port {
			conf.ServerInfo = append(conf.ServerInfo[:i], conf.ServerInfo[i+1:]...)
			break
		}
	}
	err = toml.NewEncoder(&sBuffer).Encode(conf)
	if err != nil {
		fmt.Println(err)
		return "Error"
	}
	err = ioutil.WriteFile(dir+SELF_CONF_FILE, []byte(sBuffer.String()), 0644)
	if err != nil {
		fmt.Println(err)
		return "Error"
	}
	return "OK"
}

// createConfigFile the process just creates the file when it starts
func createConfigFile() error {
	var conf ConfigInfo
	var sBuffer bytes.Buffer
	if _, err := os.Stat(dir + SELF_CONF_FILE); os.IsNotExist(err) {
		f, err := os.Create(dir + SELF_CONF_FILE)
		if err != nil {
			return err
		}
		defer f.Close()
		conf.ServerInfo = append(conf.ServerInfo, Info{
			Name: `127.0.0.1`, Host: `127.0.0.1`,
			Port: `6379`, Auth: ``})
		if conf.ServerAddress == `` {
			conf.ServerAddress = `127.0.0.1:7000`
		}
		if conf.AuthInfo == (Auth{}) {
			conf.AuthInfo = Auth{Admin: "", Password: "", Enable: 0}
		}
		err = toml.NewEncoder(&sBuffer).Encode(conf)
		if err != nil {
			return err
		}
		err = ioutil.WriteFile(dir+SELF_CONF_FILE, []byte(sBuffer.String()), 0644)
		if err != nil {
			return err
		}
	}
	return nil
}

// writeServerToml add redis-server info and write into config file
func writeServerToml(name, host, port, auth string) string {
	var conf ConfigInfo
	var flag int
	var sBuffer bytes.Buffer
	if _, err := os.Stat(dir + SELF_CONF_FILE); os.IsNotExist(err) {
		f, err := os.Create(dir + SELF_CONF_FILE)
		if err != nil {
			return `false`
		}
		defer f.Close()
	}
	_, err := toml.DecodeFile(dir+SELF_CONF_FILE, &conf)
	if err != nil {
		return `false`
	}
	for _, serverInfo := range conf.ServerInfo {
		if host == serverInfo.Host && port == serverInfo.Port {
			flag = 1
			break
		}
	}
	if flag == 0 {
		c := Info{Name: name, Host: host, Port: port, Auth: auth}
		conf.ServerInfo = append(conf.ServerInfo, c)
	}
	if conf.ServerAddress == `` {
		conf.ServerAddress = `127.0.0.1:7000`
	}
	if conf.AuthInfo == (Auth{}) {
		conf.AuthInfo = Auth{Admin: "", Password: "", Enable: 0}
	}
	err = toml.NewEncoder(&sBuffer).Encode(conf)
	if err != nil {
		fmt.Println(err)
		return `false`
	}
	err = ioutil.WriteFile(dir+SELF_CONF_FILE, []byte(sBuffer.String()), 0644)
	if err != nil {
		fmt.Println(err)
		return `false`
	}
	return `OK`
}

// getInfoByField get redis-server some statistic info by command of info
func getInfoByField(c redis.Conn) (string, string, string, string, string) {
	var count int64
	var field = []string{"server", "memory", "clients", "stats"}
	var fieldRet = make(map[string]interface{}, 0)
	var fieldMap = map[string]string{"server": "redis_version", "memory": "used_memory", "clients": "connected_clients", "stats": "total_commands_processed"}
	for _, v := range field {
		value, err := redis.String(c.Do("info", v))
		if err != nil {
			return "-", "-", "-", "-", "-"
		}
		for _, subString := range strings.Split(value, "\n") {
			if strings.Contains(subString, fieldMap[v]) {
				fieldRet[v] = strings.Split(subString, ":")[1]
				break
			}
		}
	}
	for i := 0; i <= 15; i++ {
		count += getInfo(c, "Keyspace", strconv.Itoa(i))
	}
	return fieldRet[field[0]].(string), fieldRet[field[1]].(string),
		fieldRet[field[2]].(string), fieldRet[field[3]].(string), strconv.Itoa(int(count))
}

// ipToInteger ip convert to int
func ipToInteger(ip string) int64 {
	var result int64
	var ipArr []string = strings.Split(ip, ".")
	for k, v := range ipArr {
		j, _ := strconv.ParseInt(v, 10, 0)
		j = j << uint16((3-k)*8)
		result |= j
	}
	return result
}

// portToInteger port convert to int
func portToInteger(port string) int64 {
	j, _ := strconv.ParseInt(port, 10, 0)
	return j
}

// sortServerInfo
func sortServerInfo(info map[int64]ServerExtInfo) []ServerExtInfo {
	var ipInt64 Int64Slice
	var serverInfos []ServerExtInfo
	for k := range info {
		ipInt64 = append(ipInt64, k)
	}
	sort.Sort(ipInt64)
	for _, v := range ipInt64 {
		serverInfos = append(serverInfos, info[v])
	}
	return serverInfos
}

// get serverAddress from config
func getServerAddress() string {
	var conf ConfigInfo
	if _, err := os.Stat(dir + SELF_CONF_FILE); os.IsNotExist(err) {
		return `127.0.0.1:7000`
	}
	_, err := toml.DecodeFile(dir+SELF_CONF_FILE, &conf)
	if err != nil {
		return `127.0.0.1:7000`
	}
	return conf.ServerAddress
}

// loginCheck get serverAddress from config
func loginCheck(admin, password string) string {
	var conf ConfigInfo
	if _, err := os.Stat(dir + SELF_CONF_FILE); os.IsNotExist(err) {
		return `false`
	}
	_, err := toml.DecodeFile(dir+SELF_CONF_FILE, &conf)
	if err != nil {
		return `false`
	}
	if conf.AuthInfo.Admin == admin &&
		conf.AuthInfo.Password == password {
		return `true`
	}
	return `false`
}

// isValidate get validate info from config file
func isValidate() bool {
	var conf ConfigInfo
	if _, err := os.Stat(dir + SELF_CONF_FILE); os.IsNotExist(err) {
		return false
	}
	_, err := toml.DecodeFile(dir+SELF_CONF_FILE, &conf)
	if err != nil {
		return false
	}
	if conf.AuthInfo.Enable == 1 {
		return true
	}
	return false
}

// checkUpdate render update notice alert
func checkUpdate() (bool, string, string) {
	if needUpdateVersion != false {
		return needUpdateVersion, Version, Version
	}
	r, err := http.Get(UpdateURL)
	if err != nil {
		return needUpdateVersion, Version, Version
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		r.Body.Close()
		return needUpdateVersion, Version, Version
	}
	r.Body.Close()
	u := UpdateTags{}
	err = json.Unmarshal(body, &u)
	if err != nil {
		return needUpdateVersion, Version, Version
	}
	if len(u) < 1 {
		return needUpdateVersion, Version, Version
	}
	if Version < u[0].Name {
		needUpdateVersion = true
	}
	return needUpdateVersion, Version, u[0].Name
}
