import {BrowserWindow, ipcMain} from "electron";
import path from "path";

const createAboutWindow = () => {
    const win = new BrowserWindow({
        width : 1200,
        height: 800,
        center: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        show: false
    });

    win.once('ready-to-show', () => {
        win.show()
    })

    ipcMain.handle('ping', () => 'pong')
    win.loadFile(path.join(__dirname, "./renderer/about.html"));
}