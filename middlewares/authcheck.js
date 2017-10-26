const passport = require('passport');
const authenticated = (req, res, next) => {
  console.log('in here');
  // if (!req.isAuthenticated()) {res.redirect('/');}
  // else {next();}
  passport.authenticate('basic', {session: false}, (err, user, info) => {
    console.log('no err 1');
    console.error(err);
      if (err) {return next(err);}
      if (!user) {return res.redirect('/login');}
      req.logIn(user, function(err) {
        console.log('no err 2');
        console.error(err);
        if(err) {return next(err);}
        else {next();}
      });
  });
};
const authenticatedJWT = (req, res, next) => {
  console.log('in here');
  // if (!req.isAuthenticated()) {res.redirect('/');}
  // else {next();}
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    console.log('no err 1');
    console.error(err);
      if (err) {return next(err);}
      if (!user) {return res.redirect('/login');}
      req.logIn(user, function(err) {
        console.log('no err 2');
        console.error(err);
        if(err) {return next(err);}
        else {next();}
      });
  });
};

module.exports = {authenticated, authenticatedJWT};
