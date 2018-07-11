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

  async downloadPDF() {
    const pages = document.getElementsByClassName('pdf-page');
    for ( let i = 0; i < pages.length; i++) {
      await html2canvas(<HTMLElement>pages.item(i) ).then((canvas) => {
        const img = canvas.toDataURL('image/png');
          console.log( this.images);
        this.images.push(img);
      });
    }
    this.convertImageToPdf();
  }

  convertImageToPdf() {
    const doc = new jsPDF();
    this.images.forEach((image, index) => {
        doc.addImage(image, 'JPEG', 0, 0);
        if ( this.images.length > index + 1) {
         doc.addPage();
        }
    });
    doc.save('testCanvas.pdf');
    this.images = [];
  }

}
