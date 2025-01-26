const express = require("express");
const {v4: uuidv4} = require("uuid");
const methodOverride = require("method-override"); // to understand overridden method
let mockDataPosts = require("./utils/mockdata");
const path = require("path");
const app = express();
const PORT = 8080;

app.use(methodOverride("_method"));
app.use(
  express.urlencoded({ extended: true }),
); /* It's middleware provided by Express to parse x-www-form-urlencoded data. This type of data is typically sent by HTML forms.
When extended: true, it allows you to parse complex objects, like nested objects in the request body.*/
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"))); //It tells Express, "Serve files from the public folder as static resources." This middleware makes files in a specified directory accessible to the client without explicitly writing routes for them.
/* Example:
If you have a file named style.css in the public/css directory:
public/
└── css/
    └── style.css

You can directly access it in your browser at:
http://localhost:8080/css/style.css

Purpose in the project:
This makes it easy to include assets like stylesheets, images, and client-side JavaScript in your application.
*/

app.get("/post", (req, res) => {
  res.render("index.ejs", { posts: mockDataPosts });
});
app.post("/post", (req, res) => {
  let { username, content } = req.body;
  let id = uuidv4();
  mockDataPosts.unshift({ id, username, content });
  // res.send("You have added a post successfully!");
  res.redirect("/post"); //sends a GET request to the provided URL.
});

app.get("/post/new", (req, res) => {
  res.render("newPost.ejs");
});

//show route
app.get("/post/:id", (req, res)=>{
  let {id} = req.params;
  let post = mockDataPosts.find((p)=>{
    return (id == p.id); // === was throwing an error. ERROR: post is undefined, then I used ==
  });
 if(post){
   res.render("show.ejs", {post});
 }else{
  res.status(404).send("Post not found");
 }
});

//update route

// this route will send editing form when someone click edit button
app.get("/post/:id/edit", (req, res)=>{
  const {id} = req.params;
  let post = mockDataPosts.find((p)=>p.id == id);

  res.render("edit.ejs",{post});
});
//this route updates the post
app.patch("/post/:id", (req, res)=>{
  const {id} = req.params;
  const newContent = req.body.content;

  console.log(`newContent = ${newContent}`);
  let post = mockDataPosts.find((p)=>(id == p.id));
  post.content = newContent;
  console.log(post);

  res.status(200).redirect("/post");
});

//destroy route
app.delete("/post/:id", (req, res)=>{
  const {id} = req.params;
  mockDataPosts = mockDataPosts.filter((p)=>(p.id != id));
  res.status(200).redirect("/post");
});

app.listen(PORT, () => {
  console.log("Listening to port: ", PORT);
});

/* People generally don't write GitHub commit messages in the past tense because the preferred style is to use the imperative mood (present tense), which essentially acts like a command, describing what the commit does to the code rather than what the developer did to make the change. This makes it clearer and more concise when reviewing code changes and understanding the impact of a commit. */