import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

export async function imagesToPdf(imageBuffer) {
  try {

    // Convert all image formats to PNG
    const pngBuffer = await sharp(imageBuffer)
      .resize({
        width: 2000,
        withoutEnlargement: true,
      })
      .png()
      .toBuffer();

    // Create PDF
    const pdfDoc = await PDFDocument.create();

    // Embed image
    const pngImage = await pdfDoc.embedPng(pngBuffer);

    const width = pngImage.width;
    const height = pngImage.height;

    // Add PDF page
    const page = pdfDoc.addPage([width, height]);

    // Draw image
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width,
      height,
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: true,
    });

    return Buffer.from(pdfBytes);

  } catch (error) {
    console.error("PDF Conversion Error:", error);
    throw error;
  }
}