const styles = [
    {css: 'audios', match: 'audios'},
    {css: 'friends', match: 'friends'}
];

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        }
    });
}
function listener(tabId, info, tab) {
    if (info.status == 'loading' && info.url) {
        console.log(tabId,info);
        var url = document.createElement('a');
        url.href = info.url;
        var path = url.pathname.slice(1);
        var Styles = [];
        styles.forEach(function (style) {
            var apply = !!path.startsWith(style.match);
            Styles.push({css: style.css, apply: apply})
        });
        chrome.tabs.sendMessage(tabId, {action: 'updating', css: Styles, path: path}, null)
    }
}

chrome.tabs.onUpdated.addListener(listener);

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({enabled: true})
});