const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const server = http.createServer(function (req, res) {
    let filePath = '.' + req.url;
    
    if (filePath === './') {
        filePath = './index.html'; // Default to index.html for the root URL
    }

    // Map the URL path to the actual file system path
    filePath = path.join(__dirname, filePath);

    // Determine content type based on file extension
    const contentType = getContentType(filePath);

    fs.readFile(filePath, function (error, data) {
        if (error) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('Error: File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(data);
        }
        res.end();
    });
});

server.listen(port, function (error) {
    if (error) {
        console.log('Something went wrong', error);
    } else {
        console.log('Server is listening on port ' + port);
    }
});

function getContentType(filePath) {
    const extname = path.extname(filePath);
    switch (extname) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'text/javascript';
        default:
            return 'text/plain';
    }
}
