const fs = require('fs');
const fse = require('fs-extra');
const mv = require('mv');
const path = require('path');
const to = require('await-to-js').default;
const Util = require('./index');

module.exports = {

  checkFileExist(file, directory, fileName) {
    file = path.join(directory, file);
    return new Promise((resolve, reject) => {
      fs.exists(file, (exists) => {
        if (exists) return reject(`Têp '${fileName}' đã tồn tại`);

        return resolve(true);
      });
    })
  },

  writeFile(file, directory, json) {
    file = path.join(directory, file);
    return new Promise((resolve, reject) => {
      fs.writeFile(file, JSON.stringify(json, null, 4), function (err) {
        if (err) return reject(err);

        return resolve(json);
      });
    })
  },

  removeFile(path, fileName) {
    return new Promise((resolve, reject) => {
      fs.exists(path, (exists) => {
        if (!exists) {
          return reject(`unable to find/delete ${fileName}`)
        }

        // console.log('File exists. Deleting now ...');
        fs.unlink(path, (err) => {
          if (err) return reject(`delete ${fileName} failed: ${err.message}`);
          return resolve();
        });
      });
    })
  },

  renameFile(oldPath, newPath, cb) {
    fs.rename(oldPath, newPath, (err) => {
      return cb(err);
    });
  },

  moveFile(oldPath, newPath, cb, overwrite = false) {
    mv(oldPath, newPath, {mkdirp: true, clobber: overwrite}, (err) => {
      cb(err);
    })
  },

  asyncMoveFile(oldPath, newPath, overwrite = false) {
    return new Promise((resolve, reject) => {
      this.moveFile(oldPath, newPath, (err) => {
        if (err) return reject(err);
        return resolve();
      }, overwrite)
    })
  },

  mkdirFolder(path, cb) {
    fs.mkdir(path, (err) => {
      if (err) {
        console.log(`mkdir '${path}' failed:`, err)
        return cb(err);
      }
      cb();
    })
  },

  async copyFolder(path, newPath) {
    let [err, rs] = await to(fse.copy(path, newPath));
    if (err) throw Error(Util.isString(err) ? err : err.message);
    console.log(`copyFolder success: ${path} to ${newPath}`);
    return true;
  },

  async removeFolder(path) {
    let [err, rs] = await to(fse.remove(path));
    if (err) throw Error(Util.isString(err) ? err : err.message);
    console.log(`removeFolder ${path} successfully`);
    return true;
  }
}
