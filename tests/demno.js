const { assert } = require("chai");


describe("experimental", async function() { 

    it("Can sleep for ms", async function() { 

        var ms = 500;
        var date = new Date();
        var curDate = null;
        do { curDate = new Date(); }
        while(curDate-date < ms);

    });

    it('double done', function (done) {
        // Calling `done()` twice is an error
        setImmediate(done);
        setImmediate(done);
    });

    it('single done', function (done) {
        setImmediate(done);
    });

}) // .timeout(1500);

