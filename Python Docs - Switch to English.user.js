// ==UserScript==
// @name        Python Docs - Switch to English
// @author      Tailszefox
// @description Switch to English when on a French page on Python Docs
// @match       https://docs.python.org/fr/*
// @version     1.0
// ==/UserScript==

let newHref = window.location.href.replace("docs.python.org/fr/", "docs.python.org/");
window.location.href = newHref;