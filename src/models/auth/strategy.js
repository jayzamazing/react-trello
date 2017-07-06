import {BasicStrategy} from 'passport-http';
import User from '../users/model';
//strategy to verify the user against
export default new BasicStrategy(
  (email, password, cb) => {
    let user;
    User.findOne({email: email})
    .exec()
    .then(_user => {
      user = _user;
      //if the user does not exist
      if (!user) {
        return cb(null, false, {
          message: 'Incorrect credentials'
        });
      }
      //otherwise try and validate the password
      return user.validatePassword(password);
    })
    .then(isValid => {
      //if the password is incorrect
      if (!isValid) {
        return cb(null, false, {
          message: 'Incorrect credentials'
        });
      } else {
        return cb(null, user);
      }
    })
    .catch(err => cb(err));
  }
);
