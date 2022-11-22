//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


const homeStartingContent = "Welcome to a simple project called 'Daily Journal'. Here you will find posts on various topics.";
const aboutContent = "My love affair with coding started when I finished my studies at FET; I studied in the field of ' Electric power networks and systems'; the path I was on until then had almost nothing to do with coding. That love reaches its peak through the BILD IT program. I've found that coding makes me happier, more enthusiastic, more curious, and more enlightened. Through this process I realized that this is what I want to do for a living. I will continue to learn and expand my knowledge and definitely at some point go for a master's degree in this field. This is a simple application that I made in the process of learning.";
const contactPho1 = "+387603027691";
const contactPho2 = "+387644057974";
const contactEmail = "adnannukic3@gmail.com";
const adress = "Stari Đurđevik, Nukići bb";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


//MONGOOSE:
mongoose.connect("mongodb+srv://admin-adnan:Test123@cluster0.0wdlqcf.mongodb.net/blogDB");

const postSchema = {
  title: String,
  intro: String,
  section1Title: String,
  section1: String,
  section2Title: String,
  section2: String,
  section3Title: String,
  section3: String,
  conclusionTitle: String,
  conclusion: String
};

const Post = mongoose.model("Post", postSchema);


//HOME PAGE:
app.get("/", function (req, res) {
  
  Post.find({}, function(err, posts){
    if (err) {
      console.log(err);
  } else {
    res.render("home", { homePageContent: homeStartingContent, postsList: posts});
  }
  });

});

//ABOUT PAGE:
app.get("/about", function (req, res) {

  res.render("about", { aboutPageContent: aboutContent });
});

//CONTACT PAGE:
app.get("/contact", function (req, res) {

  res.render("contact", { contactPhone1: contactPho1, contactPhone2: contactPho2, contactEMail: contactEmail, contactAdress: adress });
});

//COMPOSE PAGE:
app.get("/compose", function (req, res) {

  res.render("compose");
});

//POST PAGE:
app.get("/post/:postName", function (req, res) {
  const requestTitle = _.lowerCase(req.params.postName);
  
  Post.findOne({title: req.params.postName.replace(/-/g, ' ')}, function(err, post) {
    const storedTitle = _.lowerCase(post.title);
    if(!err && storedTitle === requestTitle) {
      res.render("post", {wantedPostTitle: post.title, wantedPostIntro: post.intro, wantedPostSection1Title: post.section1Title, wantedPostSection1: post.section1, wantedPostSection2Title: post.section2Title, wantedPostSection2: post.section2, wantedPostSection3Title: post.section3Title, wantedPostSection3: post.section3, wantedPostConclusionTitle: post.conclusionTitle, wantedPostConclusion: post.conclusion})
    }
  });
});

//POST FROM COMPOSE TO HOME
app.post("/compose", function (req, res) {
  const newPostTitle = req.body.newPostTitle;
  const newPostIntro = req.body.newPostIntro;
  const newPostSection1Title = req.body.newPostSection1Title;
  const newPostSection1 = req.body.newPostSection1;
  const newPostSection2Title = req.body.newPostSection2Title;
  const newPostSection2 = req.body.newPostSection2;
  const newPostSection3Title = req.body.newPostSection3Title;
  const newPostSection3 = req.body.newPostSection3;
  const newPostConclusionTitle = req.body.newPostConclusionTitle;
  const newPostConclusion = req.body.newPostConclusion;


  const newPost = new Post ({
    title: newPostTitle,
    intro: newPostIntro,
    section1Title: newPostSection1Title,
    section1: newPostSection1,
    section2Title: newPostSection2Title,
    section2: newPostSection2,
    section3Title: newPostSection3Title,
    section3: newPostSection3,
    conclusionTitle: newPostConclusionTitle,
    conclusion: newPostConclusion
  });

  newPost.save(function(err){
    if(!err) {
      res.redirect("/");
    }
  });

});



app.listen(3000, function () {
  console.log("Server started on port 3000");
});
