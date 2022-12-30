/*
- Finish the gradient. 
- Then organize the code better to make it more readable.
- If possible try to make it so we can import from color conversions since the two conversion functions are very heavy.
*/

import {
  convert_to_RGB,
  convert_to_hex
} from './color_conversion.js';

// Slider and Grid
const sliderValueEl = document.querySelector('.slider-value');
const sliderEl = document.querySelector('.slider');
const gridEl = document.querySelector('.color-grid');
const toggleGridBtn = document.getElementById('toggle-grid');
const clearGridBtn = document.getElementById('clear-btn');

// Contains the dataset ids of the four color butons
const colorPickerEl = document.getElementById('colorPicker');
const colorBtns = document.querySelectorAll('.color-btn');
let selectedButton = "";
let selectedColor;
let rainbowIndex = 0; //index position that accesses rainbow color hex values;
let RGB_increasing = [true, true, true]; //each boolean corresponds to R, G, and B and whether should be increasing in value or not

// Footer logic
const dateEl = document.getElementById('date');
dateEl.textContent = new Date().getFullYear(); //Gets the current year;


// Gets hex color and displays it on the color button and displays the color on the color picker
// Stores the color into selectedColors in case the user wants to use the select colors button.
function set_color_value(HEX_COLOR) {
  // Find the select Color button in the button list
  colorBtns.forEach(btn => {
    if (btn.dataset.id == "select-color") {
      btn.textContent = HEX_COLOR;
    }
  })
  selectedColor = HEX_COLOR;

  // Needed since other functions are going to change the color such as the rainbow function
  colorPickerEl.value = HEX_COLOR;
}

// Sets a rainbow color for the pixel, and shows the rainbow color on the select colors button to show the user.
function set_rainbow_colors(pixel) {
  // Hex values of red, orange, yellow, green, blue, indigo, and violet respectively
  const RAINBOW_HEX_VALUES = ["#ff0000", "#ffa500", "#ffff00", "#00ff00", "#0000ff", "#4f0082", "#8f00ff"];
  const RAINBOW_COLOR = RAINBOW_HEX_VALUES[rainbowIndex];
  pixel.style.background = RAINBOW_COLOR;
  rainbowIndex += 1;
  if (rainbowIndex > RAINBOW_HEX_VALUES.length - 1) {
    rainbowIndex = 0;
  }
  // Let's try to update the color button to show the hex codes of the rainbow colors
  set_color_value(RAINBOW_COLOR);
};



// Sets a gradient color for the pixel
/*
- Remember current_color_RGB is an array with [R,G,B] values
- Start with incrementing each value by 1, if adding the change factor to a value puts it over 255, then we will make it so it starts decreasing by the change factor
- It will keep decreasing until subtracting by the change value will result in a rgb value that is less than zero. If this happens then we will start increasing it again. 
- To see if a color should be increasing or decreasing we would use booleans. 
- When using gradient after rainbow, we get NaN in our RGB array.
*/
function set_gradient_colors(pixel) {
  let current_color_RGB = convert_to_RGB(selectedColor);
  const CHANGE_FACTOR = 1; //change factor will be a random number from 1 to 3 Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < current_color_RGB.length; i++) { //decides whether a color component should be increasing or decreasing
    if (current_color_RGB[i] + CHANGE_FACTOR > 255) {  //if incrementing the component goes over the rgb limit then we will start decrementing this component and vice versa
      RGB_increasing[i] = false;
    } else if (current_color_RGB[i] - CHANGE_FACTOR < 0) {
      RGB_increasing[i] = true;
    }

    // Now that we've determined if we want to increment or decrement a component let's either increment or decrement them
    if (RGB_increasing[i]) {
      current_color_RGB[i] += CHANGE_FACTOR;
    } else {
      current_color_RGB[i] -= CHANGE_FACTOR;
    }
  }
      
  // Then convert rgb back to hexadecimal; Now convert that pixel into that hex color, update the button text to reflect that color, and update the colorPicker to reflect that color
  const CURRENT_HEX_COLOR = convert_to_hex(current_color_RGB);
  pixel.style.background = CURRENT_HEX_COLOR; // This sets the pixel to that new hex color, which will be slightly different from the previous literally incremented one value
  set_color_value(CURRENT_HEX_COLOR); // Call this function with the new color in order to update the button text, update the selected color in the javascript and update the color picker's color.
  

};

function displaySliderValue(sliderValue) {
  sliderValueEl.textContent = `${sliderValue} x ${sliderValue}`;
}

function clearGrid() {
  const gridItems = document.querySelectorAll('.grid-item');
  gridItems.forEach(function(item) {
    item.style.background = 'white';
  });
}

// Let the grid style persist even when rendering new grid
// When rendering new grid we want to call a function that turns off the grid
// Then for the toggleGridBtn we should probably make two functions and based on the 
// data type probably we select whether its the turn on function or the turn off function
function removeGridLines() {
  const gridItems = gridEl.querySelectorAll('.grid-item');
  gridItems.forEach(function(item) {
    item.style.border = 'none';
  })
}
function displayGridLines() {
  const gridItems = gridEl.querySelectorAll('.grid-item');
  gridItems.forEach(function(item) {
    item.style.border = '1px solid black';
  })
}

// Two to persist the grid lines, one is just getting the grid items after and calling a function
// The other is directly manipulating the html in the for loop
// The third, which is interesting, would be creating a function for making the html
// board and having an entire function dedicated to rendering it on screen, which isn't a bad idea
function displayGrid() {
  // Get the slider value from the slider
  const sliderValue = sliderEl.value;
  // Calculate the amount of pixels or sections that'll be on the grid
  const amount = sliderValue * sliderValue;
  let gridItemsHTML = []; //Stores the html for the grid items
  // Style the grid so that it fits the sections; both may not be necessary
  gridEl.style.gridTemplateColumns = `repeat(${sliderValue}, 1fr)`;
  gridEl.style.gridTemplateRows = `repeat(${sliderValue}, 1fr)`;
  // Create the grid items and put them into an array
  for (let x = 0; x < amount; x++) {    
    gridItemsHTML.push(`<div class="grid-item"></div>`);
  }
  // Reset the html of the grid to the new items of the grid
  gridEl.innerHTML = gridItemsHTML.join("");
  // Persists the style of the grid in this newly generated grid
  if (toggleGridBtn.dataset.state == "on") {
    displayGridLines();
  } else {
    removeGridLines();
  }
  // Display the new dimension of the grid on the slider section
  displaySliderValue(sliderValue);
}


/*
- Function that handles how a specific grid pixel will be manipulated or changed, whether it be
that its colored in, erased, used with rainbow or gradiented. Handle the hole of if there are
no buttons selected
*/

function changeGridPixel(e) {
  const currentPixel = e.currentTarget;
  switch(selectedButton) {
    case "select-color":
      currentPixel.style.background = selectedColor;
      break;
    case "rainbow":
      set_rainbow_colors(currentPixel);
      break;
    case "gradient":
      set_gradient_colors(currentPixel);
      break;
    case "eraser":
      const WHITE_COLOR = "#FFFFFF";
      currentPixel.style.background = WHITE_COLOR;
      set_color_value(WHITE_COLOR);
      break;
    // the selectedButton variable is an empty string when none of the four color buttons are selected
    // this would mean that just nothing happens
  }
}

function toggleGridEventListener(e) {
  const gridItems = gridEl.querySelectorAll('.grid-item');
  if (e.type == "mousedown") {
    gridItems.forEach(function(item) {
      item.addEventListener('mouseover', changeGridPixel);
    })
  } else if (e.type == "mouseup") {
    gridItems.forEach(function(item){
      item.removeEventListener('mouseover', changeGridPixel);
    })
  }
}

colorBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    const btnID = e.currentTarget.dataset.id;
    //if button is newly selected then visually and logically add
    if (!btn.classList.contains('color-btn-selected')) {
      selectedButton = btnID;
      btn.classList.add('color-btn-selected'); //visually select button
      colorBtns.forEach(item => {
        if (item.dataset.id !== btnID) { //for the different buttons (differing id) delsect them
          item.classList.remove('color-btn-selected');
        }
      })
    } else {
      selectedButton = ""; //clear the selectedButton variable since the user hasn't selected anything
      btn.classList.remove('color-btn-selected'); //visually deselect the button that the user is clicking on since they want to deselect it
    }
  })
});

sliderEl.addEventListener("input", displayGrid);
colorPickerEl.addEventListener("input", () => {
  set_color_value(colorPickerEl.value);
});
clearGridBtn.addEventListener('click', clearGrid);

// Data attribute state: When it's value is 'on' then the grid lines should be showing
// When the attribute is 'off' then the grid lines are not being shown
toggleGridBtn.addEventListener('click', function(e) {
  const gridState = e.currentTarget.dataset.state;  
  const gridItems = gridEl.querySelectorAll('.grid-item');
  if (gridState == 'on') {
    toggleGridBtn.classList.remove('toggle-btn-selected');
    removeGridLines();
    toggleGridBtn.setAttribute('data-state', 'off'); 
  } else {
    toggleGridBtn.classList.add('toggle-btn-selected');
    displayGridLines();
    toggleGridBtn.setAttribute('data-state', 'on');
  }
});

window.addEventListener('mousedown', toggleGridEventListener);
window.addEventListener('mouseup', toggleGridEventListener);
window.addEventListener('DOMContentLoaded', function() {
  displayGrid();
  set_color_value(colorPickerEl.value);
});