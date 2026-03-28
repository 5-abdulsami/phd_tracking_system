const { bucket } = require('../config/firebase');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadToFirebase = (file, folder) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file provided');
    }

    const fileName = `${folder}/${uuidv4()}_${path.parse(file.originalname).name}${path.extname(file.originalname)}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (error) => {
      reject(error);
    });

    blobStream.on('finish', async () => {
      // Configuration for the public URL
      try {
        await fileUpload.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        resolve(publicUrl);
      } catch (error) {
        reject(error);
      }
    });

    blobStream.end(file.buffer);
  });
};

module.exports = {
  uploadToFirebase,
};
