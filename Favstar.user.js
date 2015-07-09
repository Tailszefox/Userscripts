// ==UserScript==
// @name        Favstar Direct Link
// @namespace   localhost
// @description Adds a direct link to tweets
// @include     http://favstar.fm/users/*
// @version     1
// @grant       none
// ==/UserScript==

var tweets = document.getElementsByClassName("fs-date");

for (var i = tweets.length - 1; i >= 0; i--)
{
    var t = tweets[i];
    var link = t.href;
    var linkSplit = link.split("/");

    var username = linkSplit[4];
    var id = linkSplit[6];

    t.href = "https://twitter.com/"+ username +"/status/" + id;
};