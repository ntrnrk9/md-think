import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';

import { DynamicObject, PaginationInfo, PaginationRequest } from '../../../@core/entities/common.entities';
import { GenericService } from '../../../@core/services/generic.service';
import { ColumnSortedEvent } from '../../../shared/modules/sortable-table/sort.service';
import { NewUrlConfig } from '../newintake-url.config';
import { MyIntakeDetails } from '../my-newintake/_entities/newintakeModel';

declare var $: any;
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'new-saveintake',
    templateUrl: './new-saveintake.component.html',
    styleUrls: ['./new-saveintake.component.scss']
})
export class NewSaveintakeComponent implements OnInit {
    paginationInfo: PaginationInfo = new PaginationInfo();
    intakes$: Observable<MyIntakeDetails[]>;
    totalRecords$: Observable<number>;
    canDisplayPager$: Observable<boolean>;
    dynamicObject: DynamicObject = {};
    private searchTermStream$ = new Subject<DynamicObject>();
    private pageStream$ = new Subject<number>();
    previousPage: number;
    constructor(private _service: GenericService<MyIntakeDetails>) {}

    ngOnInit() {
        this.getPage(1);
    }

    getPage(selectPageNumber: number) {
        const pageSource = this.pageStream$.map((pageNumber) => {
            this.paginationInfo.pageNumber = pageNumber;
            if (this.paginationInfo.pageNumber !== 1) {
                this.previousPage = pageNumber;
            } else {
                this.previousPage = this.paginationInfo.pageNumber;
            }
            return { search: this.dynamicObject, page: this.previousPage };
        });

        const searchSource = this.searchTermStream$.debounceTime(1000).map((searchTerm) => {
            this.dynamicObject = searchTerm;
            return { search: searchTerm, page: this.previousPage };
        });

        const source = pageSource
            .merge(searchSource)
            .startWith({
                search: this.dynamicObject,
                page: this.paginationInfo.pageNumber
            })
            .mergeMap((params: { search: DynamicObject; page: number }) => {
                return this._service
                    .getPagedArrayList(
                        new PaginationRequest({
                            limit: this.paginationInfo.pageSize,
                            page: selectPageNumber,
                            method: 'post',
                            where: { status: 'pending', intakenumber: '' }
                        }),
                        NewUrlConfig.EndPoint.Intake.saveIntakeUrl
                    )
                    .map((result) => {
                        return {
                            data: result.data,
                            count: result.count
                            // canDisplayPager: result.data.length > this.paginationInfo.pageSize
                        };
                    });
            })
            .share();
        this.intakes$ = source.pluck('data');
        if (this.paginationInfo.pageNumber === 1) {
            this.totalRecords$ = source.pluck('count');
            // this.canDisplayPager$ = source.pluck('canDisplayPager');
        }
    }

    pageChanged(pageInfo: any) {
        this.paginationInfo.pageNumber = pageInfo.page;
        this.paginationInfo.pageSize = pageInfo.itemsPerPage;
        if (this.paginationInfo.pageNumber !== 1) {
            this.previousPage = pageInfo.page;
        }
        // this.pageStream$.next(this.previousPage);
        this.getPage(this.paginationInfo.pageNumber);
    }
    onSorted($event: ColumnSortedEvent) {
        this.paginationInfo.sortBy = $event.sortColumn + ' ' + $event.sortDirection;
        this.pageStream$.next(this.paginationInfo.pageNumber);
    }

    onSearch(field: string, value: string) {
        this.dynamicObject[field] = { like: '%25' + value + '%25' };
        if (!value) {
            delete this.dynamicObject[field];
        }
        this.searchTermStream$.next(this.dynamicObject);
    }

    htmlToPlaintext(text) {
        // console.log(text);
        // console.log(String(text).replace(/<[^>]+>/gm, ''));
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }
}
