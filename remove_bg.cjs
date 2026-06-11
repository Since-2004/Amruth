const Jimp = require('jimp');

async function removeBackground() {
  try {
    const image = await Jimp.read('src/assets/Images/llogo.jpeg');
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is dark (near black), make it transparent
      if (red < 25 && green < 25 && blue < 25) {
        this.bitmap.data[idx + 3] = 0; // Alpha channel
      }
    });
    
    await image.writeAsync('src/assets/Images/llogo.png');
    console.log('Background removed successfully!');
  } catch (err) {
    console.error('Error:', err);
  }
}

removeBackground();
