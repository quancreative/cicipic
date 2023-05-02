const { app, BrowserWindow, Menu, ipcMain,shell, ipcRenderer, Tray, protocol  } = require("electron");

app.whenReady().then(() => {
    // const win = new BrowserWindow()
    // win.webContents.openDevTools()
})

/**
 * Live reload
 * @see https://flaviocopes.com/electron-hot-reload/
 */
try {
    require('electron-reloader')(module)
} catch (_) {}