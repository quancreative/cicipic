/**
 * @credit https://gist.github.com/thatisuday/c210592f62c1d93c8e513e510e40872c
 */
const {  app, BrowserWindow, ipcMain } = require( 'electron' );
const path = require( 'path' );
const fs = require( 'fs-extra' );
const os = require( 'os' );
// const open = require( 'open' );
const chokidar = require( 'chokidar' );
const log = require('electron-log');
// local dependencies

// export function addFileWatch(win) {
//
// }

// get application directory
const appDir = path.resolve( os.homedir(), 'electron-app-files' );

/****************************/
// Something to use when events are received.
// const log = console.log.bind(console);
exports.addFileWatch = (win) => {
// Initialize watcher.
    const watcher = chokidar.watch('file, dir, glob, or array', {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true
    });
// One-liner for current directory
//     chokidar.watch('.').on('all', (event, path) => {
//         console.log(event, path);
//         log.info(event, path)
//     });
//
//     // Add event listeners.
    watcher
        .on('add', path => log.info(`File ${path} has been added`))
        .on('change', path => log.info(`File ${path} has been changed`))
        .on('unlink', path => log.info(`File ${path} has been removed`));

// More possible events.
    watcher
        .on('addDir', path => log.info(`Directory ${path} has been added`))
        .on('unlinkDir', path => log.info(`Directory ${path} has been removed`))
        .on('error', error => log.info(`Watcher error: ${error}`))
        .on('ready', () => log.info('Initial scan complete. Ready for changes'))
        .on('raw', (event, path, details) => { // internal
            log.info('Raw event info:', event, path, details);
        });

    // 'add', 'addDir' and 'change' events also receive stat() results as second
// argument when available: https://nodejs.org/api/fs.html#fs_class_fs_stats
    watcher.on('change', (path, stats) => {
        process.stdout.write(`File ${path} changed size to ${stats.size}`)
        if (stats) console.log(`File ${path} changed size to ${stats.size}`);
    });
}
//
// // get the list of files
// exports.getFiles = () => {
//     const files = fs.readdirSync( appDir );
//
//     return files.map( filename => {
//         const filePath = path.resolve( appDir, filename );
//         const fileStats = fs.statSync( filePath );
//
//         return {
//             name: filename,
//             path: filePath,
//             size: Number( fileStats.size / 1000 ).toFixed( 1 ), // kb
//         };
//     } );
// };
//
// /****************************/
//
// // add files
// exports.addFiles = ( files = [] ) => {
//
//     // ensure `appDir` exists
//     fs.ensureDirSync( appDir );
//
//     // copy `files` recursively (ignore duplicate file names)
//     files.forEach( file => {
//         const filePath = path.resolve( appDir, file.name );
//
//         if( ! fs.existsSync( filePath ) ) {
//             fs.copyFileSync( file.path, filePath );
//         }
//     } );
//
//     // display notification
//     // notification.filesAdded( files.length );
// };
//
// // delete a file
// exports.deleteFile = ( filename ) => {
//     const filePath = path.resolve( appDir, filename );
//
//     // remove file from the file system
//     if( fs.existsSync( filePath ) ) {
//         fs.removeSync( filePath );
//     }
// };
//
// // open a file
// exports.openFile = ( filename ) => {
//     const filePath = path.resolve( appDir, filename );
//
//     // open a file using default application
//     if( fs.existsSync( filePath ) ) {
//         open( filePath );
//     }
// };
//
// /*-----*/
//
// // watch files from the application's storage directory
// exports.watchFiles = ( win ) => {
//     chokidar.watch( appDir ).on( 'unlink', ( filepath ) => {
//         win.webContents.send( 'app:delete-file', path.parse( filepath ).base );
//     } );
// }