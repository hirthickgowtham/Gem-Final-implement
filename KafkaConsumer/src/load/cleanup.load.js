import fs from "fs";
import path from "path";

const cleanupDirectory = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    try {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      }
      console.log(`🧹 Cleaned up directory: ${dirPath}`);
    } catch (err) {
      console.error(`Failed to clean up directory ${dirPath}:`, err);
    }
  }
};

export default function cleanupTempFiles() {
  console.log("⚙️ Running startup temporary file cleanup in KafkaConsumer...");
  cleanupDirectory("./uploads");
  cleanupDirectory("./converted");
  cleanupDirectory("./temp");
}
