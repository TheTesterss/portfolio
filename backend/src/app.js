const express = require('express');
const bodyParser = require('body-parser');
const setSubscriberRoutes = require('./routes/subscriber.route');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

setSubscriberRoutes(app);
setContactRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});