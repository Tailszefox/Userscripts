// ==UserScript==
// @name        Steam Gifts - Queue
// @namespace   localhost
// @include     http://www.steamgifts.com/
// @include     http://www.steamgifts.com/giveaways/search?type=*
// @include     http://www.steamgifts.com/giveaway/*
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

function getQueue()
{
    var queueJson = GM_getValue("queue");

    if(queueJson != undefined)
        return JSON.parse(queueJson);

    return [];
}

function setQueue(queue)
{
    var queueJson = JSON.stringify(queue);
    GM_setValue("queue", queueJson);
}

window.addEventListener("load", function(){
    var href = window.location.href;

    // Main page
    if(href.indexOf("/giveaway/") == -1)
    {
        var queue = [];
        var giveaways = document.querySelectorAll("div.giveaway__row-inner-wrap");

        for(var g of giveaways)
        {
            // Already participating
            if(g.className.indexOf("is-faded") > -1)
                continue;

            // Level too high
            if(g.querySelector(".giveaway__column--contributor-level--negative") != null)
                continue;

            var gUrl = g.querySelector("a.giveaway__heading__name").href;
            queue.push(gUrl);
        }

        setQueue(queue);

        var launchQueueButton = document.createElement("a");

        launchQueueButton.className = "featured__action-button";
        launchQueueButton.id = "launchQueueButton";
        launchQueueButton.style.marginBottom = "15px";

        document.querySelector(".sidebar__search-container").parentNode.insertBefore(launchQueueButton, document.querySelector(".sidebar__search-container"));

        if(queue.length > 0)
        {
            launchQueueButton.appendChild(document.createTextNode("Launch queue"));

            launchQueueButton.addEventListener("click", function(){
                window.location.assign(queue[0]);
            }, false);
        }
        else
            launchQueueButton.appendChild(document.createTextNode("Queue empty"));
    }
    // Giveaway page
    else
    {
        var queue = getQueue();
        var currentGiveaway = window.location.href;
        var currentGiveawayPosition = queue.indexOf(currentGiveaway);

        if(queue.length > 0 && currentGiveawayPosition > -1)
        {
            var enterQueueButton = document.createElement("a");
            enterQueueButton.className = "sidebar__entry-insert";
            enterQueueButton.id = "enterQueueButton";
            enterQueueButton.style.marginBottom = "10px";

            if(queue.length > 1)
                enterQueueButton.appendChild(document.createTextNode("Enter and go to next giveaway"));
            else
                enterQueueButton.appendChild(document.createTextNode("Enter and leave queue"));

            var skipQueueButton = document.createElement("a");
            skipQueueButton.className = "sidebar__error";
            skipQueueButton.id = "skipQueueButton";
            skipQueueButton.style.marginBottom = "10px";

            if(queue.length > 1)
                skipQueueButton.appendChild(document.createTextNode("Skip to next giveaway"));
            else
                skipQueueButton.appendChild(document.createTextNode("Leave queue"));

            if(document.querySelector(".sidebar__entry-insert") != null)
                document.querySelector(".sidebar__search-container").parentNode.insertBefore(enterQueueButton, document.querySelector(".sidebar__search-container"));
            
            document.querySelector(".sidebar__search-container").parentNode.insertBefore(skipQueueButton, document.querySelector(".sidebar__search-container"));

            var enterGiveaway = function()
            {
                document.querySelector(".sidebar__entry-insert").click();

                var timeout = window.setTimeout(goToNext, 10000);
                var interval = window.setInterval(function(){
                    if(document.querySelector(".sidebar__entry-delete.is-hidden") == null)
                    {
                        window.clearInterval(interval);
                        window.clearTimeout(timeout);
                        goToNext();
                    }
                }, 100);
            }

            var goToNext = function()
            {
                queue.splice(currentGiveawayPosition, 1);
                setQueue(queue);

                if(queue.length > 0)
                    window.location.assign(queue[0]);
                else
                    window.location.assign("http://www.steamgifts.com/giveaways/search?type=wishlist");
            }

            enterQueueButton.addEventListener("click", enterGiveaway, false);
            skipQueueButton.addEventListener("click", goToNext, false);
        }
    }
});