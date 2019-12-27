const puppeteer = require('puppeteer');
const ejs = require("ejs");
// const fs = require('fs')
const path = require('path');

class Pdf {
  static async renderTemplate(pathFile, data) {
    return new Promise(r => ejs.renderFile(
      path.join(process.env.PWD, pathFile),
      data,
      {}, function (err, str) {
        r(str);
      })
    );
  }

  static async makePdf(content, options = {format: 'A4', printBackground: true}) {
    let browser = await puppeteer.launch({headless: true});
    let page = await browser.newPage();
    await page.setViewport({width: 1600, height: 900});
    await page.setContent(content, {waitUntil: 'networkidle0'});
    await page.emulateMedia('screen');
    let buff = await page.pdf(options);
    browser.close();
    return buff;
  }

  static async makePdfWithTemplate(pathFile, data, options) {
    let content = await this.renderTemplate(pathFile, data);
    return await this.makePdf(content, options);
    // return content;
  }
}

module.exports = Pdf
