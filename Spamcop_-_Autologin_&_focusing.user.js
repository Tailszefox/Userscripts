// ==UserScript==
// @name        Spamcop - Autologin & focusing
// @author      Tailszefox
// @namespace   localhost
// @icon        https://i.imgur.com/UpGShRb.png
// @description Log into Spamcop and focus on submit form
// @include     https://www.spamcop.net/
// @version     1.0
// @grant       GM_getClipboard
// ==/UserScript==
 
// Are we logged out?
if ( document.querySelectorAll("input[name='password']").length > 0 )
{
  // Submit login form
  window.setTimeout(function () { document.querySelectorAll("#login form")[0].submit(); }, 3000);
}
else if ( document.querySelectorAll("textarea").length > 0 )
{
  // Focus on submit form
  document.querySelectorAll("textarea")[0].focus();
}