const express = require('express');
const routes = require("./routes");

const app = express();

app.use('/api/v1/', routes);

const port = 8000;

app.listen(port, () => console.log('App listening on port ' + port));
