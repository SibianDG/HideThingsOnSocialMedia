function init() {
    chrome.runtime.onConnect.addListener(function(port) {
        console.assert(port.name === "AskURL");
        port.onMessage.addListener(function(msg) {
            chrome.tabs.query({active: true, currentWindow: true}, function callback(tabs) {
                if (msg.asking === true)
                    //console.log("BG sent: ", tabs[0].url);
                    port.postMessage({url: tabs[0].url});
            });
        });
    });
}

init();
