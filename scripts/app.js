//variables and selections
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll ('input[type="range"]')
const currentHexes = document.querySelectorAll('.color h2')
let initialColors;
//functions

//Generate a random Color
//Asses using chroma.js
generateHex = () => {
   const hexColor = chroma.random();
   return hexColor
}

randomColors = () => {
    colorDivs.forEach((div, index) => {
        const hextText = div.children[0];
        const randomColor = generateHex()
        //Add the color to the background
        div.style.background = randomColor;
        hextText.innerText = randomColor
        //contrast checking
        checkTextContrast(randomColor, hextText)
        //Intialize Color Sliders
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll('.sliders input');
        console.log(sliders)
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

    //Update the input colors
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`
    brightness.style.backgroundImage =  `linear-gradient(to right, ${scaleBright(1)}, ${scaleBright(0.5)} , ${scaleBright(0)})`
}


randomColors()