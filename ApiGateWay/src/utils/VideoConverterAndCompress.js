import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import fs from 'fs';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export function convertAndCompressToMp4(inputPath, outputDir) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileBaseName = path.basename(inputPath, path.extname(inputPath)).replace('temp_', '');
    const outputFilename = `${fileBaseName}_${Date.now()}.mp4`;
    const outputPath = path.join(outputDir, outputFilename);

    const stderrLines = [];

    // Using raw command options to force absolute control over FFmpeg layout ordering
    ffmpeg(inputPath)
      .outputOptions([
        '-map 0:v:0',        // EXPLICIT: Take ONLY the first video track found
        '-map 0:a:0?',       // EXPLICIT: Take ONLY the first audio track found (optional if video has no sound)
        '-c:v libx264',      // Convert the extracted video track to H.264
        '-c:a aac',          // Convert the extracted audio track to AAC
        '-crf 28',           // Compress the video track on the fly
        '-preset faster',    // Maintain quick backend thread processing
        '-vf scale=-2:\'min(1080,ih)\',fps=30', // Scale to 1080p and cap framerate to 30fps
        '-ignore_unknown',   // Crucial: Tell the global decoder engine to overlook stream #0:2
        '-map_metadata -1',  // Drop the faulty Apple data envelope
        '-threads 4'
      ])
      .toFormat('mp4')
      .on('stderr', (line) => {
        stderrLines.push(line);
      })
      .on('end', () => {
        try {
          const compressedBuffer = fs.readFileSync(outputPath);
          fs.unlinkSync(outputPath); // Clean up physical disk storage space

          resolve({
            success: true,
            buffer: compressedBuffer,
            fileName: outputFilename
          });
        } catch (readError) {
          reject(readError);
        }
      })
      .on('error', (err) => {
        console.error("FFmpeg error output:\n", stderrLines.slice(-15).join('\n'));
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