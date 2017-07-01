import app from './server.js';
import mongoose from 'mongoose';
import { PORT, DATABASE_URL, NODE_ENV } from './config';
let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT, env=NODE_ENV) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      // listen for requests and log when you've started doing it
      server = app.listen(port, () => {
        console.log(`Server running on http://localhost:${port} [${env}]`);
        resolve();
      }).on('error', err => {
        mongoose.disconnect();
        reject(err)
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};
