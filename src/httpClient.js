module.exports = function(req, res) {
    const response = {
        status: "ok",
        service: "devops-assignment",
        timestamp: new Date().toISOString()
    };
    res.json(response);
};