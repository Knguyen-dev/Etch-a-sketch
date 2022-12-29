/*
- Create divs using javascript 
- Create a title 
- Create a side panel, with color selectors, so if you click on color mode, then you pick a color with a circular color selector. 
- If you pick rainbow mode the colors will show rainbow colors
- Have a gradient selector, kind of like every 10 pixels, it makes the color either lighter or darker, and it gradually does this for every 5 or 10 grids
- If you pick eraser then it turns the grid pixels white
- If you pick clear the nit clears the board of colors, making everything white
- There's also a slider at the bottom where you should be able to choose how many grids you want
- Then have a copyright at the bottom 

+ Challenge after everything is done, try to make header an interactive grid that the user can hover over and see the different squares and colors
*/
// Slider and Grid
const sliderValueEl = document.querySelector('.slider-value');
const sliderEl = document.querySelector('.slider');
const gridEl = document.querySelector('.color-grid');
const colorPickerEl = document.getElementById('colorPicker');
const colorBtn = document.getElementById('select-color-btn');
const toggleGridBtn = document.getElementById('toggle-grid');
const clearGridBtn = document.getElementById('clear-btn');

let selectedColor;

//Gets hex color and displays it on the color button.
//Stores the color into selectedColors for further usage.
function display_color_value() {
  const hexColor = colorPickerEl.value;
  colorBtn.textContent = hexColor;
  selectedColor = hexColor;
}

function displaySliderValue(sliderValue) {
  sliderValueEl.textContent = `${sliderValue} x ${sliderValue}`;
}

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

  // Display the new dimension of the grid on the slider section
  displaySliderValue(sliderValue);
}

function clearGrid() {
  const gridItems = document.querySelectorAll('.grid-item');
  gridItems.forEach(function(item) {
    item.style.background = 'white';
  });
}

sliderEl.addEventListener("input", displayGrid);
colorPickerEl.addEventListener("input", display_color_value);
clearGridBtn.addEventListener('click', clearGrid);

toggleGridBtn.addEventListener('click', function(e) {
  const gridState = e.currentTarget.dataset.state;  
  const gridItems = gridEl.querySelectorAll('.grid-item');

  if (gridState == 'on') {
    // Turn off grid lines and set button's state attribute to off so that the next time the user selects it, it turns the lines back on
    gridItems.forEach(function(item) {
      item.style.border = 'none';
    });
    toggleGridBtn.setAttribute('data-state', 'off'); 
  } else {
    gridItems.forEach(function(item) {
      item.style.border = '1px solid black';
    });
    toggleGridBtn.setAttribute('data-state', 'on');
  }
});



window.addEventListener('DOMContentLoaded', function() {
  displayGrid();
  display_color_value();
});