// ==UserScript==
// @name        Steam - Wishlist value
// @author      Tailszefox
// @namespace   localhost
// @description How much would it cost to buy all the games in your wishlist?
// @icon        https://i.imgur.com/GybYj5c.png
// @include     https://steamcommunity.com/id/tailszefox/wishlist
// @include     https://steamcommunity.com/id/tailszefox/wishlist/
// @include     https://steamcommunity.com/id/tailszefox/wishlist/*
// @version     1
// @grant       none
// ==/UserScript==

function extractPrice(nodeToExtract)
{
    var value = nodeToExtract.textContent.trim().replace(",", ".");

    if ( value.length == 0 )
        return 0;

    return parseFloat(value);
}

function calculateWishlistValue()
{
    this.childNodes[0].nodeValue = "Calculating...";

    var games = document.querySelectorAll(".wishlistRow");
    var totalFull = 0;
    var totalDiscount = 0;

    games.forEach(function(game) {
        // Game is not on sale
        if ( game.querySelector(".price") )
        {
            p = extractPrice(game.querySelector(".price"));
            totalFull += p;
            totalDiscount += p;
        }

        // Game is on sale
        else if ( game.querySelector(".discount_prices") )
        {
            totalFull += extractPrice(game.querySelector(".discount_original_price"));
            totalDiscount += extractPrice(game.querySelector(".discount_final_price"));
        }
    });

    this.childNodes[0].nodeValue = "Wishlist value: "+ totalDiscount.toFixed(2) +"€ (prices on sale) / "+ totalFull.toFixed(2) +"€ (regular prices)";
}

var spanBtn = document.createElement("span");
spanBtn.appendChild(document.createTextNode("Calculate wishlist value"));

var divBtn = document.createElement("div");
divBtn.style.marginBottom = "5px";
divBtn.className = "btnv6_blue_hoverfade btn_small";
divBtn.appendChild(spanBtn);

var wishlistItems = document.querySelector("#wishlist_items");
wishlistItems.parentNode.insertBefore(divBtn, wishlistItems);

spanBtn.addEventListener("click", calculateWishlistValue, false);
