const ex= require('express');
const app = ex();
const User = require('./models/user');
const mongo = require('mongoose');

mongo.connect('mongodb://127.0.0.1:27017/authdemo')
    .then(()=>{
        console.log("✅");
    })
    .catch(e=>{
        console.log("❌");
        console.log(e);
    })

app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/register', (req,res)=>{
    res.render('register');
})

app.get('/secret', (req,res)=>{
    res.send("after login");
})

app.listen(5000, ()=>{
    console.log("✅");
})