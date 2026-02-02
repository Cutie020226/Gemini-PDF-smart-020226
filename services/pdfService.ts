// We assume pdfjsLib is available on window due to the CDN script in index.html
// This avoids complex bundler issues with the worker file.

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfjs = (window as any).pdfjsLib;
    if (!pdfjs) throw new Error("PDF.js not loaded");

    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    // Limit to first 10 pages for demo performance, or read all
    const maxPages = Math.min(pdf.numPages, 10);
    
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    throw new Error("Failed to parse PDF.");
  }
};