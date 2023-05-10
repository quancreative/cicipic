const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'), // ipcRenderer.invoke() works same as ipcRenderer.send() but it returns a Promise
    // getMainImgSrc: () => ipcRenderer.invoke('getMainImgSrc'),
    // @see https://stackoverflow.com/a/59888788
    send: (channel, data) => {
        // whitelist channels
        let validChannels = ["toMain"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = ["fromMain"];
        if (validChannels.includes(channel)) {
            console.log('preloader from main', func)
            // Deliberately strip event as it includes `sender`
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
    update: () => ipcRenderer.invoke('update'),
    nextImage: (currentImageSrc) => ipcRenderer.send('nextImage', currentImageSrc),
    onFileDrop: (files) => ipcRenderer.send('onFileDrop', files),
    handleWindowStatus : (callback) => { ipcRenderer.on('windowStatus', callback) }
    // mainImgSrc: () => {
    //     let imgSrc = '';
    //     imgSrc = `C:/Users/Quan/Pictures/81046739_p0.jpg`
    //     let natImg = nativeImage.createFromPath(imgSrc)
    //     imgURL = natImg.toDataURL();
    //     return natImg.toDataURL();
    // }
    // we can also expose variables, not just functions
})

// process.once("loaded", () => {
//     window.process = process;
// });