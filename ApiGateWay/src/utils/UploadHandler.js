import UploadMediaFilesAws from "./MediaFilesAws/UploadMediaFilesAws.js";

const uploadCategoryParallel = async (filesArray, typeLabel) => {
  return Promise.all(
    filesArray.map(async (file) => {
      const result = await UploadMediaFilesAws(
        file.file_type,
        file.new_key,
        file.buffer
      );

      console.log(`Upload result for ${typeLabel}:`, result);

      return {
        media_id: file.media_id,
        media_file: file.new_key
      };
    })
  );
};

export default uploadCategoryParallel;