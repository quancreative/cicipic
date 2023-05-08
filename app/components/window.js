/**
 * @credit https://github.com/aesqe/electron-image-viewer/blob/master/window.js
 */
const { app, BrowserWindow } = require("electron");
const ElectronStore = require("electron-store");
const { ipcMain } = require("electron");
const path = require("path");

const defaults = {
    // title: "Electron image viewer",
    // icon: "images/icon.png",
    position: "center",
    // x: 0,
    // y: 0,
    // width: 4920,
    // height: 3080,
    minWidth: 600,
    minHeight: 300,
    // maximized: true,
    // overlayScrollbars: true,
    // resizable: true,
    // movable : true,
    // minimizable : true,
    // maximizable : true,
    // closable : true,
    // toolbar: true,
    // transparent: false,
    // fullscreen: true,
    // frame: false,
    // devTools: true,
    // titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //     color: '#2f3241',
    //     symbolColor: '#74b1be',
    //     height: 32
    // },
    show: false,
    darkTheme: true,
    webPreferences: {
        nodeIntegration: false, // is default value after Electron v5
        // nodeIntegration: true,
        // webSecurity: false,
        contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: false, // turn off remote
        preload: path.join(__dirname, 'preload.js'),
    },
}

/**
 * https://stackoverflow.com/a/51302139
 * @param a
 * @param b
 * @returns {*}
 */
function extend(a, b){
    for (let key in b) {
        if (b.hasOwnProperty(key))
            a[key] = b[key];
        return a;
    }
}

export function createMainWindow(file, settings = {}) {
    const store = new ElectronStore();

    let lastWindowState = store.get("lastWindowState");

    if (!lastWindowState) {
        lastWindowState = {
            width: 1920,
            height: 1080,
            maximized: true,
        };

        store.set("lastWindowState", lastWindowState);
    }

    // Last window state override default x, width, height
    let winSettings = Object.assign(defaults, lastWindowState)
    // settings override defaults and last time window closed
    winSettings = Object.assign(defaults, settings)

    let win = new BrowserWindow(winSettings);

    if (lastWindowState.maximized) {
        win.maximize();
    }

    win.on("close", () => {
        const maximized = win.isMaximized();

        // avoid setting width and height to screen w/h values
        win.unmaximize();

        const bounds = win.getBounds();
        const { x, y, width, height } = bounds;
        const windowState = {
            maximized,
            width,
            height,
            x,
            y,
        };

        store.set("lastWindowState", windowState);
    });

    win.once('ready-to-show', () => {
        win.show()
    })

    win.on("unresponsive", (e) => console.log(e));
    win.webContents.on("crashed", (e) => console.log(e));
    process.on("uncaughtException", (e) => console.log(e));

    win.webContents.on("did-finish-load", () => win.show());

    win.on("maximize", () => win.webContents.send("maximize"));
    win.on("unmaximize", () => win.webContents.send("unmaximize"));

    ipcMain.on("maximize", () => win.maximize());
    ipcMain.on("unmaximize", () => win.unmaximize());

    win.on("closed", () => setTimeout(() => (win = null), 150));

    ipcMain.on("quit", () => {
        win.closeDevTools();
        app.quit();
    });

    win.loadFile(file);
    // win.loadURL(`file://${__dirname}/renderers/index.html`);
    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools()
    }
    // win.webContents.openDevTools()

    return win;
}
