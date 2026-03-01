import { jsPDF } from 'jspdf';
import { passportImages } from '../../../entities/passport';

export const ExportPassportButton = () => {
  const exportPdf = async () => {
    const pdf = new jsPDF();

    for (let i = 0; i < passportImages.length; i++) {
      const img = passportImages[i];

      if (i > 0) pdf.addPage();

      pdf.addImage(img.url, 'JPEG', 10, 10, 180, 250);
    }

    pdf.save('pet-passport.pdf');
  };

  return <button onClick={exportPdf}>📄 Экспорт в PDF</button>;
};