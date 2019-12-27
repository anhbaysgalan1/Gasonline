'use strict';

const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const methodOverride = require('method-override');

module.exports = function (app) {

  // Disable caching of scripts for easier testing
  app.use(function noCache(req, res, next) {
    if (req.url.indexOf('/scripts/') === 0) {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.header('Pragma', 'no-cache');
      res.header('Expires', 0);
    }
    next();
  });
  // app.use(errorHandler());
  app.locals.pretty = true;
  app.locals.compileDebug = true;

  // error handler
  // define as the last app.use callback
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
  });

  app.set('view engine', 'jade');
  //app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  // app.use(methodOverride());
  // app.use(cookieParser());

  app.use(require('../../../routes'));

  app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401);
      res.json({"message": err.name + ": " + err.message});
    }
  });

  // custom error handler
  app.use(function (err, req, res, next) {
    if (err.message.indexOf('not found') >= 0) return next();

    //ignore range error as well
    if (err.message.indexOf('Range Not Satisfiable') >= 0) return res.send();

    console.error(err.stack)
    res.status(500).render('500')
  })

  app.use(function (req, res, next) {
    //res.redirect('/');
    res.status(404).render('404', {url: req.originalUrl})
  })
};
