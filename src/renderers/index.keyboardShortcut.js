
// Prevent scrolling during transition thru photos
function onKeyDown (event) {
    switch (event.key) {
        case 'ArrowRight' :
            event.preventDefault()
            break;
        case 'ArrowLeft' :
            event.preventDefault()
    }
}

function onKeyUp (event) {
    // You can put code here to handle the keypress.
    console.log(`You pressed ${event.key}`)
    switch (event.key){
        case 'ArrowRight' :
            event.preventDefault()
            window.api.nextImage(mainImg.src)
            break;
        case 'ArrowLeft' :
            event.preventDefault()
            window.api.send("toMain", "onPrevImgBtnClick");
            break;
        case 'ArrowUp' :
            break;
        case 'ArrowDown' :
            break;
        case 'f' :
            event.preventDefault()
            window.api.send("toMain", 'toggleFullscreen');
            break;
        case 'Escape' :
            window.api.send("toMain", 'OnEscape');
            break;
    }
}

window.addEventListener('keyup', onKeyUp, true)
window.addEventListener('keydown', onKeyDown, true)
window.addEventListener('mouseup', event => {
    switch (event.button) {
        case 3:
            window.api.send("toMain", "onPrevImgBtnClick");
            event.preventDefault()
            break;
        case 4:
            window.api.nextImage(mainImg.src)
            event.preventDefault()
            break;
        case 5:
            event.preventDefault()
            break;
    }
})