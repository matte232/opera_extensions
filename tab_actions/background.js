var map = {}
Object.prototype.removeItem = function (key) {
    if (!this.hasOwnProperty(key))
        return
    if (isNaN(parseInt(key)) || !(this instanceof Array))
        delete this[key]
    else
        this.splice(key, 1)
};

chrome.tabs.onCreated.addListener(function(tab) {

    try {//lets cheat
        var newTab = {
            "parent":tab.openerTabId,
            "children": [],
            "window":tab.windowId,
            "alive":true
        };
        
        map[tab.id] = newTab;
        if(typeof(newTab.parent) !== "undefined") {
            map[newTab.parent].children.push(tab.id);
        }
    }catch(err) {}//and be silent..
});



chrome.tabs.onRemoved.addListener(
    function(tabId, removeInfo) {
        try {//lets cheat
            if(removeInfo.isWindowClosing) {
                return;
            }
            var cur = map[tabId];
            cur.alive = false;
            
            if(cur.children.length > 0) {
                var next = cur.children.pop();
                chrome.tabs.update(next,
                                   {'active':true});
            } else {
                //find parent, remove from parents children and remove self.
                //activate parents next
                
                activeParentNext(cur.parent, cur.id);
                map.removeItem(parent);
            }
        }
        catch(err) {}//and be silent..
    }
);


activeParentNext = function(parent, child) {
    if (map.hasOwnProperty(parent)){
        var cur = map[parent];
        if(cur.children.length > 0) {
            var next = cur.children.pop();
            chrome.tabs.update(next,
                               {'active':true});
        } else {
            if(cur.alive) {
                chrome.tabs.update(cur.id,
                               {'active':true});
            } else {
                activeParentNext(cur.parent, parent);
                map.removeItem(parent);
            }
        }
        
    }
};
