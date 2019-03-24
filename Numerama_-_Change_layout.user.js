// ==UserScript==
// @name        Numerama - Change layout
// @author      Tailszefox
// @namespace   localhost
// @description Change layout on front page of Numerama because the button to do it doesn't work
// @icon        https://i.imgur.com/V1mDH4l.png
// @match       https://www.numerama.com/
// @version     1.0
// @grant       none
// ==/UserScript==

window.setTimeout(function(){
  var sortButton = document.querySelector(".sort-list-format");

  var n = $(sortButton);
  var i = n.getAjaxContainer();
  var a = i.getConfigContainer(n, i);
  var t = i.showLoader();

  $.ajax(
    {
      type: 'GET',
      url: "https://www.numerama.com/ajax.php",
      data: a,
      dataType: 'JSON',
      success: function (a) {
        t.endLoading(),
        void 0 !== a.html && i.html(a.html),
        i.data('ajax-id') && (a.container = i.data('ajax-id')),
        NUM.ajaxContentTriggers(),
        i.animate({
          opacity: 1
        }, 200, function () {
          console.log("Done");
        })
      }
    }
  );
}, 5000);
