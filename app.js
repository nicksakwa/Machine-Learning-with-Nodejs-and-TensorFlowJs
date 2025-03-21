const tf = require('@tensorflow/tfjs');
const fs = require('fs').promises;
const path = require('path');

async function processCarData() {
  try {
    const filePath = path.join(__dirname, 'cardata.json');
    const data = await fs.readFile(filePath, 'utf8');
    let carData = JSON.parse(data);

    // Extract Data
    function extractData(obj) {
      return { x: obj.Horsepower, y: obj.Miles_per_Gallon };
    }
    carData = carData.map(extractData);

    // Remove Errors (Filter)
    function removeErrors(obj) {
      return obj.x != null && obj.y != null;
    }
    carData = carData.filter(removeErrors);

    // Convert to Tensors
    const horsepowerTensor = tf.tensor(carData.map((car) => car.x));
    const mpgTensor = tf.tensor(carData.map((car) => car.y));

    console.log('Processed Data:');
    carData.forEach((car, index) => {
      console.log(`Car ${index + 1}: Horsepower = ${car.x}, MPG = ${car.y}`);
    });

    console.log('\nTensorFlow Tensors:');
    horsepowerTensor.print();
    mpgTensor.print();

    // Perform TensorFlow operations (example: calculate mean)
    const horsepowerMean = horsepowerTensor.mean();
    const mpgMean = mpgTensor.mean();

    console.log('\nTensorFlow Results:');
    console.log(`Mean Horsepower: ${horsepowerMean.dataSync()[0]}`);
    console.log(`Mean MPG: ${mpgMean.dataSync()[0]}`);

    // Dispose Tensors
    horsepowerTensor.dispose();
    mpgTensor.dispose();
    horsepowerMean.dispose();
    mpgMean.dispose();
  } catch (error) {
    console.error('Error:', error);
  }
}

processCarData();