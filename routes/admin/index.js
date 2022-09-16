const express = require("express");
const Post = require("../../models/Post");
const router = express.Router();
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const faker = require("faker");
const {userAuthenticated} = require("../../helpers/authentication");



router.all("/*", userAuthenticated, (req, res, next)=>{
    req.app.locals.layout = "admin";
    next();

});


router.get('/', (req, res)=>{
    const promises = [
        Post.count().exec(),
        Category.count().exec(),
        Comment.count().exec()
    ];
    Promise.all(promises).then(([postCount, categoryCount, commentCount])=>{
        res.render('admin/index', {postCount: postCount, categoryCount: categoryCount, commentCount: commentCount});
    });



    //
    // Post.count({}).then(postCount=>{
    //
    //     res.render('admin/index', {postCount: postCount});
    //
    //
    // });
    //



});

// router.get("/dashboard", (req,res) => {
//     // res.send("it is working") //http://localhost:4500/
//     res.render("admin/dashboard")// render always look into views directory
// });

router.post("/generate-fake-posts", (req,res)=>{
    for(let i=0; i<req.body.amount; i++){
        let post =new Post();
        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.datatype.boolean();
        post.body = faker.lorem.sentence();
        post.slug = faker.name.title();
        post.save(function(err){

            if (err) throw err;
        });

        
    }
        res.redirect('/admin/posts');
});

module.exports = router