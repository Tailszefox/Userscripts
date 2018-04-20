// ==UserScript==
// @name        Vocaroo HTML5
// @author      Tailszefox
// @namespace   localhost
// @description Adds an HTML5 player to Vocaroo
// @icon        https://vocaroo.com/title.gif
// @include     https://vocaroo.com/i/*
// @version     1.0
// @grant       none
// ==/UserScript==

var audio = document.createElement("audio");
audio.setAttribute("controls", "controls");

audioLinks = ["idDownloadAsMp3Link", "idDownloadAsOggLink", "idDownloadAsFlacLink", "idDownloadAsWavLink"]
for (var i = 0; i < audioLinks.length; i++)
{
  var l = document.querySelector("#" + audioLinks[i]);
  var audioUrl = l.attributes["href"].value;
  
  var sourceAudio = document.createElement("source");
  sourceAudio.setAttribute("src", audioUrl);
  audio.appendChild(sourceAudio);
}

document.querySelector("#idPlayerBox").appendChild(audio);
