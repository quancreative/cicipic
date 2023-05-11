// Self-invoking functions to prevent variable naming conflict
;(function () {
    let imgInfoSideBar = document.getElementById('img-info-side-bar');
    let imgInfoBtn = document.getElementById('img-info');
    let imgInfoExitBtn = document.getElementById('img-info-exit'); // @ X button in Image Info Side Bar
    let restoreWinBtn = document.getElementById('restore-win');
    let maxWinBtn = document.getElementById('max-win');
    let headerElem = document.querySelector('header')
    let moreOptsMenu = document.getElementById('more-opts-menu')

    let toggleInfoSideBar = e => {
        e.preventDefault();
        if(imgInfoSideBar.classList.contains('d-none')){
            imgInfoSideBar.classList.remove('d-none')
            imgInfoBtn.classList.add('active')
        } else {
            imgInfoSideBar.classList.add('d-none')
            imgInfoBtn.classList.remove('active')
        }
    }
    imgInfoBtn.addEventListener('click', toggleInfoSideBar)

    imgInfoExitBtn.addEventListener('click', e => {
        imgInfoSideBar.classList.add('d-none')
        imgInfoBtn.classList.remove('active')
    })

    document.getElementById('menu').addEventListener('click', e => {
        e.preventDefault();
        let thisElem = e.currentTarget;
        if(thisElem.classList.contains('active')){
            thisElem.classList.remove('active')
            moreOptsMenu.classList.add('d-none')
        } else {
            thisElem.classList.add('active')
            moreOptsMenu.classList.remove('d-none')
        }
    })

    document.getElementById('fullscreen').addEventListener('click', e => {
        e.preventDefault();
        window.api.send("toMain", 'toggleFullscreen');
    })

    document.getElementById('delete-img').addEventListener('click', e => {
        e.preventDefault();
        window.api.send("toMain", 'deleteImg');
    })

    document.getElementById('mini-win').addEventListener('click', e => {
        e.preventDefault();
        window.api.send("toMain", 'miniApp');
    })

    restoreWinBtn.addEventListener('click', e => {
        e.preventDefault();
        window.api.send("toMain", 'maxRestoreApp');
    })

    maxWinBtn.addEventListener('click', e => {
        e.preventDefault();
        window.api.send("toMain", 'maxRestoreApp');
    })

    document.getElementById('close-win').addEventListener('click', e => {
        e.preventDefault();
        window.api.send("toMain", 'closeApp');
    })

    /**
     * https://www.electronjs.org/docs/latest/tutorial/ipc
     */
    window.api.handleWindowStatus((event, value) => {
        console.log(event, value)
        switch (value) {
            case 'isMaximized' :
                maxWinBtn.classList.add('d-none')
                restoreWinBtn.classList.remove('d-none')
                break;
            case 'isRestored' :
                restoreWinBtn.classList.add('d-none')
                maxWinBtn.classList.remove('d-none')
                break;
            case 'isFullscreen' :
                headerElem.classList.add('d-none')
                break;
            case 'leaveFullscreen' :
                headerElem.classList.remove('d-none')
                break;
        }
    })
}());