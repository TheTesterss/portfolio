const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const setContactRoutes = require('./routes/contact.route');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS. In production you may want to set a specific origin via
// the FRONTEND_ORIGIN environment variable instead of allowing all origins.
const corsOptions = {
    origin: process.env.FRONTEND_ORIGIN || '*'
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

setContactRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
