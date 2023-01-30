const { render } = require("ejs")
const express = require("express")
const mongoose = require("mongoose")
const fs = require("fs")
path = require("path")
const User = require("./model/user.js")
const Post = require("./model/post")
const app = express()
const dbURL = "mongodb+srv://armanjeet:uvraaj123@cluster0.hdfibcb.mongodb.net/?retryWrites=true&w=majority"
// register view engine
app.use(express.urlencoded({ extended: true }))
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(express.static(__dirname + "./uploads"))
app.use('/uploads', express.static('./uploads'))

app.use(bodyParser())
app.set("view engine", "ejs")
mongoose.set('strictQuery', false);
mongoose.connect(dbURL)
  .then(() => {
    console.log("mongo connected")
    app.listen(8000)
  }).catch((err) => {
    console.log(err)
  })

//registration
app.get("/", (req, res) => {
  res.render("login")
})
app.get("/signup", (req, res) => {
  res.render("signup")
})


app.post("/signup", (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  newUser.save()
    .then((result) => {
      res.send(result)
    }).catch((err) => {
      console.log(err)
    })
  res.render("login")
});

//LOGIN

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const useremail = await User.findOne({ email });
    if (useremail.password === password) {
      res.status(201).redirect('/home');
    } else {
      res.send("invalid email or password")
    }
  } catch (error) {
    res.status(400).send("invalid email or password")
  }
})

app.get('/home', (req, res) => {
  Post.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send('An error occurred', err);
    }
    else {
      res.render('home', { items: items });
    }
  });
});

var multer = require('multer');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({ storage: storage });

app.get('/posts', (req, res) => {
  res.render("posts")
});

app.post('/posts', upload.single('image'), (req, res, next) => {

  var obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
      contentType: 'image/png'
    }
  }
  Post.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    }
    else {
      // item.save();
      res.redirect('/home');
    }
  });
});
