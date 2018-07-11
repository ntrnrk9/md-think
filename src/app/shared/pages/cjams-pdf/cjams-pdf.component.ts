import { Component, OnInit } from '@angular/core';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
@Component({
  selector: 'cjams-pdf',
  templateUrl: './cjams-pdf.component.html',
  styleUrls: ['./cjams-pdf.component.scss']
})
export class CjamsPdfComponent implements OnInit {

  constructor() { }
  images : string[] =[];
  ngOnInit() {
  }

  downloadPDF() {
    const pages = document.getElementsByClassName('pdf-page');
    for ( let i = 0; i < pages.length; i++) {
      html2canvas(<HTMLElement>pages.item(i) ).then((canvas) => {
        const img = canvas.toDataURL('image/png');
        this.images.push(img);
        console.log(pages.length, i);
        if (pages.length === i + 1) {
          this.convertImageToPdf(this.images);
        }
      });
    }
  }

  convertImageToPdf(images: string[]) {
    const doc = new jsPDF();
    images.forEach((image, index) => {
        doc.addImage(image, 'JPEG', 0, 0);
        if ( images.length > index + 1) {
         doc.addPage();
        }
    });
    doc.save('testCanvas.pdf');
  }

}
