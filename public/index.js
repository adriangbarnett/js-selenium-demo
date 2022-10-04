// clear text field value
function clearValue(id) {
    document.getElementById(id).value = null;
}

// set text field value with random string
function setRandomValue(id, length) {
    document.getElementById(id).value = rndStr(length);
}

// random string
function rndStr(length) {
    let result = '';
    const characters =  'abcdefghijklmnopqrstuvwxyz0123456789' //'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


// counter
try {
    const counterElement = document.getElementById('counter');
    counterElement.addEventListener('input', setNumericValue);
    // counterElement.addEventListener('onchange', setNumericValue(counterElement, 0) );
    //counterElement.addEventListener('onclick', setNumericValue(counterElement, 0) );
    //counterElement.addEventListener('onmouseover', setNumericValue() );
    // counterElement.addEventListener('onmouseout', setNumericValue(counterElement, 0) );
    //counterElement.addEventListener('onkeydown', setNumericValue(counterElement, 0) );
    //counterElement.addEventListener('onload', setNumericValue(counterElement, 0) );
    //counterElement.addEventListener('change', setNumericValue(counterElement, 0) );
} catch (e) {
    //console.log(e);
}


// Set number of numeric field
function setNumericValue(e) {
    // try {
        
    //    un = document.getElementById('username');
    
    //     if (e.target.value < 21) { 
    //         un.value = "less than 20";
    //         e.target.value = 0;
    //     } else {
    //         un.value = "more than 20";
    //     }
    // }
    // catch (ex) {
    //     console.log(ex);
    // }

}
