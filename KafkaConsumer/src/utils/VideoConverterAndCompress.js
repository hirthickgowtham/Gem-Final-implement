import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import path from "path";
import fs from "fs";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export function convertAndCompressToMp4(inputPath, outputDir) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileBaseName = path.basename(inputPath, path.extname(inputPath)).replace("temp_", "");
    const outputFilename = `${fileBaseName}_${Date.now()}.mp4`;
    const outputPath = path.join(outputDir, outputFilename);

    const stderrLines = [];

    ffmpeg(inputPath)
      .outputOptions([
        "-map 0:v:0",
        "-map 0:a:0?",
        "-c:v libx264",
        "-c:a aac",
        "-crf 28",
        "-preset faster",
        "-vf scale=-2:'min(1080,ih)',fps=30",
        "-ignore_unknown",
        "-map_metadata -1",
        "-threads 4"
      ])
      .toFormat("mp4")
      .on("stderr", (line) => {
        stderrLines.push(line);
      })
      .on("end", () => {
        resolve({
          success: true,
          outputPath: outputPath,
          fileName: outputFilename
        });
      })
      .on("error", (err) => {
        console.error("FFmpeg error output:\n", stderrLines.slice(-15).join("\n"));
        if (fs.existsSync(outputPath)) {
          try {
            fs.unlinkSync(outputPath);
          } catch (unlinkError) {
            console.error("Failed to clean up output path on error:", unlinkError);
          }
        }
        reject(new Error(`FFmpeg error: ${err.message}`));
      })
      .save(outputPath);
  });
}
