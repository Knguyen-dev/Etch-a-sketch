function convert_to_RGB(hexColor) {
  const hexValues = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'a': 10,
    'b': 11,
    'c': 12,
    'd': 13,
    'e': 14,
    'f': 15
  };
  /*
  - RGB array will contain the 3 values in decimal form
  - hexPosition is the exponent that each two adjacent hex digits will use during multiplication.
  e.g: Hex color #f1 would be (f * 16 ^ hexPosition) + (1 * 16 ^ hexPosition - 1), so hexPosition will only have values
  1 and 0 due to how hexadecimal to decimal conversions work.
  - sum variable will sum up the decimal values of 2 hex digits before being put into the RGB array and then reset
  for the next pair of hex digits.
  - hexColor is a string that represents a 6 hexadecimal digit color value.
  */
  let RGB_values = []; 
  let hexPosition = 1;  
  let sum = 0;   
  hexColor.slice(1);
  // Loop through all hex digits
  for (let i = 0; i < hexColor.length; i++) {
    sum += hexValues[hexColor[i]] * Math.pow(16, hexPosition); //Do hex multiplication
    hexPosition -= 1;   //Decrement the hexPosition so the math is correct
    if (i % 2 !== 0) {  //If 2 digits have been looped through, then we push the sum to the array and reset the sum for the next pair
      RGB_values.push(sum);  
      sum = 0;
    }
    if (hexPosition == -1) { //If the exponent goes to -1, which isn't allowed, then reset back to 1 so the math works 
      hexPosition = 1;
    }    
  }
  return RGB_values;
}

//Expects an array as an argument with numeric color values [R, G, B] 
function convert_to_hex(RGB_values) {
  const hexValues = { //Object maps out all of the possible hex values into decimal
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 'a',
    '11': 'b',
    '12': 'c',
    '13': 'd',
    '14': 'e',
    '15': 'f'
  };
  let hexCode = "#";
  for (let i = 0; i < RGB_values.length; i++) {
    let RGB_component = RGB_values[i]; //Variable representing the numeric value of R, G, or B
    let hex_digits = ""; //Variable that will store 2 hex digits on every iteration of the for loop
    while (RGB_component / 16 !== 0) {
      hex_digits = hexValues[RGB_component % 16] + hex_digits; //remainder being converted into hex digit and being added to the hex digit string 
      RGB_component = Math.floor(RGB_component / 16); //keep getting the quotient as per hex division
    }
  
    // hex components are in form xx xx xx, if only one of those 3 components only evaluates to 1 digits
    // Then we need to add a zero when converting
    if (hex_digits.length < 2) {
      hex_digits = '0' + hex_digits;
    }
    // Concatenate the 2 hex digits into the hex code string that will be returned at the end
    hexCode += hex_digits;
  }
  return hexCode;
}

export {convert_to_RGB, convert_to_hex};