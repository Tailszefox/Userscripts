// ==UserScript==
// @name        MB - Alternate track similarity calculation
// @author      Tailszefox
// @namespace   http://tailszefox.net/
// @description Allows to keep recordings when using the track parser.
// @icon        https://i.imgur.com/kdfat4E.png
// @include     http*://*.mbsandbox.org/release/*/edit*
// @include     http*://*.mbsandbox.org/release/add*
// @include     http*://*musicbrainz.org/release/*/edit*
// @include     http*://*musicbrainz.org/release/add*
// @exclude     *//*/*mbsandbox.org/*
// @exclude     *//*/*musicbrainz.org/*
// @version     1
// @grant       none
// ==/UserScript==

window.addEventListener("load", function(){
    // Yes, there are more than one track-parser-options, even though it's an ID
    var allParserOptions =  document.querySelectorAll("#track-parser-options");

    // So we'll add our thing to all of them
    for (var i = allParserOptions.length - 1; i >= 0; i--)
    {
        var parserOptions = allParserOptions[i].querySelectorAll("tr td")[6];

        var checkAlternate = document.createElement("input");
        checkAlternate.type = "checkbox";
        checkAlternate.name = "alternate-similarity";

        var labelAlternate = document.createElement("label");
        labelAlternate.appendChild(checkAlternate);
        labelAlternate.appendChild(document.createTextNode(" Use alternative matching function"));

        parserOptions.appendChild(labelAlternate);

        checkAlternate.addEventListener("change", function(e){
            if(e.target.checked)
            {
                // Make a copy of the original function
                MB.releaseEditor.trackParser.matchDataWithTrackOriginal = MB.releaseEditor.trackParser.matchDataWithTrack;

                // Put our alternate function in its place
                MB.releaseEditor.trackParser.matchDataWithTrack = function (data, track) {
                    if(!track)
                        return;

                    if(MB.releaseEditor.utils.similarLengths(data.length, track.length()) && data.position == parseInt(track.position()))
                    {
                        return {
                            similarity: 1,
                            track: track,
                            data: data
                        };
                    }
                };
            }
            else
            {
                // Restore the original function
                MB.releaseEditor.trackParser.matchDataWithTrack = MB.releaseEditor.trackParser.matchDataWithTrackOriginal;
            }
        });

    };
});
