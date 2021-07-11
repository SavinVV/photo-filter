const fileInput = document.querySelector('input[type="file"]'),
      imageContainer = document.querySelector('.image-container'),
      btnNextImage = document.querySelector('.btn-next'),
      filtersContainer = document.querySelector('.filters');

// Загрузить своё изображение

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.classList.add('image');
        imageContainer.innerHTML = "";
        imageContainer.append(img);
    };
    reader.readAsDataURL(file);
    fileInput.value = '';
});

// Переключить на следующее изображение

let numberImage = 0;
function getNumberImage()  {
    if (numberImage > 20) {
        numberImage = 0;
    }
    if (numberImage == 0) {
        numberImage++;
    }
    if (numberImage < 10) {
        return `0` + numberImage;
    } else {
        return numberImage;
    }
}

function getTime() {
    let time = (new Date()).getHours();
    if (time >= 0 && time <= 6) {
        return 'night';
    } else if (time >= 6 && time <= 12) {
        return 'morning';
    } else if (time >= 12 && time <= 18) {
        return 'day';
    } else {
        return 'evening';
    }
}


btnNextImage.addEventListener('click', () => {
    numberImage++;

    const prevImage = document.querySelector('.image'),
          nextImage = new Image();

    const num = getNumberImage(),
          timeOfDay = getTime(),
          imgSrc = `assets/images/${timeOfDay}/${num}.jpg`;

    nextImage.src = imgSrc;
    nextImage.classList.add('image');
    prevImage.remove();
    nextImage.onload = () => {
        imageContainer.appendChild(nextImage);
    };
});


// Изменение фильтров

let isMouseDown = false;

filtersContainer.addEventListener('mousedown', () => {
    isMouseDown = true;
});

filtersContainer.addEventListener('mouseup', () => {
    isMouseDown = false;
});

function updateFilter(target, value) {
    target.nextElementSibling.value = value;
    let suffix = target.dataset.sizing || '';
    document.documentElement.style.setProperty(`--${target.name}`, value + suffix);
}

filtersContainer.addEventListener('mousemove', e => {
    let target = e.target;
    if (isMouseDown && target.tagName == 'INPUT') {updateFilter(target, target.value);}
});

filtersContainer.addEventListener('click', e => {
    let target = e.target;
    if (target.tagName == 'INPUT') {
        updateFilter(target, target.value);
    }
});

// Reset 

const btnReset = document.querySelector('.btn-reset');

const baseFilters = {
    'blur': '0',
    'invert': '0',
    'sepia': '0',
    'saturate': '100',
    'hue-rotate': '0',
};

function resetFilters() {
    for (let filter in baseFilters) {
        let target = document.querySelector(`input[name='${filter}']`);
        updateFilter(target, baseFilters[filter]);
        target.value = baseFilters[filter];
    }
}

btnReset.addEventListener('click', resetFilters);

// Fullscreen

const fullscreen = document.querySelector('.fullscreen');

fullscreen.addEventListener('click', () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
});

// Скачать изображение

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

function getCanvasFilters() {
    const filters = ['blur', 'invert', 'sepia', 'saturate', 'hue-rotate'];
    let canvasFilters = [];
    for (const item of filters) {
        const value = document.documentElement.style.getPropertyValue(`--${item}`);
        if (value) {canvasFilters.push(`${item}(${value})`);}
    }
    return canvasFilters.join(' ');
}

function save(canvas) {
    const dataURL = canvas.toDataURL();
    const a  = document.createElement('a');
    a.href = dataURL;
    a.download = 'image.png';
    a.click();
}

const saveBtn = document.querySelector('.btn-save');

saveBtn.addEventListener('click', (e) => {
    const image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = document.querySelector('.image').src;
    image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.filter = getCanvasFilters();
        ctx.drawImage(image, 0, 0, image.width, image.height);
        save(canvas);
    };
});