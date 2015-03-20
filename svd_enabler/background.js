// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
  
    chrome.contentSettings.cookies.set({
        'primaryPattern': "http://svd.se/*",
        'setting' : 'block'
    })
    chrome.contentSettings.cookies.set({
        'primaryPattern': "http://*.svd.se/*",
        'setting' : 'block'
    })
});
