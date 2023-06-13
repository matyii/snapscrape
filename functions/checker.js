const fs = require('fs');

function checker(folders) {
  folders.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
      console.log(`Created folder: ${folder}`);
    } else {
      console.log(`Folder already exists: ${folder}`);
    }
  });
}
module.exports = checker