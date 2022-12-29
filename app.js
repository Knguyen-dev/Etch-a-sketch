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


// Have a crack at the mouse down and hover effect first and then try to see how the person did it
// Obviously the effect of clicking a single container and changing the color is simple, as setting an
// event listener on the grid itself is simple; as well as this the hover effect is not the desired effect we want
// so have a crack at it and if you don't get it try to see how he did it on the website.


// Slider and Grid
const sliderValueEl = document.querySelector('.slider-value');
const sliderEl = document.querySelector('.slider');
const gridEl = document.querySelector('.color-grid');
const colorPickerEl = document.getElementById('colorPicker');
const colorBtns = document.querySelectorAll('.color-btn');
const toggleGridBtn = document.getElementById('toggle-grid');
const clearGridBtn = document.getElementById('clear-btn');


let selectedColor;
let selectedButton = "";
// Now with these buttons we will select the four (color, rainbow, gradient, and eraser)
// For the first time. Then we will need make them listen to events, once a button is clicked
// we visually select it and visually deselect other buttons. As well as this we store
// the id of the selected button into a variable. Only one option can be selected at a time
// So keep reassigning when clicked. 

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

//Gets hex color and displays it on the color button.
//Stores the color into selectedColors for further usage.
function set_color_value() {
  const hexColor = colorPickerEl.value;
  // Find the select Color button in the button list
  colorBtns.forEach(btn => {
    if (btn.dataset.id == "select-color") {
      btn.textContent = hexColor;
    }
  })
  selectedColor = hexColor;
}

function displaySliderValue(sliderValue) {
  sliderValueEl.textContent = `${sliderValue} x ${sliderValue}`;
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
/*
- Function that handles filling in the colors for each individual grid pixel
- The event being passed is the div or pixel in the grid that 
- We should
*/
function changeGridPixel(e) {
  const currentPixel = e.currentTarget; 
  currentPixel.style.background = selectedColor;
}

sliderEl.addEventListener("input", displayGrid);
colorPickerEl.addEventListener("input", set_color_value);
clearGridBtn.addEventListener('click', clearGrid);



toggleGridBtn.addEventListener('click', function(e) {
  const gridState = e.currentTarget.dataset.state;  
  const gridItems = gridEl.querySelectorAll('.grid-item');
  if (gridState == 'on') {
    toggleGridBtn.classList.add('toggle-btn-selected');
    removeGridLines();
    toggleGridBtn.setAttribute('data-state', 'off'); 
  } else {
    toggleGridBtn.classList.remove('toggle-btn-selected');
    displayGridLines();
    toggleGridBtn.setAttribute('data-state', 'on');
  }
});

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

window.addEventListener('mousedown', toggleGridEventListener);
window.addEventListener('mouseup', toggleGridEventListener);
window.addEventListener('DOMContentLoaded', function() {
  displayGrid();
  set_color_value();
});