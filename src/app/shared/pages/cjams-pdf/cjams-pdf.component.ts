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

  ngOnInit() {
  }

  downloadPDF() {
    const pages = document.getElementsByClassName('pdf-page');
    for ( let i = 0; i < pages.length; i++) {
      html2canvas( pages[i] ).then(function (canvas) {
        const img = canvas.toDataURL('image/png');
        const doc = new jsPDF();
        doc.addImage(img, 'JPEG', 0, 0);
        doc.save('testCanvas.pdf');
      });
    }
  }

}
