// ==UserScript==
// @name        Steam - Sale Discovery Queue
// @author      Tailszefox
// @namespace   localhost
// @description Automatically go through discovery queue
// @include     https://store.steampowered.com/?l=english
// @include     https://store.steampowered.com/
// @include     https://store.steampowered.com/*autoqueue=true*
// @include     https://store.steampowered.com/app/*
// @version     1.0
// @grant       none
// ==/UserScript==

console.log("Autoqueue OK");
var timeoutId;

function changeDiscoveryLink()
{ 
  if(document.querySelector("#discovery_queue_start_link").href.indexOf("snr="))
  {
    document.querySelector("#discovery_queue_start_link").href = document.querySelector("#discovery_queue_start_link").href + "&autoqueue=true";
    clearInterval(timeoutId);
  }
}

function clickNext()
{
  document.querySelector("#next_in_queue_form").action = document.querySelector("#next_in_queue_form").action + "?autoqueue=true";
  document.querySelector('.btn_next_in_queue_trigger').click();
}

function changeNextLink()
{
  document.querySelector("#next_in_queue_form").action = document.querySelector("#next_in_queue_form").action + "?autoqueue=true";
}

function submitAgeForm()
{
  document.querySelector("select[name='ageYear']").value = "1989";
  document.querySelector("#agecheck_form").action = document.querySelector("#agecheck_form").action + "?autoqueue=true";
  DoAgeGateSubmit();
}

if(document.location.href == "https://store.steampowered.com/?l=english" || document.location.href == "https://store.steampowered.com/")
{
  timeoutId = setInterval(changeDiscoveryLink, 1000);
}
else if(document.location.href.indexOf("/agecheck/") != -1)
{
  timeoutId = setTimeout(submitAgeForm, 1000);
}
else if(document.location.href.indexOf("/app/") != -1)
{
  if(document.location.href.indexOf("autoqueue=true") != -1)
    timeoutId = setTimeout(clickNext, 2500);
  else
    timeoutId = setTimeout(changeNextLink, 2500);
}
