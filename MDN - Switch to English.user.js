// ==UserScript==
// @name        MDN - Switch to English
// @author      Tailszefox
// @description Switch to English when on a French page on MDN
// @match       https://developer.mozilla.org/fr/*
// @version     1.0
// ==/UserScript==

window.location = window.location.toString().replace("mozilla.org/fr/", "mozilla.org/en/");