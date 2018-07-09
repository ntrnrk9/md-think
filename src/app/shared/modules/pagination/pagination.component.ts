import * as _ from 'lodash'; // # sorry use lodash for this example (another dependency ...)
import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'pagination',
    templateUrl: './pagination.component.html',
    // directives: [ROUTER_DIRECTIVES]
})
export class PaginationComponent {
  totalPage: number = 0;

  @Input()
  params: {[key: string]: string | number} = {};

  @Input()
  total: number = 0;

  @Input()
  pageSize: number = 5;

  @Input()
  page: number = 1;

  @Output()
  goTo: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  totalPages() {
    // # 10 items per page per default
    return Math.ceil(this.total / this.pageSize);
  }

  rangeStart() {
    return Math.floor(this.page / this.pageSize) * this.pageSize + 1;
  }

  pagesRange() {
    return _.range(this.rangeStart(), Math.min(this.rangeStart() + 10, this.totalPages() + 1));
  }

  prevPage() {
    return Math.max(this.rangeStart(), this.page - 1);
  }

  nextPage() {
    return Math.min(this.page + 1, this.totalPages());
  }

  pageClicked(page: number) {
    this.goTo.next(page);
  }
}
