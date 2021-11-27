let http = require('http');
let https = require('https');
let unzipper = require('unzipper');
let querystring = require('querystring')

function auth(request, response) {
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    getToken(query.code, function (info) {
        console.log(info)
        response.write(`<a href='http://localhost:8083/?token=${info.access_token}'>publish</a>`);
        response.end();
    });
}

function getToken(code, callback) {
    let request = https.request({
        hostname: "github.com",
        path: `/login/oauth/access_token?code=${code}&client_id=&client_secret=`,
        port: 443,
        method: "POST"
    }, function (response) {
        let body = ""
        response.on('data', chunk => {
            body += (chunk.toString());
        })
        response.on('end', chunk => {
            callback(querystring.parse(body));
        })
    });
    request.end();
}

function publish(request, response) {
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    getUser(query.token, info => {
        if (info.login === "frankwang") {
            request.pipe(unzipper.Extract({ path: '../server/public/' }))
        }
    });

}

function getUser(token, callback) {
    let request = https.request({
        hostname: "api.github.com",
        path: `/login/oauth/access_token?code=${code}&client_id=&client_secret=`,
        port: 443,
        method: "GET",
        headers: {
            Authorization: `token ${token}`,
            "User-Agent": 'toy-publish'
        }
    }, function (response) {
        let body = ""
        response.on('data', chunk => {
            body += (chunk.toString());
        })
        response.on('end', chunk => {
            callback(JSON.parse(body));
        })
    });
    request.end();
}


http.createServer(function (request, response) {
    if (request.url.match(/^\/auth\?/))
        return auth(request, response);
    if (request.url.match(/^\/publish\?/))
        return publish(request, response);
    // console.log("request")
    // let outFile = fs.createWriteStream("../server/public/tmp.zip");


}).listen(8082);