// dialog.showOpenDialog({
//     filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }, { name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
//     properties: ['openFile', 'multiSelections', 'showHiddenFiles']
// }).then(result => {
//     log.info('openFile result', result.filePaths)
//     if(!result.canceled){
//         AppController.updateState(getFileInfoBySrc(result.filePaths[0]), 'openFileDialog');
//     }
// }).catch(err => {
//     log.error('openFile', err)
// })

// ipcMain.on('open-directory', (event) => {
//     dialog.showOpenDialog(win, {
//             title: 'Seleccione la nueva ubicación',
//             buttonLabel: 'Abrir ubicación',
//             properties: ['openDirectory']
//         },
//         (dir) => {
//             const images = []
//             if (dir) {
//                 fs.readdir(dir[0], (err, files) => {  // eslint-disable-line
//                     for (var i = 0, length1 = files.length; i < length1; i++) { // eslint-disable-line
//                         if (isImage(files[i])) { // eslint-disable-line
//                             let imageFile = path.join(dir[0], files[i])
//                             let stats = fs.statSync(imageFile)
//                             let size = filesize(stats.size, {round: 0})
//                             images.push({filename: files[i], src: `file://${imageFile}`, size: size}) // eslint-disable-line
//                         }
//                     }
//                 })
//             }
//         })
// })