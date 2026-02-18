import fs from 'fs';

export class PdfUtils {

  static async extractText(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found at path: ${filePath}`);
    }

    const pdfParse = require('pdf-parse') as (
      dataBuffer: Buffer,
      options?: Record<string, unknown>
    ) => Promise<{ text: string; numpages: number }>;

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  static async assertContains(filePath: string, keywords: readonly string[]): Promise<void> {
    const text = await PdfUtils.extractText(filePath);
    const lowerText = text.toLowerCase();

    const missing: string[] = [];
    for (const keyword of keywords) {
      if (!lowerText.includes(keyword.toLowerCase())) {
        missing.push(keyword);
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `PDF assertion failed. Missing keywords: [${missing.join(', ')}]\n` +
          `PDF path: ${filePath}\n` +
          `Extracted text (first 500 chars): ${text.slice(0, 500)}`
      );
    }
  }

  static getFileSizeBytes(filePath: string): number {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    return fs.statSync(filePath).size;
  }

  static isValidFile(filePath: string): boolean {
    return fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
  }
}
