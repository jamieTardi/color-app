//variables and selections
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll ('input[type="range"]')
const currentHexes = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-container')
const adjustButton = document.querySelectorAll('.adjust');
const closeAdjustments = document.querySelectorAll('.close-adjustment');
const sliderContainers = document.querySelectorAll('.sliders');
const lockButton = document.querySelectorAll('.lock')
let initialColors;
//local storage
let savedPalettes = [];

//event listner

sliders.forEach(slider => {
    slider.addEventListener('input', hslControls);
});
colorDivs.forEach((slider, index) => {
    slider.addEventListener('change', () => {
        //callback function (the function defintion is at the bottom)
        updateTextUI(index);
    })
});
currentHexes.forEach(hex => {
    hex.addEventListener('click', () => {
        copyToClipboard(hex)
    })
})

popup.addEventListener('transitionend', () => {
  const popupBox = popup.children[0]
  popup.classList.remove('active');
  popupBox.classList.remove('active'); 
})
adjustButton.forEach((button, index) => {
    button.addEventListener('click', () => {
        openAdjustmentPanel(index)
    })
})

closeAdjustments.forEach((button, index) =>{
    button.addEventListener('click', () => {
        closeAdustPanel(index)
    })
})

lockButton.forEach((button, index) => {
    button.addEventListener('click', () => {
        locked(index)
    })
})






//functions

//Generate a random Color
//Asses using chroma.js
generateHex = () => {
   const hexColor = chroma.random();
   return hexColor
}

randomColors = () => {
    //initial color saved
    initialColors = [];

    colorDivs.forEach((div, index) => {
        const hextText = div.children[0];
        const randomColor = generateHex()

        //Add the generated hex tot the array
        if(div.classList.contains('locked')){
            initialColors.push(hextText.innerText);
            return;
        }
        else{
        initialColors.push(chroma(randomColor).hex());
        }

        //Add the color to the background
        div.style.backgroundColor = randomColor;
        hextText.innerText = randomColor
        //contrast checking
        checkTextContrast(randomColor, hextText)
        //Intialize Color Sliders
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2]

        colorizeSliders (color, hue, brightness, saturation);
    })
    //reset the input sliders
    resetInputs();
    //Check for contrast
    adjustButton.forEach((button,index) => {
        checkTextContrast(initialColors[index], button) 
        checkTextContrast(initialColors[index], lockButton[index])
        
    })
}

//White text on a dark background and vice versa.
checkTextContrast = (color, text) => {
    const luminance = chroma(color).luminance();
    if (luminance > 0.5){
        text.style.color = 'black'
    }
    else{
        text.style.color = 'white'
    }
}

colorizeSliders = (color, hue, brightness, saturation) => {
    //Saturation Scale
    const noSat = color.set('hsl.s', 0)
    const fullSat = color.set('hsl.s', 1)
    const scaleSat = chroma.scale([noSat, color, fullSat]);

    //scale Brightness
    const midBright = color.set('hsl.l', 0.5);
    const scaleBright = chroma.scale (['black', midBright, 'white'])

    //scale HUE
    const midHue = color.set('hsl.h', 0.5);
    const scaleHue = chroma.scale (['black', midHue, 'white'])

    //Update the input colors
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)} , ${scaleBright(1)})`
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204),rgb(204,75,75))`
}

//Sliders for hue ssaturation and brightness
function hslControls (e) {
    const index = e.target.getAttribute('data-bright') ||
                  e.target.getAttribute('data-hue') ||
                  e.target.getAttribute('data-sat')
    
                  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]')
                  const hue = sliders[0];
                  const brightness = sliders[1];
                  const saturation = sliders[2];

                  const bgColor = initialColors[index]
                  

                  let color = chroma(bgColor)
                  .set('hsl.s', saturation.value)
                  .set('hsl.l', brightness.value)
                  .set('hsl.h', hue.value);

                  colorDivs[index].style.background = color;

                  //colorize the sliders
                  colorizeSliders(color, hue, brightness, saturation)

}
function updateTextUI(index){
    const activeDiv = colorDivs[index]
    const color = chroma(activeDiv.style.backgroundColor);
    const textHex = activeDiv.querySelector('h2');
    const icons = activeDiv.querySelectorAll('.controls button')
    textHex.innerText = color.hex();
    //Checking the contrast
    checkTextContrast(color, textHex)
    for(icon of icons){
        checkTextContrast(color, icon)
    }
}


//Funtion to reset the hue saturation and luminance on refresh. 
function resetInputs(){
    const sliders = document.querySelectorAll('.sliders input')
    sliders.forEach((slider) => {
        if(slider.name === 'hue'){
            const hueColor = initialColors[slider.getAttribute('data-hue')]
            const hueValue = chroma(hueColor).hsl()[0]
            slider.value = Math.floor(hueValue);
            console.log(slider.value)
        }
        if(slider.name === 'brightness'){
            const brightColor = initialColors[slider.getAttribute('data-bright')]
            const brightValue = chroma(brightColor).hsl()[2]
            slider.value = Math.floor(brightValue * 100) / 100;
            console.log(slider.value)
        }
        if(slider.name === 'saturation'){
            const satColor = initialColors[slider.getAttribute('data-sat')]
            const satValue = chroma(satColor).hsl()[1]
            slider.value = Math.floor(satValue * 100) / 100;
            console.log(slider.value)
        }
    })
}

//copying to the clip board functionality
function copyToClipboard (hex) {
    const el = document.createElement('textarea')
    el.value = hex.innerText;
    document.body.appendChild(el)
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el)

    //Deal with the pop up once copied, grab the first child (the entire div)
    const popupBox = popup.children[0]
    popup.classList.add('active')
    popupBox.classList.add('active')
}

//opening the adjust panel for HSL
function openAdjustmentPanel(index){
    sliderContainers[index].classList.toggle('active')
}

//Using the x button to close. Rememeber the index is giving us access to the button event listener
function closeAdustPanel(index){
    sliderContainers[index].classList.remove('active')
}
//event listner for random colors
generateBtn.addEventListener('click', randomColors)

//adding font icons on click of lock button
function locked (index){
    colorDivs[index].classList.toggle('locked')
    lockButton[index].firstChild.classList.toggle(`fa-lock-open`);
    lockButton[index].firstChild.classList.toggle(`fa-lock`); 
}

//Palette saving and Local storage.
const saveBtn = document.querySelector('.submit-save')
const submitSave = document.querySelector('.save');
const closeSave = document.querySelector('.close-save');
const saveContainer = document.querySelector('.save-container');
const saveInput = document.querySelector('.save-container input');
const libraryContainer = document.querySelector('.library-container');
const libraryBtn = document.querySelector('.library');
const closeLibraryBtn = document.querySelector('.close-library');

//Event Listners

submitSave.addEventListener('click', openPalette)
closeSave.addEventListener('click', closePalette)
saveBtn.addEventListener('click', savePalette)
//open a container when clicking on save
function openPalette(e){
    console.log('working')
    const popup = saveContainer.children[0];
    saveContainer.classList.add('active');
    popup.classList.add('active');

}

//closing save container
function closePalette(e){
    const popup = saveContainer.children[0];
    saveContainer.classList.toggle('active');
    popup.classList.add('remove');
}

function savePalette (e) {
    saveContainer.classList.remove('active');
    popup.classList.add('remove');
    //Value from input field
    const name = saveInput.value;
    //Store colors in the empty array
    const colors = [];
    //for each hex push the hex into the empty array
    currentHexes.forEach((hex) => {
        colors.push(hex.innerText);
    })
    //Generate the object. this will be nothing or empty for the time being. Default saved is 5
    let paletteNum = savedPalettes.length;
    const paletteObjects = JSON.parse(localStorage.getItem('palettes'));
    if (paletteObjects){
        paletteNum = paletteObjects.length;
    }else{
        paletteNum = savedPalettes.length
    }

    //object is the same as variable no need to name them
    const paletteObj = {name, colors, num: paletteNum};
    savedPalettes.push(paletteObj);
    console.log(savedPalettes)
    //save to local storage
    saveToLocal(paletteObj);
    saveInput.value = ''

    //generate the actual palette for the library
    const palette = document.createElement('div');
    palette.classList.add('custom-palette');
    const title = document.createElement('h4');
    //adding the name of the palette as the created object.
    title.innerText = paletteObj.name;
    const preview = document.createElement('div');
    preview.classList.add('small-preview');
    //for each pallete object color display the background of the small div
    paletteObj.colors.forEach((previewColor) => {
        const smallDiv = document.createElement('div');
        smallDiv.style.backgroundColor = previewColor;
        preview.appendChild(smallDiv)
    })

    const paletteBtn = document.createElement('button');
    paletteBtn.classList.add('pick-palette-btn');
    paletteBtn.classList.add(paletteObj.num);
    paletteBtn.innerText = 'Select'

    //Attach event listner to select button
    paletteBtn.addEventListener('click', e => {
        closeLibrary();
        const paletteIndex = e.target.classList[1];
        initialColors = [];
        savedPalettes[paletteIndex].colors.forEach((color, index) => {
            initialColors.push(color);
            colorDivs[index].style.backgroundColor = color;
            const text = colorDivs[index].children[0]
            checkTextContrast(color, text);
            updateTextUI(index)
        })
        resetInputs();
    })

    //Append to the library
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(paletteBtn);
    libraryContainer.children[0].appendChild(palette);
}

function saveToLocal(paletteObj){
    let localPalettes;
    //if the local storage has nothing in it create the empty array
    if(localStorage.getItem('palettes') === null){
        localPalettes = [];
    }else{
        //The name of the item does not matter
        localPalettes = JSON.parse(localStorage.getItem('palettes'))
    }
    

    localPalettes.push(paletteObj);
    localStorage.setItem('palettes', JSON.stringify(localPalettes))
}

function openLibrary(){
    const popup = libraryContainer.children[0];
    libraryContainer.classList.add('active');
    popup.classList.add('active');
}

function closeLibrary(){
    const popup = libraryContainer.children[0];
    libraryContainer.classList.remove('active');
    popup.classList.remove('active');
}

function getLocal(){
    if(localStorage.getItem('palettes') === null){
        localPalettes = [];
    }else{
        const paletteObject = JSON.parse(localStorage.getItem('palettes'))
        savedPalettes = [...paletteObject];
        paletteObject.forEach(paletteObj => {
            const palette = document.createElement('div');
    palette.classList.add('custom-palette');
    const title = document.createElement('h4');
    //adding the name of the palette as the created object.
    title.innerText = paletteObj.name;
    const preview = document.createElement('div');
    preview.classList.add('small-preview');
    //for each pallete object color display the background of the small div
    paletteObj.colors.forEach((previewColor) => {
        const smallDiv = document.createElement('div');
        smallDiv.style.backgroundColor = previewColor;
        preview.appendChild(smallDiv)
    })

    const paletteBtn = document.createElement('button');
    paletteBtn.classList.add('pick-palette-btn');
    paletteBtn.classList.add(paletteObj.num);
    paletteBtn.innerText = 'Select'

    //Attach event listner to select button
    paletteBtn.addEventListener('click', e => {
        closeLibrary();
        const paletteIndex = e.target.classList[1];
        initialColors = [];
        paletteObject[paletteIndex].colors.forEach((color, index) => {
            initialColors.push(color);
            colorDivs[index].style.backgroundColor = color;
            const text = colorDivs[index].children[0]
            checkTextContrast(color, text);
            updateTextUI(index)
        })
        resetInputs();
    })

    //Append to the library
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(paletteBtn);
    libraryContainer.children[0].appendChild(palette);
        })
    }
}


libraryBtn.addEventListener('click', openLibrary)

closeLibraryBtn.addEventListener('click', closeLibrary)
//automatic generation of colors upon function call



getLocal()
randomColors()
