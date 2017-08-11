package main

import (
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
)

func main() {
	fmt.Printf("%s \n", LOGO)
	dir, _ = filepath.Abs(filepath.Dir(os.Args[0]))
	defer func() {
		if err := recover(); err != nil {
			fmt.Printf("run time panic: %v", err)
		}
		fmt.Printf("redisvo Exited ...\n")
	}()
	if err := createConfigFile(); err != nil {
		fmt.Printf("create redisvo.toml error: %v", err)
	}
	http.HandleFunc("/login", login)
	http.HandleFunc("/config", getConfigInfo)
	http.HandleFunc("/monitor", redisMonitorRealTime)
	http.HandleFunc("/static/", getAsset)
	http.HandleFunc("/ping", ping)
	http.HandleFunc("/getlist", validate(getServerList))
	http.HandleFunc("/addServer", addServer)
	http.HandleFunc("/server", getServerKeyNameHtml)
	http.HandleFunc("/serverinfo", getInfoByServerAndDb)
	http.HandleFunc("/search", getInfoBySearchKey)
	http.HandleFunc("/searchfield", searchFieldByTypeName)
	http.HandleFunc("/showfields", getInfoByTypeNameorKey)
	http.HandleFunc("/addkey", addFieldsByTypeAndName)
	http.HandleFunc("/deletekey", deleteTypeName)
	http.HandleFunc("/modify", modifyTypeName)
	http.HandleFunc("/changeContent", saveChangeContent)
	http.HandleFunc("/terminal", execInstruction)
	http.HandleFunc("/", getMainInterface)

	go func(serverAddress string) {
		if err := http.ListenAndServe(serverAddress, nil); err != nil {
			panic("Binding service ip and port error, please check whether the port is occupied and then restart ... ")
		}
	}(getServerAddress())
	stopSignals()
}

// stopSignals kill this programme
func stopSignals() {
	chExit := make(chan os.Signal, 1)
	signal.Notify(chExit, syscall.SIGINT, syscall.SIGTERM, syscall.SIGKILL)
	select {
	case <-chExit:
	}
}
