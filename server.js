const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const tf = require('@tensorflow/tfjs');

const hostname = '127.0.0.1';
const port = 3000;

async function processCarData() {
  try {
    const filePath = path.join(__dirname, 'cardata.json');
    const data = await fs.readFile(filePath, 'utf8');
    let carData = JSON.parse(data);

    function extractData(obj) {
      return { x: obj.Horsepower, y: obj.Miles_per_Gallon };
    }
    carData = carData.map(extractData);

    function removeErrors(obj) {
      return obj.x != null && obj.y != null;
    }
    carData = carData.filter(removeErrors);

    return carData;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/') {
    try {
      const html = await fs.readFile('index.html', 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch (error) {
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  } else if (req.url === '/data') {
    const carData = await processCarData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(carData));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});