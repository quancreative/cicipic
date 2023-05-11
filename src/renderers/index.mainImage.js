const ImageZoom = {
    scale : 1,
    speed: 0.02,
    zoomIncrement: 0.2,
    zoomPercentElem : document.getElementById('zoom-percentage'),
    zoomElem : document.getElementById('main-img-zoom'),
    resizeOriginalElem : document.getElementById('resize-original'),
    zoomToFitElem : document.getElementById('zoom-to-fit'), // Button on the header
    containerElem : document.getElementById('main-img-container'),
    mainImgElem : document.getElementById('main-img'),
    imageLoaded : false,
    init(){
        this.addEvents()
    },
    setScale(scaleVal = 1){
        this.scale = scaleVal
        this.update()
    },
    checkImageLoaded(callback, tried = 1){
        console.log('running tries: ', tried)
        if(this.imageLoaded) {
            return true;
        } else {
            if(tried < 10){
                let mainImgElem = document.getElementById('main-img');
                if(mainImgElem.complete && mainImgElem.naturalHeight !== 0){
                    this.imageLoaded = true;
                    callback()
                    return;
                } else {
                    tried ++;
                    setTimeout( () => this.checkImageLoaded(callback, tried), 50)
                }
            } else {
                return;
            }
        }
    },
    startFresh(){
        this.imageLoaded = false
        this.mainImgElem.classList.add('d-none')
        this.setScale(1)
    },
    setImageSrc(src){
        this.startFresh()
        this.mainImgElem.src = src;
        this.checkImageLoaded(() => {
            this.mainImgElem.classList.remove('d-none')
            this.imageToFit()// If image larger then window, scale down and center it
        })
    },
    update(){
        this.zoomElem.style.transform = `scale(${this.scale})`
        this.updateZoomPercentage()
        this.updateHeaderBtns()
    },
    updateZoomPercentage () {
        let zoomRounded = Math.round(this.scale * 100)
        this.zoomPercentElem.textContent = `${zoomRounded}%`
    },
    updateHeaderBtns(){
        if (this.scale == 1) {
            this.resizeOriginalElem.classList.add('d-none')
            this.zoomToFitElem.classList.remove('d-none')
        } else {
            this.zoomToFitElem.classList.add('d-none')
            this.resizeOriginalElem.classList.remove('d-none')
        }
    },
    /**
     * If image larger then window, scale down and center it
     */
    imageToFit() {
        let maxWidth = this.mainImgElem.clientWidth;
        let maxHeight = this.mainImgElem.clientHeight;
        let containerWidth = this.containerElem.clientWidth
        let containerHeigt = this.containerElem.clientHeight
        let isImageBiggerThenContainer = containerWidth <= maxWidth && containerHeigt <= maxHeight;
        if(isImageBiggerThenContainer){
            let tempScale = Math.min(containerWidth/maxWidth, containerHeigt/maxHeight)
            console.log('tempScale', tempScale)
            this.setScale(tempScale)

            let hhh = (this.containerElem.clientHeight / 2) - ((this.zoomElem.clientHeight * tempScale) / 2) ;
            this.containerElem.scrollTop = hhh ;
            let www = (this.containerElem.clientWidth / 2) - ((this.zoomElem.clientWidth * tempScale) / 2);
            this.containerElem.scrollLeft = www / 2 ;
        }
    },
    addEvents(){
        this.mainImgElem.addEventListener('load ', e => {
           console.log('image loaded')
        })

        window.addEventListener("load", event => {
            let image =  document.getElementById('main-img');
            let isLoaded = image.complete && image.naturalHeight !== 0;
            console.log(isLoaded);
        });

        document.getElementById('zoom-out').addEventListener('click', e => {
            e.preventDefault();
            if(this.zoomElem.getBoundingClientRect().width >= 100){
                this.setScale( this.scale -= this.zoomIncrement)
            }
        })

        document.getElementById('zoom-in').addEventListener('click', e => {
            e.preventDefault();
            this.setScale(this.scale += this.zoomIncrement)
        })

        this.zoomToFitElem.addEventListener('click', e => {
            e.preventDefault();
            this.imageToFit()
        })

        this.resizeOriginalElem.addEventListener('click', e => {
            e.preventDefault();
            this.setScale(1)
        })

        document.addEventListener('wheel', e => {
            if(e.deltaY > 0){
                // Prevent zoom to negative number
                if(this.zoomElem.getBoundingClientRect().width >= 100){
                    this.zoomElem.style.transform = `scale(${this.scale -= this.speed})`
                }
            } else {
                this.zoomElem.style.transform = `scale(${this.scale += this.speed})`
            }
            this.update()
        })
    }
};

const DragScroll = {
    pos : { top: 0, left: 0, x: 0, y: 0 },
    // containerElem : document.getElementById('main-img-container'),
    containerElem : document.getElementById('main-img-container'),
    init() {
        this.containerElem.scrollTop = 100;
        this.containerElem.scrollLeft = 150;
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);
        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        document.addEventListener('mousedown', this.mouseDownHandler);
    },
    mouseDownHandler: function(e) {
        if(e.button != 0) return;

        e.preventDefault()
        this.pos = {
            // The current scroll
            left: this.containerElem.scrollLeft,
            top: this.containerElem.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        // Change the cursor and prevent user from selecting the text
        this.containerElem.style.cursor = 'grabbing';
        this.containerElem.style.userSelect = 'none';

        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('mouseup', this.mouseUpHandler);
    },
    mouseMoveHandler: function(e){
        // How far the mouse has been moved
        const dx = e.clientX - this.pos.x;
        const dy = e.clientY - this.pos.y;

        // Scroll the element
        this.containerElem.scrollTop = this.pos.top - dy;
        this.containerElem.scrollLeft = this.pos.left - dx;
    },
    mouseUpHandler: function(e) {
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler);

        this.containerElem.style.cursor = 'grab';
        this.containerElem.style.removeProperty('user-select');
    }
}

/**
 * Self-invoking functions to prevent variable naming conflict
 * Adding a semicolon at the beginning of the line, helps JavaScript understand that this is a separate line and should not be combined with the previous line.
 * @se https://bobbyhadz.com/blog/javascript-intermediate-value-is-not-a-function#add-a-semicolon-at-the-beginning-of-the-line-on-which-the-error-occurred
 */
;(function () {

    let updateMainDisplay = (data) => {
        if(data.currentFile.hasOwnProperty('path'), data.currentFile.path){
            let imgSrc = data.currentFile.path
            ImageZoom.setImageSrc(imgSrc);
            document.getElementById('main-form').classList.add('d-none')
            document.getElementById('main-img-nav').classList.remove('d-none')

        } else {
            ImageZoom.clear();
            document.getElementById('main-form').classList.remove('d-none')
            document.getElementById('main-img-nav').classList.add('d-none')
            document.getElementById('header-img-filename').textContent = ''

        }
    }

    window.api.receive("fromMain", (data) => {
        if (data.currentFile) {
            document.title = data.currentFile.path;
            updateMainDisplay(data);
        }
    });

})();
ImageZoom.init();
DragScroll.init();
