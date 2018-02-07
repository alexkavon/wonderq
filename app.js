const express = require('express');
const app = express();
const routes = require('./routes');
const port = process.env.PORT || 8080;

routes(app);

app.listen(port, () => console.log('WonderQ started on port ' + port));