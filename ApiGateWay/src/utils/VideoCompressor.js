import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";

export const compressVideo = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const tempInput = path.join(tmpdir(), `input_${Date.now()}.mp4`);
    const tempOutput = path.join(tmpdir(), `output_${Date.now()}.mp4`);

    // Write the buffer to a temp file
    fs.writeFileSync(tempInput, fileBuffer);

    // Execute FFmpeg directly
    // -crf 28: Good balance of size/quality
    // -preset veryfast: Faster compression for web requests
    const ffmpeg = spawn(ffmpegPath, [
      "-i", tempInput,
      "-vcodec", "libx264",
      "-crf", "28",
      "-preset", "veryfast",
      "-y", // Overwrite output if exists
      tempOutput
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        const compressedBuffer = fs.readFileSync(tempOutput);
        
        // Clean up
        fs.unlinkSync(tempInput);
        fs.unlinkSync(tempOutput);
        
        resolve(compressedBuffer);
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on("error", (err) => {
      if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
      reject(err);
    });
  });
};