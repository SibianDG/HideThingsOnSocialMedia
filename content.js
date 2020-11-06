
// todo: search stackoverflow -> addLisntener?
function setTitle(){
    document.title = 'facebook';
}

class website {
    constructor(name, viaClass = true) {
        this._name = name;
        this._viaClass = viaClass;
        this._allClasses = [];
        this._needToBeHidden = [];
        this._needsToBeVisable = [];
    }

    checkAriaLabel(el, string){
        return el.getAttribute('aria-label').includes(string);
    }

    addToList(what, string) {
        if (this._viaClass){
            let all = [...document.getElementsByClassName(string)];
            if (this._name === "facebook"){
                all.forEach(classToAdd => {
                    if (what === "rightColumn"){
                        classToAdd = classToAdd.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
                        this._allClasses.push({what : what, cta: classToAdd});
                    } else if (what === "navigation") {
                        if (this.checkAriaLabel(classToAdd, "Pages") || this.checkAriaLabel(classToAdd, "Watch") || this.checkAriaLabel(classToAdd, "Marketplace") || this.checkAriaLabel(classToAdd, "Messenger")) {
                            classToAdd = classToAdd.parentElement.parentElement.parentElement;
                            this._allClasses.push({what : what, cta: classToAdd});
                        }
                    } else if (what === "newsFeed") {
                        classToAdd = classToAdd.parentElement.parentElement.parentElement.parentElement;
                        this._allClasses.push({what : what, cta: classToAdd});
                    } else if (what === "rooms") {
                        classToAdd = classToAdd.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
                        this._allClasses.push({what: "newsFeed", cta: classToAdd});
                    } else if (what === "overviewLeft"){
                        this._allClasses.push({what : what, cta: classToAdd});
                    }
                });
            } else if (this._name === "messenger"){
                all.forEach(c => {
                    this._allClasses.push({what : what, cta: c})
                });
            } else {
                this._allClasses.push({what : what, cta: all[0]});
            }
        } else {
            const classToAdd = document.getElementById(string)
            this._allClasses.push({what: what, cta: classToAdd})
        }
    }

    changeAndCheckClasses(items){
        this._allClasses.forEach(el => {
            if (items[this._name].removeTrue.includes(el.what)){
                this._needToBeHidden.push(el.cta);
            } else {
                this._needsToBeVisable.push(el.cta);
            }
        })
        this.changeClass([...this._needToBeHidden], true);
        this.changeClass([...this._needsToBeVisable], false);
    }

    async getFromStorage() {
        chrome.storage.sync.get(items => {
            if (!items[this._name]){
                this._needsToBeVisable = [...this._allClasses];
            } else {
                this.changeAndCheckClasses(items);
            }
        });
    }

    addStorageListener() {
        chrome.storage.onChanged.addListener(() => {
            try {
                // FIXME: 1e keer site bezoeken werkt soms niet?
                console.log("storage chanced")
                chrome.storage.sync.get(items => {
                    this._needsToBeVisable = [];
                    this._needToBeHidden = [];
                    this.changeAndCheckClasses(items);
                });
            } catch (e) {
                //ignore
            }
        });
    }

    changeClass(list, remove) {
        if (list && list.length > 0){
            list.forEach(el => {
                console.log(el)
                try {
                    if (remove){
                        el.setAttribute( 'style', 'display: none!important;')
                    } else {
                        el.style.removeProperty('display');
                    }
                } catch (e) {
                    //ignore
                }
            });
        }
    }

    async getStarted() {
        await this.getFromStorage()
            .then(() => {this.addStorageListener()});
        //Todo? when scroll + 100 -> opnieuw classes? -> Messenger
    }
}

function init(){
    var port = chrome.runtime.connect({name: "AskURL"});
    port.postMessage({asking: true});
    port.onMessage.addListener(function(msg) {
        let theWebsite;
        if (msg.url.includes("facebook.com")){
            theWebsite = new website("facebook", true)
            theWebsite.addToList("navigation","oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 j83agx80 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl l9j0dhe7 abiwlrkh p8dawk7l bp9cbjyn cbu4d94t pi1r6xr4 taijpn5t k4urcfbm");
            theWebsite.addToList("navigation","oajrlxb2 tdjehn4e qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 j83agx80 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl l9j0dhe7 abiwlrkh p8dawk7l bp9cbjyn s45kfl79 emlxlaya bkmhp75w spb7xbtv rt8b4zig n8ej3o3l agehan2d sk4xxmp2 taijpn5t qypqp5cg q676j6op");
            theWebsite.addToList("newsFeed","pedkr2u6 tn0ko95a pnx7fd3z");
            theWebsite.addToList("rooms","gs1a9yip kb5gq1qc pfnyh3mw hpfvmrgz qdtcsgvi oi9244e8 t7l9tvuc");
            theWebsite.addToList("rightColumn","d2edcug0 hpfvmrgz qv66sw1b c1et5uql rrkovp55 a5q79mjw g1cxx5fr lrazzd5p m9osqain");
            theWebsite.addToList("overviewLeft","rq0escxv lpgh02oy du4w35lb pad24vr5 rirtxc74 dp1hu0rb fer614ym bx45vsiw o387gat7 qbu88020 ni8dbmo4 stjgntxs czl6b2yu");
        } else if (msg.url.includes("youtube.com")){
            theWebsite = new website("youtube", false)
            theWebsite.addToList("recomandationsHome", "contents");
            theWebsite.addToList("recomandationsVid", "items");
            theWebsite.addToList("recomandationsVid", "secondary");
            theWebsite.addToList("comments", "comments");
        } else if (msg.url.includes("instagram.com")){
            theWebsite = new website("instagram", true)
            theWebsite.addToList("stories", "zGtbP IPQK5 VideM");
            theWebsite.addToList("rightColumn", "COOzN MnWb5 YT6rB");
            theWebsite.addToList("accountActivity", "_0ZPOP kIKUG");
            theWebsite.addToList("main", "SCxLW  o64aR");
        } else if (msg.url.includes("messenger.com")){
            theWebsite = new website("messenger", true)
            theWebsite.addToList("profilePictures", "_1qt3 _6-5k _5l-3");
            theWebsite.addToList("profilePictures", "_5bli _2_a2 img");
            theWebsite.addToList("profilePictures", "_87u_ img");
        } else if (msg.url.includes("strava.com")){
            theWebsite = new website("strava", false)
            theWebsite.addToList("columnLeft", "dashboard-athlete-sidebar");
            theWebsite.addToList("newsFeed", "dashboard-feed");
            theWebsite.addToList("columnRight", "dashboard-sidebar");
            theWebsite.addToList("notifications", "notifications");
        }
        if (theWebsite){
            theWebsite.getStarted();
        }
    });
}

init();