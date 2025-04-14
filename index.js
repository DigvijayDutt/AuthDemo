const ex= require('express');
const app = ex();
const User = require('./models/user');
const mongo = require('mongoose');
const bc = require('bcrypt');
var session  = require('express-session');

app.use(ex.urlencoded({extended:true}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

const requireLogin = (req,res,next)=>{
    if(!req.session.user_id){
        return res.redirect('/login')
    }
    next();
}

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
    req.session.user_id = user._id;
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
        req.session.user_id = user._id;
        res.redirect('/secret');
    }else{
        res.redirect("/login");
    }
})

app.get('/secret', requireLogin, (req,res)=>{
    if(req.session.user_id){
        res.render("secret");
    }else{
        res.redirect('/login');
    }
})

app.post('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
})

app.listen(5000, ()=>{
    console.log("✅");
})