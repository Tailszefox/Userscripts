// ==UserScript==
// @name        Steam - Wishlist reordering
// @author      Tailszefox
// @namespace   localhost
// @description Reorders your wishlist using the choosen sort order
// @icon        https://i.imgur.com/nXcltPQ.png
// @include     https://steamcommunity.com/id/*/wishlist/?sort=*
// @version     1.0
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

// Create button with text and styling
function createButton(text)
{
    var btn = document.createElement("div");
    btn.className = "btnv6_blue_hoverfade btn_small";
    var btnSpan = document.createElement("span");
    btnSpan.appendChild(document.createTextNode(text));
    btn.appendChild(btnSpan);

    return btn;
}

// Get the order list from storage
function getOrderList()
{
    var orderListJson = GM_getValue("orderList");

    if(orderListJson != undefined)
        return JSON.parse(orderListJson);

    return [];
}

// Save the order list in storage
function setOrderList(orderList)
{
    var orderListJson = JSON.stringify(orderList);
    GM_setValue("orderList", orderListJson);
}

// First step of ordering the list: get the current order
function rankList_stepOne(inverted)
{
    var games = document.querySelectorAll(".wishlistRow");
    var orderList = [];

    // Get the game id for all games, in order
    for(var game of games)
    {
        orderList.push(game.id);
    }

    // Invert the list if requested
    if(inverted)
        orderList.reverse();

    setOrderList(orderList);

    // Navigate to the "sort by rank" page
    var h = window.location.href;
    newHref = h.substring(0, h.indexOf("?sort=")) + "?sort=rank";
    window.location.assign(newHref);
}

// On the "sort by rank" page
if(window.location.href.indexOf("sort=rank") != -1)
{
    // Get the order list
    var orderList = getOrderList();

    // Nothing to do if the list is empty
    if(orderList.length == 0)
        return;

    var currentRank = 1;

    // For each game, assign new rank
    for(var gameId of orderList)
    {
        var game = document.querySelector("#" + gameId);
        var rankInput = game.querySelector(".wishlist_rank");

        // Change the rank and trigger the change event
        rankInput.value = currentRank;
        rankInput.onchange();

        currentRank++;
    }

    // Clear the list once we're done
    setOrderList([]);
}
// On page with another sort order
else
{
    // Create the div holding the buttons
    var divSort = document.createElement("div");
    divSort.style.float = "right"
    divSort.appendChild(document.createTextNode("Rank list using "));

    // Create the buttons and add listeners for click
    var btnSort = createButton("the current order");
    btnSort.addEventListener("click", function(){ rankList_stepOne(false); }, false);
    var btnSortInverted = createButton("the current inverted order");
    btnSortInverted.addEventListener("click", function(){ rankList_stepOne(true); }, false);

    divSort.appendChild(btnSort);
    divSort.appendChild(document.createTextNode(" "));
    divSort.appendChild(btnSortInverted);

    // Add the div to the page
    document.querySelector("#save_action_disabled_1").appendChild(divSort);
}
