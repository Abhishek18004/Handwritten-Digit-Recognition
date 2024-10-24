let model;
window.onload = async function() {
    model = await tf.loadLayersModel('/tsjsmodel/model.json');
    console.log('Model Loaded');
    console.log(model.summary());
};

async function preprocessImage(imageInput) {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;

            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Sets canvas size to 28x28 for resizing the image
                canvas.width = 28;
                canvas.height = 28;

                // Draws image onto canvas and convert to grayscale
                ctx.drawImage(img, 0, 0, 28, 28);
                let imgData = ctx.getImageData(0, 0, 28, 28);

                // Converts pixel data to grayscale and invert
                let grayscaleImageData = [];
                for (let i = 0; i < imgData.data.length; i += 4) {
                    let grayscale = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
                    grayscaleImageData.push(255 - grayscale);  // Inverts to grayscale
                }

                // Converts the array into a 28x28 grayscale tensor (1 channel)
                let tensor = tf.tensor(grayscaleImageData, [28, 28, 1])  // 1 means grayscale channel
                                       .toFloat()
                                       .div(255.0);  // Normalizing pixel values

                // Check the shape before reshaping
                console.log("Tensor shape before reshaping:", tensor.shape); 

                // reshaping to [1, 28, 28, 1] for model input
                tensor = tensor.reshape([1, 28, 28, 1]);

                // Checking the final tensor shape
                console.log("Final tensor shape:", tensor.shape);

                resolve(tensor);
            };

            img.onerror = function(error) {
                reject(new Error("Error loading image: " + error));
            };
        };

        reader.onerror = function(error) {
            reject(new Error("Error reading file: " + error));
        };

        reader.readAsDataURL(imageInput);
    });
}

document.getElementById('predictBtn').addEventListener('click', async () => {
    const imageInput = document.getElementById('imageUpload').files[0];

    if (imageInput) {
        try {
            const imgTensor = await preprocessImage(imageInput);
            const prediction = model.predict(imgTensor);
            const predictedDigit = prediction.argMax(-1).dataSync()[0];

            console.log('Predicted digit:', predictedDigit);

            const predictedDigitElement = document.getElementById('predictedDigit');
            predictedDigitElement.innerText = `${predictedDigit}`;
            
            const resultSection = document.getElementById('result');
            resultSection.classList.remove('hidden');
            resultSection.classList.add('show');

        } catch (error) {
            console.error('Prediction error:', error);
            alert('Error making prediction. Please try again.');
        }
    } else {
        alert('Please upload an image');
    }
});
