const { app, BrowserWindow, Menu, MenuItem, ipcMain, shell, ipcRenderer, Tray, protocol } = require("electron");
const {createMainWindow} = require('./components/window.js')
const { devtool } = require('./components/devtools.js')
const path = require("path");
const os = require("os");
const fs = require("fs");
const {getNextImageFile, getPrevImageFile, getFileInfoByPath, isFistFileOfTheList, isLastFileOfTheList} = require("./components/utilities");
// const {createGlobalShortcut} = require("./components/globalShortcut");
const log = require('electron-log');
// const {addFileWatch} = require("./components/io");
// const {notify} = require("./components/notification");


// fs.readFile(p, 'utf8', function (err, data) {
//     if (err) return console.log(err);
//     // data is the contents of the text file we just read
// });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null
let fileURL =  `C:/Users/Quan/Pictures/81046739_p0.jpg`
let stateChange = {
    fileList: {
        pwd: '',
        allFiles: [],
        images: []
    },
    currentFile : {
        name: path.basename(fileURL),
        path : fileURL
    }
}
// const appIcon = new Tray('/Users/Quan/Pictures/desktop-5.jpg')
// console.log(appIcon, win)

const isDev = process.env.NODE_ENV !== 'production'
const isMac = process.platform === 'darwin'
// if (process.env.NODE_ENV === 'development') {
//     devtools()
// }

log.info(`Hello from Electron 👋`)
process.stdout.write(`Hello from Electron 👋`)

let AppController = {
    winFinishLoad : false,
    tempState : null,
    updateWinFinishLoad(value = null){
        this.winFinishLoad = value
        log.info(`winFinishLoad ${this.winFinishLoad}`)
        if (this.winFinishLoad && this.tempState != null) {
            win.webContents.send("fromMain", this.tempState)
            this.tempState = null
        }
    },
    next(trigger = ''){
        let curentFilePath = stateChange.currentFile.path;
        !async function () {
            let fileObj = await getNextImageFile(stateChange.currentFile.name);
            if(!fileObj) return;
            this.updateState(fileObj, 'next', trigger)
            // isLastFileOfTheList(curentFilePath, fileObj.files) &&  notify('You have reached the end of the road!')
        }();
        // console.log('next()', trigger)
        // console.log('AppController', this)
    },
    prev(trigger = 'prev'){
        let curentFilePath = stateChange.currentFile.path;
        ;(async () => {
            let fileObj = await getPrevImageFile(stateChange.currentFile.path)
            this.updateState(fileObj, 'updateMainImageSource', trigger);
            // isFistFileOfTheList(curentFilePath, fileObj.files) && notify('You have reached the begining!')
        })();
    },
    updateState(fileObj, event, trigger){
        stateChange = {event: event, currentFile: fileObj, trigger: trigger}
        if(!this.winFinishLoad){
            log.warn(`winFinishLoad has not occured.`)
            this.tempState = stateChange
        }
        const func = async () => {
            log.info('updateState stateChange', stateChange)
            win.webContents.send("fromMain", stateChange)
        }
        func().then()
    },
    toggleFullscreen(){
        if (win.isFullScreen()) {
            this.exitFullScreen()
        } else {
            this.setFullScreen()
        }
    },
    setFullScreen(){
        win.setMenu(null);
        win.setFullScreen(true)
        win.setMenuBarVisibility(false)
    },
    exitFullScreen() {
        console.log('exitFullScreen');
        // win.setMenu();
        win.setFullScreen(false)
        win.setMenuBarVisibility(true);
    }
}

async function createWindow (){

    // protocol.registerFileProtocol('file', (request, callback) => {
    //     const pathname = request.url.replace('file:///', '');
    //     const pathnameDecode = decodeURI(request.url.replace('file:///', ''));
    //     callback(pathname);
    // });

    win = createMainWindow(path.join(__dirname, "renderers/index.html"));
    win.on('closed', () => { win = null;  });
    win.on('maximize', () => { win.webContents.send('windowStatus', 'isMaximized') });
    win.on('unmaximize', () => { win.webContents.send('windowStatus', 'isRestored') });
    win.on('enter-full-screen', () => { win.webContents.send('windowStatus', 'isFullscreen') });
    win.on('leave-full-screen', () => { win.webContents.send('windowStatus', 'leaveFullscreen') });
    win.on('app-command', (e, cmd) => {
        cmd === 'browser-backward' && AppController.prev()
        cmd === 'browser-forward' && AppController.next()
    })
    win.webContents.once("did-finish-load", () => {
        AppController.updateWinFinishLoad(true)
    });

    ipcMain.handle('ping', () => 'pong')
    // ipcMain.handle('getMainImgSrc', () => 'C:/Users/Quan/Pictures/73270408_p0.png')
    // ipcMain.handle('getMainImgSrc', () => fileURL)
    // ipcMain.handle('update', () =>  async (event, ...args) => {
    //     const result = await update(...args)
    //     return result
    // })

    ipcMain.on('nextImage', (event, currentDisplayImageSrc) => {
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        const func = async () => {
            // console.log('currentDisplayImageSrc', currentDisplayImageSrc)
            let fileObj = await getNextImageFile(decodeURI(currentDisplayImageSrc)); // Ex: Convert %20 to space
            AppController.updateState(fileObj, 'updateMainImageSource', 'onNextImgBtnClick');
            return fileObj;
        }
        func().then()

        // Todo: Try code below for cleaner
        // (async() => {
        //     const fileObj = await getNextImageFile(decodeURI(currentDisplayImageSrc)); // Ex: Convert %20 to space
        //     AppController.updateState(fileObj, 'updateMainImageSource', 'onNextImgBtnClick');
        // })().catch(console.error)
    })
    return win
}

ipcMain.on("toMain", (event, args) => {
    log.info('toMain', args);
    switch (args) {
        case 'onPrevImgBtnClick' :
            AppController.prev()
            break;
        case 'onNextImgBtnClick' :
            console.log('onNextImgBtnClick')
            AppController.next()
            break;
        case 'toggleFullscreen' :
            AppController.toggleFullscreen()
            break;
        case 'OnEscape' :
            AppController.exitFullScreen()
            break;
        case 'deleteImg' :
            break;            
        case 'miniApp' :
            win.minimize()
            break;
        case 'maxRestoreApp' :
            if(win.isMaximized()){
                win.restore()
            } else {
                win.maximize()
            }
            break;
        case 'maxApp' :
            win.maximize()
            break;
        case 'restortApp' :
            win.restore()
            break;       
        case 'maxApp' :
            win.maximize()
            break;   
        case 'closeApp' :
            win.close()
            break;              
        case 'onFileBrowseClick' :

            break;
    }
    fs.readFile("path/to/file", (error, data) => {
        // Do something with file contents

        // Send result back to renderer process
        win.webContents.send("fromMain", stateChange);
    });
});

ipcMain.on('onFileExplorerClick', (event, path) => {
    // @https://stackoverflow.com/a/43701801
    fs.lstat(path, (err, stats) => {
        if(err) return console.log(err); //Handle error
        // console.log(`Is file: ${stats.isFile()}`);
        // console.log(`Is directory: ${stats.isDirectory()}`);

        // Show the given file in a file manager. If possible, select the file.
        // if (stats.isFile()) shell.showItemInFolder(path)
        if (stats.isFile()) shell.showItemInFolder(path)

        if (stats.isDirectory()) shell.openPath(path)
    });
})

/**
 * This is when user double click on an external image file to open our app.
 */
let checkOpenedFile = () => {
    // console.log(createdWin);
    // @credit https://stackoverflow.com/a/70822261
    if (process.platform == 'win32' && process.argv.length >= 2) {
        let openFilePath = process.argv[1]; // Get the 2nd argument
        // Check if a file and if the file is an image
        let filename = path.basename(openFilePath)
        if (!filename.match(/\.(jpg|jpeg|png|gif)$/i)){
            return
        }
        ;(async () => {
            log.info('init external file: 2', openFilePath)
            let fileInfo = await getFileInfoByPath(openFilePath);
            log.info('external fileInfo: 2', fileInfo)
            AppController.updateState(fileInfo, 'openExternalFile');
        })();
    }
}

let onWindReady = () => {
    createWindow().then( checkOpenedFile).catch()
    
    // addFileWatch(win)
    log.info('process.argv', process.argv);
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow().then(checkOpenedFile).catch()
        }
    })
    
    registerIPCEvents()
    // createGlobalShortcut(AppController)
}

/**
 * Only one single instance. 
 * activating the window of primary instance when a second instance starts:
 * 
 * @see https://stackoverflow.com/a/52633637
 * @see https://github.com/electron/electron/blob/main/docs/api/app.md
 */
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
            checkOpenedFile()
        }
    })
        
    // Create myWindow, load the rest of the app, etc...
    app.whenReady().then(onWindReady)
}

/**
 * Mac only. Fires when double click on external file
 */
app.on('open-file', (event, url) => {
    log.info('open-file', url)
    log.info(event, url)
    event.preventDefault();
    if (win === null) {
        // create the main window here
        // this is usually done on app.on("ready")
        // but this event fires before "ready"
    }
    // if you already had a mainWindow or just finished
    // creating it for the first time then handle the file
    let file = null;
    let openFilePath = null;
    if (process.platform == "win32" && process.argv.length >= 2) {
        openFilePath = process.argv[1];
    }
    if (process.platform == "darwin") {
        openFilePath = path;
    }
    file = fs.readFileSync(openFilePath, "utf-8");
    // now do stuff with the file such as sending it to the renderer
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
    win = null
})

/**
 * Call by index.fileIO.js when user click on Browse button on index.html.
 */
ipcMain.on('onFileDrop', (event, files) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    ;(async () => {
        let fileInfo = await getFileInfoByPath(files[0].path);
        AppController.updateState(fileInfo, 'onFileDrop');
    })();
})


async function registerIPCEvents() {

    ipcMain.on('get-file-data', (event) => {
        log.info('get-file-data', event);
        if (process.platform == 'win32' && process.argv.length >= 2) {
            let openFilePath = process.argv[1];
            log.info(openFilePath);
            log.info('get-file-data');
        }
    });

// listen to file open event
    ipcMain.on( 'on-file-open', ( event, file ) => {
        log.info(event);
        log.info('open-file file', file);
    } );

    ipcMain.on( 'on-file-add', ( event, file = [] ) => {
        log.info('open-file-add event', event);
        log.info('open-file-add', file);
    } );

    ipcMain.on('get-file-paths', async (event, options) => {
        log.info('get-file-paths', event);
        // event.sender.send('get-file-paths-response', (await dialog.showOpenDialog(options)).filePaths);
    });
    ipcMain.on('getSecurityCode', (event, _eventData) => {
        // event.sender.send('getSecurityCodeResponse', getState().securityCode);
    });
    ipcMain.on('droppedFiles', async (_event, eventData) => {
        for (const path of eventData.files) {
            // await handleFile(path, eventData.username, eventData.onlineToken);
        }
    });
    ipcMain.on('tip', (_event, _eventData) => {
        // emitIPC('techTip', tip());
    });
    ipcMain.on('setChibiPlayerAlwaysOnTop', (_event, _eventData) => {
        // setChibiPlayerAlwaysOnTop(!getConfig().GUI.ChibiPlayer.AlwaysOnTop);
        // setConfig({ GUI: { ChibiPlayer: { AlwaysOnTop: !getConfig().GUI.ChibiPlayer.AlwaysOnTop } } });
    });
    ipcMain.on('closeChibiPlayer', (_event, _eventData) => {
        // updateChibiPlayerWindow(false);
        // setConfig({ GUI: { ChibiPlayer: { Enabled: false } } });
        // if (getConfig().App.FirstRun) {
        //     applyMenu('REDUCED');
        // } else {
        //     applyMenu('DEFAULT');
        // }
    });
    ipcMain.on('focusMainWindow', (_event, _eventData) => {
        // focusWindow();
    });
    ipcMain.on('openFolder', (_event, eventData) => {
        if (eventData.type === 'streamFiles') {
            // shell.openPath(resolve(resolvedPath('StreamFiles')));
        }
    });
}
