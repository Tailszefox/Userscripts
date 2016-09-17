// ==UserScript==
// @name        OVH - Fix 2FA
// @namespace   localhost
// @description Swap the form's order so that Enter works correctly
// @include     https://www.ovh.com/manager/web/login/
// @include     https://www.ovh.com/auth/?*
// @version     1
// @grant       none
// ==/UserScript==

if(document.querySelector("button[name='otpMethod']") != null)
{
    var btn = document.querySelectorAll("button[type='submit']");

    var divBackup = btn[0].parentNode;
    var divMobile = btn[1].parentNode;

    var htmlTemp = divBackup.innerHTML;
    divBackup.innerHTML = divMobile.innerHTML;
    divMobile.innerHTML = htmlTemp;
}