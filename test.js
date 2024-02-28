const loadImageAsBlob = async (imageUrl) => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return blob;
    } catch (error) {
        console.error('Error converting image to Blob:', error);
        console.error('Error converting image to Blob:', error);
        throw error;
    }
};
import axios from "axios";
const imageUrl = 'https://storage.googleapis.com/rd-bckt-media/user/dp_125_1708431743420.png';
loadImageAsBlob(imageUrl)
    .then(async (blob) => {
        console.log('Converted image to Blob:', blob);

        const formData = new FormData();
        formData.append('file', blob, 'blob.png');

        axios.post("http://localhost:4001/api/v1/user/upload-photo", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTI1LCJleHAiOjI2Mjk3NDYwMDB9.5s2oTKtGP0aLjPNXKhNqK5plj2422GyLrPo0kaj7KzI',
            }
        })
            .then((response) => {
                console.log('Response:', response.data);
            })
            .catch((error) => {
                console.error('Error:', error.message);
            });

    })
    .catch((error) => {
        // Handle error
        console.error('Error:', error);
    });
