let imgInfoSideBar = document.getElementById('img-info-side-bar');
let imgInfoBtn = document.getElementById('img-info');
let imgInfoExitBtn = document.getElementById('img-info-exit'); // @ X button in Image Info Side Bar

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