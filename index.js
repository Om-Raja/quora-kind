const express = require("express");
const mockDataPosts = require("./utils/mockdata");
const path = require("path");
const app = express();
const PORT = 8080;

app.use(
  express.urlencoded({ extended: true }),
); /* It's middleware provided by Express to parse x-www-form-urlencoded data. This type of data is typically sent by HTML forms.
When extended: true, it allows you to parse complex objects, like nested objects in the request body.*/

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
  mockDataPosts.push({ username, content });
  res.send("You have added a post successfully!");
});

app.get("/post/new", (req, res) => {
  res.render("newPost.ejs");
});

app.listen(PORT, () => {
  console.log("Listening to port: ", PORT);
});
