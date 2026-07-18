import "./config/dotenv.config.js";
import path from "path";
import fs from "fs";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./config/AWS.config.js";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const downloadFile = async (fileName, localPath) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
    };
    const command = new GetObjectCommand(params);
    const response = await s3.send(command);

    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(localPath);
        response.Body.pipe(fileStream)
            .on("error", reject)
            .on("finish", resolve);
    });
};

const run = async () => {
    const fileName = "temp_bb7c877bec25cafdf6326acff150009b673a1326aba5a1c0b348fe3b1de2e8ac.MOV";
    const localInput = "./temp.mov";
    const localOutput = "./output.mp4";

    console.log("Downloading from S3...");
    await downloadFile(fileName, localInput);
    console.log("Downloaded. Running ffmpeg...");

    const command = ffmpeg(localInput)
        .outputOptions([
            '-map 0:v:0',
            '-map 0:a:0?',
            '-c:v libx264',
            '-c:a aac',
            '-crf 28',
            '-preset faster',
            '-ignore_unknown',
            '-map_metadata -1',
            '-threads 4'
        ])
        .toFormat('mp4')
        .on('stderr', (line) => {
            console.log('FFmpeg stderr:', line);
        })
        .on('end', () => {
            console.log('Finished successfully.');
            // Clean up temp
            if (fs.existsSync(localInput)) fs.unlinkSync(localInput);
            if (fs.existsSync(localOutput)) fs.unlinkSync(localOutput);
        })
        .on('error', (err) => {
            console.error('Finished with error:', err.message);
            // Clean up temp
            if (fs.existsSync(localInput)) fs.unlinkSync(localInput);
        });

    command.save(localOutput);
};

run().catch(console.error);
