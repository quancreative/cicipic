
/**
 * Self-invoking functions to prevent variable naming conflict
 * Adding a semicolon at the beginning of the line, helps JavaScript understand that this is a separate line and should not be combined with the previous line.
 * @se https://bobbyhadz.com/blog/javascript-intermediate-value-is-not-a-function#add-a-semicolon-at-the-beginning-of-the-line-on-which-the-error-occurred
 */
;(function () {
    const imgFolder = document.getElementById('img-folder') // @ Image Info Side bar
    const imgFilePath = document.getElementById('img-file-path') // @ Image Info Side bar

    imgFolder.addEventListener('click', e => {
        e.preventDefault();
        window.api.openFileExplorer(imgFolder.textContent)
    })

    imgFilePath.addEventListener('click', e => {
        e.preventDefault();
        window.api.openFileExplorer(imgFilePath.textContent)
    })


    let updateMainDisplay = (data) => {
        if(data.currentFile.hasOwnProperty('path'), data.currentFile.path){
            let imgSrc = data.currentFile.path
            document.getElementById('img-name').textContent = data.currentFile.name // @ Info side bar
            imgFilePath.textContent = imgSrc // @ Info side bar
            imgFilePath.href = `file:///${imgSrc}` // @ Info side bar
            imgFolder.textContent = data.currentFile.pwd // @ Info side bar
            imgFolder.href = data.currentFile.pwd
        } else {

            document.getElementById('img-filename').textContent = ''
            document.getElementById('img-name').textContent = ''
            imgFilePath.textContent = '' // @ Info side bar
            imgFilePath.href = ''
            imgFolder.textContent = ''
            imgFolder.href = ''
        }
    }

    window.api.receive("fromMain", (data) => {
        if (data.currentFile) {
            updateMainDisplay(data);
        }
    });

})();