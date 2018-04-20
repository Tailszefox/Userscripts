// ==UserScript==
// @name        Steam - Wishlist value
// @author      Tailszefox
// @namespace   localhost
// @description How much would it cost to buy all the games in your wishlist?
// @icon        https://i.imgur.com/GybYj5c.png
// @include     http://store.steampowered.com/wishlist/profiles/76561197967038647
// @include     http://store.steampowered.com/wishlist/profiles/76561197967038647/
// @include     http://store.steampowered.com/wishlist/profiles/76561197967038647/*
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

    var games = document.querySelectorAll(".wishlist_row");
    var totalFull = 0;
    var totalDiscount = 0;

    for (var gameId in g_Wishlist.rgElements)
    {
        var game = g_Wishlist.rgElements[gameId][0];
      
        // Game is on sale
        if ( game.querySelector(".discount_original_price") )
        {
            totalFull += extractPrice(game.querySelector(".discount_original_price"));
            totalDiscount += extractPrice(game.querySelector(".discount_final_price"));
        }
        // Game is not on sale
        else if ( game.querySelector(".discount_final_price") )
        {
            p = extractPrice(game.querySelector(".discount_final_price"));
            totalFull += p;
            totalDiscount += p;
        }
    }

    this.childNodes[0].nodeValue = "Wishlist value: "+ totalDiscount.toFixed(2) +"€ (prices on sale) / "+ totalFull.toFixed(2) +"€ (regular prices)";
}

var spanBtn = document.createElement("span");
spanBtn.appendChild(document.createTextNode("Calculate wishlist value"));

var divBtn = document.createElement("div");
divBtn.style.marginBottom = "5px";
divBtn.className = "btnv6_blue_hoverfade btn_small";
divBtn.appendChild(spanBtn);

var wishlistDiv = document.querySelector("#wishlist_ctn");
wishlistDiv.parentNode.insertBefore(divBtn, wishlistDiv);

spanBtn.addEventListener("click", calculateWishlistValue, false);
