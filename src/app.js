'use strict';
import app from './server.js';
import mongoose from 'mongoose';
import { PORT, DATABASE_URL, NODE_ENV } from './config';
let server;
mongoose.Promise = global.Promise;
//start the server and connect to mongo db
function runServer(databaseUrl=DATABASE_URL, port=PORT, env=NODE_ENV) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
/* eslint-disable no-console */
        console.log(`Server running on http://localhost:${port} [${env}]`);
/* eslint-enable no-console */
        resolve();
      })
.on('error', err => {
  mongoose.disconnect();
  reject(err);
});
    });
  });
}
//close the server and disconnect from mongo db
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
/* eslint-disable no-console */
      console.log('Closing server');
/* eslint-enable no-console */
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
/* eslint-disable no-console */
  runServer().catch(err => console.error(err));
/* eslint-enable no-console */
}

export { app, runServer, closeServer };
