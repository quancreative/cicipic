const ImageZoom = {
    scale : 1,
    speed: 0.02,
    zoomIncrement: 0.2,
    zoomPercentElem : document.getElementById('zoom-percentage'),
    zoomElem : document.getElementById('main-img-zoom'),
    resizeOriginalElem : document.getElementById('resize-original'),
    zoomToFitElem : document.getElementById('zoom-to-fit'),
    init(){
        this.addEvents()
    },
    reset(){
        this.scale = 1
        this.update()
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
    addEvents(){
        document.getElementById('zoom-out').addEventListener('click', e => {
            e.preventDefault();
            if(this.zoomElem.getBoundingClientRect().width >= 100){
                this.scale -= this.zoomIncrement
                this.update()
            }
        })

        document.getElementById('zoom-in').addEventListener('click', e => {
            e.preventDefault();
            this.scale += this.zoomIncrement
            this.update()
        })

        this.zoomToFitElem.addEventListener('click', e => {
            e.preventDefault();
        })

        this.resizeOriginalElem.addEventListener('click', e => {
            e.preventDefault();
            this.reset()
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
    const imgFolder = document.getElementById('img-folder') // @ Image Info Side bar
    const imgFilePath = document.getElementById('img-file-path') // @ Image Info Side bar

    let updateMainDisplay = (data) => {
        if(data.currentFile.hasOwnProperty('path'), data.currentFile.path){
            let imgSrc = data.currentFile.path
            mainImg.src = imgSrc
            document.getElementById('main-form').classList.add('d-none')
            document.getElementById('main-img-nav').classList.remove('d-none')
            document.getElementById('img-filename').textContent = data.currentFile.name // @ <header />
            document.getElementById('img-name').textContent = data.currentFile.name // @ Info side bar
            imgFilePath.textContent = imgSrc // @ Info side bar
            imgFilePath.href = `file:///${imgSrc}` // @ Info side bar
            imgFolder.textContent = data.currentFile.pwd // @ Info side bar
            imgFolder.href = data.currentFile.pwd
            ImageZoom.reset();
        } else {
            document.getElementById('main-form').classList.remove('d-none')
            document.getElementById('main-img-nav').classList.add('d-none')
            document.getElementById('img-filename').textContent = ''
            document.getElementById('img-name').textContent = ''
            imgFilePath.textContent = '' // @ Info side bar
            imgFolder.textContent = ''
            imgFolder.href = ''
        }
    }

    window.api.receive("fromMain", (data) => {
        console.log(`Received ${data} from main process`, data);
        if (data.currentFile) {
            document.title = data.currentFile.path;
            updateMainDisplay(data);
        }
    });

    ImageZoom.init();
    DragScroll.init();

})();
