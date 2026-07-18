import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const compressVideo = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const tempDir = "./temp";
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const uniqueId = crypto.randomUUID();
    const tempInput = path.join(tempDir, `input_${uniqueId}.mp4`);
    const tempOutput = path.join(tempDir, `output_${uniqueId}.mp4`);

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
      "-map", "0:v:0",
      "-map", "0:a:0?",
      "-ignore_unknown",
      "-map_metadata", "-1",
      "-threads", "4",
      "-y", // Overwrite output if exists
      tempOutput
    ]);

    const stderrLines = [];
    ffmpeg.stderr.on("data", (data) => {
      stderrLines.push(data.toString());
    });

    const cleanUpFiles = () => {
      try {
        if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
        if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
      } catch (cleanupErr) {
        console.error("Error during temp files cleanup in VideoCompressor:", cleanupErr);
      }
    };

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        try {
          const compressedBuffer = fs.readFileSync(tempOutput);
          cleanUpFiles();
          resolve(compressedBuffer);
        } catch (readError) {
          cleanUpFiles();
          reject(readError);
        }
      } else {
        console.error("❌ FFmpeg process failed. Stderr output:\n", stderrLines.join(""));
        cleanUpFiles();
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on("error", (err) => {
      console.error("❌ FFmpeg error:", err);
      cleanUpFiles();
      reject(err);
    });
  });
};