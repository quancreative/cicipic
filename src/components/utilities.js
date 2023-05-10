const isImage = require('is-image')
const path = require('path');
const isNumeric = (num) => (typeof(num) === 'number' || typeof(num) === "string" && num.trim() !== '') && !isNaN(num);
const fs = require('fs/promises');
const filesize = require('filesize')


const getFilenameOfPath = (src) => {
    // let filename = src.replace(/^.*[\\\/]/, '');
    let filename = path.basename(src);
    filename = decodeURIComponent(filename); // convert encodeURI to original. Ex: %C3% to ü
    // console.log('filename', filename);
    // console.log('path.basename filename', path.basename(src));
    return filename;
}

/**
 * Make sure fileInfo have the same structure and information.
 * @param fileInfo
 * @returns {{}}
 */
let constructFileInfo = async (fileInfo = {}) => {
    if(!fileInfo.hasOwnProperty('path')){
        // Can't do much without the path of the file.
        return fileInfo;
    }

    /**
     * @deprecated use name
     */
    if(!fileInfo.hasOwnProperty('filename') || !fileInfo.filename){
        fileInfo.filename = path.basename(fileInfo.path)
    }

    if(!fileInfo.hasOwnProperty('name') || !fileInfo.name){
        fileInfo.name = path.basename(fileInfo.path)
    }

    if(!fileInfo.hasOwnProperty('size') || !fileInfo.size){
        // let stats = fs.statSync(fileInfo.path)
        // fileInfo.size = filesize(stats.size, {round: 0})
    }

    let folder;
    if(!fileInfo.hasOwnProperty('pwd') || !fileInfo.pwd){
        folder = path.dirname(fileInfo.path);
        fileInfo.pwd = folder
    }

    if(!fileInfo.hasOwnProperty('files') || !fileInfo.files || !fileInfo.files.length){
        let images = await getAllImagesInFolderByImgSrc(fileInfo.path)
        fileInfo.files = images
    }
    return fileInfo;
}

let getAllImagesInFolderByImgSrc = async(imgSrc) => {
    let images = [];
    let src = imgSrc.replace('file:///', '')
    let folder =  path.dirname(src)
    const dir = await fs.readdir(folder)
    for (const filename of dir) {
        if (isImage(filename)) {
            let fileSrc = `${folder}/${filename}`
            images.push( {name: filename, path: fileSrc})
        }
      }

    return images;
}

const getIndexOfObjectInArray = (objProperty, objValue, arr) => {
    let index = 0;
    let obj = arr.find((o, i) => {
        if (o[objProperty] === objValue) {
            index = i
            return true; // stop searching
        }
    });

    return index
}

export async function getNextImageFile(currentDisplayImageSrc) {
    let filename = getFilenameOfPath(currentDisplayImageSrc)
    let images = await getAllImagesInFolderByImgSrc(currentDisplayImageSrc)
    let currentIndexNum = getIndexOfObjectInArray('name', filename, images)
    let nextIndexNum = currentIndexNum + 1;
    let returnImage;

    if(isNumeric(nextIndexNum) && nextIndexNum < images.length){
        returnImage = images[nextIndexNum]
    } else {
        returnImage = images[currentIndexNum]
    }
    return constructFileInfo(returnImage)
}

export async function getPrevImageFile(currentDisplayImageSrc) {
    let filename = getFilenameOfPath(currentDisplayImageSrc)
    let images = await getAllImagesInFolderByImgSrc(currentDisplayImageSrc)
    let currentIndexNum = getIndexOfObjectInArray('name', filename, images)
    let prevIndexNum = currentIndexNum - 1;
    let returnImage;
    if(isNumeric(prevIndexNum) && prevIndexNum > -1){
        returnImage = images[prevIndexNum]
    } else {
        returnImage = images[0];
    }

    return constructFileInfo(returnImage)
}

export async function getFileInfoByPath (path){
    return constructFileInfo({path: path});
}

export function isFistFileOfTheList(filePath, list) {
    let filename = path.basename(filePath);
    let currentIndexNum = getIndexOfObjectInArray('name', filename, list)
    return currentIndexNum == 0;
}

export function isLastFileOfTheList(filePath, list) {
    let filename = path.basename(filePath);
    let currentIndexNum = getIndexOfObjectInArray('name', filename, list)
    return currentIndexNum == list.length - 1;
}