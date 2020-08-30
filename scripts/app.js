//variables and selections
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll ('input[type="range"]')
const currentHexes = document.querySelectorAll('.color h2')
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
        initialColors.push(chroma(randomColor).hex())

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

randomColors()