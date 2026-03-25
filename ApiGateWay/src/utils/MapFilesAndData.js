const mapFilesForUpload = (fileData, files) => {
  const result = [];

  Object.keys(fileData).forEach((type) => {
    const keys = fileData[type];     // old S3 keys
    const uploadedFiles = files[type] || [];

    keys.forEach((key, index) => {
      const file = uploadedFiles[index];

      if (!file) {
        throw new Error(`${type} file missing at index ${index}`);
      }

      result.push({
        key, // old S3 key (replace file)
        buffer: file.buffer,
        mimetype: file.mimetype
      });
    });
  });

  return result;
};

export default {mapFilesForUpload};