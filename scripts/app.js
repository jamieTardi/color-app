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
        
    })
}

checkTextContrast = (color, text) => {
    const luminance = chroma(color).luminance();
}


randomColors()