var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
require('appmetrics-dash').monitor();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const callbackUrl = 'http://localhost:3000/callback';
const oauth2 = require('simple-oauth2').create({
    client: {
      id: '4275ded7-5e0e-44d7-8b4e-bbc4ab95f269',
      secret: '6a745fff-c434-4540-82f5-307882dce14e',
    },
    auth: {
      tokenHost: 'https://nopcommerceapi.azurewebsites.net/',
      tokenPath: '/api/token',
      authorizePath: '/oauth/authorize',
    },
    options: {
      authorizationMethod: 'body',
    },
  });

  // Authorization uri definition
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: callbackUrl,
    scope: ['nop_api','offline_access'],
  });

  // Initial page redirecting to Github
  app.get('/auth', (req, res) => {
    console.log(authorizationUri);
    res.redirect(authorizationUri);
  });

  // Callback service parsing the authorization token and asking for the access token
  app.get('/callback', async (req, res) => {
    const { code } = req.query;
    const options = {
      code,
      redirect_uri: callbackUrl,
    };

    try {
      const result = await oauth2.authorizationCode.getToken(options);

      console.log('The resulting token: ', result);

      const accessTokenResult = oauth2.accessToken.create(result);
      const jsonToken = JSON.stringify(accessTokenResult.token);

      return res.status(200);
    } catch (error) {
      console.error('Access Token Error', error.message);
      console.log(error.message);
      return res.status(500).json('Authentication failed');
    }
  });

  app.get('/login', (req, res) => {
    res.send('Hello<br><a href="/auth">Log in with nopommerce</a>');
  });




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
