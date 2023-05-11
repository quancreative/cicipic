function drop_handler(ev) {
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM

}
let dropArea = document.getElementById('main-content')

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, e => {
        // prevent default action (open as link for some elements)
        e.preventDefault()
        e.stopPropagation()
    }, false)
})

dropArea.addEventListener('drop', handleDrop, false)
// dropArea.classList.add('border')
function handleDrop(e) {
    let filePathList = [];
    // const data = e.dataTransfer.getData("text/plain");
    if (e.dataTransfer.items) {
        for (const item of e.dataTransfer.items) {
            let file = item.getAsFile()

            // Prevent error: Uncaught Error: An object could not be cloned.
            filePathList.push({
                name : file.name,
                path : file.path,
                size : file.size,
                type : file.name,
                lastModified: file.lastModified
            })
            // console.log(`kind = ${item.kind}, type = ${item.type}`);
        }
    }

    if (filePathList.length) {
        window.api.onFileDrop(filePathList)
    }
}

document.getElementById('file-browse-btn').addEventListener('change', e => {
    const files = event.target.files;
    let fileInfoList = [];
    for (const file of files) {

        // for(const property in file){
        //     // console.log(`property = ${property}, value = ${file[property]}`);
        // }
        // Prevent error: Uncaught Error: An object could not be cloned.
        fileInfoList.push({
            name : file.name,
            path : file.path,
            size : file.size,
            type : file.name,
            lastModified: file.lastModified
        })
    }

    if (fileInfoList.length) {
        window.api.onFileDrop(fileInfoList)
    }
})
document.getElementById('open-file-dialog').addEventListener('change', e => {
    const files = event.target.files;
    let fileInfoList = [];
    for (const file of files) {

        // for(const property in file){
        //     // console.log(`property = ${property}, value = ${file[property]}`);
        // }
        // Prevent error: Uncaught Error: An object could not be cloned.
        fileInfoList.push({
            name : file.name,
            path : file.path,
            size : file.size,
            type : file.name,
            lastModified: file.lastModified
        })
    }

    if (fileInfoList.length) {
        window.api.onFileDrop(fileInfoList)
    }
})
