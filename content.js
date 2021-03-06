let urlNow;
// todo: search stackoverflow -> addLisntener?
function setTitle(){
    document.title = 'facebook';
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
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
        if (el.getAttribute('aria-label'))
            return el.getAttribute('aria-label').includes(string);
        return true;
    }

    addToList(what, string) {
        if (this._viaClass){
            let all = [...document.getElementsByClassName(string)];
            if (this._name === "facebook"){
                all.forEach(classToAdd => {
                    console.log("what")
                    if (what === "rightColumn"){
                        if (string === "rq0escxv lpgh02oy du4w35lb pad24vr5 rirtxc74 dp1hu0rb fer614ym hlyrhctz o387gat7 qbu88020 ni8dbmo4 stjgntxs czl6b2yu"){
                            if (classToAdd.getAttribute("role").includes("complementary")){
                                this._allClasses.push({what : what, cta: classToAdd});
                            }
                        } else {
                            classToAdd = classToAdd.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
                            this._allClasses.push({what : what, cta: classToAdd});
                        }
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
                    } else if(what === "rightColumn2"){
                        console.log("rightColumn2")
                        if (classToAdd.getAttribute("data-pagelet") && classToAdd.getAttribute("data-pagelet").includes("RightRail"))
                            console.log("RightRail222222")
                            this._allClasses.push({what : "rightColumn", cta: classToAdd});
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
                if (el.cta){
                    if ((!urlNow.endsWith("youtube.com/") || !urlNow.endsWith("youtube.com")) && el.cta.id === "primary"){
                        this._needsToBeVisable.push(el.cta);
                    } else if(el.cta.id === "items" && document.getElementById("upnext")) {
                        this._needToBeHidden.push(el.cta);
                        this._needToBeHidden.push(document.getElementById("related"));
                        this._needToBeHidden.push(document.getElementById("secondary-inner"));
                        this._needToBeHidden.push(document.getElementById("secondary"));
                    } else {
                        this._needToBeHidden.push(el.cta);
                    }
                } else {
                    this._needsToBeVisable.push(el.cta);
                }
            } else {
                this._needsToBeVisable.push(el.cta);
            }
        })
        console.log(this._needsToBeVisable);
        console.log(this._needToBeHidden);
        this.changeClass([...this._needToBeHidden], true);
        this.changeClass([...this._needsToBeVisable], false);
    }

    async getFromStorage() {
        chrome.storage.sync.get(items => {
            if (!items[this._name]){
                sleep(1000).then(() => {
                    if (!items[this._name]){
                        this._needsToBeVisable = [...this._allClasses];
                    } else {
                        this.changeAndCheckClasses(items);
                    }
                });
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
            .then(() => {this.addStorageListener()})
    }
}

function init(){
    var port = chrome.runtime.connect({name: "AskURL"});
    port.postMessage({asking: true});
    port.onMessage.addListener(function(msg) {
        let theWebsite;
        urlNow = msg.url;
        if (urlNow.includes("facebook.com")){
            theWebsite = new website("facebook", true)
            theWebsite.addToList("navigation","oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 j83agx80 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl l9j0dhe7 abiwlrkh p8dawk7l bp9cbjyn cbu4d94t pi1r6xr4 taijpn5t k4urcfbm");
            theWebsite.addToList("navigation","oajrlxb2 tdjehn4e qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 j83agx80 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl l9j0dhe7 abiwlrkh p8dawk7l bp9cbjyn s45kfl79 emlxlaya bkmhp75w spb7xbtv rt8b4zig n8ej3o3l agehan2d sk4xxmp2 taijpn5t qypqp5cg q676j6op");
            theWebsite.addToList("navigation", "buofh1pr to382e16 o5zgeu5y jrc8bbd0 dawyy4b1 h676nmdw hw7htvoc");
            theWebsite.addToList("newsFeed","pedkr2u6 tn0ko95a pnx7fd3z");
            theWebsite.addToList("newsFeed", "rq0escxv l9j0dhe7 du4w35lb j83agx80 g5gj957u pmt1y7k9 buofh1pr hpfvmrgz taijpn5t gs1a9yip owycx6da btwxx1t3 f7vcsfb0 fjf4s8hc b6rwyo50 oyrvap6t")
            theWebsite.addToList("rooms","gs1a9yip kb5gq1qc pfnyh3mw hpfvmrgz qdtcsgvi oi9244e8 t7l9tvuc");
            theWebsite.addToList("rightColumn","d2edcug0 hpfvmrgz qv66sw1b c1et5uql rrkovp55 a5q79mjw g1cxx5fr lrazzd5p m9osqain");
            //theWebsite.addToList("rightColumn","rq0escxv lpgh02oy du4w35lb pad24vr5 rirtxc74 dp1hu0rb fer614ym hlyrhctz o387gat7 qbu88020 ni8dbmo4 stjgntxs czl6b2yu");
            //theWebsite.addToList("rightColumn", "rq0escxv lpgh02oy du4w35lb o387gat7 qbu88020 pad24vr5 rirtxc74 dp1hu0rb fer614ym ni8dbmo4 stjgntxs be9z9djy hlyrhctz");
            theWebsite.addToList("rightColumn2", "cxgpxx05");
            theWebsite.addToList("overviewLeft","rq0escxv lpgh02oy du4w35lb pad24vr5 rirtxc74 dp1hu0rb fer614ym bx45vsiw o387gat7 qbu88020 ni8dbmo4 stjgntxs czl6b2yu");
            theWebsite.addToList("overviewLeft","rq0escxv lpgh02oy du4w35lb pad24vr5 rirtxc74 dp1hu0rb fer614ym rek2kq2y bx45vsiw o387gat7 qbu88020 ni8dbmo4 stjgntxs czl6b2yu");
            theWebsite.addToList("overviewLeft","rq0escxv lpgh02oy du4w35lb o387gat7 qbu88020 pad24vr5 rirtxc74 dp1hu0rb fer614ym ni8dbmo4 stjgntxs rek2kq2y be9z9djy bx45vsiw")
        } else if (urlNow.includes("youtube.com")){
            //todo: YT don't refresh whole page when you click item...
            theWebsite = new website("youtube", false)
            theWebsite.addToList("recommendationsHome", "contents");
            theWebsite.addToList("recommendationsHome", "primary");
            theWebsite.addToList("recommendationsVideo", "items");
            theWebsite.addToList("recommendationsVideo", "secondary");
            theWebsite.addToList("comments", "comments");
        } else if (urlNow.includes("instagram.com")){
            theWebsite = new website("instagram", true)
            theWebsite.addToList("stories", "zGtbP IPQK5 VideM");
            theWebsite.addToList("rightColumn", "COOzN MnWb5 YT6rB");
            theWebsite.addToList("accountActivity", "_0ZPOP kIKUG");
            theWebsite.addToList("main", "SCxLW  o64aR");
        } else if (urlNow.includes("messenger.com")){
            theWebsite = new website("messenger", true)
            theWebsite.addToList("profilePictures", "_1qt3 _6-5k _5l-3");
            theWebsite.addToList("profilePictures", "_5bli _2_a2 img");
            theWebsite.addToList("profilePictures", "_87u_ img");
        } else if (urlNow.includes("strava.com")){
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
document.addEventListener('click', () => init());

init();