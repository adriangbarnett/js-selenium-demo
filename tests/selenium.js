/* ======================================================================


    TEST CASES
    IMPORANT: do NOT use sleep > 1500 in the test case
    because the async will always timeout after 2000ms
    Documentation: https://mochajs.org/

    This is async "hell" maybe we shoudkl use cypress! ?

    USAGE:

    npm test ./tests/selenium.js

    IT:

    it("will run, unless ONLY is set on other test case" is set, async function() { }
    it.skip("this will skips", async function() { }
    it.only("only this will run", async function() { }

/* ====================================================================== */

const { assert } = require("chai");
const webdriver = require("selenium-webdriver");
const { Builder, By, Key, until, WebDriverWait, WebElement, FindBy, Duration, ExpectedConditions, JavascriptExecutor} = require("selenium-webdriver");
var driver = new webdriver.Builder().forBrowser("chrome").build();
//driver.manage().setTimeouts({implicit: (10000)})


// build in demo
describe.skip("Navigate tests", async function() { 

    // Add user form
    const input_username= By.id("inputUsername");
    const input_email = By.id("inputEmail");
    const input_counter = By.id("inputCounter");
    const input_image = By.id("inputImage");
    const button_add = By.id("buttonAdd");

    // test data
    const baseUrl = "http://localhost:3000/";
    const expectedUrl = "http://localhost:3000/"


    before(async function() { 
        //console.log("before");
    })

    beforeEach(async function() { 
        //console.log("beforeEach");
        await gotoUrl(baseUrl);
    })

    afterEach(async function() {
        //console.log("afterEach");
    })

    after(async function() { 
        //console.log("after");
        await driver.quit(); 
    })

    // URL tests
    it("Can check url using: assert.isTrue", async function() { 
        const actualUrl = await driver.getCurrentUrl();
        assert.isTrue(actualUrl === expectedUrl, `Incorrect URL, actual: [${actualUrl}], expected: [${expectedUrl}]`);
    })

    it("Can check url using: assert.equal", async function() { 
        const actualUrl = await driver.getCurrentUrl();
        assert.equal(actualUrl, expectedUrl, `Incorrect URL, actual: [${actualUrl}], expected: [${expectedUrl}]`);
    })

    it("Can check url using: assert.isString", async function() { 
        const actualUrl = await driver.getCurrentUrl();
        assert.isString(actualUrl, `Url not string actual: [${actualUrl}], expected: [${expectedUrl}]`);
    })

    it("Can check url: using assert.isNotNull", async function() { 
        const actualUrl = await driver.getCurrentUrl();
        assert.isNotNull(actualUrl, `URL is null, actual: [${actualUrl}], expected: [${expectedUrl}]`);
    })

    // Add user tests
    describe("Add users tests", async function() { 

        it("Can add user using selenium click", async function() { 
            assert.isTrue(await sendKeys(input_username,"auto1"));
            assert.isTrue(await sendKeys(input_email,"auto1@mail.com"));
            assert.isTrue(await sendKeys(input_counter, 666));
            assert.isTrue(await sendKeys(input_image, "./imgs/1.png"));
            assert.isTrue(await clickButton(button_add), "Can not find/click add button");
        })

        it("Can add user using selenium executeScript click", async function() { 
            assert.isTrue(await sendKeys(input_username,"auto1"));
            assert.isTrue(await sendKeys(input_email,"auto1@mail.com"));
            assert.isTrue(await sendKeys(input_counter, 666));
            assert.isTrue(await sendKeys(input_image, "./imgs/1.png"));
            await driver.executeScript(`document.getElementById('buttonAdd').click;`);
        })

        it("Can add user using selenium jsClick click", async function() { 
            assert.isTrue(await sendKeys(input_username,"auto1"));
            assert.isTrue(await sendKeys(input_email,"auto1@mail.com"), "Could noy add text to email field");
            assert.isTrue(await sendKeys(input_counter, 666), "Could noy add nymber to counter field");
            assert.isTrue(await sendKeys(input_image, "./imgs/1.png"), "Could noy add text to image field");
            assert.isTrue(await jsClick(button_add), "Could not click add button");
        })

    })

})



/* ======================================================================
    SELENIUM FUNCTIONS
/* ====================================================================== */

async function clearInput(by) {
    try {
        const e = await find(by);
        if (e === null) {
            console.log({method: "clearInput", message: "E is null", by: by});
        }
        await e.clear();
        return true;
    } catch (ex) {
        console.log({method: "clearInput", message: "exception", exception: ex, by: by});
        return false;
    }
}

// click element by javascript
async function jsClick(by) {
    try {
        const e = await find(by);
        if (e === null) { 
            console.log({method: "jsClick", message: " E is null", by: by});
            return false;
        }
        const res = await driver.executeScript("arguments[0].click();", e);
        return true
    } catch (ex) {
        console.log({method: "jsClick", message: "exception", exception: ex, by: by});
        return false;
    }

    
}

//
async function sendKeys(by, text) {
    try {
        const e = await find(by);
        if (e === null) { 
            console.log({method: "sendKeys", message: " E is null", by: by});
            return false;
        }
        await clearInput(by);
        await e.sendKeys(text);
        return true;
    } catch (ex) {
        console.log({method: "sendKeys", message: "exception", exception: ex, by: by});
        return false;
    }

}

// navigate
async function gotoUrl(url) {
    await driver.get(url);
    waitUntilPageLoaded(5);
}

// selenium click
async function clickButton(by) {
    try {
        // wait for item to be clickable
        const e = await find(by, 5);
        await e.click();
        return true;
    } catch (ex) {
        console.log({method: "clickButton", message: "exception", exception: ex, by: by});
        return false;
    }
}


// bypass timeout with our "own" find by with retry
async function find(by, max_seconds) {

    let tick = 0;
    let e = null;
    if (max_seconds === null || max_seconds === undefined) { max_seconds = 1; }
    
    do {
        try {

            e = null;
            e = await driver.findElement(by);

            // we need to test E to force an error
            //todo: add something to handkle stale element
            if (e !== null) { 
                return e; 
            }

        } catch (err) { 
            // try again
        } 

        sleep(1000); 
        if (tick >= max_seconds) {  return null; } // max tick reached
        tick++;

    } while (tick < max_seconds)

    console.log({method: "find2", message: " timed-out", by: by});
    return null;

}
    
// wait (if use more than 2000 aysn wil time out)
async function sleep(ms)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < ms);
}

// wait for page to load by checking document ready state
async function waitUntilPageLoaded(max_seconds) {

    const documentReadyStateScript = "return document.readyState";
    const documentReadyStateExpectedResult = "complete";

    if (max_seconds === null || max_seconds === undefined ) { max_seconds = 1; }
    let tick  = 0;
    do {
        sleep(1000);
        if (tick >= max_seconds) { return; }
        if ( await driver.executeScript(documentReadyStateScript) === documentReadyStateExpectedResult ) { return; }
        tick++;
    } while ( driver.executeScript("return document.readyState") !== "complete" )
    
}

// JavaScriptExecutor 
async function jsexec(script) {
    const response = await driver.executeScript(script);
    return response;
}

// find element by javascript
async function jsfindByID(stringID, max_seconds) {

    let tick = 0;
    let e = null;

    if (max_seconds === null || max_seconds === undefined) { max_seconds = 1; }

    do {
        try {
            e = await jsexec(`return document.getElementById('${stringID}')`);
            if (e !== null ) { return e; }
        } catch (err) { } // try again

        await sleep(1000);
        tick ++;
        if (tick >= max_seconds) { return null;}

    }  while (tick < max_seconds)

}  