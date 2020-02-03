const express = require('express');
const app = express();
const configRoutes = require("./routes");

app.use(express.json());

let visited = {}
app.use(function(request, response, next) {

    console.log("Logger 1: Requested Method", request.method + " at URL http://localhost:3000" + request.originalUrl);
    next();
});
app.use(function(request, response, next) {

    let url = request.originalUrl;
    if (visited[url] != undefined) {
        visited[url] += 1;
    } else {
        visited[url] = 1;
    }
    console.log("Logger 2: Count of http://localhost:3000" + url + " : " + visited[url]);
    next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});