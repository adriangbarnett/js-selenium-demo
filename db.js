// simulate local database but WITHOUHT using mongodb.


const e = require('express');
const uuid = require('uuid');
let users = [];
let usercounter = 0;

// get all users
function readall() {
    return users; 
}

// get one user
function read(id) {

    for(i=0; i != users.length; i++) {
        if (users[i].id === id) {
            return  users[i];
        } 
     }

     return null;
}

// find users that contain search string 
function filter(searchValue) {

    const result = [];

    for(i=0; i != users.length; i++) { 

        // concat all fields then search for value
        const u = users[i];
        var s = "";
        var str = s.concat(u.id, u.username, u.email, u.date, u.counter, u.token, u.image);
   
        if (str.includes(searchValue) === true) {
            result.push(users[i])
         }
    }

    return result;

}

// update one by id
function update(id, newData) {

    const newArr = [];
    const oldArr = users;
    for(i=0; i != users.length; i++) {

        if (users[i].id !== id) {
            newArr.push(users[i]);
        } else {
            // match found
            newArr.push(newData);
        }
    }
    users = newArr;
}

// remove all from db
function removeAll() {
    const count = users.length;
    users = [];
    return {
        code: 200, 
        message: count + "users deleted"
    }
}

// remove one by id
function remove(id) {

    if (!id ) {
        return {
            code: 400, 
            message: "missing id"
        }
    }

    let match = false;
    let newArr = [];

    for(i=0; i != users.length; i++) {

        if (users[i].id !== id) {
            newArr.push(users[i]);
        } else {
            match = true;
        }
    }
    
    users = [];
    users = newArr;

    if (match !== true) {
        return {
            code: 400, 
            message: "id not found"
        }
    } else {
        return {
            code: 200, 
            message: "updated"
        }  
    }

}

// Generate random data then return the array
async function generateRandomData(length) {

    let newData = [];

    for (let i=1; i!=length+1; i++) {

        const rnd = await rndStr(4);
        const name = `user${i}${rnd}`

        const u = {
            username: `user${i}${rnd}`,
            email: `user${i}${rnd}@mail.com`,
            counter: 0,
            token:  rnd + "token",
            image: `./img/${randomInteger(0,4)}.png`
        }

        newData.push(u);

    }

    return newData;

}

// create random data
async function add(newUser) {

    // override some values
    usercounter++;
    newUser.dbid = usercounter,
    newUser.id = await uid(true);
    newUser.date = await dtNow();
    newUser.token = await rndStr(4) + "token";
    

    users.push(newUser);
    console.log(users.length + " user(s) in db");

    return {
        code: 200, 
        message: users.length + " user(s) in db"
    } 

}

// generate date/time format
async function dtNow() {
    const d = new Date();
    let dt = d.toLocaleTimeString("en-GB", {year: 'numeric', month: '2-digit', day: '2-digit', weekday:"short", hour: '2-digit', hour12: false, minute:'2-digit', second:'2-digit'});
    //let dt = await d.toLocaleTimeString();
    return dt;
}

// generate unique id
async function uid(removeHash){
    let id = await uuid.v1();
    if (removeHash === true) {
        let result = id.replaceAll("-","",);

        return result;
    } else {
        return id;
    }
}


// random string
async function rndStr(length) {
    let result = '';
    const characters =  'abcdefghijklmnopqrstuvwxyz0123456789' //'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// random interger
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


module.exports = {
    read,
    readall,
    update,
    remove,
    removeAll,
    rndStr,
    add,
    generateRandomData,
    dtNow,
    filter
}