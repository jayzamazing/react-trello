import path from 'path';
import Express from 'express';
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

export default app;
