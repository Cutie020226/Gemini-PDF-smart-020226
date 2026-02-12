// We assume pdfjsLib is available on window due to the CDN script in index.html

export const getPDFDocument = async (file: File): Promise<any> => {
  const arrayBuffer = await file.arrayBuffer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjs = (window as any).pdfjsLib;
  if (!pdfjs) throw new Error("PDF.js not loaded");
  return await pdfjs.getDocument({ data: arrayBuffer }).promise;
};

export const getPageCount = async (file: File): Promise<number> => {
    const pdf = await getPDFDocument(file);
    return pdf.numPages;
};

// Renders a page to a data URL (for preview)
export const renderPageToDataURL = async (file: File, pageNum: number, scale = 0.5): Promise<string> => {
    const pdf = await getPDFDocument(file);
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
        canvasContext: context,
        viewport: viewport
    }).promise;

    return canvas.toDataURL();
};

export const extractTextFromPages = async (file: File, pageNumbers: number[]): Promise<string> => {
  try {
    const pdf = await getPDFDocument(file);
    let fullText = '';
    
    // Sort page numbers to ensure logical text order
    const sortedPages = [...pageNumbers].sort((a, b) => a - b);

    for (const pageNum of sortedPages) {
      if (pageNum > pdf.numPages || pageNum < 1) continue;
      
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
    }

    return fullText;
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    throw new Error("Failed to parse PDF.");
  }
};

export const extractTextFromPDF = async (file: File): Promise<string> => {
    // Legacy fallback: extract first 10 pages
    const count = await getPageCount(file);
    const max = Math.min(count, 10);
    const pages = Array.from({length: max}, (_, i) => i + 1);
    return extractTextFromPages(file, pages);
};