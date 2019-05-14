// ==UserScript==
// @name        Steam - Set sale price for inventory
// @author      Tailszefox
// @namespace   localhost
// @description Automatically sets sale price for inventory items
// @icon        https://i.imgur.com/5jMQgzt.png
// @include     https://steamcommunity.com/id/tailszefox/inventory
// @include     https://steamcommunity.com/id/tailszefox/inventory/
// @include     https://steamcommunity.com/id/tailszefox/inventory/#*
// @version     1.0
// @grant       none
// ==/UserScript==

// Sets the buyer price to the desired value
function setBuyerPrice(price)
{

    document.querySelector("#market_sell_buyercurrency_input").value = price;
    SellItemDialog.OnBuyerPriceInputKeyUp();
}

// What to do when the Sell Item dialog appears
function process()
{
    // Get the current price
    var divPrice = jQuery(".item_market_action_button_contents:visible")[0].parentNode.parentNode.querySelectorAll("div")[2];
    var textPrice = jQuery(divPrice).text();
    var price = priceRegex.exec(textPrice)[1];

    // Set it in the seller price box
    setBuyerPrice(price);

    // Check the box about agreeing to stuff
    document.querySelector("#market_sell_dialog_accept_ssa").checked = true;

    // Get the last few prices the item was sold at
    var lastPrices = SellItemDialog.m_plotPriceHistory._plotData[0].slice(-3);
    var lastPricesText = "Last prices from most recent: ";

    // Remove the price list if we had already added it
    jQuery("#divPrices").remove();

    // Add a div to contain the price history
    var divPrices = document.createElement("div");
    divPrices.id = "divPrices";
    divPrices.style.float = "left";
    jQuery(".zoom_controls:visible").before(divPrices);
    divPrices.appendChild(document.createTextNode(lastPricesText));

    // Add links to change the price
    for (var i = lastPrices.length - 1; i >= 0; i--)
    {
        var p = lastPrices[i][1]

        var a = document.createElement("a");
        a.appendChild(document.createTextNode(p.toFixed(2)));
        a.addEventListener("click", function(e)
        {
            var price = e.target.text + "€";
            setBuyerPrice(price);
        }, false);
        divPrices.appendChild(a);
        divPrices.appendChild(document.createTextNode("€ "));
    };
}

var priceRegex = /(\d+,\d+€)/;

// Wait for the price history to be displayed before doing anything
var observer = new MutationObserver(function(m)
{
    for (var i = m.length - 1; i >= 0; i--)
    {
        var mutation = m[i]

        // If it's been set to be visible
        if(mutation.target.style.visible != "none")
        {
            process();
        }
    };
});

// Attach our observer to the price history element
var priceHistory = document.querySelector("#pricehistory");
observer.observe(priceHistory, { attributes: true });
