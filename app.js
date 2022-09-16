// Step 1: Creating a server
const express = require("express"); //by default require goes to check node_module folder for any module installation
const app = express(); //Creating app using express
const path = require("path");
const exprshbr  = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const {allowInsecurePrototypeAccess} =require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars");
const methodOverride =require("method-override");
const upload = require("express-fileupload");
const session = require("express-session");
const flash = require("connect-flash");
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');

mongoose.connect(mongoDbUrl).then((db)=>{
    
        console.log("MONGO connected");
    
    }).catch(error=>console.log("Could not connect"));
    
// mongoose.Promise =global.Promise;

// mongoose.connect("mongodb://127.0.0.1:27017/cms", {useNewUrlParser: true}).then((db)=>{
    
//     console.log("MONGO connected");

// }).catch(error=>console.log("Could not connect"));

app.use(express.static(path.join(__dirname, "public"))); // we want app.js to use file inside public folder. thatis why we connected.

//set view engine

const {select, GenerateTime, paginate} = require("./helpers/handlebars-helpers");
app.engine("handlebars", exprshbr.engine({handlebars:allowInsecurePrototypeAccess(Handlebars), defaultLayout: "home", helpers: {select: select, GenerateTime: GenerateTime, paginate: paginate}}));// this by default will lokk home.handlebars(no need to use extension)
app.set('view engine', 'handlebars');

//Upload middlewares
app.use(upload());

//Body Parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Method override
app.use(methodOverride('_method'));

app.use(session({
    secret: 'neha123nodejs',
    resave: true,
    saveUninitialized: true

}));

app.use(flash());

// PASSPORT

app.use(passport.initialize());
app.use(passport.session());

//local variables using middlewares

app.use((req,res,next)=>{
    res.locals.success_message = req.flash('success-message');
    next();
})

// Local Variables using Middleware


app.use((req, res, next)=>{

    res.locals.user = req.user || null;

    res.locals.success_message = req.flash('success_message');

    res.locals.error_message = req.flash('error_message');

    res.locals.form_errors = req.flash('form_errors');

    res.locals.error = req.flash('error');

    next();


});

//Load routes
const home = require("./routes/home/index");
const admin = require("./routes/admin/index");
const posts = require("./routes/admin/posts");
const categories = require('./routes/admin/categories');
const comments= require('./routes/admin/comments');

//Use routes
app.use("/", home);
app.use("/admin", admin);
app.use("/admin/posts", posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);


const PORT = process.env.PORT || 4500;

app.listen(PORT, () =>{
    console.log(`listening to ${PORT}`);
}); //binds itself with the specified host and port to bind and listen for any connections. localhost/4000


