const {ToggleButton}  = require('sdk/ui/button/toggle');
const {PageMod} = require('sdk/page-mod');
var prefs = require('sdk/simple-prefs').prefs;
const {Panel} = require("sdk/panel");
var _ = require("sdk/l10n").get;

const {Cu} = require('chrome');
Cu.import("resource://gre/modules/Console.jsm");

var button = ToggleButton({
    id: 'oldvk-button',
    label: _('appName'),
    icon: {
        "16": './oldvk-16.png',
        "32": './oldvk-32.png'
    },
    onChange: handleChange
});

var panel = Panel({
    width: 225,
    height: 130,
    contentURL: './popup.html',
    contentScriptFile: './popup.js',
    contentScriptOptions: {version: require('sdk/self').version},
    onHide: handleHide
});

function handleChange(state) {
    if (state.checked) {
        panel.show({
            position: button
        })
    }
}

function handleHide() {
    button.state('window', {checked: false});
}

panel.port.on('enabled', function (e) {
    enableExt(e)
});

panel.port.emit('enabled', prefs['enabled']);

var vkPage;
var vkPage1;

function enableExt(state) {
    prefs['enabled'] = state;
    if (state) {
        vkPage = PageMod(options);
        vkPage1 = PageMod(options1);
    }
    else {
        if (vkPage) vkPage.destroy();
        vkPage = null;
        if (vkPage1) vkPage1.destroy();
        vkPage1 = null;
    }
}

var options = {
    include: '*.vk.com',
    contentScriptFile: ['./arrive.min.js', './lib.js', './mainStart.js'],
    contentScriptWhen: 'start',
    contentStyleFile: ['./main.css', './local.css'],
    exclude: /^.*vk\.com\/(notifier\.php|al_.*\.php|dev\/|apps\?act=manage|upload_fails.php|ads_rotate.php|share.php|adscreate$|adscreate\?|wkview.php|bugs$|bugs\?|q_frame.php|.*upload.php|login.php).*$/
};

var options1 = {
    include: '*.vk.com',
    contentScriptFile: ['./arrive.min.js', './lib.js', './mainEnd.js'],
    contentScriptWhen: 'ready',
    exclude: /^.*vk\.com\/(notifier\.php|al_.*\.php|dev\/|apps\?act=manage|upload_fails.php|ads_rotate.php|share.php|adscreate$|adscreate\?|wkview.php|bugs$|bugs\?|q_frame.php|.*upload.php|login.php).*$/
};

if (prefs['enabled']) {
    vkPage = PageMod(options);
    vkPage1 = PageMod(options1);
}