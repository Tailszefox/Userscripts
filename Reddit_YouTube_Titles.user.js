// ==UserScript==
// @name        Reddit YouTube Titles
// @namespace   localhost
// @description Display the title of YouTube videos
// @include     https://www.reddit.com/r/*/comments/*
// @version     1
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// ==/UserScript==

function onLoad() {
    var links = document.querySelectorAll(".commentarea")[0].querySelectorAll("a[href*='youtube.com'],a[href*='youtu.be']");

    var i = 0;
    for(i = 0; i < links.length; i++)
    {
        l = links[i];
        var url = l.href;
        var p = parse(url);

        if(p)
        {
            request(l, p.vid);
        }
    }
}

function parse(url)
{ 
    return /^https?:\/\/((www\.|m\.)?youtu(\.be|be\.(googleapis\.)?com).+v[=\/]|#p\/[a-z]\/.+\/|youtu\.be\/)([a-z0-9_-]{8,})(.*[#&\?]t=([0-9hms]+))?/i.exec(url) ? {vid:RegExp.$5, t:RegExp.$7} : null;
}

function request(l, vid)
{
    net.json('https://www.googleapis.com/youtube/v3/videos?id=' + vid + '&part=snippet&fields=items(snippet/title)&' + window.atob('a2V5PUFJemFTeURXeE9yNExpNEE2SHRZeDlrN2JWYkNRNjh2cHdKSnVvYw=='), function(code, obj, txt) {
        var item = obj.items[0];
        var title = item.snippet.title;
        decorate(l, title);
    });
}

function decorate(link, title)
{
    link.innerHTML += " <span style=\"font-size: smaller;\">("+title+")</span>";
}

var net = {
    info: function(li, f) {
        var id = li.sid + li.vid;
        if(typeof net.pending[id] != 'object') {
            net.pending[id] = [f];
            sites[li.sid].request(li.vid, function(vi) {
                if(vi) {
                    cache.set(li.sid, li.vid, vi);
                    for(var i = net.pending[id].length; i--;) {
                        window.setTimeout(net.pending[id][i], 0, vi);
                    }
                }
                delete net.pending[id];
                });
        } else {
            net.pending[id].push(f);
        }
    },
    pending: {},
    json: function(url, f) {
        GM_xmlhttpRequest({
            method: 'GET',
            url:    url,
            onload: function(req) {
                var obj;
                try {
                    obj = JSON.parse(req.responseText);
                } catch(ex) {
                    log('JSON data from ' + url + ' could not be parsed: ' + ex + '\nHTTP: ' + req.status + '\nResponse: ' + req.responseText);
                }
                window.setTimeout(f, 0, req.status, obj, req.responseText);
            },
            onerror: function(req) {
                log('Request to ' + url + ' failed.');
                window.setTimeout(f, 0, req.status, null, req.responseText);
            }
        });
    },
    text: function(url, re, f) {
        GM_xmlhttpRequest({
            method: 'GET',
            url:    url,
            onload: function(req) {
                var m = [], txt = req.responseText;
                for(var i = 0, len = re.length; i < len; i++) {
                    m.push(re[i].exec(txt));
                }
                window.setTimeout(f, 0, req.status, m);
            },
            onerror: function(req) {
                log('Request to ' + url + ' failed.');
                window.setTimeout(f, 0, req.status, []);
            }
        });
    }
};

window.setTimeout(onLoad, 100);