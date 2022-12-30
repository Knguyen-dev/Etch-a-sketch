import {
  convert_to_RGB,
  convert_to_hex
} from './color_conversion.js';

// Slider and Grid
/*
- sliderValueEl: h1 or text element that will show the dimensions of the show
- sliderEl: Input range element that will control the dimensions of the grid 
- gridEl: The grid or parent container that will contain the grid items.
- toggleGridBtn: Button in the side panel section/container that will control whether grid lines will show or not on the grid.
- clearGridBtn: Button that will clear the color from all pixels (divs) on the grid by resetting the grid to white again
*/

const sliderValueEl = document.querySelector('.slider-value');
const sliderEl = document.querySelector('.slider');
const gridEl = document.querySelector('.color-grid');
const toggleGridBtn = document.getElementById('toggle-grid');
const clearGridBtn = document.getElementById('clear-btn');

// Side Panel and buttons
/*
- colorPickerEl: Input type color html element that will help the user select the color they want to use
- colorBtns are a nodelist of 4 buttons that will change how a grid pixel will be changed. First is the select color button which will color a pixel with the color on the color picker. The second is the rainbow
button which colors the grid pixels all rainbow colors. The third is the gradient button, which slightly changes the rgb values of the color on the color picker each time the user colors
a grid pixel. The last one is the eraser which erasers the color on a pixel by painting it white. 
- selectedButton: String that will contain a data id of one of the four colorBtns in order to control which of the four features the user is currently using
- selectedColor: A hexadecimal color value that's tracked when the user changes colors on the color pixel and when using other color functions.
- rainbowIndex: An index position that's used to access the rainbow color hex values in the rainbow colors function. This value constantly changes to loop through all of the rainbow colors.
- RGB_increasing: An array containing 3 booleans that corresponds to R, G, and B values respectively. The booleans indicate whether the program should increase a color component R, G, or B. If a boolean is true 
then it tells the program that we should keep increasing that component, but if the boolean is false then we start decreasing the component.
*/
const colorPickerEl = document.getElementById('colorPicker');
const colorBtns = document.querySelectorAll('.color-btn');
let selectedButton = "";
let selectedColor;
let rainbowIndex = 0; //index position that accesses rainbow color hex values;
let RGB_increasing = [true, true, true]; //each boolean corresponds to R, G, and B and whether should be increasing in value or not

// Footer logic
//  dateEl: Text html element that will contain and show the chronological date. 
const dateEl = document.getElementById('date');
dateEl.textContent = new Date().getFullYear(); //Gets the current year to show it ;

/*
1. Gets hex color and displays it on the select color button
2. Displays or changes to that color on the color picker
3. Reassigns the hex color to the selectedColor variable  
*/
function set_color_value(HEX_COLOR) {
  // Find the select Color button in the button list and if the ID matches the select color button, then change the text on that button to the current color.
  colorBtns.forEach(btn => {
    if (btn.dataset.id == "select-color") {
      btn.textContent = HEX_COLOR;
    }
  })
  selectedColor = HEX_COLOR;
  colorPickerEl.value = HEX_COLOR;
}

/*
1. Gets a rainbow color and sets current pixel to that color
2. Calls set_color_value function with that color to update current color on the color picker, text button, and selectedColor variable.
*/
// Sets a rainbow color for the pixel, and shows the rainbow color on the select colors button to show the user.
function set_rainbow_colors(pixel) {
  // Hex values of red, orange, yellow, green, blue, indigo, and violet respectively
  const RAINBOW_HEX_VALUES = ["#ff0000", "#ffa500", "#ffff00", "#00ff00", "#0000ff", "#4f0082", "#8f00ff"];
  const RAINBOW_COLOR = RAINBOW_HEX_VALUES[rainbowIndex];
  pixel.style.background = RAINBOW_COLOR;
  // Increment rainbowIndex so that the next time this function is used, it will be a different color; also the conditional is used to keep the indices within range
  rainbowIndex += 1;
  if (rainbowIndex > RAINBOW_HEX_VALUES.length - 1) {
    rainbowIndex = 0;
  }
  // Let's try to update the color button to show the hex codes of the rainbow colors
  set_color_value(RAINBOW_COLOR);
};

// Sets a gradient color for the pixel
/*
1. Gets the RGB values of the selectedColor variable, which is also the current color on the color picker input element; current_color_RGB is an array with [R,G,B] values
2. Create a value that each of the rgb values will be changed by. Check for each component: If adding the value to that component makes it go over 255 then set the boolean corresponding to that rgb value
in RGB_increasing to false. Else if subtracting by the value is less than zero then set the boolean to true. 
3. Then for each boolean, if its true then increasing the corresponding rgb component by the value, else decrease it by the value.
4. Convert the color back to hex and set the pixel to that color.
5. Then call the set color function to update the current color being used visually and in the program's logic.

NOTE: Since it is initialize with all true booleans, then on the first pixel, it will likely always make the rgb values increase. If rgb values are all in the middle e.g. (100,100,100), both of the conditions
will not apply, so the true booleans will stay the same, and it will increase the same. As well as this the booleans don't reset on a new color, they will only reassign based on the conditions that are looking at the
RGB values. For example, if you're using gradient and you have rgb(240, 210, 200) as [false, true true], then if pick a brand new color on the color picker maybe [50, 0, 0], it will stay [false, true, true];
*/
function set_gradient_colors(pixel) {
  let current_color_RGB = convert_to_RGB(selectedColor);
  const CHANGE_FACTOR = Math.floor(Math.random() * 3) + 1; 
  //decides whether a color component should be increasing or decreasing
  //if incrementing the component goes over the rgb limit then we will start decrementing this component and vice versa
  for (let i = 0; i < current_color_RGB.length; i++) { 
    if (current_color_RGB[i] + CHANGE_FACTOR > 255) {  
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
  pixel.style.background = CURRENT_HEX_COLOR; 
  set_color_value(CURRENT_HEX_COLOR); // all this function with the new color in order to update the button text, update the selected color in the javascript and update the color picker's color.
};


// Function that will handle how a specific grid pixel will be changed
/*
- Function has four paths of logic that will affect a pixel
1. Colors the pixel with the current color which will be selectedColor
2 If rainbow then call the rainbow function with currentPixel as the argument, which will color the pixel with a rainbow color
3. Calls gradient function which will color current pixel with a gradient style
4. If it's eraser then colors the pixel with a white color to erase all color on it

NOTE: That selectedButton can be an empty string when none of the buttons in colorBtns are selected, in that case nothing will happen
*/

function changeGridPixel(e) {
  const currentPixel = e.currentTarget; //gets the currentTarget of the event which will be the individual div or grid pixel
  switch(selectedButton) {              //selectedButton will contain the ID of one of the four color btns, and based on the value of that variable we will do one of four things
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
      const WHITE_COLOR = "#ffffff";
      currentPixel.style.background = WHITE_COLOR;
      set_color_value(WHITE_COLOR);
      break;
  }
}

// Displays the dimensions of the grid with the value of the slider input element being passed into it;
function displaySliderValue(sliderValue) {
  sliderValueEl.textContent = `${sliderValue} x ${sliderValue}`;
}

// Clears all color on the grid by making all divs or items in the grid white, which clears all color on it
function clearGrid() {
  const gridItems = document.querySelectorAll('.grid-item');
  gridItems.forEach(function(item) {
    item.style.background = 'white';
  });
}

// Removes the grid lines by removing the borders of all of the grid items
function removeGridLines() {
  const gridItems = gridEl.querySelectorAll('.grid-item');
  gridItems.forEach(function(item) {
    item.style.border = 'none';
  })
}

// Displays the lines for the grid by putting a border on all grid items
function displayGridLines() {
  const gridItems = gridEl.querySelectorAll('.grid-item');
  gridItems.forEach(function(item) {
    item.style.border = '1px solid black';
  })
}

// This function will render the grid based on the value of the slider
/*
1. Get value of the slider which is the amount rows or cols in our perfect square grid. Square the value to find out how many pixels are in the grid and create that amount of pixels.
2. Update the grid on the DOM by reassigning the HTML
3. the toggle grid btn to see if the user wanted the grid lines to show or not, and call the appropriate function accordingly
4. Display the dimensions of the new grid
*/

function displayGrid() {
  const sliderValue = sliderEl.value;
  const amount = sliderValue * sliderValue;
  let gridItemsHTML = []; 
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


// Function that controls the mouseover effect for all grid pixels; accepts event type as argument as this function is activated with either a mousedown or mouseup event
/*
1. Get all grid pixels. If it was mousedown, then create a mouseover event for all of the pixels. Hovering over will activate the change pixel function, which will color grid accordingly depending on what colorBtns
are selected. 
2. The second option is whether its a mouseup event that triggered this function, which will remove that mouseover event for all of the grid pixels. This is so that when the user isn't having the mouse down and 
hovering over the grid, none of the grid pixels will be colored or affected.
*/
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

// Add an eventlistener for each of the four color buttons to control whether the buttons will appear selected or deselected
// It will indicate this visually with the css classes, but also the selectedButton variable will be reassigned to the selected button's ID to indicate that it is currently in use.  
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

// Every time the user changes the value on the slider, which are the grid dimensions, then we will call displayGrid to render a new grid each time
sliderEl.addEventListener("input", displayGrid);

// Each time the user changes the value on the color picker input element, then call the set color function with the value of the input element in order to update the current color visually and in the program's logic
colorPickerEl.addEventListener("input", () => {
  set_color_value(colorPickerEl.value);
});

// Every time the clear grid button is clicked we call the button to clear the grid;
clearGridBtn.addEventListener('click', clearGrid);

// Add an event listener to the toggle grid button
/*
1. Get state variable of the button. 
- Data attribute state: When it's value is 'on' then the grid lines should be showing
- When the attribute is 'off' then the grid lines are not being shown
2. Depending on the data-state attribute we will call either the remove or display grid lines functions
*/
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

/*
1. Create a mousedown and up event listener for the toggleGridEventListener, so that the hovering to color the pixels will happen when the user is mousing down, and nothign will color when the mouse is up.
2. When the page loads we will display a grid, which is based on the slider value that's set in the html file. Then call the set color function to set the current color, which will be the color value of the 
colorPicker element that is set in the html file. 
*/
window.addEventListener('mousedown', toggleGridEventListener);
window.addEventListener('mouseup', toggleGridEventListener);
window.addEventListener('DOMContentLoaded', function() {
  displayGrid();
  set_color_value(colorPickerEl.value);
});