#!/usr/bin/env node
const express = require('express');
const app = express();
const routes = require('./routes');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;

app.use(bodyParser.json())

routes(app);

app.listen(port, () => console.log('WonderQ started on port ' + port));