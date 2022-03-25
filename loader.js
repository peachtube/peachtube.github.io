"use strict";

let server = "https://peachtube.github.io/"

function loadScript(url) {
    console.log('Loading ' + url)
    var script = document.createElement("script");  // create a script DOM node
    script.src = url + '?v=' + Date.now();  // set its src to the provided URL
    document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

window.addEventListener("flutterInAppWebViewPlatformReady", function(event) {
    console.log('Performing redirect...')
    if(location.href.includes('engine.html')) loadScript(server + 'engine.js');
    if(location.href.includes('example')) loadScript(server + 'extractors/example.js');
});
