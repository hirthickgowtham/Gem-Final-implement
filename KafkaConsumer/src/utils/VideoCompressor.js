import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const compressVideo = (inputFilePath) => {
  return new Promise((resolve, reject) => {
    const tempDir = "./temp";
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const uniqueId = crypto.randomUUID();
    const tempOutput = path.join(tempDir, `compressed_${uniqueId}.mp4`);

    // Execute FFmpeg directly reading from input file path and writing to temp output
    const ffmpeg = spawn(ffmpegPath, [
      "-i", inputFilePath,
      "-vcodec", "libx264",
      "-crf", "28",
      "-preset", "veryfast",
      "-vf", "scale=-2:'min(1080,ih)',fps=30",
      "-map", "0:v:0",
      "-map", "0:a:0?",
      "-ignore_unknown",
      "-map_metadata", "-1",
      "-threads", "4",
      "-y",
      tempOutput
    ]);

    const stderrLines = [];
    ffmpeg.stderr.on("data", (data) => {
      stderrLines.push(data.toString());
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve({
          outputPath: tempOutput,
          fileName: `compressed_${uniqueId}.mp4`
        });
      } else {
        console.error("❌ FFmpeg process failed. Stderr output:\n", stderrLines.join(""));
        if (fs.existsSync(tempOutput)) {
          try { fs.unlinkSync(tempOutput); } catch (e) {}
        }
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on("error", (err) => {
      console.error("❌ FFmpeg error:", err);
      if (fs.existsSync(tempOutput)) {
        try { fs.unlinkSync(tempOutput); } catch (e) {}
      }
      reject(err);
    });
  });
};
