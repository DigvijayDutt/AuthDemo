const ex= require('express');
const app = ex();
const User = require('./models/user');
const mongo = require('mongoose');
const bc = require('bcrypt');

app.use(ex.urlencoded({extended:true}));

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

app.get('/',(req,res)=>{
    res.send("Home");
})

app.get('/register', (req,res)=>{
    res.render('register');
})

app.post('/register', async(req,res)=>{
    const {password, username} = req.body;
    const hash = await bc.hash(password, 12);
    const user = new User({
        username,
        password: hash,
    })
    await user.save();
    res.redirect('/');
})

app.get('/login',(req,res)=>{
    res.render('login')
})
app.post('/login',async(req,res)=>{
    const {username,password} = req.body;
    const user = await User.findOne({username});
    const check = await bc.compare(password, user.password);
    if(check){
        res.redirect('/');
    }else{
        res.send("Try again");
    }
})

app.get('/secret', (req,res)=>{
    res.send("after login");
})

app.listen(5000, ()=>{
    console.log("✅");
})