
const information = document.getElementById('info')
const mainLogoElem = document.getElementById('main-img');

information.innerText = `This app is using Chrome (v${api.chrome()}), Node.js (v${api.node()}), and Electron (v${api.electron()})`
// let src = `${api.mainImgSrc()}`

const func = async () => {
    const response = await window.api.ping()
    console.log(response) // prints out 'pong'
    // let getMainImgSrcRes = await window.api.getMainImgSrc().then( res => {
    //     console.log(res);
    //     mainLogoElem.src = res
    //
    // }).catch(e => {
    //     console.log(e)
    // })
    // let getMainImgSrcRes = await window.api.getMainImgSrc()
    // console.log(getMainImgSrcRes) // prints out 'undefined'
}

func().then()

let sendToMain = (event) => {
    window.api.send("toMain", event, mainLogoElem.src);
}

let updateMainDisplay = (data) => {
    let imgSrc = data.currentFile.path;
    mainLogoElem.src = imgSrc
}

let getAllImageInFileList = (files) => {
    let images = []
    for(let i = 0; i < files.length; i++){
        let file = files[i];
        if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)){
            images.push(file);
        }
    }
    return images;
}
let updatePagination = (data) => {
    let onlyImageFiles = getAllImageInFileList(data.currentFile.files)
    let currentIndexNum = getIndexOfObjectInArray('name', data.currentFile.name, onlyImageFiles);
    // console.log('currentIndexNum', currentIndexNum)
    if (currentIndexNum == 0) {
        document.getElementById('prevImgBtn').classList.add('disabled')
    } else {
        document.getElementById('prevImgBtn').classList.remove('disabled')
    }

    if (currentIndexNum == onlyImageFiles.length - 1) {
        document.getElementById('nextImgBtn').classList.add('disabled')
    } else {
        document.getElementById('nextImgBtn').classList.remove('disabled')
    }
}

window.api.receive("fromMain", (data) => {
    console.log(`Received ${data} from main process`, data);
    if (data.currentFile) {
        document.title = data.currentFile.path;
        updateMainDisplay(data);
        updatePagination(data);
    }
});

let onPreImgBtnClick = e => {
    e.preventDefault()
    console.log('prevImgBtn pressed');
    sendToMain("onPrevImgBtnClick", mainLogoElem.src);
}
let prevImgBtn = document.getElementById('prevImgBtn').addEventListener('click', onPreImgBtnClick)
// let nextImgBtn = document.getElementById('nextImgBtn').addEventListener('click', e => window.api.send("toMain", "onNextImgBtnClick"))
let nextImgBtn = document.getElementById('nextImgBtn').addEventListener('click', e => {
    e.preventDefault()
    window.api.nextImage(mainLogoElem.src)
})

/**
 * @see https://stackoverflow.com/a/12462414
 * @param objProperty
 * @param objValue
 * @param arr
 * @returns {number}
 */
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

