// utils/MapFilesAndData.js
import RandomName from "./RandomName.js";

const MapFilesAndData = (fileDataArray = [], filesArray = []) => {
  return fileDataArray.map((item, index) => {
    const file = filesArray[index];

    if (!file) return null;

    return {
      media_id: item.media_id,
      new_key: RandomName(), // make sure this exists or import it
      file_type: file.mimetype,
      buffer: file.buffer
    };
  }).filter(Boolean);
};

export {MapFilesAndData};