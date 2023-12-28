const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const serveIndex = require('serve-index')
const bodyParser = require("body-parser");
const multer = require("multer");
const formatChatMessages = require('./functions/formatter');
const checker = require("./functions/checker")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

folders = ['uploads', 'uploads/formatted', 'uploads/unformatted']
checker(folders)

const storage = multer.diskStorage({
    destination: "uploads/unformatted/",
    filename: (req, file, cb) => {
        const username = req.body.username;
        const filename = username + ".json";
        cb(null, filename);
    },
});
const upload = multer({ storage: storage });  

app.get('/', (req, res) => {
    res.render("home")
});

app.post("/", upload.single("json"), (req, res) => {
  const filePath = req.file.destination + req.file.filename;

  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading file:', err);
          return res.status(500).send('Error reading file');
      }
      const jsonData = JSON.parse(data);
      const username = req.body.username;
      formatChatMessages(jsonData, username);
      res.redirect(`/chat/${username}`);
  });
});

app.get("/chat/:username", (req, res) => {
    const username = req.params.username;
    const filePath = path.join(__dirname, 'uploads', 'formatted', `${username}.json`);
  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).redirect("/")
      }
  
      try {
        const jsonData = JSON.parse(data);
        const messages = jsonData.Messages;
  
        res.render('chat', { username, messages });
      } catch (err) {
        console.error('Error processing JSON:', err);
        return res.status(500).send('Error processing JSON');
      }
    });
  });
  
app.use(express.static("./views/"))
app.use('/assets/', serveIndex('./assets/'))

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});