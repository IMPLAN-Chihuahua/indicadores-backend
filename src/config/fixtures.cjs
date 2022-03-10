const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../../uploads/tmp');

const mochaGlobalTeardown = function () {
  fs.readdir(dir, (err, files) => {
    if (err) {
      throw err;
    }
    
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      if (file === '.gitignore') {
        continue;
      }
      fs.unlink(path.join(dir, file), (error) => {
        if (error) {
          throw error;
        }
      });
    }

  });
};

module.exports = { mochaGlobalTeardown };