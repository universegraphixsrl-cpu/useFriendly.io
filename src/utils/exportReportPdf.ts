import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportPdfInput {
  /** Zona din pagină care se fotografiază (cardurile și graficele afișate) */
  element: HTMLElement;
  /** Titlul raportului */
  title: string;
  /** Perioada afișată, ex. „1 – 28 august 2026” */
  period: string;
  /** Cine a generat raportul */
  owner: string;
  /** Linia de context de sub titlu */
  subtitle: string;
}

/**
 * Exportă raportul păstrând grafica din aplicație: secțiunea vizibilă e
 * randată ca imagine la rezoluție dublă și așezată sub un header de brand.
 */
export async function exportReportPdf({
  element,
  title,
  period,
  owner,
  subtitle
}: ReportPdfInput) {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#f7f9fc',
    useCORS: true,
    logging: false,
    windowWidth: element.scrollWidth
  });

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 32;
  const headerHeight = 96;
  const footerHeight = 34;

  /** Header identic cu bara închisă din aplicație */
  const drawHeader = (page: number, total: number) => {
    doc.setFillColor(15, 23, 41);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');

    // Logo pătrat albastru cu inițiala F, ca în bara de sus
    doc.setFillColor(47, 107, 255);
    doc.roundedRect(margin, 26, 26, 26, 7, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('F', margin + 9, 44);

    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('Friendly', margin + 36, 44);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(title, margin, 76);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(160, 180, 220);
    doc.text(`${period} · ${owner}`, pageWidth - margin, 44, {
      align: 'right'
    });
    doc.text(subtitle, pageWidth - margin, 76, { align: 'right' });

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Generat pe ${new Date().toLocaleDateString('ro-RO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })} · Friendly CRM`,
      margin,
      pageHeight - 16
    );
    doc.text(`Pagina ${page} din ${total}`, pageWidth - margin, pageHeight - 16, {
      align: 'right'
    });
  };

  // Fundalul aplicației
  const contentWidth = pageWidth - margin * 2;
  const scale = contentWidth / canvas.width;
  const contentTop = headerHeight + 18;
  const usableHeight = pageHeight - contentTop - footerHeight;
  // Câți pixeli din captură încap pe o pagină
  const sliceHeight = Math.floor(usableHeight / scale);
  const pages = Math.max(1, Math.ceil(canvas.height / sliceHeight));

  for (let page = 0; page < pages; page += 1) {
    if (page > 0) doc.addPage();

    doc.setFillColor(247, 249, 252);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    drawHeader(page + 1, pages);

    const sliceCanvas = document.createElement('canvas');
    const currentSlice = Math.min(
      sliceHeight,
      canvas.height - page * sliceHeight
    );
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = currentSlice;
    const context = sliceCanvas.getContext('2d');
    if (context) {
      context.fillStyle = '#f7f9fc';
      context.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      context.drawImage(
        canvas,
        0,
        page * sliceHeight,
        canvas.width,
        currentSlice,
        0,
        0,
        canvas.width,
        currentSlice
      );
    }

    doc.addImage(
      sliceCanvas.toDataURL('image/png'),
      'PNG',
      margin,
      contentTop,
      contentWidth,
      currentSlice * scale,
      undefined,
      'FAST'
    );
  }

  const fileName = `raport-${period.
  toLowerCase().
  replace(/[^a-z0-9]+/g, '-').
  replace(/^-|-$/g, '')}.pdf`;
  doc.save(fileName);
}