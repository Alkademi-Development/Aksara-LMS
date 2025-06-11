const compressImageFile = (file, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const filename = file?.name
        const filetype = file?.type

        reader.readAsDataURL(file);
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, img.width, img.height);
                canvas.toBlob(function(blob) {
                    // Create a File object from the blob
                    const file = new File([blob], filename, { type: filetype });

                    resolve(file);
                }, file.type, quality);
            };

        };

        reader.onerror = function(error) {
            reject(error);
            console.error(error);
        };
    });
}

export { compressImageFile }