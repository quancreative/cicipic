const isImage = require('is-image')
const filesize = require('filesize')
const fs = require('fs');
const path = require("path");
const folder = 'C:/Users/Quan/Pictures/';

let readDir = (file) => {
    let allFiles = [];
    let images = [];

    fs.readdir(folder, (err, files) => {
        files.forEach(file => {
            // console.log(file);
            // let imageFile = path.join(dir[0], files[i])
            // let stats = fs.statSync(imageFile)
            // let size = filesize(stats.size, {round: 0})
            let fileSrc = `${folder}${file}`
            let fileObj = {filename: file, src: fileSrc}
            if (isImage(file)) { // eslint-disable-line
                images.push(fileObj) // eslint-disable-line
            }

            allFiles.push(fileObj)
        });
    });

    return {
        pwd: folder,
        allFiles: allFiles,
        images: images
    }
}


// @see https://stackoverflow.com/a/16631079
// expose as a common js module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {readDir};
}

// expose mousetrap as an AMD module
if (typeof define === 'function' && define.amd) {
    define(function() {
        return {readDir};
    });
}