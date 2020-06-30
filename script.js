// ========== DOM ELEMENTS ==========

/** The button used to call for a password */
var generateButton = document.getElementById("generateButton");
/** Output field */
var outputField = document.getElementById("outputField");
/** The checkbox to indicate the inclusion of lowercase letters */
var lowercaseCheck = document.getElementById("lowercaseCheck");
/** The checkbox to indicate the inclusion of capital letters */
var capitalCheck = document.getElementById("capitalCheck");
/** The checkbox to indicate the inclusion of numbers */
var numberCheck = document.getElementById("numberCheck");
/** The checkbox to indicate the inclusion of special characters */
var specialCheck = document.getElementById("specialCharCheck");
/** The input slider representing the number of characters to use */
var numberSlider = document.getElementById("charRange");
/** The text used to display the length of the password */
var lengthText = document.getElementById("lengthText");



// ========== VARIABLES ==========

/** The array of lowercase letters to grab from */
var lowerChars = "abcdefghijklmnopqrstuvwxyz";
/** The array of uppercase letters to grab from */
var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
/** The array of numbers to grab from */
var numberChars = "0123456789";
/** The array of special characters to grab from */
var specialChars = "\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\]\^\_\`\{\|\}\~";
/** An array to allow us to iterate through character arrays */
var passwordArray = [lowerChars, upperChars, numberChars, specialChars];
/** The length of the password to generator */
var charLength = numberSlider.value;
/** The array indicating the conditions for password generation, correlating to index in password array */
var passwordOptions = [1, 1, 1, 1];



// ========== METHODS ==========
//#region
/**
 * Using the binary array of options passed to it, constructs a password by string together the character strings and selecting random characters form it
 * 
 * @param {array} a_options the options for how to generate the password, 1 for include 0 for exclude
 * 
 * @returns {string} A string of randomly generated characters
 */
function GeneratePassword(a_options){

    // Control for improper conditions
    if(a_options.length != 4){
        console.log("An incorrect number of " + a_options.length + " options was passed to GeneratePassword");
    }
    else if(charLength <= 0){
        console.log("An intractable number of " + charLength + " characters was passed to GeneratePassword");
    }

    /** The characters to build the password from */
    var validChars = "";

    // Iterate through each option and if requested append it to validChars
    for(let i = 0; i < 4; i++)
    {
        if(a_options[i] === 1){
            validChars += passwordArray[i];
        }
    }

    // Return is our user is lame
    if(charLength === 0){
        return;
    }

    var t_string = "";

    // For each requested character generate a random one from our list
    for(let i = 0; i < charLength; i++){
        var t_index = Math.ceil(Math.random() * validChars.length) - 1;
        t_string += validChars.charAt(t_index);
    }
    console.log(t_string);

    return t_string;    
}

/**
 * Handles when a button is clicked
 * 
 * @param {Event} event the event which triggered the call
 * 
 * @returns {void}
 */
function HandleClick(event){
    event.preventDefault();

    /** The element that trigged the call */
    var t_element = event.target;

    if(t_element.matches("button")){ // If the element is a button generate a password
        outputField.value = GeneratePassword(passwordOptions);
    }
    else if(t_element.matches("input") && t_element.type === "checkbox"){ // If the element is a checkbox toggle the appropriate value
        var t_index = 5;

        // I am a sloppy coder :(
        for(let i = 0; i < 4; i++){
            if(t_element === lowercaseCheck){
                t_index = 0;
                break;
            }
            else if(t_element === capitalCheck){
                t_index = 1;
                break;
            }
            else if(t_element === numberCheck){
                t_index = 2;
                break;
            }
            else if(t_element === specialCheck){
                t_index = 3;
                break;
            }
        }

        // Toggle the option
        ToggleOption(t_index);
    }
}

/**
 * Updates the length text element using the current value of the slider
 * 
 * @param {Event} event the event calling the method, preferably input
 * 
 * @return {void}
 */
function HandleMoveSlider(event){
    event.preventDefault();

    charLength = numberSlider.value;
    DisplayLength();
}

/**
 * Displays the current length in the prepend part of the input field
 * 
 * @returns {void}
 */
function DisplayLength(){
    lengthText.textContent = "Length: " + charLength;
}

/**
 * Toggles a setting for GeneratePassword, to be called when a checkbox is clicked
 *
 * @param {int} a_index the generation setting to change 
 * 
 * @returns {void}
 */
function ToggleOption(a_index){
    passwordOptions[a_index] = 1 - passwordOptions[a_index];
    console.log("Options: " + passwordOptions.toString());
}

/**
 * Updates the length for GeneratePassword, to be called when the slider is updated
 * 
 * @param {int} a_length a positive integer representing the desired length of the password
 * 
 * @returns {void}
 */
function UpdateLength(a_length){
    if(a_length <= 0){
        charLength = 1;
    }
    charLength = a_length;
}

//#endregion




// ========== EVENT HANDLING ==========
//#region

// Add event listeners
//numberSlider.addEventListener("change", HandleSlider);
numberSlider.addEventListener("input", HandleMoveSlider);
generateButton.addEventListener("click", HandleClick);
lowercaseCheck.addEventListener("change",HandleClick);
capitalCheck.addEventListener("change", HandleClick);
numberCheck.addEventListener("change", HandleClick);
specialCheck.addEventListener("change", HandleClick);

//#endregion 