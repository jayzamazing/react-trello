import path from 'path';
import Express from 'express';
import mongoose from 'mongoose';
import { PORT, DATABASE_URL, NODE_ENV } from './config';
const app = Express();
app.use(Express.static(path.join(__dirname, '../static')));

app.get('*', function(req, res) {
  if (req.url.includes('.css')) {
    res.sendFile(path.resolve(__dirname, '../static/css' + req.url));
  } else if(req.url.includes('.js')) {
    res.sendFile(path.resolve(__dirname, '../static/js' + req.url));
  } else {
    res.sendFile(path.join(__dirname, '../static/index.html'));
  }
});

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
