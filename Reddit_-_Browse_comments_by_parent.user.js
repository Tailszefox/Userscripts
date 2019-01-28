// ==UserScript==
// @name        Reddit - Browse comments by parent
// @author      Tailszefox
// @namespace   localhost
// @description Browse comments by parent (root) comments
// @icon        https://i.imgur.com/kKgg42d.png
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
    if($(".res-floater-visibleAfterScroll ul li").length == 0)
    {
        return;
    }

    window.clearInterval(interval);

    var previous = document.createElement("a");
    previous.style.cursor = "pointer";
    previous.style.font = '24px/1 "Batch"';
    previous.style.color = "#888";
    previous.appendChild(document.createTextNode("\u2190"));

    var next = document.createElement("a");
    next.style.cursor = "pointer";
    next.style.font = '24px/1 "Batch"';
    next.style.color = "#888";
    next.appendChild(document.createTextNode("\u2192"));

    $(previous).click(function() { goTo(false) } );
    $(next).click(function() { goTo(true) } );

    var nreFloatLi = document.createElement("li");
    nreFloatLi.appendChild(document.createElement("br"));
    nreFloatLi.appendChild(previous);
    nreFloatLi.appendChild(document.createElement("br"));
    nreFloatLi.appendChild(next);

    var nreFloat = $(".res-floater-visibleAfterScroll ul")[0];
    nreFloat.appendChild(nreFloatLi);
}, 10000);
