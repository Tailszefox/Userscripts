// ==UserScript==
// @name             Fnac - En stock en magasin
// @author           Tailszefox
// @match            https://www.fnac.com/*
// @version          1.0
// ==/UserScript==

function filterProducts() {
    let dispos = document.querySelectorAll("li.Shop-item");

    dispos.forEach((d) => {
        let dispoText = d.querySelector("div.Dispo-txt");

        if (dispoText?.innerText.indexOf("En stock en magasin") === 0) {
            return;
        }

        d.closest("article").parentElement.remove();
    });
}

let b = document.createElement("button");
b.appendChild(document.createTextNode("Filtrer produits disponibles en boutique"));
b.addEventListener("click", filterProducts);

let hItems = document.querySelector("div[data-automation-id=header-line-2] div.f-header__items");
hItems.prepend(b);