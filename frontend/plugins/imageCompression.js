// plugins/imageCompression.js

export default ({ app }, inject) => {
    // Function to compress image resolution
    const compressImage = async (imageUrl) => {
      return new Promise((resolve, reject) => {
        const image = new Image();
  
        // Load the image from the URL
        image.onload = () => {
          // Create a canvas element
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
  
          // Set the canvas dimensions to the image size
          canvas.width = image.width;
          canvas.height = image.height;
  
          // Draw the image on the canvas
          context.drawImage(image, 0, 0);
  
          // Convert the canvas content to a base64-encoded data URL
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
  
          // Resolve the promise with the compressed image data URL
          resolve(compressedDataUrl);
        };
  
        image.onerror = (error) => {
          // Reject the promise with the error message
          reject(error);
        };
  
        image.crossOrigin = 'anonymous';
        image.src = imageUrl;
      });
    };
  
    // Inject the compressImage function into the context
    inject('compressImage', compressImage);
  };
  