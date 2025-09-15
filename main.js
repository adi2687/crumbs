const sharp = require('sharp');

sharp('IMG_9201.jpg')
  .resize({ width: 1280, height: 1280, fit: 'inside' }) // optional
  .webp({ quality: 95 }) // visually lossless
  .toFile('output.webp')
  .then(() => console.log('Visually lossless compression done'));
