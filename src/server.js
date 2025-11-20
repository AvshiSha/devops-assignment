const express = require('express');
const { getStatus } = require('./httpClient');

const app = express();
const PORT = 3000;

app.get('/status', (req, res) => {
    const status = {
        status: "ok",
        service: "devops-assignment",
        timestamp: new Date().toISOString()
    };
    res.json(status);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});