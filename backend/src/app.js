const express = require('express');
const bodyParser = require('body-parser');
const setContactRoutes = require('./routes/contact.route');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

setContactRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
