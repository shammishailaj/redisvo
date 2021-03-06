/**@license
 *       __ _____                     ________                              __
 *      / // _  /__ __ _____ ___ __ _/__  ___/__ ___ ______ __ __  __ ___  / /
 *  __ / // // // // // _  // _// // / / // _  // _//     // //  \/ // _ \/ /
 * /  / // // // // // ___// / / // / / // ___// / / / / // // /\  // // / /__
 * \___//____ \\___//____//_/ _\_  / /_//____//_/ /_/ /_//_//_/ /_/ \__\_\___/
 *           \/              /____/                              version 1.0.6
 *
 * This file is part of jQuery Terminal. http://terminal.jcubic.pl
 *
 * Copyright (c) 2010-2017 Jakub Jankiewicz <http://jcubic.pl>
 * Released under the MIT license
 *
 * Contains:
 *
 * Storage plugin Distributed under the MIT License
 * Copyright (c) 2010 Dave Schindler
 *
 * jQuery Timers licenced with the WTFPL
 * <http://jquery.offput.ca/timers/>
 *
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 *
 * jQuery Caret
 * Copyright (c) 2009, Gideon Sireling
 * 3 clause BSD License
 *
 * sprintf.js
 * Copyright (c) 2007-2013 Alexandru Marasteanu <hello at alexei dot ro>
 * licensed under 3 clause BSD license
 *
 * Date: Wed, 15 Feb 2017 08:50:38 +0000
 */
(function (e) {
    var n = function () {
        if (!n.cache.hasOwnProperty(arguments[0])) {
            n.cache[arguments[0]] = n.parse(arguments[0])
        }
        return n.format.call(null, n.cache[arguments[0]], arguments)
    };
    n.format = function (e, t) {
        var o = 1,
            a = e.length,
            s = "",
            l, f = [],
            c, u, p, m, h, d;
        for (c = 0; c < a; c++) {
            s = r(e[c]);
            if (s === "string") {
                f.push(e[c])
            } else {
                if (s === "array") {
                    p = e[c];
                    if (p[2]) {
                        l = t[o];
                        for (u = 0; u < p[2].length; u++) {
                            if (!l.hasOwnProperty(p[2][u])) {
                                throw n('[sprintf] property "%s" does not exist', p[2][u])
                            }
                            l = l[p[2][u]]
                        }
                    } else {
                        if (p[1]) {
                            l = t[p[1]]
                        } else {
                            l = t[o++]
                        }
                    } if (/[^s]/.test(p[8]) && r(l) !== "number") {
                        throw n("[sprintf] expecting number but found %s", r(l))
                    }
                    switch (p[8]) {
                    case "b":
                        l = l.toString(2);
                        break;
                    case "c":
                        l = String.fromCharCode(l);
                        break;
                    case "d":
                        l = parseInt(l, 10);
                        break;
                    case "e":
                        l = p[7] ? l.toExponential(p[7]) : l.toExponential();
                        break;
                    case "f":
                        l = p[7] ? parseFloat(l).toFixed(p[7]) : parseFloat(l);
                        break;
                    case "o":
                        l = l.toString(8);
                        break;
                    case "s":
                        l = (l = String(l)) && p[7] ? l.substring(0, p[7]) : l;
                        break;
                    case "u":
                        l = l >>> 0;
                        break;
                    case "x":
                        l = l.toString(16);
                        break;
                    case "X":
                        l = l.toString(16).toUpperCase();
                        break
                    }
                    l = /[def]/.test(p[8]) && p[3] && l >= 0 ? " +" + l : l;
                    h = p[4] ? p[4] === "0" ? "0" : p[4].charAt(1) : " ";
                    d = p[6] - String(l).length;
                    m = p[6] ? i(h, d) : "";
                    f.push(p[5] ? l + m : m + l)
                }
            }
        }
        return f.join("")
    };
    n.cache = {};
    n.parse = function (e) {
        var n = e,
            t = [],
            r = [],
            i = 0;
        while (n) {
            if ((t = /^[^\x25]+/.exec(n)) !== null) {
                r.push(t[0])
            } else {
                if ((t = /^\x25{2}/.exec(n)) !== null) {
                    r.push("%")
                } else {
                    if ((t = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(n)) !== null) {
                        if (t[2]) {
                            i |= 1;
                            var o = [],
                                a = t[2],
                                s = [];
                            if ((s = /^([a-z_][a-z_\d]*)/i.exec(a)) !== null) {
                                o.push(s[1]);
                                while ((a = a.substring(s[0].length)) !== "") {
                                    if ((s = /^\.([a-z_][a-z_\d]*)/i.exec(a)) !== null) {
                                        o.push(s[1])
                                    } else {
                                        if ((s = /^\[(\d+)\]/.exec(a)) !== null) {
                                            o.push(s[1])
                                        } else {
                                            throw "[sprintf] huh?"
                                        }
                                    }
                                }
                            } else {
                                throw "[sprintf] huh?"
                            }
                            t[2] = o
                        } else {
                            i |= 2
                        } if (i === 3) {
                            throw "[sprintf] mixing positional and named placeholders is not (yet) supported"
                        }
                        r.push(t)
                    } else {
                        throw "[sprintf] huh?"
                    }
                }
            }
            n = n.substring(t[0].length)
        }
        return r
    };
    var t = function (e, t, r) {
        r = t.slice(0);
        r.splice(0, 0, e);
        return n.apply(null, r)
    };

    function r(e) {
        return Object.prototype.toString.call(e).slice(8, -1).toLowerCase()
    }

    function i(e, n) {
        for (var t = []; n > 0; t[--n] = e) {}
        return t.join("")
    }
    e.sprintf = n;
    e.vsprintf = t
})(typeof global !== "undefined" ? global : window);
(function (e, n) {
    e.omap = function (n, t) {
        var r = {};
        e.each(n, function (e, i) {
            r[e] = t.call(n, e, i)
        });
        return r
    };
    var t = {
        clone_object: function (n) {
            var t = {};
            if (typeof n === "object") {
                if (e.isArray(n)) {
                    return this.clone_array(n)
                } else {
                    if (n === null) {
                        return n
                    } else {
                        for (var r in n) {
                            if (e.isArray(n[r])) {
                                t[r] = this.clone_array(n[r])
                            } else {
                                if (typeof n[r] === "object") {
                                    t[r] = this.clone_object(n[r])
                                } else {
                                    t[r] = n[r]
                                }
                            }
                        }
                    }
                }
            }
            return t
        }, clone_array: function (n) {
            if (!e.isFunction(Array.prototype.map)) {
                throw new Error("Your browser don't support ES5 array map " + "use es5-shim")
            }
            return n.slice(0).map(function (e) {
                if (typeof e === "object") {
                    return this.clone_object(e)
                } else {
                    return e
                }
            }.bind(this))
        }
    };
    var r = function (e) {
        return t.clone_object(e)
    };
    var i = function () {
        var e = "test",
            n = window.localStorage;
        try {
            n.setItem(e, "1");
            n.removeItem(e);
            return true
        } catch (t) {
            return false
        }
    };
    var o = i();

    function a(e, n) {
        var t;
        if (typeof e === "string" && typeof n === "string") {
            localStorage[e] = n;
            return true
        } else {
            if (typeof e === "object" && typeof n === "undefined") {
                for (t in e) {
                    if (e.hasOwnProperty(t)) {
                        localStorage[t] = e[t]
                    }
                }
                return true
            }
        }
        return false
    }

    function s(e, n) {
        var t, r, i;
        t = new Date;
        t.setTime(t.getTime() + 31536000000);
        r = "; expires=" + t.toGMTString();
        if (typeof e === "string" && typeof n === "string") {
            document.cookie = e + "=" + n + r + "; path=/";
            return true
        } else {
            if (typeof e === "object" && typeof n === "undefined") {
                for (i in e) {
                    if (e.hasOwnProperty(i)) {
                        document.cookie = i + "=" + e[i] + r + "; path=/"
                    }
                }
                return true
            }
        }
        return false
    }

    function l(e) {
        return localStorage[e]
    }

    function f(e) {
        var n, t, r, i;
        n = e + "=";
        t = document.cookie.split(";");
        for (r = 0; r < t.length; r++) {
            i = t[r];
            while (i.charAt(0) === " ") {
                i = i.substring(1, i.length)
            }
            if (i.indexOf(n) === 0) {
                return i.substring(n.length, i.length)
            }
        }
        return null
    }

    function c(e) {
        return delete localStorage[e]
    }

    function u(e) {
        return s(e, "", -1)
    }
    e.extend({
        Storage: {
            set: o ? a : s,
            get: o ? l : f,
            remove: o ? c : u
        }
    });
    var p = e;
    p.fn.extend({
        everyTime: function (e, n, t, r, i) {
            return this.each(function () {
                p.timer.add(this, e, n, t, r, i)
            })
        }, oneTime: function (e, n, t) {
            return this.each(function () {
                p.timer.add(this, e, n, t, 1)
            })
        }, stopTime: function (e, n) {
            return this.each(function () {
                p.timer.remove(this, e, n)
            })
        }
    });
    p.extend({
        timer: {
            guid: 1,
            global: {},
            regex: /^([0-9]+)\s*(.*s)?$/,
            powers: {
                ms: 1,
                cs: 10,
                ds: 100,
                s: 1000,
                das: 10000,
                hs: 100000,
                ks: 1000000
            },
            timeParse: function (e) {
                if (e === n || e === null) {
                    return null
                }
                var t = this.regex.exec(p.trim(e.toString()));
                if (t[2]) {
                    var r = parseInt(t[1], 10);
                    var i = this.powers[t[2]] || 1;
                    return r * i
                } else {
                    return e
                }
            }, add: function (e, n, t, r, i, o) {
                var a = 0;
                if (p.isFunction(t)) {
                    if (!i) {
                        i = r
                    }
                    r = t;
                    t = n
                }
                n = p.timer.timeParse(n);
                if (typeof n !== "number" || isNaN(n) || n <= 0) {
                    return
                }
                if (i && i.constructor !== Number) {
                    o = !!i;
                    i = 0
                }
                i = i || 0;
                o = o || false;
                if (!e.$timers) {
                    e.$timers = {}
                }
                if (!e.$timers[t]) {
                    e.$timers[t] = {}
                }
                r.$timerID = r.$timerID || this.guid++;
                var s = function () {
                    if (o && s.inProgress) {
                        return
                    }
                    s.inProgress = true;
                    if (++a > i && i !== 0 || r.call(e, a) === false) {
                        p.timer.remove(e, t, r)
                    }
                    s.inProgress = false
                };
                s.$timerID = r.$timerID;
                if (!e.$timers[t][r.$timerID]) {
                    e.$timers[t][r.$timerID] = window.setInterval(s, n)
                }
                if (!this.global[t]) {
                    this.global[t] = []
                }
                this.global[t].push(e)
            }, remove: function (e, n, t) {
                var r = e.$timers,
                    i;
                if (r) {
                    if (!n) {
                        for (var o in r) {
                            if (r.hasOwnProperty(o)) {
                                this.remove(e, o, t)
                            }
                        }
                    } else {
                        if (r[n]) {
                            if (t) {
                                if (t.$timerID) {
                                    window.clearInterval(r[n][t.$timerID]);
                                    delete r[n][t.$timerID]
                                }
                            } else {
                                for (var a in r[n]) {
                                    if (r[n].hasOwnProperty(a)) {
                                        window.clearInterval(r[n][a]);
                                        delete r[n][a]
                                    }
                                }
                            }
                            for (i in r[n]) {
                                if (r[n].hasOwnProperty(i)) {
                                    break
                                }
                            }
                            if (!i) {
                                i = null;
                                delete r[n]
                            }
                        }
                    }
                    for (i in r) {
                        if (r.hasOwnProperty(i)) {
                            break
                        }
                    }
                    if (!i) {
                        e.$timers = null
                    }
                }
            }
        }
    });
    if (/(msie) ([\w.]+)/.exec(navigator.userAgent.toLowerCase())) {
        p(window).one("unload", function () {
            var e = p.timer.global;
            for (var n in e) {
                if (e.hasOwnProperty(n)) {
                    var t = e[n],
                        r = t.length;
                    while (--r) {
                        p.timer.remove(t[r], n)
                    }
                }
            }
        })
    }(function (e) {
        if (!String.prototype.split.toString().match(/\[native/)) {
            return
        }
        var n = String.prototype.split,
            t = /()??/.exec("")[1] === e,
            r;
        r = function (r, i, o) {
            if (Object.prototype.toString.call(i) !== "[object RegExp]") {
                return n.call(r, i, o)
            }
            var a = [],
                s = (i.ignoreCase ? "i" : "") + (i.multiline ? "m" : "") + (i.extended ? "x" : "") + (i.sticky ? "y" : ""),
                l = 0,
                f, c, u, p;
            i = new RegExp(i.source, s + "g");
            r += "";
            if (!t) {
                f = new RegExp("^" + i.source + "$(?!\\s)", s)
            }
            o = o === e ? -1 >>> 0 : o >>> 0;
            while (c = i.exec(r)) {
                u = c.index + c[0].length;
                if (u > l) {
                    a.push(r.slice(l, c.index));
                    if (!t && c.length > 1) {
                        c[0].replace(f, function () {
                            for (var n = 1; n < arguments.length - 2; n++) {
                                if (arguments[n] === e) {
                                    c[n] = e
                                }
                            }
                        })
                    }
                    if (c.length > 1 && c.index < r.length) {
                        Array.prototype.push.apply(a, c.slice(1))
                    }
                    p = c[0].length;
                    l = u;
                    if (a.length >= o) {
                        break
                    }
                }
                if (i.lastIndex === c.index) {
                    i.lastIndex++
                }
            }
            if (l === r.length) {
                if (p || !i.test("")) {
                    a.push("")
                }
            } else {
                a.push(r.slice(l))
            }
            return a.length > o ? a.slice(0, o) : a
        };
        String.prototype.split = function (e, n) {
            return r(this, e, n)
        };
        return r
    })();
    e.fn.caret = function (e) {
        var n = this[0];
        var t = n.contentEditable === "true";
        if (arguments.length === 0) {
            if (window.getSelection) {
                if (t) {
                    n.focus();
                    var r = window.getSelection().getRangeAt(0),
                        i = r.cloneRange();
                    i.selectNodeContents(n);
                    i.setEnd(r.endContainer, r.endOffset);
                    return i.toString().length
                }
                return n.selectionStart
            }
            if (document.selection) {
                n.focus();
                if (t) {
                    var r = document.selection.createRange(),
                        i = document.body.createTextRange();
                    i.moveToElementText(n);
                    i.setEndPoint("EndToEnd", r);
                    return i.text.length
                }
                var e = 0,
                    o = n.createTextRange(),
                    i = document.selection.createRange().duplicate(),
                    a = i.getBookmark();
                o.moveToBookmark(a);
                while (o.moveStart("character", -1) !== 0) {
                    e++
                }
                return e
            }
            return 0
        }
        if (e === -1) {
            e = this[t ? "text" : "val"]().length
        }
        if (window.getSelection) {
            if (t) {
                n.focus();
                window.getSelection().collapse(n.firstChild, e)
            } else {
                n.setSelectionRange(e, e)
            }
        } else {
            if (document.body.createTextRange) {
                var o = document.body.createTextRange();
                o.moveToElementText(n);
                o.moveStart("character", e);
                o.collapse(true);
                o.select()
            }
        } if (!t) {
            n.focus()
        }
        return e
    };

    function m(e, n) {
        var t = [];
        var r = e.length;
        if (r < n) {
            return [e]
        } else {
            if (n < 0) {
                throw new Error("str_parts: length can't be negative")
            }
        }
        for (var i = 0; i < r; i += n) {
            t.push(e.substring(i, i + n))
        }
        return t
    }

    function h(n) {
        var t = n ? [n] : [];
        var r = 0;
        e.extend(this, {
            get: function () {
                return t
            }, rotate: function () {
                if (!t.filter(Boolean).length) {
                    return
                }
                if (t.length === 1) {
                    return t[0]
                } else {
                    if (r === t.length - 1) {
                        r = 0
                    } else {
                        ++r
                    } if (t[r]) {
                        return t[r]
                    } else {
                        return this.rotate()
                    }
                }
            }, length: function () {
                return t.length
            }, remove: function (e) {
                delete t[e]
            }, set: function (e) {
                for (var n = t.length; n--;) {
                    if (t[n] === e) {
                        r = n;
                        return
                    }
                }
                this.append(e)
            }, front: function () {
                if (t.length) {
                    var e = r;
                    var n = false;
                    while (!t[e]) {
                        e++;
                        if (e > t.length) {
                            if (n) {
                                break
                            }
                            e = 0;
                            n = true
                        }
                    }
                    return t[e]
                }
            }, append: function (e) {
                t.push(e)
            }
        })
    }

    function d(n) {
        var t = n instanceof Array ? n : n ? [n] : [];
        e.extend(this, {
            data: function () {
                return t
            }, map: function (n) {
                return e.map(t, n)
            }, size: function () {
                return t.length
            }, pop: function () {
                if (t.length === 0) {
                    return null
                } else {
                    var e = t[t.length - 1];
                    t = t.slice(0, t.length - 1);
                    return e
                }
            }, push: function (e) {
                t = t.concat([e]);
                return e
            }, top: function () {
                return t.length > 0 ? t[t.length - 1] : null
            }, clone: function () {
                return new d(t.slice(0))
            }
        })
    }

    function g(n, t, r) {
        var i = true;
        var o = "";
        if (typeof n === "string" && n !== "") {
            o = n + "_"
        }
        o += "commands";
        var a;
        if (r) {
            a = []
        } else {
            a = e.Storage.get(o);
            a = a ? e.parseJSON(a) : []
        }
        var s = a.length - 1;
        e.extend(this, {
            append: function (n) {
                if (i) {
                    if (a[a.length - 1] !== n) {
                        a.push(n);
                        if (t && a.length > t) {
                            a = a.slice(-t)
                        }
                        s = a.length - 1;
                        if (!r) {
                            e.Storage.set(o, JSON.stringify(a))
                        }
                    }
                }
            }, set: function (n) {
                if (n instanceof Array) {
                    a = n;
                    if (!r) {
                        e.Storage.set(o, JSON.stringify(a))
                    }
                }
            }, data: function () {
                return a
            }, reset: function () {
                s = a.length - 1
            }, last: function () {
                return a[a.length - 1]
            }, end: function () {
                return s === a.length - 1
            }, position: function () {
                return s
            }, current: function () {
                return a[s]
            }, next: function () {
                if (s < a.length - 1) {
                    ++s
                }
                if (s !== -1) {
                    return a[s]
                }
            }, previous: function () {
                var e = s;
                if (s > 0) {
                    --s
                }
                if (e !== -1) {
                    return a[s]
                }
            }, clear: function () {
                a = [];
                this.purge()
            }, enabled: function () {
                return i
            }, enable: function () {
                i = true
            }, purge: function () {
                if (!r) {
                    e.Storage.remove(o)
                }
            }, disable: function () {
                i = false
            }
        })
    }
    var v = 0;
    e.fn.cmd = function (t) {
        var r = this;
        var i = r.data("cmd");
        if (i) {
            return i
        }
        var o = v++;
        r.addClass("cmd");
        r.append('<span class="prompt"></span><span></span>' + '<span class="cursor">&nbsp;</span><span></span>');
        var a = e("<textarea>").attr({
            autocapitalize: "off",
            spellcheck: "false"
        }).addClass("clipboard").appendTo(r);
        if (t.width) {
            r.width(t.width)
        }
        var s;
        var l;
        var f = r.find(".prompt");
        var c = false;
        var u = "";
        var p = null;
        var h;
        var d = t.mask || false;
        var b = "";
        var k;
        var x = "";
        var T = 0;
        var R;
        var C;
        var E = t.historySize || 60;
        var S, A;
        var F = r.find(".cursor");
        var L;
        var O = 0;

        function P() {
            var n = e("<span>&nbsp;</span>").appendTo(r);
            var t = n[0].getBoundingClientRect();
            n.remove();
            return t
        }

        function j(e) {
            var n = r.find(".prompt").text().length;
            var t = P();
            var i = t.width;
            var o = t.height;
            var a = r.offset();
            var s = Math.floor((e.x - a.left) / i);
            var l = Math.floor((e.y - a.top) / o);
            var f = te(b);
            var c;
            if (l > 0 && f.length > 1) {
                c = s + f.slice(0, l).reduce(function (e, n) {
                    return e + n.length
                }, 0)
            } else {
                c = s - n
            }
            var u = b.replace(/\t/g, "\x00\x00\x00\x00");
            var p = u.slice(0, c);
            var m = p.replace(/\x00{4}/g, "    ").replace(/\x00+/, "").length;
            return m > b.length ? b.length : m
        }

        function I(e) {
            if (e.which == 229) {
                var e = jQuery.Event("keypress");
                e.keyCode = e.which = 32
            }
            if (!e.key) {
                throw new Error("key event property not supported try " + "https://github.com/cvan/keyboardevent-key-polyfill")
            }
            var n = e.key.toUpperCase();
            if (n === "CONTROL") {
                return "CTRL"
            } else {
                var t = [];
                if (e.ctrlKey) {
                    t.push("CTRL")
                }
                if (e.shiftKey) {
                    t.push("SHIFT")
                }
                if (e.altKey) {
                    t.push("ALT")
                }
                if (e.key) {
                    t.push(n)
                }
                return t.join("+")
            }
        }
        var N;
        var $ = {
            "ALT+D": function () {
                r.set(b.slice(0, T) + b.slice(T).replace(/ *[^ ]+ *(?= )|[^ ]+$/, ""), true);
                return false
            }, ENTER: function () {
                if (A && b && !d && (e.isFunction(t.historyFilter) && t.historyFilter(b)) || t.historyFilter instanceof RegExp && b.match(t.historyFilter) || !t.historyFilter) {
                    A.append(b)
                }
                var n = b;
                A.reset();
                r.set("");
                if (t.commands) {
                    t.commands(n)
                }
                if (e.isFunction(R)) {
                    oe()
                }
                e(".clipboard").val("");
                return true
            }, "SHIFT+ENTER": function () {
                r.insert("\n");
                return false
            }, BACKSPACE: function () {
                if (c) {
                    u = u.slice(0, -1);
                    V()
                } else {
                    if (b !== "" && T > 0) {
                        r["delete"](-1)
                    }
                }
                return w
            }, TAB: function () {
                r.insert("    ")
            }, "CTRL+D": function () {
                r["delete"](1);
                return false
            }, DELETE: function () {
                r["delete"](1);
                return true
            }, ARROWUP: B,
            UP: B,
            "CTRL+P": B,
            ARROWDOWN: W,
            DOWN: W,
            "CTRL+N": W,
            ARROWLEFT: U,
            LEFT: U,
            "CTRL+B": U,
            "CTRL+ARROWLEFT": function () {
                var e = T - 1;
                var n = 0;
                if (b[e] === " ") {
                    --e
                }
                for (var t = e; t > 0; --t) {
                    if (b[t] === " " && b[t + 1] !== " ") {
                        n = t + 1;
                        break
                    } else {
                        if (b[t] === "\n" && b[t + 1] !== "\n") {
                            n = t;
                            break
                        }
                    }
                }
                r.position(n)
            }, "CTRL+R": function () {
                if (c) {
                    ee(true)
                } else {
                    h = R;
                    V();
                    k = b;
                    r.set("");
                    ie();
                    c = true
                }
                return false
            }, "CTRL+G": function () {
                if (c) {
                    R = h;
                    oe();
                    r.set(k);
                    ie();
                    c = false;
                    u = "";
                    return false
                }
            }, ARROWRIGHT: q,
            "CTRL+F": q,
            RIGHT: q,
            "CTRL+ARROWRIGHT": function () {
                if (b[T] === " ") {
                    ++T
                }
                var e = /\S[\n\s]{2,}|[\n\s]+\S?/;
                var n = b.slice(T).match(e);
                if (!n || n[0].match(/^\s+$/)) {
                    r.position(b.length)
                } else {
                    if (n[0][0] !== " ") {
                        T += n.index + 1
                    } else {
                        T += n.index + n[0].length - 1;
                        if (n[0][n[0].length - 1] !== " ") {
                            --T
                        }
                    }
                }
                ie()
            }, F12: H,
            END: M,
            "CTRL+E": M,
            HOME: K,
            "CTRL+A": K,
            "SHIFT+INSERT": D,
            "CTRL+SHIFT+T": H,
            "CTRL+W": function () {
                if (b !== "" && T !== 0) {
                    var e = b.slice(0, T).match(/([^ ]+ *$)/);
                    x = r["delete"](-e[0].length);
                    J(r, x)
                }
                return false
            }, "CTRL+H": function () {
                if (b !== "" && T > 0) {
                    r["delete"](-1)
                }
                return false
            }, "CTRL+X": H,
            "CTRL+C": H,
            "CTRL+T": H,
            "CTRL+Y": function () {
                if (x !== "") {
                    r.insert(x)
                }
            }, "CTRL+V": D,
            "CTRL+K": function () {
                x = r["delete"](b.length - T);
                J(r, x);
                return false
            }, "CTRL+U": function () {
                if (b !== "" && T !== 0) {
                    x = r["delete"](-T);
                    J(r, x)
                }
                return false
            }, "CTRL+TAB": function () {
                return false
            }
        };

        function H() {
            return true
        }

        function D() {
            a.val("");
            O = 0;
            a.focus();
            a.on("input", function e(n) {
                ae(n);
                a.off("input", e)
            })
        }

        function B() {
            if (se) {
                k = b;
                r.set(A.current())
            } else {
                r.set(A.previous())
            }
            se = false;
            return false
        }

        function W() {
            r.set(A.end() ? k : A.next());
            return false
        }

        function U() {
            if (T > 0) {
                r.position(-1, true);
                ie()
            }
        }

        function q() {
            if (T < b.length) {
                r.position(1, true)
            }
            return false
        }

        function K() {
            r.position(0)
        }

        function M() {
            r.position(b.length)
        }

        function G() {
            var e = a.is(":focus");
            if (C) {
                if (!e) {
                    a.focus();
                    r.oneTime(10, function () {
                        a.focus()
                    })
                }
            } else {
                if (e) {
                    a.blur()
                }
            }
        }

        function Y() {
            r.oneTime(10, function () {
                a.val(b);
                if (C) {
                    r.oneTime(10, function () {
                        try {
                            a.caret(T)
                        } catch (e) {}
                    })
                }
            })
        }
        if (y && !_) {
            L = function (e) {
                if (e) {
                    F.addClass("blink")
                } else {
                    F.removeClass("blink")
                }
            }
        } else {
            var X = false;
            L = function (e) {
                if (e && !X) {
                    X = true;
                    F.addClass("inverted blink");
                    r.everyTime(500, "blink", Q)
                } else {
                    if (X && !e) {
                        X = false;
                        r.stopTime("blink", Q);
                        F.removeClass("inverted blink")
                    }
                }
            }
        }

        function Q() {
            F.toggleClass("inverted")
        }

        function V() {
            R = "(reverse-i-search)`" + u + "': ";
            oe()
        }

        function Z() {
            R = h;
            c = false;
            p = null;
            u = ""
        }

        function ee(n) {
            var t = A.data();
            var i, o;
            var a = t.length;
            if (n && p > 0) {
                a -= p
            }
            if (u.length > 0) {
                for (var s = u.length; s > 0; s--) {
                    o = e.terminal.escape_regex(u.substring(0, s));
                    i = new RegExp(o);
                    for (var l = a; l--;) {
                        if (i.test(t[l])) {
                            p = t.length - l;
                            r.position(t[l].indexOf(o));
                            r.set(t[l], true);
                            ie();
                            if (u.length !== s) {
                                u = u.substring(0, s);
                                V()
                            }
                            return
                        }
                    }
                }
            }
            u = ""
        }

        function ne() {
            var e = r.width();
            var n = F[0].getBoundingClientRect().width;
            s = Math.floor(e / n)
        }

        function te(e) {
            var n;
            if (e.match(/\n/)) {
                var t = e.split("\n");
                var r = s - l - 1;
                for (var i = 0; i < t.length - 1; ++i) {
                    t[i] += " "
                }
                if (t[0].length > r) {
                    n = [t[0].substring(0, r)];
                    var o = t[0].substring(r);
                    n = n.concat(m(o, s))
                } else {
                    n = [t[0]]
                }
                for (i = 1; i < t.length; ++i) {
                    if (t[i].length > s) {
                        n = n.concat(m(t[i], s))
                    } else {
                        n.push(t[i])
                    }
                }
            } else {
                var a = e.substring(0, s - l);
                var f = e.substring(s - l);
                n = [a].concat(m(f, s))
            }
            return n
        }

        function re(n) {
            var t = e.terminal.defaults.formatters;
            for (var r = 0; r < t.length; ++r) {
                try {
                    if (typeof t[r] === "function") {
                        var i = t[r](n);
                        if (typeof i === "string") {
                            n = i
                        }
                    }
                } catch (o) {
                    alert("formatting error at formatters[" + r + "]\n" + (o.stack ? o.stack : o))
                }
            }
            return e.terminal.format(e.terminal.encode(n))
        }
        var ie = function () {
            var n = F.prev();
            var t = F.next();

            function i(e, r) {
                var i = e.length;
                if (r === i) {
                    n.html(re(e));
                    F.html("&nbsp;");
                    t.html("")
                } else {
                    if (r === 0) {
                        n.html("");
                        F.html(re(e.slice(0, 1)));
                        t.html(re(e.slice(1)))
                    } else {
                        var o = e.slice(0, r);
                        n.html(re(o));
                        var a = e.slice(r, r + 1);
                        F.html(re(a));
                        if (r === e.length - 1) {
                            t.html("")
                        } else {
                            t.html(re(e.slice(r + 1)))
                        }
                    }
                }
            }

            function o(e) {
                return "<div>" + re(e) + "</div>"
            }

            function a(n) {
                var r = t;
                e.each(n, function (n, t) {
                    r = e(o(t)).insertAfter(r)
                })
            }

            function f(t) {
                e.each(t, function (e, t) {
                    n.before(o(t))
                })
            }
            return function () {
                var c;
                switch (typeof d) {
                case "boolean":
                    c = d ? b.replace(/./g, "*") : b;
                    break;
                case "string":
                    c = b.replace(/./g, d);
                    break
                }
                var u;
                r.find("div").remove();
                n.html("");
                if (c.length > s - l - 1 || c.match(/\n/)) {
                    var p = c.match(/\t/g);
                    var m = p ? p.length * 3 : 0;
                    if (p) {
                        c = c.replace(/\t/g, "\x00\x00\x00\x00")
                    }
                    var h = te(c);
                    if (p) {
                        h = e.map(h, function (e) {
                            return e.replace(/\x00\x00\x00\x00/g, "    ")
                        })
                    }
                    var g = h[0].length;
                    if (g === 0 && h.length === 1) {} else {
                        if (T < g) {
                            i(h[0], T);
                            a(h.slice(1))
                        } else {
                            if (T === g) {
                                n.before(o(h[0]));
                                i(h[1] || "", 0);
                                if (h.length > 1) {
                                    a(h.slice(2))
                                }
                            } else {
                                var v = h.length;
                                if (T < g) {
                                    i(h[0], T);
                                    a(h.slice(1))
                                } else {
                                    if (T === g) {
                                        n.before(o(h[0]));
                                        i(h[1], 0);
                                        a(h.slice(2))
                                    } else {
                                        var y = h.slice(-1)[0];
                                        var _ = c.length - T - m;
                                        var w = y.length;
                                        var k = 0;
                                        if (_ <= w) {
                                            f(h.slice(0, -1));
                                            if (w === _) {
                                                k = 0
                                            } else {
                                                k = w - _
                                            }
                                            i(y, k)
                                        } else {
                                            if (v === 3) {
                                                var x = re(h[0]);
                                                n.before("<div>" + x + "</div>");
                                                i(h[1], T - g - 1);
                                                x = re(h[2]);
                                                t.after("<div>" + x + "</div>")
                                            } else {
                                                var R;
                                                var C;
                                                k = T;
                                                for (u = 0; u < h.length; ++u) {
                                                    var E = h[u].length;
                                                    if (k > E) {
                                                        k -= E
                                                    } else {
                                                        break
                                                    }
                                                }
                                                C = h[u];
                                                R = u;
                                                if (k === C.length) {
                                                    k = 0;
                                                    C = h[++R]
                                                }
                                                i(C, k);
                                                f(h.slice(0, R));
                                                a(h.slice(R + 1))
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (c === "") {
                        n.html("");
                        F.html("&nbsp;");
                        t.html("")
                    } else {
                        i(c, T)
                    }
                }
            }
        }();
        var oe = function () {
            function n(n) {
                f.html(e.terminal.format(e.terminal.encode(n)));
                l = f.text().length
            }
            return function () {
                switch (typeof R) {
                case "string":
                    n(R);
                    break;
                case "function":
                    R(n);
                    break
                }
            }
        }();

        function ae() {
            if (O++ > 0) {
                return
            }
            if (r.isenabled()) {
                var e = r.find("textarea");
                if (!e.is(":focus")) {
                    e.focus()
                }
                r.oneTime(100, function () {
                    r.insert(e.val());
                    e.val("");
                    Y()
                })
            }
        }
        var se = true;
        var le = false;
        var fe;
        var ce;

        function ue(i) {
            var o;
            if (C) {
                if (e.isFunction(t.keydown)) {
                    o = t.keydown(i);
                    if (o !== n) {
                        return o
                    }
                }
                var a = I(i);
                ce = ["SHIFT+INSERT", "BACKSPACE", "CTRL+V"].indexOf(a) !== -1;
                if (i.which !== 38 && !(i.which === 80 && i.ctrlKey)) {
                    se = true
                }
                if (e.isFunction(N[a])) {
                    o = N[a]();
                    if (o === true) {
                        return
                    }
                    if (o !== n) {
                        return o
                    }
                }
                if (c && (i.which === 35 || i.which === 36 || i.which === 37 || i.which === 38 || i.which === 39 || i.which === 40 || i.which === 13 || i.which === 27)) {
                    Z();
                    oe();
                    if (i.which === 27) {
                        r.set("")
                    }
                    ie();
                    ue.call(this, i)
                } else {
                    if (i.altKey) {
                        return true
                    } else {
                        le = false;
                        fe = true;
                        return
                    }
                }
                i.preventDefault()
            }
        }

        function pe() {
            if (e.isFunction(t.onCommandChange)) {
                t.onCommandChange(b)
            }
        }
        e.extend(r, {
            name: function (e) {
                if (e !== n) {
                    S = e;
                    var i = A && A.enabled() || !A;
                    A = new g(e, E, t.history === "memory");
                    if (!i) {
                        A.disable()
                    }
                    return r
                } else {
                    return S
                }
            }, purge: function () {
                A.clear();
                return r
            }, history: function () {
                return A
            }, "delete": function (e, n) {
                var t;
                if (e === 0) {
                    return r
                } else {
                    if (e < 0) {
                        if (T > 0) {
                            t = b.slice(0, T).slice(e);
                            b = b.slice(0, T + e) + b.slice(T, b.length);
                            if (!n) {
                                r.position(T + e)
                            }
                            pe()
                        }
                    } else {
                        if (b !== "" && T < b.length) {
                            t = b.slice(T).slice(0, e);
                            b = b.slice(0, T) + b.slice(T + e, b.length);
                            pe()
                        }
                    }
                }
                ie();
                Y();
                return t
            }, set: function (e, t) {
                if (e !== n) {
                    b = e;
                    if (!t) {
                        r.position(b.length)
                    }
                    ie();
                    Y();
                    pe()
                }
                return r
            }, keymap: function (n) {
                if (typeof n === "undefined") {
                    return N
                } else {
                    N = e.extend({}, $, e.omap(n || {}, function (e, n) {
                        return function (t) {
                            return n(t, $[e])
                        }
                    }));
                    return r
                }
            }, insert: function (e, n) {
                if (T === b.length) {
                    b += e
                } else {
                    if (T === 0) {
                        b = e + b
                    } else {
                        b = b.slice(0, T) + e + b.slice(T)
                    }
                } if (!n) {
                    r.position(e.length, true)
                } else {
                    Y()
                }
                ie();
                pe();
                return r
            }, get: function () {
                return b
            }, commands: function (e) {
                if (e) {
                    t.commands = e;
                    return r
                } else {
                    return e
                }
            }, destroy: function () {
                me.unbind("keypress.cmd", he);
                me.unbind("keydown.cmd", ue);
                me.unbind("paste.cmd", ae);
                me.unbind("input.cmd", de);
                r.stopTime("blink", Q);
                r.find(".cursor").next().remove().end().prev().remove().end().remove();
                r.find(".prompt, .clipboard").remove();
                r.removeClass("cmd").removeData("cmd").off(".cmd");
                return r
            }, prompt: function (e) {
                if (e === n) {
                    return R
                } else {
                    if (typeof e === "string" || typeof e === "function") {
                        R = e
                    } else {
                        throw new Error("prompt must be a function or string")
                    }
                    oe();
                    ie();
                    return r
                }
            }, kill_text: function () {
                return x
            }, position: function (n, i) {
                if (typeof n === "number") {
                    if (i) {
                        T += n
                    } else {
                        if (n < 0) {
                            T = 0
                        } else {
                            if (n > b.length) {
                                T = b.length
                            } else {
                                T = n
                            }
                        }
                    } if (e.isFunction(t.onPositionChange)) {
                        t.onPositionChange(T)
                    }
                    ie();
                    Y();
                    return r
                } else {
                    return T
                }
            }, visible: function () {
                var e = r.visible;
                return function () {
                    e.apply(r, []);
                    ie();
                    oe()
                }
            }(),
            show: function () {
                var e = r.show;
                return function () {
                    e.apply(r, []);
                    ie();
                    oe()
                }
            }(),
            resize: function (e) {
                if (e) {
                    s = e
                } else {
                    ne()
                }
                ie();
                return r
            }, enable: function () {
                C = true;
                r.addClass("enabled");
                try {
                    a.caret(T)
                } catch (e) {}
                L(true);
                G();
                return r
            }, isenabled: function () {
                return C
            }, disable: function () {
                C = false;
                r.removeClass("enabled");
                L(false);
                G();
                return r
            }, mask: function (e) {
                if (typeof e === "undefined") {
                    return d
                } else {
                    d = e;
                    ie();
                    return r
                }
            }
        });
        r.name(t.name || t.prompt || "");
        if (typeof t.prompt === "string") {
            R = t.prompt
        } else {
            R = "> "
        }
        oe();
        if (t.enabled === n || t.enabled === true) {
            r.enable()
        }
        var me = e(document.documentElement || window);
        r.keymap(t.keymap);

        function he(i) {
            var o;
            fe = false;
            if ((i.ctrlKey || i.metaKey) && [99, 118, 86].indexOf(i.which) !== -1) {
                return
            }
            if (le) {
                return
            }
            if (!c && e.isFunction(t.keypress)) {
                o = t.keypress(i)
            }
            var a = z() ? i.key : String.fromCharCode(i.which);
            if (a.toUpperCase() === "SPACEBAR") {
                a = " "
            }
            if (o === n || o) {
                if (C) {
                    if (e.inArray(i.which, [13, 0, 8]) > -1) {
                        if (i.keyCode === 123) {
                            return
                        }
                        return false
                    } else {
                        if (a && (!i.ctrlKey || i.ctrlKey && i.ctrlKey) && (!(i.altKey && i.which === 100) || i.altKey)) {
                            if (c) {
                                u += a;
                                ee();
                                V()
                            } else {
                                r.insert(a)
                            }
                            return false
                        }
                    }
                }
            } else {
                return o
            }
        }

        function de(e) {
            if (fe && !ce) {
                var n = a.val();
                if (n !== "" || e.which === 8) {
                    r.set(n)
                }
            }
        }
        me.bind("keypress.cmd", he).bind("keydown.cmd", ue).bind("input.cmd", de);
        (function () {
            var n = false;
            var i = false;
            var a = 0;
            r.on("mousedown.cmd", function () {
                i = true;
                r.oneTime(1, function () {
                    e(window).on("mousemove.cmd_" + o, function () {
                        n = true;
                        e(window).off("mousemove.cmd_" + o)
                    })
                })
            }).on("mouseup.cmd", function (s) {
                var l = n;
                n = false;
                e(window).off("mousemove.cmd_" + o);
                if (!l) {
                    var f = "click_" + o;
                    if (++a === 1) {
                        var c = i;
                        r.oneTime(t.clickTimeout, f, function () {
                            if (!e(s.target).is(".prompt") && c) {
                                r.position(j({
                                    x: s.pageX,
                                    y: s.pageY
                                }))
                            }
                            a = 0
                        })
                    } else {
                        r.stopTime(f);
                        a = 0
                    }
                }
                i = false
            })
        })();
        r.data("cmd", r);
        return r
    };
    var y = function () {
        var e = false,
            t = "Webkit Moz O ms Khtml".split(" "),
            r = document.createElement("div");
        if (r.style.animationName) {
            e = true
        }
        if (e === false) {
            for (var i = 0; i < t.length; i++) {
                var o = t[i] + "AnimationName";
                if (r.style[o] !== n) {
                    e = true;
                    break
                }
            }
        }
        return e
    }();
    var _ = navigator.userAgent.toLowerCase().indexOf("android") !== -1;
    var w = function () {
        return "ontouchstart" in window || !!window.DocumentTouch && document instanceof window.DocumentTouch
    }();

    function b(e, n) {
        var t = n(e);
        if (t.length) {
            var r = t.shift();
            var i = e.substring(r.length).trim();
            return {
                command: e,
                name: r,
                args: t,
                rest: i
            }
        } else {
            return {
                command: e,
                name: "",
                args: [],
                rest: ""
            }
        }
    }
    var k = /(\[\[[!gbiuso]*;[^;]*;[^\]]*\](?:[^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]?)/i;
    var x = /\[\[([!gbiuso]*);([^;]*);([^;\]]*);?([^;\]]*);?([^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]?/gi;
    var T = /\[\[([!gbiuso]*;[^;\]]*;[^;\]]*(?:;|[^\]()]*);?[^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]?/gi;
    var R = /\[\[([!gbiuso]*;[^;\]]*;[^;\]]*(?:;|[^\]()]*);?[^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]/gi;
    var C = /^\[\[([!gbiuso]*;[^;\]]*;[^;\]]*(?:;|[^\]()]*);?[^\]]*)\]([^\]]*\\\][^\]]*|[^\]]*|[^[]*\[[^\]]*)\]$/gi;
    var E = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
    var S = /(\bhttps?:\/\/(?:(?:(?!&[^;]+;)|(?=&amp;))[^\s"'<>\][)])+\b)/gi;
    var A = /\b(https?:\/\/(?:(?:(?!&[^;]+;)|(?=&amp;))[^\s"'<>\][)])+)\b(?![^[\]]*])/gi;
    var F = /((([^<>('")[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))/g;
    var L = /('(?:[^']|\\')*'|"(\\"|[^"])*"|(?:\/(\\\/|[^\/])+\/[gimy]*)(?=:? |$)|(\\\s|\S)+|[\w-]+)/gi;
    var O = /(\[\[[!gbiuso]*;[^;]*;[^\]]*\])/i;
    var P = /^(\[\[[!gbiuso]*;[^;]*;[^\]]*\])/i;
    var j = /\[\[[!gbiuso]*;[^;]*;[^\]]*\]?$/i;
    var I = /(\[\[(?:[^\]]|\\\])*\]\])/;
    var N = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
    var $ = /^\/((?:\\\/|[^\/]|\[[^\]]*\/[^\]]*\])+)\/([gimy]*)$/;
    e.terminal = {
        version: "1.0.6",
        color_names: ["transparent", "currentcolor", "black", "silver", "gray", "white", "maroon", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua", "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"],
        valid_color: function (n) {
            if (n.match(E)) {
                return true
            } else {
                return e.inArray(n.toLowerCase(), e.terminal.color_names) !== -1
            }
        }, escape_regex: function (e) {
            if (typeof e === "string") {
                var n = /([-\\^$[\]()+{}?*.|])/g;
                return e.replace(n, "\\$1")
            }
        }, have_formatting: function (e) {
            return typeof e === "string" && !!e.match(R)
        }, is_formatting: function (e) {
            return typeof e === "string" && !!e.match(C)
        }, format_split: function (e) {
            return e.split(k)
        }, split_equal: function (n, t, r) {
            var i = false;
            var o = false;
            var a = "";
            var s = [];
            var l = n.replace(T, function (e, n, t) {
                var r = n.match(/;/g).length;
                if (r >= 4) {
                    return e
                } else {
                    if (r === 2) {
                        r = ";;"
                    } else {
                        if (r === 3) {
                            r = ";"
                        } else {
                            r = ""
                        }
                    }
                }
                var i = t.replace(/\\\]/g, "&#93;").replace(/\n/g, "\\n").replace(/&nbsp;/g, " ");
                return "[[" + n + r + i + "]" + t + "]"
            }).split(/\n/g);

            function f() {
                return m.substring(y - 6, y) === "&nbsp;" || m.substring(y - 1, y) === " "
            }

            function c() {
                var e = g.match(T);
                if (e) {
                    var n = e[e.length - 1];
                    if (n[n.length - 1] !== "]") {
                        a = n.match(O)[1];
                        g += "]"
                    } else {
                        if (g.match(j)) {
                            g = g.replace(j, "");
                            a = n.match(O)[1]
                        }
                    }
                }
            }
            for (var u = 0, p = l.length; u < p; ++u) {
                if (l[u] === "") {
                    s.push("");
                    continue
                }
                var m = l[u];
                var h = 0;
                var d = 0;
                var g;
                var v = -1;
                for (var y = 0, _ = m.length; y < _; ++y) {
                    if (m.substring(y).match(P)) {
                        i = true;
                        o = false
                    } else {
                        if (i && m[y] === "]") {
                            if (o) {
                                i = false;
                                o = false
                            } else {
                                o = true
                            }
                        } else {
                            if (i && o || !i) {
                                if (m[y] === "&") {
                                    var w = m.substring(y).match(/^(&[^;]+;)/);
                                    if (!w) {
                                        throw new Error("Unclosed html entity in line " + (u + 1) + " at char " + (y + 1))
                                    }
                                    y += w[1].length - 2;
                                    if (y === _ - 1) {
                                        s.push(g + w[1])
                                    }
                                    continue
                                } else {
                                    if (m[y] === "]" && m[y - 1] === "\\") {
                                        --d
                                    } else {
                                        ++d
                                    }
                                }
                            }
                        }
                    } if (f() && (i && o || !i || m[y] === "[" && m[y + 1] === "[")) {
                        v = y
                    }
                    if ((d === t || y === _ - 1) && (i && o || !i)) {
                        var b = e.terminal.strip(m.substring(v));
                        b = e("<span>" + b + "</span>").text();
                        var k = b.length;
                        b = b.substring(0, y + t + 1);
                        var x = !!b.match(/\s/) || y + t + 1 > k;
                        if (r && v !== -1 && y !== _ - 1 && x) {
                            g = m.substring(h, v);
                            y = v - 1
                        } else {
                            g = m.substring(h, y + 1)
                        } if (r) {
                            g = g.replace(/(&nbsp;|\s)+$/g, "")
                        }
                        v = -1;
                        h = y + 1;
                        d = 0;
                        if (a) {
                            g = a + g;
                            if (g.match("]")) {
                                a = ""
                            }
                        }
                        c();
                        s.push(g)
                    }
                }
            }
            return s
        }, encode: function (e) {
            e = e.replace(/&(?!#[0-9]+;|[a-zA-Z]+;)/g, "&amp;");
            return e.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
        }, escape_formatting: function (n) {
            return e.terminal.escape_brackets(e.terminal.encode(n))
        }, format: function (n, t) {
            var r = e.extend({}, {
                linksNoReferrer: false
            }, t || {});
            if (typeof n === "string") {
                var i = e.terminal.format_split(n);
                n = e.map(i, function (n) {
                    if (n === "") {
                        return n
                    } else {
                        if (e.terminal.is_formatting(n)) {
                            n = n.replace(/\[\[[^\]]+\]/, function (e) {
                                return e.replace(/&nbsp;/g, " ")
                            });
                            return n.replace(x, function (n, t, i, o, a, s, l) {
                                if (l === "") {
                                    return ""
                                }
                                l = l.replace(/\\]/g, "]");
                                var f = "";
                                if (t.indexOf("b") !== -1) {
                                    f += "font-weight:bold;"
                                }
                                var c = [];
                                if (t.indexOf("u") !== -1) {
                                    c.push("underline")
                                }
                                if (t.indexOf("s") !== -1) {
                                    c.push("line-through")
                                }
                                if (t.indexOf("o") !== -1) {
                                    c.push("overline")
                                }
                                if (c.length) {
                                    f += "text-decoration:" + c.join(" ") + ";"
                                }
                                if (t.indexOf("i") !== -1) {
                                    f += "font-style:italic;"
                                }
                                if (e.terminal.valid_color(i)) {
                                    f += "color:" + i + ";";
                                    if (t.indexOf("g") !== -1) {
                                        f += "text-shadow:0 0 5px " + i + ";"
                                    }
                                }
                                if (e.terminal.valid_color(o)) {
                                    f += "background-color:" + o
                                }
                                var u;
                                if (s === "") {
                                    u = l
                                } else {
                                    u = s.replace(/&#93;/g, "]")
                                }
                                var p;
                                if (t.indexOf("!") !== -1) {
                                    if (u.match(F)) {
                                        p = '<a href="mailto:' + u + '" '
                                    } else {
                                        p = '<a target="_blank" href="' + u + '" ';
                                        if (r.linksNoReferrer) {
                                            p += 'rel="noreferrer" '
                                        }
                                    }
                                } else {
                                    p = "<span"
                                } if (f !== "") {
                                    p += ' style="' + f + '"'
                                }
                                if (a !== "") {
                                    p += ' class="' + a + '"'
                                }
                                if (t.indexOf("!") !== -1) {
                                    p += ">" + l + "</a>"
                                } else {
                                    p += ' data-text="' + u.replace('"', "&quote;") + '">' + l + "</span>"
                                }
                                return p
                            })
                        } else {
                            return "<span>" + n.replace(/\\\]/g, "]") + "</span>"
                        }
                    }
                }).join("");
                return n.replace(/<span><br\s*\/?><\/span>/gi, "<br/>")
            } else {
                return ""
            }
        }, escape_brackets: function (e) {
            return e.replace(/\[/g, "&#91;").replace(/\]/g, "&#93;")
        }, strip: function (e) {
            return e.replace(x, "$6")
        }, active: function () {
            return Z.front()
        }, last_id: function () {
            var e = Z.length();
            if (e) {
                return e - 1
            }
        }, parse_arguments: function (n) {
            return e.map(n.match(L) || [], function (n) {
                var t = n.match($);
                if (t) {
                    return new RegExp(t[1], t[2])
                } else {
                    if (n[0] === "'" && n[n.length - 1] === "'") {
                        return n.replace(/^'|'$/g, "")
                    } else {
                        if (n[0] === '"' && n[n.length - 1] === '"') {
                            return e.parseJSON(n)
                        } else {
                            if (n.match(/^-?[0-9]+$/)) {
                                return parseInt(n, 10)
                            } else {
                                if (n.match(N)) {
                                    return parseFloat(n)
                                } else {
                                    return n.replace(/\\ /g, " ")
                                }
                            }
                        }
                    }
                }
            })
        }, split_arguments: function (n) {
            return e.map(n.match(L) || [], function (e) {
                if (e[0] === "'" && e[e.length - 1] === "'") {
                    return e.replace(/^'|'$/g, "")
                } else {
                    if (e[0] === '"' && e[e.length - 1] === '"') {
                        return e.replace(/^"|"$/g, "").replace(/\\([" ])/g, "$1")
                    } else {
                        if (e.match(/\/.*\/[gimy]*$/)) {
                            return e
                        } else {
                            return e.replace(/\\ /g, " ")
                        }
                    }
                }
            })
        }, parse_command: function (n) {
            return b(n, e.terminal.parse_arguments)
        }, split_command: function (n) {
            return b(n, e.terminal.split_arguments)
        }, extended_command: function (e, n) {
            try {
                te = false;
                e.exec(n, true).then(function () {
                    te = true
                })
            } catch (t) {}
        }
    };
    e.fn.visible = function () {
        return this.css("visibility", "visible")
    };
    e.fn.hidden = function () {
        return this.css("visibility", "hidden")
    };
    e.fn.scroll_element = function () {
        var n = e.fn.scroll_element.defaults;
        return this.map(function () {
            var t = e(this);
            if (t.is("body")) {
                var r = e("html");
                var i = e("body");
                var o = i.scrollTop() || r.scrollTop();
                var a = e("<pre/>").css(n.pre).appendTo("body");
                a.html(new Array(n.lines).join("\n"));
                e("body,html").scrollTop(10);
                var s;
                if (i.scrollTop() === 10) {
                    i.scrollTop(o);
                    s = i[0]
                } else {
                    if (r.scrollTop() === 10) {
                        r.scrollTop(o);
                        s = r[0]
                    }
                }
                a.remove();
                return s
            } else {
                return this
            }
        })
    };
    e.fn.scroll_element.defaults = {
        lines: 2000,
        pre: {
            "font-size": "14px",
            "white-space": "pre"
        }
    };

    function z() {
        var e = window.KeyboardEvent.prototype;
        if (!("KeyboardEvent" in window && "key" in e)) {
            return false
        }
        var n = Object.getOwnPropertyDescriptor(e, "key").get;
        return n.toString().match(/\[native code\]/)
    }

    function H(e) {
        if (console && console.warn) {
            console.warn(e)
        } else {
            throw new Error("WARN: " + e)
        }
    }
    var D = {};
    e.jrpc = function (n, t, r, i, o) {
        var a;
        if (e.isPlainObject(n)) {
            a = n
        } else {
            a = {
                url: n,
                method: t,
                params: r,
                success: i,
                error: o
            }
        }

        function s(e) {
            return typeof e.id === "number" && typeof e.result !== "undefined" || a.method === "system.describe" && e.name === "DemoService" && typeof e.id !== "undefined" && e.procs instanceof Array
        }
        D[a.url] = D[a.url] || 0;
        var l = {
            jsonrpc: "2.0",
            method: a.method,
            params: a.params,
            id: ++D[a.url]
        };
        return e.ajax({
            url: a.url,
            beforeSend: function (n, t) {
                if (e.isFunction(a.request)) {
                    a.request(n, l)
                }
                t.data = JSON.stringify(l)
            }, success: function (n, t, r) {
                var i = r.getResponseHeader("Content-Type");
                if (!i.match(/(application|text)\/json/)) {
                    H("Response Content-Type is neither application/json" + " nor text/json")
                }
                var o;
                try {
                    o = e.parseJSON(n)
                } catch (l) {
                    if (a.error) {
                        a.error(r, "Invalid JSON", l)
                    } else {
                        throw new Error("Invalid JSON")
                    }
                    return
                }
                if (e.isFunction(a.response)) {
                    a.response(r, o)
                }
                if (s(o)) {
                    a.success(o, t, r)
                } else {
                    if (a.error) {
                        a.error(r, "Invalid JSON-RPC")
                    } else {
                        throw new Error("Invalid JSON-RPC")
                    }
                }
            }, error: a.error,
            contentType: "application/json",
            dataType: "text",
            async: true,
            cache: false,
            type: "POST"
        })
    };

    function B() {
        var n = e('<div class="terminal temp"><div class="cmd"><span cla' + 'ss="cursor">&nbsp;</span></div></div>').appendTo("body");
        var t = n.find("span");
        var r = {
            width: t.width(),
            height: t.outerHeight()
        };
        n.remove();
        return r
    }

    function W(n) {
        var t = e('<div class="terminal wrap"><span class="cursor">' + "&nbsp;</span></div>").appendTo("body").css("padding", 0);
        var r = t.find("span");
        var i = r[0].getBoundingClientRect().width;
        var o = Math.floor(n.find("iframe").width() / i);
        t.remove();
        return o
    }

    function U(e) {
        return Math.floor(e.height() / B().height)
    }

    function q() {
        if (window.getSelection || document.getSelection) {
            var e = (window.getSelection || document.getSelection)();
            if (e.text) {
                return e.text
            } else {
                return e.toString()
            }
        } else {
            if (document.selection) {
                return document.selection.createRange().text
            }
        }
    }

    function J(n, t) {
        var r = e("<div>" + t.replace(/\n/, "<br/>") + "<div>");
        var i;
        n.append(r);
        if (document.body.createTextRange) {
            i = document.body.createTextRange();
            i.moveToElementText(r[0]);
            i.select()
        } else {
            if (window.getSelection) {
                var o = window.getSelection();
                if (o.setBaseAndExtent) {
                    o.setBaseAndExtent(r[0], 0, r[0], 1)
                } else {
                    if (document.createRange) {
                        i = document.createRange();
                        i.selectNodeContents(r[0]);
                        o.removeAllRanges();
                        o.addRange(i)
                    }
                }
            }
        }
        try {
            document.execCommand("copy")
        } catch (a) {}
        r.remove()
    }
    var K = !e.terminal.version.match(/^\{\{/);
    var M = "" + "";
    var G = K ? "" : "";
    var Y = new RegExp(" {" + G.length + "}$");
    var X = "jQuery Terminal Emulator" + (K ? G : "");
    var Q = [
        ["jQuery Terminal", "(c) 2011-2017 jcubic"],
        [X, M.replace(/^Copyright | *<.*>/g, "")],
        [X, M.replace(/^Copyright /, "")],
        ["", "", "", "", "", "".replace(Y, " ") + G, M],
        ["" + "", "" + "", "" + "", "" + "", "" + "", ("" + "").replace(Y, "") + G, M]
    ];
    e.terminal.defaults = {
        prompt: "> ",
        history: true,
        exit: true,
        clear: true,
        enabled: true,
        historySize: 60,
        maskChar: "*",
        wrap: true,
        checkArity: true,
        raw: false,
        exceptionHandler: null,
        memory: false,
        cancelableAjax: true,
        processArguments: true,
        linksNoReferrer: false,
        processRPCResponse: null,
        Token: true,
        convertLinks: true,
        extra: {},
        historyState: false,
        importHistory: false,
        echoCommand: true,
        scrollOnEcho: true,
        login: null,
        outputLimit: -1,
        formatters: [],
        onAjaxError: null,
        scrollBottomOffset: 20,
        wordAutocomplete: true,
        clickTimeout: 200,
        request: e.noop,
        response: e.noop,
        onRPCError: null,
        completion: false,
        historyFilter: null,
        softPause: false,
        onInit: e.noop,
        onClear: e.noop,
        onBlur: e.noop,
        onFocus: e.noop,
        onTerminalChange: e.noop,
        onExit: e.noop,
        onPush: e.noop,
        onPop: e.noop,
        keypress: e.noop,
        keydown: e.noop,
        strings: {
            comletionParameters: "From version 1.0.0 completion function need to" + "have two arguments",
            wrongPasswordTryAgain: "Wrong password try again!",
            wrongPassword: "Wrong password!",
            ajaxAbortError: "Error while aborting ajax call!",
            wrongArity: "Wrong number of arguments. Function '%s' expects %s got" + " %s!",
            commandNotFound: "Command '%s' Not Found!",
            oneRPCWithIgnore: "You can use only one rpc with ignoreSystemDescr" + "ibe or rpc without system.describe",
            oneInterpreterFunction: "You can't use more than one function (rpc " + "without system.describe or with option ignoreSystemDescribe cou" + "nts as one)",
            loginFunctionMissing: "You didn't specify a login function",
            noTokenError: "Access denied (no token)",
            serverResponse: "Server responded",
            wrongGreetings: "Wrong value of greetings parameter",
            notWhileLogin: "You can't call `%s' function while in login",
            loginIsNotAFunction: "Authenticate must be a function",
            canExitError: "You can't exit from main interpreter",
            invalidCompletion: "Invalid completion",
            invalidSelector: 'Sorry, but terminal said that "%s" is not valid ' + "selector!",
            invalidTerminalId: "Invalid Terminal ID",
            login: "login",
            password: "password",
            recursiveCall: "Recursive call detected, skip"
        }
    };
    var V = [];
    var Z = new h;
    var ee = [];
    var ne;
    var te = false;
    var re = true;
    var ie = true;
    e.fn.terminal = function (t, i) {
        function o(n) {
            if (n) {
                this.storage = {}
            }
            this.set = function (t, r) {
                if (n) {
                    this.storage[t] = r
                } else {
                    e.Storage.set(t, r)
                }
            };
            this.get = function (t) {
                if (n) {
                    return this.storage[t]
                } else {
                    return e.Storage.get(t)
                }
            };
            this.remove = function (t) {
                if (n) {
                    delete this.storage[t]
                } else {
                    e.Storage.remove(t)
                }
            }
        }

        function a(n) {
            if (e.isFunction(Te.processArguments)) {
                return b(n, Te.processArguments)
            } else {
                if (Te.processArguments) {
                    return e.terminal.parse_command(n)
                } else {
                    return e.terminal.split_command(n)
                }
            }
        }

        function s(n) {
            if (typeof n === "string") {
                se.echo(n)
            } else {
                if (n instanceof Array) {
                    se.echo(e.map(n, function (e) {
                        return JSON.stringify(e)
                    }).join(" "))
                } else {
                    if (typeof n === "object") {
                        se.echo(JSON.stringify(n))
                    } else {
                        se.echo(n)
                    }
                }
            }
        }

        function l(n) {
            var t = /(.*):([0-9]+):([0-9]+)$/;
            var r = n.match(t);
            if (r) {
                se.pause(Te.softPause);
                e.get(r[1], function (n) {
                    var t = location.href.replace(/[^\/]+$/, "");
                    var i = r[1].replace(t, "");
                    se.echo("[[b;white;]" + i + "]");
                    var o = n.split("\n");
                    var a = +r[2] - 1;
                    se.echo(o.slice(a - 2, a + 3).map(function (n, t) {
                        if (t === 2) {
                            n = "[[;#f00;]" + e.terminal.escape_brackets(n) + "]"
                        }
                        return "[" + (a + t) + "]: " + n
                    }).join("\n")).resume()
                }, "text")
            }
        }

        function f(n) {
            if (e.isFunction(Te.onRPCError)) {
                Te.onRPCError.call(se, n)
            } else {
                se.error("&#91;RPC&#93; " + n.message);
                if (n.error && n.error.message) {
                    n = n.error;
                    var t = "  " + n.message;
                    if (n.file) {
                        t += ' in file "' + n.file.replace(/.*\//, "") + '"'
                    }
                    if (n.at) {
                        t += " at line " + n.at
                    }
                    se.error(t)
                }
            }
        }

        function c(n, t) {
            var r = function (t, r) {
                se.pause(Te.softPause);
                e.jrpc({
                    url: n,
                    method: t,
                    params: r,
                    request: function (e, n) {
                        try {
                            Te.request.apply(se, e, n, se)
                        } catch (t) {
                            y(t, "USER")
                        }
                    }, response: function (e, n) {
                        try {
                            Te.response.apply(se, e, n, se)
                        } catch (t) {
                            y(t, "USER")
                        }
                    }, success: function (n) {
                        if (n.error) {
                            f(n.error)
                        } else {
                            if (e.isFunction(Te.processRPCResponse)) {
                                Te.processRPCResponse.call(se, n.result, se)
                            } else {
                                s(n.result)
                            }
                        }
                        se.resume()
                    }, error: p
                })
            };
            return function (e, n) {
                if (e === "") {
                    return
                }
                try {
                    e = a(e)
                } catch (i) {
                    y(i, "TERMINAL (get_processed_command)");
                    return
                }
                if (!t || e.name === "help") {
                    r(e.name, e.args)
                } else {
                    var o = n.token();
                    if (o) {
                        r(e.name, [o].concat(e.args))
                    } else {
                        n.error("&#91;AUTH&#93; " + Ce.noTokenError)
                    }
                }
            }
        }

        function u(t, r, i, o) {
            return function (s, l) {
                if (s === "") {
                    return
                }
                var f;
                try {
                    f = a(s)
                } catch (c) {
                    if (e.isFunction(Te.exception)) {
                        Te.exception(c, se)
                    } else {
                        se.error(c.toString())
                    }
                    return
                }
                var p = t[f.name];
                var m = e.type(p);
                if (m === "function") {
                    if (r && p.length !== f.args.length) {
                        se.error("&#91;Arity&#93; " + sprintf(Ce.wrongArity, f.name, p.length, f.args.length))
                    } else {
                        return p.apply(se, f.args)
                    }
                } else {
                    if (m === "object" || m === "string") {
                        var h = [];
                        if (m === "object") {
                            h = Object.keys(p);
                            p = u(p, r, i)
                        }
                        l.push(p, {
                            prompt: f.name + "> ",
                            name: f.name,
                            completion: m === "object" ? h : n
                        })
                    } else {
                        if (e.isFunction(o)) {
                            o(s, se)
                        } else {
                            if (e.isFunction(Te.onCommandNotFound)) {
                                Te.onCommandNotFound.call(se, s, se)
                            } else {
                                l.error(sprintf(Ce.commandNotFound, f.name))
                            }
                        }
                    }
                }
            }
        }

        function p(n, t, r) {
            se.resume();
            if (e.isFunction(Te.onAjaxError)) {
                Te.onAjaxError.call(se, n, t, r)
            } else {
                if (t !== "abort") {
                    se.error("&#91;AJAX&#93; " + t + " - " + Ce.serverResponse + ":\n" + e.terminal.escape_brackets(n.responseText))
                }
            }
        }

        function m(n, t, r) {
            function i(n) {
                if (n.error) {
                    f(n.error)
                } else {
                    if (e.isFunction(Te.processRPCResponse)) {
                        Te.processRPCResponse.call(se, n.result, se)
                    } else {
                        s(n.result)
                    }
                }
                se.resume()
            }

            function o(e, n) {
                try {
                    Te.request.call(se, e, n, se)
                } catch (t) {
                    y(t, "USER")
                }
            }

            function a(e, n) {
                try {
                    Te.response.call(se, e, n, se)
                } catch (t) {
                    y(t, "USER")
                }
            }

            function l(s) {
                if (s.procs) {
                    var l = {};
                    e.each(s.procs, function (r, s) {
                        l[s.name] = function () {
                            var r = t && s.name !== "help";
                            var l = Array.prototype.slice.call(arguments);
                            var f = l.length + (r ? 1 : 0);
                            if (Te.checkArity && s.params && s.params.length !== f) {
                                se.error("&#91;Arity&#93; " + sprintf(Ce.wrongArity, s.name, s.params.length, f))
                            } else {
                                se.pause(Te.softPause);
                                if (r) {
                                    var c = se.token(true);
                                    if (c) {
                                        l = [c].concat(l)
                                    } else {
                                        se.error("&#91;AUTH&#93; " + Ce.noTokenError)
                                    }
                                }
                                e.jrpc({
                                    url: n,
                                    method: s.name,
                                    params: l,
                                    request: o,
                                    response: a,
                                    success: i,
                                    error: p
                                })
                            }
                        }
                    });
                    l.help = l.help || function (n) {
                        if (typeof n === "undefined") {
                            var t = s.procs.map(function (e) {
                                return e.name
                            }).join(", ") + ", help";
                            se.echo("Available commands: " + t)
                        } else {
                            var r = false;
                            e.each(s.procs, function (e, t) {
                                if (t.name === n) {
                                    r = true;
                                    var i = "";
                                    i += "[[bu;#fff;]" + t.name + "]";
                                    if (t.params) {
                                        i += " " + t.params.join(" ")
                                    }
                                    if (t.help) {
                                        i += "\n" + t.help
                                    }
                                    se.echo(i);
                                    return false
                                }
                            });
                            if (!r) {
                                if (n === "help") {
                                    se.echo("[[bu;#fff;]help] [method]\ndisplay help " + "for the method or list of methods if not" + " specified")
                                } else {
                                    var i = "Method `" + n + "' not found ";
                                    se.error(i)
                                }
                            }
                        }
                    };
                    r(l)
                } else {
                    r(null)
                }
            }
            return e.jrpc({
                url: n,
                method: "system.describe",
                params: [],
                success: l,
                request: function (e, n) {
                    try {
                        Te.request.call(se, e, n, se)
                    } catch (t) {
                        y(t, "USER")
                    }
                }, response: function (e, n) {
                    try {
                        Te.response.call(se, e, n, se)
                    } catch (t) {
                        y(t, "USER")
                    }
                }, error: function () {
                    r(null)
                }
            })
        }

        function h(n, t, r) {
            r = r || e.noop;
            var i = e.type(n);
            var o;
            var a = {};
            var s = 0;
            var l;
            if (i === "array") {
                o = {};
                (function f(n, r) {
                    if (n.length) {
                        var i = n[0];
                        var a = n.slice(1);
                        var u = e.type(i);
                        if (u === "string") {
                            se.pause(Te.softPause);
                            if (Te.ignoreSystemDescribe) {
                                if (++s === 1) {
                                    l = c(i, t)
                                } else {
                                    se.error(Ce.oneRPCWithIgnore)
                                }
                                f(a, r)
                            } else {
                                m(i, t, function (n) {
                                    if (n) {
                                        e.extend(o, n)
                                    } else {
                                        if (++s === 1) {
                                            l = c(i, t)
                                        } else {
                                            se.error(Ce.oneRPCWithIgnore)
                                        }
                                    }
                                    se.resume();
                                    f(a, r)
                                })
                            }
                        } else {
                            if (u === "function") {
                                if (l) {
                                    se.error(Ce.oneInterpreterFunction)
                                } else {
                                    l = i
                                }
                                f(a, r)
                            } else {
                                if (u === "object") {
                                    e.extend(o, i);
                                    f(a, r)
                                }
                            }
                        }
                    } else {
                        r()
                    }
                })(n, function () {
                    r({
                        interpreter: u(o, false, t, l.bind(se)),
                        completion: Object.keys(o)
                    })
                })
            } else {
                if (i === "string") {
                    if (Te.ignoreSystemDescribe) {
                        o = {
                            interpreter: c(n, t)
                        };
                        if (e.isArray(Te.completion)) {
                            o.completion = Te.completion
                        }
                        r(o)
                    } else {
                        se.pause(Te.softPause);
                        m(n, t, function (e) {
                            if (e) {
                                a.interpreter = u(e, false, t);
                                a.completion = Object.keys(e)
                            } else {
                                a.interpreter = c(n, t)
                            }
                            r(a);
                            se.resume()
                        })
                    }
                } else {
                    if (i === "object") {
                        r({
                            interpreter: u(n, Te.checkArity),
                            completion: Object.keys(n)
                        })
                    } else {
                        if (i === "undefined") {
                            n = e.noop
                        } else {
                            if (i !== "function") {
                                throw new Error(i + " is invalid interpreter value")
                            }
                        }
                        r({
                            interpreter: n,
                            completion: Te.completion
                        })
                    }
                }
            }
        }

        function g(n, t) {
            var r = e.type(t) === "boolean" ? "login" : t;
            return function (t, i, o) {
                se.pause(Te.softPause);
                e.jrpc({
                    url: n,
                    method: r,
                    params: [t, i],
                    request: function (e, n) {
                        try {
                            Te.request.call(se, e, n, se)
                        } catch (t) {
                            y(t, "USER")
                        }
                    }, response: function (e, n) {
                        try {
                            Te.response.call(se, e, n, se)
                        } catch (t) {
                            y(t, "USER")
                        }
                    }, success: function (e) {
                        if (!e.error && e.result) {
                            o(e.result)
                        } else {
                            o(null)
                        }
                        se.resume()
                    }, error: p
                })
            }
        }

        function v(e) {
            if (typeof e === "string") {
                return e
            } else {
                if (typeof e.fileName === "string") {
                    return e.fileName + ": " + e.message
                } else {
                    return e.message
                }
            }
        }

        function y(n, t) {
            if (e.isFunction(Te.exceptionHandler)) {
                Te.exceptionHandler.call(se, n, t)
            } else {
                se.exception(n, t)
            }
        }

        function _() {
            var e;
            if (le.prop) {
                e = le.prop("scrollHeight")
            } else {
                e = le.attr("scrollHeight")
            }
            le.scrollTop(e)
        }

        function k(n, t) {
            try {
                if (e.isFunction(t)) {
                    t(function () {})
                } else {
                    if (typeof t !== "string") {
                        var r = n + " must be string or function";
                        throw r
                    }
                }
            } catch (i) {
                y(i, n.toUpperCase());
                return false
            }
            return true
        }
        var x = [];
        var T = 1;

        function R(t, r) {
            if (Te.convertLinks && !r.raw) {
                t = t.replace(F, "[[!;;]$1]").replace(A, "[[!;;]$1]")
            }
            var i = e.terminal.defaults.formatters;
            var o, a;
            if (!r.raw) {
                if (r.formatters) {
                    for (o = 0; o < i.length; ++o) {
                        try {
                            if (typeof i[o] === "function") {
                                var s = i[o](t);
                                if (typeof s === "string") {
                                    t = s
                                }
                            }
                        } catch (l) {
                            if (e.isFunction(Te.exceptionHandler)) {
                                Te.exceptionHandler.call(se, l, "FORMATTERS")
                            } else {
                                alert("formatting error at formatters[" + o + "]\n" + (l.stack ? l.stack : l))
                            }
                        }
                    }
                }
                t = e.terminal.encode(t)
            }
            x.push(T);
            if (!r.raw && (t.length > he || t.match(/\n/)) && (Te.wrap === true && r.wrap === n || Te.wrap === false && r.wrap === true)) {
                var f = r.keepWords;
                var c = e.terminal.split_equal(t, he, f);
                for (o = 0, a = c.length; o < a; ++o) {
                    if (c[o] === "" || c[o] === "\r") {
                        x.push("<span></span>")
                    } else {
                        if (r.raw) {
                            x.push(c[o])
                        } else {
                            x.push(e.terminal.format(c[o], {
                                linksNoReferrer: Te.linksNoReferrer
                            }))
                        }
                    }
                }
            } else {
                if (!r.raw) {
                    t = e.terminal.format(t, {
                        linksNoReferrer: Te.linksNoReferrer
                    });
                    t.split(/\n/).forEach(function (e) {
                        x.push(e)
                    })
                } else {
                    x.push(t)
                }
            }
            x.push(r.finalize)
        }

        function C(n, t) {
            try {
                var r = e.extend({
                    exec: true,
                    raw: false,
                    finalize: e.noop
                }, t || {});
                var i = e.type(n) === "function" ? n() : n;
                i = e.type(i) === "string" ? i : String(i);
                if (i !== "") {
                    i = e.map(i.split(I), function (n) {
                        if (n.match(I) && !e.terminal.is_formatting(n)) {
                            n = n.replace(/^\[\[|\]\]$/g, "");
                            if (r.exec) {
                                if (fe && fe.command === n) {
                                    se.error(Ce.recursiveCall)
                                } else {
                                    e.terminal.extended_command(se, n)
                                }
                            }
                            return ""
                        } else {
                            return n
                        }
                    }).join("");
                    if (i !== "") {
                        R(i, r)
                    }
                }
            } catch (o) {
                x = [];
                if (e.isFunction(Te.exceptionHandler)) {
                    Te.exceptionHandler.call(se, o, "TERMINAL")
                } else {
                    alert("[Internal Exception(process_line)]:" + v(o) + "\n" + o.stack)
                }
            }
        }

        function E() {
            ze.resize(he);
            var n = pe.empty().detach();
            var t;
            if (Te.outputLimit >= 0) {
                var r;
                if (Te.outputLimit === 0) {
                    r = se.rows()
                } else {
                    r = Te.outputLimit
                }
                t = ue.slice(ue.length - r - 1)
            } else {
                t = ue
            }
            try {
                x = [];
                e.each(t, function (e, n) {
                    C.apply(null, n)
                });
                ze.before(n);
                se.flush()
            } catch (i) {
                if (e.isFunction(Te.exceptionHandler)) {
                    Te.exceptionHandler.call(se, i, "TERMINAL (redraw)")
                } else {
                    alert("Exception in redraw\n" + i.stack)
                }
            }
        }

        function L() {
            if (Te.greetings === n) {
                se.echo(se.signature)
            } else {
                if (Te.greetings) {
                    var e = typeof Te.greetings;
                    if (e === "string") {
                        se.echo(Te.greetings)
                    } else {
                        if (e === "function") {
                            Te.greetings.call(se, se.echo)
                        } else {
                            se.error(Ce.wrongGreetings)
                        }
                    }
                }
            }
        }

        function O(n) {
            var t = ze.prompt();
            var r = ze.mask();
            switch (typeof r) {
            case "string":
                n = n.replace(/./g, r);
                break;
            case "boolean":
                if (r) {
                    n = n.replace(/./g, Te.maskChar)
                } else {
                    n = e.terminal.escape_formatting(n)
                }
                break
            }
            var i = {
                finalize: function (e) {
                    e.addClass("command")
                }
            };
            if (e.isFunction(t)) {
                t(function (e) {
                    se.echo(e + n, i)
                })
            } else {
                se.echo(t + n, i)
            }
        }

        function P(e) {
            var n = Z.get()[e[0]];
            if (!n) {
                throw new Error(Ce.invalidTerminalId)
            }
            var t = e[1];
            if (ee[t]) {
                n.import_view(ee[t])
            } else {
                te = false;
                var r = e[2];
                if (r) {
                    n.exec(r).then(function () {
                        te = true;
                        ee[t] = n.export_view()
                    })
                }
            }
        }

        function j() {
            if (te) {
                re = false;
                location.hash = "#" + JSON.stringify(ne);
                setTimeout(function () {
                    re = true
                }, 100)
            }
        }
        var N = true;
        var $ = [];

        function z(t, r, i) {
            if (N) {
                N = false;
                if (Te.historyState || Te.execHash && i) {
                    if (!ee.length) {
                        se.save_state()
                    } else {
                        se.save_state(null)
                    }
                }
            }

            function o() {
                if (!i) {
                    te = true;
                    if (Te.historyState) {
                        se.save_state(t, false)
                    }
                    te = f
                }
                l.resolve();
                if (e.isFunction(Te.onAfterCommand)) {
                    Te.onAfterCommand.call(se, se, t)
                }
            }
            try {
                if (e.isFunction(Te.onBeforeCommand)) {
                    if (Te.onBeforeCommand.call(se, se, t) === false) {
                        return
                    }
                }
                if (!i) {
                    fe = e.terminal.split_command(t)
                }
                if (!G()) {
                    if (i && (e.isFunction(Te.historyFilter) && Te.historyFilter(t) || t.match(Te.historyFilter))) {
                        ze.history().append(t)
                    }
                }
                var a = $e.top();
                if (!r && Te.echoCommand) {
                    O(t)
                }
                var l = new e.Deferred;
                var f = te;
                if (t.match(/^\s*login\s*$/) && se.token(true)) {
                    if (se.level() > 1) {
                        se.logout(true)
                    } else {
                        se.logout()
                    }
                    o()
                } else {
                    if (Te.exit && t.match(/^\s*exit\s*$/) && !_e) {
                        var c = se.level();
                        if (c === 1 && se.get_token() || c > 1) {
                            if (se.get_token(true)) {
                                se.set_token(n, true)
                            }
                            se.pop()
                        }
                        o()
                    } else {
                        if (Te.clear && t.match(/^\s*clear\s*$/) && !_e) {
                            se.clear();
                            o()
                        } else {
                            var u = ue.length - 1;
                            var p = a.interpreter.call(se, t, se);
                            if (p !== n) {
                                se.pause(Te.softPause);
                                return e.when(p).then(function (e) {
                                    if (e && u === ue.length - 1) {
                                        s(e)
                                    }
                                    o();
                                    se.resume()
                                })
                            } else {
                                if (Ae) {
                                    $.push(function () {
                                        o()
                                    })
                                } else {
                                    o()
                                }
                            }
                        }
                    }
                }
                return l.promise()
            } catch (m) {
                y(m, "USER");
                se.resume();
                throw m
            }
        }

        function H() {
            if (e.isFunction(Te.onBeforeLogout)) {
                try {
                    if (Te.onBeforeLogout.call(se, se) === false) {
                        return
                    }
                } catch (n) {
                    y(n, "onBeforeLogout")
                }
            }
            D();
            if (e.isFunction(Te.onAfterLogout)) {
                try {
                    Te.onAfterLogout.call(se, se)
                } catch (n) {
                    y(n, "onAfterlogout")
                }
            }
            se.login(Te.login, true, M)
        }

        function D() {
            var e = se.prefix_name(true) + "_";
            Re.remove(e + "token");
            Re.remove(e + "login")
        }

        function B(n) {
            var t = se.prefix_name() + "_interpreters";
            var r = Re.get(t);
            if (r) {
                r = e.parseJSON(r)
            } else {
                r = []
            } if (e.inArray(n, r) === -1) {
                r.push(n);
                Re.set(t, JSON.stringify(r))
            }
        }

        function J(n) {
            var t = $e.top();
            var r = se.prefix_name(true);
            if (!G()) {
                B(r)
            }
            ze.name(r);
            if (e.isFunction(t.prompt)) {
                ze.prompt(function (e) {
                    t.prompt.call(se, e, se)
                })
            } else {
                ze.prompt(t.prompt)
            } if (e.isPlainObject(t.keymap)) {
                ze.keymap(e.omap(t.keymap, function (e, n) {
                    return function () {
                        var e = [].slice.call(arguments);
                        try {
                            return n.apply(se, e)
                        } catch (t) {
                            y(t, "USER KEYMAP");
                            throw t
                        }
                    }
                }))
            }
            ze.set("");
            if (!n && e.isFunction(t.onStart)) {
                t.onStart.call(se, se)
            }
        }

        function K() {
            if (re && Te.execHash) {
                try {
                    if (location.hash) {
                        var n = location.hash.replace(/^#/, "");
                        ne = e.parseJSON(decodeURIComponent(n))
                    } else {
                        ne = []
                    } if (ne.length) {
                        P(ne[ne.length - 1])
                    } else {
                        if (ee[0]) {
                            se.import_view(ee[0])
                        }
                    }
                } catch (t) {
                    y(t, "TERMINAL")
                }
            }
        }

        function M() {
            J();
            L();
            if (ue.length) {
                E()
            }
            var n = false;
            if (e.isFunction(Te.onInit)) {
                we = function () {
                    n = true
                };
                try {
                    Te.onInit.call(se, se)
                } catch (t) {
                    y(t, "OnInit")
                } finally {
                    we = e.noop;
                    if (!n && se.enabled()) {
                        se.resume()
                    }
                }
            }
            if (ie) {
                ie = false;
                e(window).on("hashchange", K)
            }
        }

        function G() {
            return _e || ze.mask() !== false
        }

        function Y(t) {
            var r, i = $e.top();
            if (e.isFunction(i.keydown)) {
                r = i.keydown.call(se, t, se);
                if (r !== n) {
                    return r
                }
            } else {
                if (e.isFunction(Te.keydown)) {
                    r = Te.keydown.call(se, t, se);
                    if (r !== n) {
                        return r
                    }
                }
            }
        }
        var X = {
            "CTRL+D": function (e, t) {
                if (!_e) {
                    if (ze.get() === "") {
                        if ($e.size() > 1 || Te.login !== n) {
                            se.pop("")
                        } else {
                            se.resume();
                            se.echo("")
                        }
                    } else {
                        t()
                    }
                }
                return false
            }, "CTRL+L": function () {
                se.clear()
            }, TAB: function (t, r) {
                var i = $e.top(),
                    o;
                if (Te.completion && e.type(Te.completion) !== "boolean" && i.completion === n) {
                    o = Te.completion
                } else {
                    o = i.completion
                } if (o === "settings") {
                    o = Te.completion
                }
                if (o) {
                    switch (e.type(o)) {
                    case "function":
                        var a = se.before_cursor(Te.wordAutocomplete);
                        if (o.length === 3) {
                            var s = new Error(Te.comletionParameters);
                            y(s, "USER");
                            return false
                        }
                        o.call(se, a, function (e) {
                            se.complete(e, {
                                echo: true
                            })
                        });
                        break;
                    case "array":
                        se.complete(o, {
                            echo: true
                        });
                        break;
                    default:
                        throw new Error(Ce.invalidCompletion)
                    }
                } else {
                    r()
                }
                return false
            }, "CTRL+V": function (e, n) {
                n(e);
                se.oneTime(1, function () {
                    _()
                })
            }, "CTRL+TAB": function () {
                if (Z.length() > 1) {
                    se.focus(false);
                    return false
                }
            }, PAGEDOWN: function () {
                se.scroll(se.height())
            }, PAGEUP: function () {
                se.scroll(-se.height())
            }
        };

        function oe(t) {
            var r, i;
            if (!se.paused() && se.enabled()) {
                r = Y(t);
                if (r !== n) {
                    return r
                }
                if (t.which !== 9) {
                    ce = 0
                }
                se.attr({
                    scrollTop: se.attr("scrollHeight")
                })
            } else {
                if (t.which === 68 && t.ctrlKey) {
                    r = Y(t);
                    if (r !== n) {
                        return r
                    }
                    if (V.length) {
                        for (i = V.length; i--;) {
                            var o = V[i];
                            if (o.readyState !== 4) {
                                try {
                                    o.abort()
                                } catch (a) {
                                    if (e.isFunction(Te.exceptionHandler)) {
                                        Te.exceptionHandler.call(se, t, "AJAX ABORT")
                                    } else {
                                        se.error(Ce.ajaxAbortError)
                                    }
                                }
                            }
                        }
                        V = [];
                        se.resume()
                    }
                    return false
                }
            }
        }

        function ae(e) {
            if (ye.state() !== "resolved") {
                ye.then(e.bind(se))
            } else {
                e.call(se)
            }
        }
        var se = this;
        if (this.length > 1) {
            return this.each(function () {
                e.fn.terminal.call(e(this), t, e.extend({
                    name: se.selector
                }, i))
            })
        }
        if (se.data("terminal")) {
            return se.data("terminal")
        }
        if (se.length === 0) {
            throw sprintf(e.terminal.defaults.strings.invalidSelector, se.selector)
        }
        var le;
        var fe;
        var ce = 0;
        var ue = [];
        var pe;
        var me = Z.length();
        var he;
        var de;
        var ge;
        var ve = new d;
        var ye = e.Deferred();
        var _e = false;
        var we = e.noop;
        var be, ke;
        var xe = [];
        var Te = e.extend({}, e.terminal.defaults, {
            name: se.selector
        }, i || {});
        var Re = new o(Te.memory);
        var Ce = e.extend({}, e.terminal.defaults.strings, Te.strings);
        var Ee = Te.enabled,
            Se = false;
        var Ae = false;
        var Fe = true;
        e.extend(se, e.omap({
            id: function () {
                return me
            }, clear: function () {
                pe.html("");
                ue = [];
                try {
                    Te.onClear.call(se, se)
                } catch (e) {
                    y(e, "onClear")
                }
                se.attr({
                    scrollTop: 0
                });
                return se
            }, export_view: function () {
                var n = {};
                if (e.isFunction(Te.onExport)) {
                    try {
                        n = Te.onExport.call(se)
                    } catch (t) {
                        y(t, "onExport")
                    }
                }
                return e.extend({}, {
                    focus: Ee,
                    mask: ze.mask(),
                    prompt: se.get_prompt(),
                    command: se.get_command(),
                    position: ze.position(),
                    lines: r(ue),
                    interpreters: $e.clone(),
                    history: ze.history().data
                }, n)
            }, import_view: function (n) {
                if (_e) {
                    throw new Error(sprintf(Ce.notWhileLogin, "import_view"))
                }
                if (e.isFunction(Te.onImport)) {
                    try {
                        Te.onImport.call(se, n)
                    } catch (t) {
                        y(t, "onImport")
                    }
                }
                ae(function i() {
                    se.set_prompt(n.prompt);
                    se.set_command(n.command);
                    ze.position(n.position);
                    ze.mask(n.mask);
                    if (n.focus) {
                        se.focus()
                    }
                    ue = r(n.lines);
                    $e = n.interpreters;
                    if (Te.importHistory) {
                        ze.history().set(n.history)
                    }
                    E()
                });
                return se
            }, save_state: function (t, r, i) {
                if (typeof i !== "undefined") {
                    ee[i] = se.export_view()
                } else {
                    ee.push(se.export_view())
                } if (!e.isArray(ne)) {
                    ne = []
                }
                if (t !== n && !r) {
                    var o = [me, ee.length - 1, t];
                    ne.push(o);
                    j()
                }
            }, exec: function (n, t, r) {
                var i = r || new e.Deferred;
                ae(function o() {
                    if (e.isArray(n)) {
                        (function r() {
                            var e = n.shift();
                            if (e) {
                                se.exec(e, t).then(r)
                            } else {
                                i.resolve()
                            }
                        })()
                    } else {
                        if (Ae) {
                            xe.push([n, t, i])
                        } else {
                            z(n, t, true).then(function () {
                                i.resolve(se)
                            })
                        }
                    }
                });
                return i.promise()
            }, autologin: function (e, n, t) {
                se.trigger("terminal.autologin", [e, n, t]);
                return se
            }, login: function (n, t, r, i) {
                ve.push([].slice.call(arguments));
                if (_e) {
                    throw new Error(sprintf(Ce.notWhileLogin, "login"))
                }
                if (!e.isFunction(n)) {
                    throw new Error(Ce.loginIsNotAFunction)
                }
                _e = true;
                if (se.token() && se.level() === 1 && !Fe) {
                    _e = false;
                    se.logout(true)
                } else {
                    if (se.token(true) && se.login_name(true)) {
                        _e = false;
                        if (e.isFunction(r)) {
                            r()
                        }
                        return se
                    }
                } if (Te.history) {
                    ze.history().disable()
                }
                var o = se.level();

                function a(n, a, s) {
                    if (a) {
                        while (se.level() > o) {
                            se.pop()
                        }
                        if (Te.history) {
                            ze.history().enable()
                        }
                        var l = se.prefix_name(true) + "_";
                        Re.set(l + "token", a);
                        Re.set(l + "login", n);
                        _e = false;
                        if (e.isFunction(r)) {
                            r()
                        }
                    } else {
                        if (t) {
                            if (!s) {
                                se.error(Ce.wrongPasswordTryAgain)
                            }
                            se.pop().set_mask(false)
                        } else {
                            _e = false;
                            if (!s) {
                                se.error(Ce.wrongPassword)
                            }
                            se.pop().pop()
                        } if (e.isFunction(i)) {
                            i()
                        }
                    }
                    se.off("terminal.autologin")
                }
                se.on("terminal.autologin", function (e, n, t, r) {
                    a(n, t, r)
                });
                se.push(function (e) {
                    se.set_mask(Te.maskChar).push(function (t) {
                        try {
                            n.call(se, e, t, function (n, t) {
                                a(e, n, t)
                            })
                        } catch (r) {
                            y(r, "AUTH")
                        }
                    }, {
                        prompt: Ce.password + ": ",
                        name: "password"
                    })
                }, {
                    prompt: Ce.login + ": ",
                    name: "login"
                });
                return se
            }, settings: function () {
                return Te
            }, before_cursor: function (e) {
                var n = ze.position();
                var t = ze.get().substring(0, n);
                var r = t.split(" ");
                var i;
                if (e) {
                    if (r.length === 1) {
                        i = r[0]
                    } else {
                        i = r[r.length - 1];
                        for (Ie = r.length - 1; Ie > 0; Ie--) {
                            var o = r[Ie - 1];
                            if (o[o.length - 1] === "\\") {
                                i = r[Ie - 1] + " " + i
                            } else {
                                break
                            }
                        }
                    }
                } else {
                    i = t
                }
                return i
            }, complete: function (n, t) {
                t = e.extend({
                    word: true,
                    echo: false
                }, t || {});
                var r = se.before_cursor(t.word);
                n = n.slice();
                if (Te.clear && e.inArray("clear", n) === -1) {
                    n.push("clear")
                }
                if (Te.exit && e.inArray("exit", n) === -1) {
                    n.push("exit")
                }
                if (ce % 2 === 0) {
                    ge = se.before_cursor(t.word)
                } else {
                    var i = se.before_cursor(t.word);
                    if (i !== ge) {
                        return
                    }
                }
                var o = new RegExp("^" + e.terminal.escape_regex(r));
                var a = [];
                for (var s = n.length; s--;) {
                    if (o.test(n[s])) {
                        a.push(n[s])
                    }
                }
                if (a.length === 1) {
                    se.insert(a[0].replace(o, ""));
                    ge = se.before_cursor(t.word);
                    return true
                } else {
                    if (a.length > 1) {
                        if (++ce >= 2) {
                            ce = 0;
                            if (t.echo) {
                                var l = a.reverse().join("    ");
                                se.echo(e.terminal.escape_brackets(l), {
                                    keepWords: true
                                });
                                return true
                            }
                        } else {
                            var f = false;
                            var c;
                            e: for (c = r.length; c < a[0].length; ++c) {
                                for (s = 1; s < a.length; ++s) {
                                    if (a[0].charAt(c) !== a[s].charAt(c)) {
                                        break e
                                    }
                                }
                                f = true
                            }
                            if (f) {
                                se.insert(a[0].slice(0, c).replace(o, ""));
                                ge = se.before_cursor(t.word);
                                return true
                            }
                        }
                    }
                }
            }, commands: function () {
                return $e.top().interpreter
            }, set_interpreter: function (n, t) {
                function r() {
                    se.pause(Te.softPause);
                    h(n, !!t, function (n) {
                        se.resume();
                        var t = $e.top();
                        e.extend(t, n);
                        J(true)
                    })
                }
                if (e.type(n) === "string" && t) {
                    se.login(g(n, t), true, r)
                } else {
                    r()
                }
                return se
            }, greetings: function () {
                L();
                return se
            }, paused: function () {
                return Ae
            }, pause: function (n) {
                ae(function t() {
                    we();
                    Ae = true;
                    ze.disable();
                    if (!n) {
                        ze.hidden()
                    }
                    if (e.isFunction(Te.onPause)) {
                        Te.onPause.call(se)
                    }
                });
                return se
            }, resume: function () {
                ae(function n() {
                    Ae = false;
                    if (Z.front() === se) {
                        ze.enable()
                    }
                    ze.visible();
                    var n = xe;
                    xe = [];
                    for (var t = 0; t < n.length; ++t) {
                        se.exec.apply(se, n[t])
                    }
                    se.trigger("resume");
                    var r = $.shift();
                    if (r) {
                        r()
                    }
                    _();
                    if (e.isFunction(Te.onResume)) {
                        Te.onResume.call(se)
                    }
                });
                return se
            }, cols: function () {
                return Te.numChars ? Te.numChars : W(se)
            }, rows: function () {
                return Te.numRows ? Te.numRows : U(se)
            }, history: function () {
                return ze.history()
            }, history_state: function (e) {
                function n() {
                    Te.historyState = true;
                    if (!ee.length) {
                        se.save_state()
                    } else {
                        if (Z.length() > 1) {
                            se.save_state(null)
                        }
                    }
                }
                if (e) {
                    if (typeof window.setImmediate === "undefined") {
                        setTimeout(n, 0)
                    } else {
                        setImmediate(n)
                    }
                } else {
                    Te.historyState = false
                }
                return se
            }, clear_history_state: function () {
                ne = [];
                ee = [];
                return se
            }, next: function () {
                if (Z.length() === 1) {
                    return se
                } else {
                    Z.front().disable();
                    var n = Z.rotate().enable();
                    var t = n.offset().top - 50;
                    e("html,body").animate({
                        scrollTop: t
                    }, 500);
                    try {
                        Te.onTerminalChange.call(n, n)
                    } catch (r) {
                        y(r, "onTerminalChange")
                    }
                    return n
                }
            }, focus: function (e, n) {
                ae(function t() {
                    var t;
                    if (Z.length() === 1) {
                        if (e === false) {
                            try {
                                t = Te.onBlur.call(se, se);
                                if (!n && t !== false || n) {
                                    se.disable()
                                }
                            } catch (r) {
                                y(r, "onBlur")
                            }
                        } else {
                            try {
                                t = Te.onFocus.call(se, se);
                                if (!n && t !== false || n) {
                                    se.enable()
                                }
                            } catch (r) {
                                y(r, "onFocus")
                            }
                        }
                    } else {
                        if (e === false) {
                            se.next()
                        } else {
                            var i = Z.front();
                            if (i !== se) {
                                i.disable();
                                if (!n) {
                                    try {
                                        Te.onTerminalChange.call(se, se)
                                    } catch (r) {
                                        y(r, "onTerminalChange")
                                    }
                                }
                            }
                            Z.set(se);
                            se.enable()
                        }
                    }
                });
                return se
            }, freeze: function (e) {
                ae(function n() {
                    if (e) {
                        se.disable();
                        Se = true
                    } else {
                        Se = false;
                        se.enable()
                    }
                })
            }, frozen: function () {
                return Se
            }, enable: function () {
                if (!Ee && !Se) {
                    if (he === n) {
                        se.resize()
                    }
                    ae(function e() {
                        ze.enable();
                        Ee = true
                    })
                }
                return se
            }, disable: function () {
                if (Ee && !Se) {
                    ae(function e() {
                        Ee = false;
                        ze.disable()
                    })
                }
                return se
            }, enabled: function () {
                return Ee
            }, signature: function () {
                var e = se.cols();
                var n;
                if (e < 15) {
                    n = null
                } else {
                    if (e < 35) {
                        n = 0
                    } else {
                        if (e < 55) {
                            n = 1
                        } else {
                            if (e < 64) {
                                n = 2
                            } else {
                                if (e < 75) {
                                    n = 3
                                } else {
                                    n = 4
                                }
                            }
                        }
                    }
                } if (n !== null) {
                    return ""
                } else {
                    return ""
                }
            }, version: function () {
                return e.terminal.version
            }, cmd: function () {
                return ze
            }, get_command: function () {
                return ze.get()
            }, set_command: function (e) {
                ae(function n() {
                    ze.set(e)
                });
                return se
            }, insert: function (e) {
                if (typeof e === "string") {
                    ae(function n() {
                        ze.insert(e)
                    });
                    return se
                } else {
                    throw new Error("insert function argument is not a string")
                }
            }, set_prompt: function (n) {
                ae(function t() {
                    if (k("prompt", n)) {
                        if (e.isFunction(n)) {
                            ze.prompt(function (e) {
                                n(e, se)
                            })
                        } else {
                            ze.prompt(n)
                        }
                        $e.top().prompt = n
                    }
                });
                return se
            }, get_prompt: function () {
                return $e.top().prompt
            }, set_mask: function (e) {
                ae(function n() {
                    ze.mask(e === true ? Te.maskChar : e)
                });
                return se
            }, get_output: function (n) {
                if (n) {
                    return ue
                } else {
                    return e.map(ue, function (n) {
                        return e.isFunction(n[0]) ? n[0]() : n[0]
                    }).join("\n")
                }
            }, resize: function (n, t) {
                if (!se.is(":visible")) {
                    se.stopTime("resize");
                    se.oneTime(500, "resize", function () {
                        se.resize(n, t)
                    })
                } else {
                    if (n && t) {
                        se.width(n);
                        se.height(t)
                    }
                    n = se.width();
                    t = se.height();
                    var r = se.cols();
                    var i = se.rows();
                    if (r !== he || i !== de) {
                        he = r;
                        de = i;
                        E();
                        var o = $e.top();
                        if (e.isFunction(o.resize)) {
                            o.resize(se)
                        } else {
                            if (e.isFunction(Te.onResize)) {
                                Te.onResize.call(se, se)
                            }
                        }
                        _()
                    }
                }
                return se
            }, flush: function () {
                try {
                    var n = se.is_bottom();
                    var t;
                    e.each(x, function (n, r) {
                        if (r === T) {
                            t = e("<div></div>")
                        } else {
                            if (e.isFunction(r)) {
                                t.appendTo(pe);
                                try {
                                    r(t)
                                } catch (i) {
                                    y(i, "USER:echo(finalize)")
                                }
                            } else {
                                e("<div/>").html(r).appendTo(t).width("100%")
                            }
                        }
                    });
                    if (Te.outputLimit >= 0) {
                        var r;
                        if (Te.outputLimit === 0) {
                            r = se.rows()
                        } else {
                            r = Te.outputLimit
                        }
                        var i = pe.find("div div");
                        if (i.length > r) {
                            var o = i.length - r + 1;
                            var a = i.slice(0, o);
                            var s = a.parent();
                            a.remove();
                            s.each(function () {
                                var n = e(this);
                                if (n.is(":empty")) {
                                    n.remove()
                                }
                            })
                        }
                    }
                    de = U(se);
                    if (Te.scrollOnEcho || n) {
                        _()
                    }
                    x = []
                } catch (l) {
                    if (e.isFunction(Te.exceptionHandler)) {
                        Te.exceptionHandler.call(se, l, "TERMINAL (Flush)")
                    } else {
                        alert("[Flush] " + v(l) + "\n" + l.stack)
                    }
                }
                return se
            }, update: function (e, n) {
                ae(function t() {
                    if (e < 0) {
                        e = ue.length + e
                    }
                    if (!ue[e]) {
                        se.error("Invalid line number " + e)
                    } else {
                        if (n === null) {
                            ue.splice(e, 1)
                        } else {
                            ue[e][0] = n
                        }
                        E()
                    }
                });
                return se
            }, last_index: function () {
                return ue.length - 1
            }, echo: function (n, t) {
                function r(n) {
                    try {
                        var r = e.extend({
                            flush: true,
                            raw: Te.raw,
                            finalize: e.noop,
                            keepWords: false,
                            formatters: true
                        }, t || {});
                        if (r.flush) {
                            if (x.length) {
                                se.flush()
                            }
                            x = []
                        }
                        C(n, r);
                        ue.push([n, e.extend(r, {
                            exec: false
                        })]);
                        if (r.flush) {
                            se.flush()
                        }
                    } catch (i) {
                        if (e.isFunction(Te.exceptionHandler)) {
                            Te.exceptionHandler.call(se, i, "TERMINAL (echo)")
                        } else {
                            alert("[Terminal.echo] " + v(i) + "\n" + i.stack)
                        }
                    }
                }
                n = n || "";
                var i = e.type(n);
                if (i === "function" || i === "string") {
                    r(n)
                } else {
                    e.when(n).then(r)
                }
                return se
            }, error: function (n, t) {
                t = e.extend({}, t, {
                    raw: false,
                    formatters: false
                });
                var r = e.terminal.escape_brackets(n).replace(/\\$/, "&#92;").replace(S, "]$1[[;;;error]");
                return se.echo("[[;;;error]" + r + "]", t)
            }, exception: function (n, t) {
                var r = v(n);
                if (t) {
                    r = "&#91;" + t + "&#93;: " + r
                }
                if (r) {
                    se.error(r, {
                        finalize: function (e) {
                            e.addClass("exception message")
                        }, keepWords: true
                    })
                }
                if (typeof n.fileName === "string") {
                    se.pause(Te.softPause);
                    e.get(n.fileName, function (e) {
                        var t = n.lineNumber - 1;
                        var r = e.split("\n")[t];
                        if (r) {
                            se.error("[" + n.lineNumber + "]: " + r)
                        }
                        se.resume()
                    }, "text")
                }
                if (n.stack) {
                    var i = e.terminal.escape_brackets(n.stack);
                    se.echo(i.split(/\n/g).map(function (e) {
                        return "[[;;;error]" + e.replace(S, function (e) {
                            return "]" + e + "[[;;;error]"
                        }) + "]"
                    }).join("\n"), {
                        finalize: function (e) {
                            e.addClass("exception stack-trace")
                        }, formatters: false
                    })
                }
            }, scroll: function (e) {
                var n;
                e = Math.round(e);
                if (le.prop) {
                    if (e > le.prop("scrollTop") && e > 0) {
                        le.prop("scrollTop", 0)
                    }
                    n = le.prop("scrollTop");
                    le.scrollTop(n + e)
                } else {
                    if (e > le.attr("scrollTop") && e > 0) {
                        le.attr("scrollTop", 0)
                    }
                    n = le.attr("scrollTop");
                    le.scrollTop(n + e)
                }
                return se
            }, logout: function (e) {
                if (_e) {
                    throw new Error(sprintf(Ce.notWhileLogin, "logout"))
                }
                ae(function t() {
                    if (e) {
                        var t = ve.pop();
                        se.set_token(n, true);
                        se.login.apply(se, t)
                    } else {
                        if ($e.size() === 1 && se.token()) {
                            se.logout(true)
                        } else {
                            while ($e.size() > 1) {
                                if (se.token()) {
                                    se.logout(true).pop().pop()
                                } else {
                                    se.pop()
                                }
                            }
                        }
                    }
                });
                return se
            }, token: function (e) {
                return Re.get(se.prefix_name(e) + "_token")
            }, set_token: function (e, n) {
                var t = se.prefix_name(n) + "_token";
                if (typeof e === "undefined") {
                    Re.remove(t, e)
                } else {
                    Re.set(t, e)
                }
                return se
            }, get_token: function (e) {
                return se.token(e)
            }, login_name: function (e) {
                return Re.get(se.prefix_name(e) + "_login")
            }, name: function () {
                return $e.top().name
            }, prefix_name: function (e) {
                var n = (Te.name ? Te.name + "_" : "") + me;
                if (e && $e.size() > 1) {
                    var t = $e.map(function (e) {
                        return e.name || ""
                    }).slice(1).join("_");
                    if (t) {
                        n += "_" + t
                    }
                }
                return n
            }, read: function (n, t) {
                var r = new e.Deferred;
                se.push(function (n) {
                    se.pop();
                    if (e.isFunction(t)) {
                        t(n)
                    }
                    r.resolve(n)
                }, {
                    prompt: n
                });
                return r.promise()
            }, push: function (t, r) {
                ae(function i() {
                    r = r || {};
                    var i = {
                        infiniteLogin: false,
                        extra: {}
                    };
                    var o = e.extend({}, i, r);
                    if (!o.name && fe) {
                        o.name = fe.name
                    }
                    if (o.prompt === n) {
                        o.prompt = (o.name || ">") + " "
                    }
                    var a = $e.top();
                    if (a) {
                        a.mask = ze.mask()
                    }
                    var s = Ae;

                    function l() {
                        Te.onPush.call(se, a, $e.top(), se);
                        J()
                    }
                    h(t, !!r.login, function (n) {
                        $e.push(e.extend({}, n, o));
                        if (o.completion === true) {
                            if (e.isArray(n.completion)) {
                                $e.top().completion = n.completion
                            } else {
                                if (!n.completion) {
                                    $e.top().completion = false
                                }
                            }
                        }
                        if (o.login) {
                            var r;
                            var i = e.type(o.login);
                            if (i === "function") {
                                r = o.infiniteLogin ? e.noop : se.pop;
                                se.login(o.login, o.infiniteLogin, l, r)
                            } else {
                                if (e.type(t) === "string" && i === "string" || i === "boolean") {
                                    r = o.infiniteLogin ? e.noop : se.pop;
                                    se.login(g(t, o.login), o.infiniteLogin, l, r)
                                }
                            }
                        } else {
                            l()
                        } if (!s && se.enabled()) {
                            se.resume()
                        }
                    })
                });
                return se
            }, pop: function (t) {
                if (t !== n) {
                    O(t)
                }
                var r = se.token(true);
                var i;
                if ($e.size() === 1) {
                    i = $e.top();
                    if (Te.login) {
                        H();
                        if (e.isFunction(Te.onExit)) {
                            try {
                                Te.onExit.call(se, se)
                            } catch (o) {
                                y(o, "onExit")
                            }
                        }
                    } else {
                        se.error(Ce.canExitError)
                    }
                    Te.onPop.call(se, i, null, se)
                } else {
                    if (r) {
                        D()
                    }
                    var a = $e.pop();
                    i = $e.top();
                    J();
                    Te.onPop.call(se, a, i);
                    if (_e && se.get_prompt() !== Ce.login + ": ") {
                        _e = false
                    }
                    if (e.isFunction(a.onExit)) {
                        try {
                            a.onExit.call(se, se)
                        } catch (o) {
                            y(o, "onExit")
                        }
                    }
                    se.set_mask(i.mask)
                }
                return se
            }, option: function (n, t) {
                if (typeof t === "undefined") {
                    if (typeof n === "string") {
                        return Te[n]
                    } else {
                        if (typeof n === "object") {
                            e.each(n, function (e, n) {
                                Te[e] = n
                            })
                        }
                    }
                } else {
                    Te[n] = t
                }
                return se
            }, level: function () {
                return $e.size()
            }, reset: function () {
                ae(function e() {
                    se.clear();
                    while ($e.size() > 1) {
                        $e.pop()
                    }
                    M()
                });
                return se
            }, purge: function () {
                ae(function n() {
                    var n = se.prefix_name() + "_";
                    var t = Re.get(n + "interpreters");
                    e.each(e.parseJSON(t), function (e, n) {
                        Re.remove(n + "_commands");
                        Re.remove(n + "_token");
                        Re.remove(n + "_login")
                    });
                    ze.purge();
                    Re.remove(n + "interpreters")
                });
                return se
            }, destroy: function () {
                ae(function n() {
                    ze.destroy().remove();
                    pe.remove();
                    Le.remove();
                    e(document).unbind(".terminal_" + se.id());
                    e(window).unbind(".terminal_" + se.id());
                    se.unbind("click mousewheel mousedown mouseup");
                    se.removeData("terminal").removeClass("terminal");
                    if (Te.width) {
                        se.css("width", "")
                    }
                    if (Te.height) {
                        se.css("height", "")
                    }
                    e(window).off("blur", Be).off("focus", De);
                    Oe.remove();
                    Z.remove(me);
                    if (!Z.length()) {
                        e(window).off("hashchange")
                    }
                });
                return se
            }, scroll_to_bottom: _,
            is_bottom: function () {
                if (Te.scrollBottomOffset === -1) {
                    return false
                } else {
                    var n, t, r;
                    if (se.is("body")) {
                        n = e(document).height();
                        t = e(window).scrollTop();
                        r = window.innerHeight
                    } else {
                        n = le[0].scrollHeight;
                        t = le.scrollTop();
                        r = le.outerHeight()
                    }
                    var i = n - Te.scrollBottomOffset;
                    return t + r > i
                }
            }
        }, function (e, n) {
            return function () {
                try {
                    return n.apply(se, [].slice.apply(arguments))
                } catch (t) {
                    if (e !== "exec" && e !== "resume") {
                        y(t, "TERMINAL")
                    }
                    throw t
                }
            }
        }));
        if (Te.width) {
            se.width(Te.width)
        }
        if (Te.height) {
            se.height(Te.height)
        }
        le = se.scroll_element();
        e(document).bind("ajaxSend.terminal_" + se.id(), function (e, n) {
            V.push(n)
        });
        var Le = e('<div class="terminal-wrapper"/>').appendTo(se);
        var Oe = e("<iframe/>").appendTo(Le);
        pe = e("<div>").addClass("terminal-output").appendTo(Le);
        se.addClass("terminal");
        if (Te.login && e.isFunction(Te.onBeforeLogin)) {
            try {
                if (Te.onBeforeLogin.call(se, se) === false) {
                    Fe = false
                }
            } catch (Pe) {
                y(Pe, "onBeforeLogin");
                throw Pe
            }
        }
        var je;
        if (typeof t === "string") {
            je = t
        } else {
            if (t instanceof Array) {
                for (var Ie = 0, Ne = t.length; Ie < Ne; ++Ie) {
                    if (typeof t[Ie] === "string") {
                        je = t[Ie];
                        break
                    }
                }
            }
        } if (je && (typeof Te.login === "string" || Te.login === true)) {
            Te.login = g(je, Te.login)
        }
        Z.append(se);
        var $e;
        var ze;
        var He;

        function De() {
            if (He) {
                se.focus()
            }
        }

        function Be() {
            He = Ee;
            se.disable()
        }
        h(t, !!Te.login, function (t) {
            if (Te.completion && typeof Te.completion !== "boolean" || !Te.completion) {
                t.completion = "settings"
            }
            var r = e.extend({}, X, Te.keymap || {});
            $e = new d(e.extend({
                name: Te.name,
                prompt: Te.prompt,
                keypress: Te.keypress,
                keydown: Te.keydown,
                resize: Te.onResize,
                greetings: Te.greetings,
                mousewheel: Te.mousewheel,
                keymap: r,
                extra: Te.extra
            }, t));
            ze = e("<div/>").appendTo(Le).cmd({
                prompt: Te.prompt,
                history: Te.memory ? "memory" : Te.history,
                historyFilter: Te.historyFilter,
                historySize: Te.historySize,
                width: "100%",
                enabled: Ee && !w,
                keydown: oe,
                keymap: r,
                clickTimeout: Te.clickTimeout,
                keypress: function (n) {
                    var t = $e.top();
                    if (e.isFunction(t.keypress)) {
                        return t.keypress.call(se, n, se)
                    } else {
                        if (e.isFunction(Te.keypress)) {
                            return Te.keypress.call(se, n, se)
                        }
                    }
                }, onCommandChange: function (n) {
                    if (e.isFunction(Te.onCommandChange)) {
                        try {
                            Te.onCommandChange.call(se, n, se)
                        } catch (t) {
                            y(t, "onCommandChange");
                            throw t
                        }
                    }
                    _()
                }, commands: z
            });
            if (Ee && se.is(":visible") && !w) {
                se.focus(n, true)
            } else {
                se.disable()
            }
            se.oneTime(100, function () {
                function n(n) {
                    var t = e(n.target);
                    if (!t.closest(".terminal").length && se.enabled() && Te.onBlur.call(se, se) !== false) {
                        se.disable()
                    }
                }
                e(document).bind("click.terminal_" + se.id(), n).bind("contextmenu.terminal_" + se.id(), n)
            });
            var i = e(window);
            if (!w) {
                i.on("focus.terminal_" + se.id(), De).on("blur.terminal_" + se.id(), Be)
            } else {} if (w) {
                se.click(function () {
                    if (!se.enabled() && !Se) {
                        se.focus();
                        ze.enable()
                    } else {
                        se.focus(false)
                    }
                })
            } else {
                (function () {
                    var n = 0;
                    var t = false;
                    var r;
                    se.mousedown(function (i) {
                        var o = e(i.target).parents();
                        if (o.addBack) {
                            r = o.addBack()
                        } else {
                            r = o.andSelf()
                        }
                        se.oneTime(1, function () {
                            e(window).on("mousemove.terminal_" + se.id(), function () {
                                t = true;
                                n = 0;
                                e(window).off("mousemove.terminal_" + se.id())
                            })
                        })
                    }).mouseup(function () {
                        var i = t;
                        t = false;
                        e(window).off("mousemove.terminal_" + se.id());
                        if (!i) {
                            if (++n === 1) {
                                if (!se.enabled() && !Se) {
                                    se.focus();
                                    ze.enable()
                                }
                                var o = "click_" + se.id();
                                se.oneTime(Te.clickTimeout, o, function () {
                                    if (!r.is(".terminal-output") && !r.is(".cmd") && r.is(".terminal > div")) {
                                        ze.position(ze.get().length)
                                    }
                                    n = 0
                                })
                            } else {
                                se.stopTime("click_" + se.id());
                                n = 0
                            }
                        }
                    }).dblclick(function () {
                        n = 0;
                        se.stopTime("click_" + se.id())
                    })
                })()
            }
            se.delegate(".exception a", "click", function (n) {
                var t = e(this).attr("href");
                if (t.match(/:[0-9]+$/)) {
                    n.preventDefault();
                    l(t)
                }
            });
            se.mousedown(function (e) {
                if (e.which === 2) {
                    var n = q();
                    se.insert(n)
                }
            });
            if (se.is(":visible")) {
                he = se.cols();
                ze.resize(he);
                de = U(se)
            }
            if (Te.login) {
                se.login(Te.login, true, M)
            } else {
                M()
            }

            function o() {
                if (se.is(":visible")) {
                    var e = se.width();
                    var n = se.height();
                    if (ke !== n || be !== e) {
                        se.resize()
                    }
                    ke = n;
                    be = e
                }
            }
            se.oneTime(100, function () {
                function e() {
                    Oe[0].contentWindow.onresize = o
                }
                if (Oe.is(":visible")) {
                    e()
                } else {
                    Oe.on("load", e)
                }
            });

            function a(n) {
                var t = Z.get()[n[0]];
                if (t && me === t.id()) {
                    if (n[2]) {
                        try {
                            if (Ae) {
                                var r = e.Deferred();
                                $.push(function () {
                                    return t.exec(n[2]).then(function () {
                                        t.save_state(n[2], true, n[1]);
                                        r.resolve()
                                    })
                                });
                                return r.promise()
                            } else {
                                return t.exec(n[2]).then(function () {
                                    t.save_state(n[2], true, n[1])
                                })
                            }
                        } catch (i) {
                            var o = t.settings();
                            if (e.isFunction(o.exceptionHandler)) {
                                o.exceptionHandler.call(se, i, "EXEC HASH")
                            } else {
                                var a = e.terminal.escape_brackets(ge);
                                var s = "Error while exec with command " + a;
                                t.error(s).exception(i)
                            }
                        }
                    }
                }
            }
            if (Te.execHash) {
                if (location.hash) {
                    setTimeout(function () {
                        try {
                            var n = location.hash.replace(/^#/, "");
                            ne = e.parseJSON(decodeURIComponent(n));
                            var t = 0;
                            (function i() {
                                var e = ne[t++];
                                if (e) {
                                    a(e).then(i)
                                } else {
                                    te = true
                                }
                            })()
                        } catch (r) {}
                    })
                } else {
                    te = true
                }
            } else {
                te = true
            } if (e.event.special.mousewheel) {
                var s = false;
                e(document).bind("keydown.terminal_" + se.id(), function (e) {
                    if (e.shiftKey) {
                        s = true
                    }
                }).bind("keyup.terminal_" + se.id(), function (e) {
                    if (e.shiftKey || e.which === 16) {
                        s = false
                    }
                });
                se.mousewheel(function (n, t) {
                    if (!s) {
                        var r = $e.top();
                        var i;
                        if (e.isFunction(r.mousewheel)) {
                            i = r.mousewheel(n, t, se);
                            if (i === false) {
                                return
                            }
                        } else {
                            if (e.isFunction(Te.mousewheel)) {
                                i = Te.mousewheel(n, t, se);
                                if (i === false) {
                                    return
                                }
                            }
                        } if (t > 0) {
                            se.scroll(-40)
                        } else {
                            se.scroll(40)
                        }
                    }
                })
            }
            ye.resolve()
        });
        se.data("terminal", se);
        return se
    }
})(jQuery);