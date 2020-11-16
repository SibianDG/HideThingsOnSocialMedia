//let cl = chrome.storage.sync.clear(() => { console.log("Cleared")});

function isEmpty(obj) {
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function clearPopup(){
    document.getElementById('content').innerHTML = "";
}

function notSupportedPopup(){
    document.getElementById('content').insertAdjacentHTML("beforeend", `<h3>This page is not supported.</h3>`);
}

class website{
    constructor(name) {
        this._name = name;
        this._inputs = {};
        this._removeTrue = [];
        this._removeFalse = [];
    }

    makeHTMLinPopup(listOfIds){
        document.getElementById('content').insertAdjacentHTML("beforeend", `<h3>Remove:</h3>`);
        listOfIds.forEach(id => {
            let string = id.replace( /([A-Z])/g, " $1" );
            string = string.charAt(0).toUpperCase() + string.slice(1);
            document.getElementById('content').insertAdjacentHTML("beforeend", `
                <div class="d-flex">
                    <p class="textForLabel">${string}</p>
                    <label class="form-switch">
                        <input type="checkbox" id="${id}">
                            <i></i>
                    </label>
                </div>`);
            this._inputs[id] = document.getElementById(id);
        });
        this.getStarted()
    }

    async checkInStorage() {

        name = this._name;
        await new Promise((resolve, reject) => {
            chrome.storage.sync.get(name, function (result) {
                if (chrome.runtime.lastError) {
                    reject(Error(chrome.runtime.lastError.message))
                } else {
                    resolve(result)
                }
            })
        })
            .then((result) => {
            let items = result[name];
            if (isEmpty(items) || (items.removeFalse.length === 0 && items.removeTrue.length === 0)) {
                for (let key in this._inputs) {
                    this._removeFalse.push(key);
                }
                let jsonObj = {[name]: {removeTrue: this._removeTrue, removeFalse: this._removeFalse}};
                chrome.storage.sync.set(jsonObj, function () {
                    console.log('Value is set!');
                })
            } else {
                for (let key in this._inputs) {
                    this._inputs[key].checked = items.removeTrue.includes(key);
                }
                this._removeTrue = items.removeTrue;
                this._removeFalse = items.removeFalse;
            }
        })
    }

    async inputOnChange() {
        let removeTrue = this._removeTrue;
        let removeFalse = this._removeFalse;
        let name = this._name;

        for (let key in this._inputs){
            let value = this._inputs[key];
            value.addEventListener('change', function() {
                const nowChecked = value.checked;
                if (nowChecked){
                    removeFalse.splice(removeFalse.indexOf(key), 1);
                    if (!removeTrue.includes(key)){
                        removeTrue.push(key);
                    }
                } else {
                    removeTrue.splice(removeTrue.indexOf(key), 1);
                    if (!removeFalse.includes(key)){
                        removeFalse.push(key);
                    }
                }
                let jsonObj = {[name]: {removeTrue: removeTrue, removeFalse: removeFalse}};
                chrome.storage.sync.remove(name);
                chrome.storage.sync.set(jsonObj, function () {
                    console.log("Value that just changed set")
                });
            });
        }
    }

    async getStarted() {
        await this.checkInStorage();
        await this.inputOnChange();
    }
}

function init() {
    var port = chrome.runtime.connect({name: "AskURL"});
    port.postMessage({asking: true});
    port.onMessage.addListener(function(msg) {
        clearPopup();
        let theWebsite;
        if (msg.url.includes("facebook.com")){
            theWebsite = new website("facebook");
            theWebsite.makeHTMLinPopup(['navigation', 'rightColumn', 'newsFeed', 'overviewLeft']);
        } else if (msg.url.includes("youtube.com")) {
            theWebsite = new website("youtube");
            theWebsite.makeHTMLinPopup(['recommendationsHome', 'recommendationsVideo', 'comments']);
        } else if (msg.url.includes("instagram.com")) {
            theWebsite = new website("instagram");
            theWebsite.makeHTMLinPopup(['stories', 'rightColumn', 'accountActivity', 'main']);
        } else if (msg.url.includes("messenger.com")) {
            theWebsite = new website("messenger");
            theWebsite.makeHTMLinPopup(['profilePictures']);
        } else if (msg.url.includes("strava.com")) {
            theWebsite = new website("strava");
            theWebsite.makeHTMLinPopup(['columnLeft', 'newsFeed', 'columnRight', 'notifications']);
        } else {
            notSupportedPopup();
        }
    });
}

init();
