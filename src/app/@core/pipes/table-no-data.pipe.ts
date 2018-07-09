import { Pipe, PipeTransform, ElementRef } from '@angular/core';
import { DynamicObject } from '../entities/common.entities';

@Pipe({
    name: 'noDataDisplay'
})
export class NoDataDisplayPipe implements PipeTransform {
    private dynamicObject: DynamicObject = {};
    transform(value: any, elementId: string, noDataDisplayText: string): any {
        const el = <any>document.querySelector('#' + elementId);
        if (el) {
            if ((Array.isArray(value) && !value.length) || (!Array.isArray(value) && !value)) {
                if (!this.dynamicObject[elementId]) {
                    const tr = document.createElement('tr');
                    const td = document.createElement('td');
                    td.colSpan = el.parentNode.querySelectorAll('thead > tr > th').length;
                    td.textContent = noDataDisplayText;
                    tr.appendChild(td);
                    el.appendChild(tr);
                    this.dynamicObject[elementId] = true;
                }
            } else {
                for (let index = 0; index < el.children.length; index++) {
                    const element = el.children[index];
                    if (element.textContent === noDataDisplayText) {
                        el.removeChild(element);
                        this.dynamicObject[elementId] = false;
                    }
                }
            }
        }

        return value;
    }
}
