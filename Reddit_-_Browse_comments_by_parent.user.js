// ==UserScript==
// @name        Reddit - Browse comments by parent
// @namespace   localhost
// @description Browse comments by parent (root) comments
// @include     https://*.reddit.com/r/*/comments/*
// @version     1
// @grant       none
// ==/UserScript==

function getPosition(element)
{
    return element.getBoundingClientRect().top + window.scrollY;
}

function goTo(next)
{
    var children = $("div[id^='siteTable_t3']").children();

    // If there's only two children, we're in a comment thread
    if(children.length == 2)
        var children = $("div[id^='siteTable_t1_']").eq(0).children();

    var current = $("html").scrollTop();

    if(next)
    {
        for(var i = 0; i < children.length; i += 2)
        {
            var top = getPosition(children[i]);

            if(top > current + 10)
            {
                $("html").scrollTop(top);
                return;
            }
        }
    }
    else
    {
        for(var i = 0; i < children.length; i += 2)
        {
            var top = getPosition(children[i]);

            if(top > current - 10)
            {
                if(i < 2)
                    return;

                var previousTop = getPosition(children[i - 2]);
                $("html").scrollTop(previousTop);
                return;
            }
        }
    }
}

var interval = window.setInterval(function() {
    if($("#NREFloat ul li").length == 0)
    {
        return;
    }

    window.clearInterval(interval);

    var previous = document.createElement("a");
    previous.style.cursor = "pointer";
    previous.style.fontSize = "20px";
    previous.appendChild(document.createTextNode("\u2190"));

    var next = document.createElement("a");
    next.style.cursor = "pointer";
    next.style.fontSize = "20px";
    next.appendChild(document.createTextNode("\u2192"));

    $(next).click(function() { goTo(true) } );

    var nrefloat = $("#NREFloat ul li")[0]
    nrefloat.appendChild(document.createElement("br"));
    nrefloat.appendChild(previous);
    nrefloat.appendChild(document.createElement("br"));
    nrefloat.appendChild(next);

    $(previous).click(function() { goTo(false) } );
}, 10000);