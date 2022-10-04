const express = require("express")
app = express()

const path = require('path')
require('dotenv').config({ path: '.properties' })
const db = require("./db.js");


//
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use("/", express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())


//
app.get("/", async (req, res) => { 

    const pageData = {
        code: 200,
        message: "ok",
        title: "indexTitle",
        heading1: "List",
        filter: null,
        list: await db.readall(),
        username: "aa",
        email: "aa",
        counter: 0,
        token: null,
        image: "./img/0.png",
    }
    res.render("index", pageData); 

})


app.post("/add", async (req, res) => { 

    console.log("add");
    const u = req.body;

    let pageData = {
        code: 200,
        message: "ok",
        title: "indexTitle",
        heading1: "List",
        filter: null,
        list: await db.readall(),
        username: u.username,
        email: u.email,
        counter: u.counter,
        token: null,
        image: u.image
    }

    // error checks
    
    if (!u.username ||  !u.email || !u.counter) {
        pageData.code = 400;
        pageData.message = "Missing username OR email OR counter";
        return res.render("index", pageData); 
    }

    const newData = {
        username: u.username,
        email: u.email,
        counter: u.counter,
        image: u.image,
    }
    await db.add(newData);

  
    return res.render("index", pageData); 

})

//
app.post("/filter", async (req, res) => { 

    if (req.body.filter) {
        const pageData = {
            code: 200,
            message: "ok",
            title: "indexTitle",
            heading1: "List",
            filter: req.body.filter,
            list: await db.filter(req.body.filter),
            username: null,
            email: null,
            counter: 0,
            token: null,
            image: null,
        }
        return res.render("index", pageData); 
    }
    return res.redirect("/");

})

//
app.get("/randomupdate", async (req, res) => { 

    const oldData = db.read(req.query.id);
    if (!oldData) {
        console.log("Can not user by id")
        return;
    }

    // change some values
    const rnd = await db.rndStr(4);
    let newData = oldData;
    newData.counter = newData.counter +1;
    newData.date = db.dtNow();
    newData.token = rnd + "token",
    
    db.update(req.query.id, newData);
    return res.redirect("/");
})


// delete all
app.get("/removeall", async (req, res) => { 
    db.removeAll();
    return res.redirect("/");
})

// delete one
app.get("/remove", async (req, res) => { 
    db.remove(req.query.id);
    return res.redirect("/");
})

//
app.get("/generate", async (req, res) => { 
    await addRandomUsers(1);
    return res.redirect("/");
})


//
async function addRandomUsers(length) {
    const newData = await db.generateRandomData(length)
    for (i=0; i!= newData.length; i++) {
        await db.add(newData[i]);
    }
}

// 404: Error
app.get("*", (req, res) => { 
    const pageData = {
        code: 404,
        message: "Page not found",
        title: "errorTitle",
        heading1: "Error 404",
        list: null
    }
    res.render("error", pageData); 
 })

// Start
app.listen(process.env.PORT || process.env.LOCALHOST_PORT, async function(req, res) { 
    
    // create radnom data
    await addRandomUsers(1);
    console.log(`Server started, version: ${process.env.BUILD}`);
});


