const express=require('express');
const path=require('path');
const port=3000 //set default port

const app=express(); 
app.use(express.json()); 
const router = express.Router();
const dotenv = require("dotenv");
const mysql = require('mysql2');
const { connect } = require('http2');
const multer = require('multer')
const cors = require('cors');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const secretKey = 'your_secret_key';

const { rootCertificates } = require('tls');
const { result } = require('lodash');
app.use(cors());
app.use(cookieParser());
app.use(router);
dotenv.config();





router.use(express.json());
router.use(express.urlencoded({ extended: true })); /* encoded for get body */

app.use('/', express.static(path.join(__dirname,'html')));
app.use(express.static(path.join(__dirname, 'user')));
app.use('/', express.static(path.join(__dirname,'icon')));

app.use('/image/item', express.static(path.join(__dirname, 'image', 'item')));
app.use('/Team', express.static(path.join(__dirname,'Team')));


function authenticateToken(req, res, next) {
    const token = req.cookies.auth_token;
    if (!token) return res.redirect('/account_post?error=unauthorized');

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.redirect('/account_post?error=unauthorized');
        req.user = user;
        next();
    });
}


router.get("/admin_product", authenticateToken, (req, res) => {
    console.log("Request at /admin_product");
    res.sendFile(path.join(__dirname, 'html', 'admin', 'admin_product.html'));  // Serve HTML file
});



router.get("/edit_product" ,authenticateToken ,(req,res) => {
    console.log("/edit_product")
    res.sendFile(path.join(`${__dirname}/html/admin/edit_product.html`))
});


router.get("/add_product" ,authenticateToken ,(req,res) => {
    console.log("/add_product")
    res.sendFile(path.join(`${__dirname}/html/admin/add_product.html`))
});



router.get('/add_admin' , authenticateToken ,(req,res) => {
    console.log('/add_admin');
    res.sendFile(path.join(`${__dirname}/html/admin/add_admin.html`))
});





router.get('/user' ,authenticateToken , (req , res) => {
    console.log('/user')
    res.sendFile(path.join(`${__dirname}/html/admin/user.html`))
});

router.get('/dashboard' ,authenticateToken, (req , res) => {
    console.log('/dashboard')
    res.sendFile(path.join(`${__dirname}/html/admin/Dashboard.html`))
});

router.get('/administrators' , authenticateToken , (req , res) => {
    console.log('/administrators')
    res.sendFile(path.join(`${__dirname}/html/admin/Administrators.html`))
});

router.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/admin/edit_product.html')); 
});

router.get('/edit_admin', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/admin/edit_admin.html')); 
});



// route user

router.get('/index' , (req , res) => {
    console.log('/index')
    res.sendFile(path.join(`${__dirname}/html/user/index.html`))
});

router.get('/ourteam' , (req , res) => {
    console.log('/ourteam')
    res.sendFile(path.join(`${__dirname}/html/user/Our_team.html`))
});

router.get('/product' , (req , res) => {
    console.log('/product')
    res.sendFile(path.join(`${__dirname}/html/user/product.html`))
});

router.get('/recommend' , (req , res) => {
    console.log('/recommend')
    res.sendFile(path.join(`${__dirname}/html/user/recommend.html`))
});



router.get('/user' , (req , res) => {
    console.log('/user')
    res.sendFile(path.join(`${__dirname}/html/user/user.html`))
});

router.get('/women' , (req , res) => {
    console.log('/women')
    res.sendFile(path.join(`${__dirname}/html/user/women.html`))
});



router.get('/men' , (req , res) => {
    console.log('/men')
    res.sendFile(path.join(`${__dirname}/html/user/men.html`))
});

router.get('/add_address' , (req , res) => {
    console.log('/add_address')
    res.sendFile(path.join(`${__dirname}/html/user/add_address.html`))
});

router.get('/check_out' , (req , res) => {
    console.log('/check_out')
    res.sendFile(path.join(`${__dirname}/html/user/Check_Out.html`))
});

router.get('/create_account' , (req , res) => {
    console.log('/create_account')
    res.sendFile(path.join(`${__dirname}/html/user/create_account.html`))
});

router.get('/handbage' , (req , res) => {
    console.log('/handbage')
    res.sendFile(path.join(`${__dirname}/html/user/Handbage.html`))
});



// เส้นทาง 404 (ต้องเพิ่มไว้ท้ายสุด)
app.use((req, res) => {
    console.log(`404 - Page not found: ${req.originalUrl}`);
    res.sendFile(path.join(`${__dirname}/html/user/404.html`));
});


//listen port

app.listen(process.env.PORT ,  function(){
    console.log(`Server listening on port: ${process.env.PORT}`)
});



