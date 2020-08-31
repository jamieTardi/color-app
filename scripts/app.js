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

function locked (index){
    colorDivs[index].classList.toggle('locked')
    lockButton[index].firstChild.classList.toggle(`fa-lock-open`);
    lockButton[index].firstChild.classList.toggle(`fa-lock`); 
}


randomColors()