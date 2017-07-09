'use strict';
import path from 'path';
import Express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import strategy from './models/config/strategy';
import { Router as userRouter } from './models/users';
import { Router as authRouter } from './models/auth';
import bodyParser from 'body-parser';
const app = Express();
app.use(morgan('common'));
app.use(Express.static(path.join(__dirname, '../build/static')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());
app.use('/login/', authRouter);
app.use('/users/', userRouter);
// app.get('*', (req, res) => {
//   console.log(path.join(__dirname, '../build/static'));
//   console.log('in here fools');
//   console.log(req.url);
//   if (req.url.includes('.css')) {
//     res.sendFile(path.join(__dirname, './static/css' + req.url));
//   } else if(req.url.includes('.js')) {
//     res.sendFile(path.join(__dirname, './static/js' + req.url));
//   } else if(req.url == '/') {
//     console.log('returning htmls');
//     res.sendFile('./index.html');
//   }
// });
export default app;
