const { runHttpRequest, runMemoryInterpreter } = require('../controllers/test.controller');

const setTestRoutes = (app) => {
    app.post('/api/tests/memory/run', runMemoryInterpreter);
    app.post('/api/tests/http/request', runHttpRequest);
};

module.exports = setTestRoutes;
