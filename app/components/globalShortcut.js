import {globalShortcut} from "electron";

const { app, BrowserWindow } = require("electron");
const ElectronStore = require("electron-store");
const { ipcMain } = require("electron");
const path = require("path");

let shortcuts = []

const regShortCut = (shortcut, handler) => {
    const ret = globalShortcut.register(shortcut, handler)
    if (!ret) {
        console.log(`registration shortcut ${shortcut} failed`)
    }

    // Check whether a shortcut is registered.
    console.log(globalShortcut.isRegistered(shortcut))
}

/**
 * Global shortcut will work even when application is not active/focus
 *
 * @param AppController
 */
export function createGlobalShortcut(AppController) {
    shortcuts = [
        {
            shortcut : 'MediaNextTrack',
            handler : 'next'
        },
        {
            shortcut : 'CommandOrControl+f',
            handler : 'fullscreenToggle'
        },
        {
            shortcut : 'MediaPreviousTrack',
            handler : 'prev'
        },
    ]


    for (let i = 0; i < shortcuts.length; i++) {
        let shortcutObj = shortcuts[i];
        regShortCut(shortcutObj.shortcut, () => {
            AppController[shortcutObj.handler](shortcutObj.shortcut)
        })
    }
}

app.on('will-quit', () => {
    for (let i = 0; i < shortcuts.length; i++) {
        // Unregister a shortcut.
        globalShortcut.unregister(shortcuts[i].shortcut)
    }

    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        globalShortcut.unregisterAll();
    }
});