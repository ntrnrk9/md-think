import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DropdownModel, PaginationInfo } from '../../../../@core/entities/common.entities';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericService, AlertService } from '../../../../@core/services';
import { CommonHttpService } from '../../../../@core/services/common-http.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ObjectUtils } from '../../../../@core/common/initializer';
import { Subject } from 'rxjs/Rx';
import { NewUrlConfig } from '../../newintake-url.config';
import { InvolvedEntitySearchResponse, InvolvedEntitySearch } from '../_entities/newintakeModel';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'intake-entities',
    templateUrl: './intake-entities.component.html',
    styleUrls: ['./intake-entities.component.scss']
})
export class IntakeEntitiesComponent implements OnInit {
    canShowSSBG = false;
    involvedEntityData: Boolean = false;
    involvedEntitiesForm: FormGroup;
    countyDropDownItems$: Observable<DropdownModel>;
    stateDropDownItems$: Observable<DropdownModel>;
    regionDropDownItems$: Observable<DropdownModel>;
    categoryDropDownItems$: Observable<DropdownModel>;
    paginationInfo: PaginationInfo = new PaginationInfo();
    involvedEntitySearchResponses$: Observable<InvolvedEntitySearchResponse[]>;
    totalRecords$: Observable<number>;
    canDisplayPager$: Observable<boolean>;
    private pageSubject$ = new Subject<number>();
    private involvedEntitySearch: InvolvedEntitySearch;
    constructor(
        private formBuilder: FormBuilder,
        private _involvedEntitySeachService: GenericService<InvolvedEntitySearchResponse>,
        private _commonHttpService: CommonHttpService,
        private _alertService: AlertService,
        private _changeDetect: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.initilizeForm();
        this.loadDropdownItems();
    }
    initilizeForm() {
        this.involvedEntitiesForm = this.formBuilder.group({
            agencyname: [''],
            agencycategorykey: [''],
            facid: [''],
            ssbg: [''],
            // lastName: [''],
            // firstName: [''],
            // contactNum: [''],
            address1: [''],
            address2: [''],
            zipcode: [''],
            city: [''],
            region: [''],
            state: [''],
            county: [''],
            phonenumber: [''],
            isSatelliteOffice: ['']
        });
    }
    private loadDropdownItems() {
        const source = forkJoin([
            this._commonHttpService.getArrayList(
                {
                    method: 'get',
                    nolimit: true
                },
                NewUrlConfig.EndPoint.Intake.CountryListUrl + '?filter'
            ),
            this._commonHttpService.getArrayList(
                {
                    method: 'get',
                    nolimit: true
                },
                NewUrlConfig.EndPoint.Intake.StateListUrl + '?filter'
            ),
            this._commonHttpService.getArrayList(
                {
                    where: { activeflag: '1' },
                    method: 'get',
                    nolimit: true
                },
                NewUrlConfig.EndPoint.Intake.RegionListUrl + '?filter'
            ),
            this._commonHttpService.getArrayList(
                {
                    method: 'get',
                    nolimit: true
                },
                NewUrlConfig.EndPoint.Intake.AgencyCategoryUrl + '?filter'
            )
        ])
            .map((result) => {
                return {
                    counties: result[0].map(
                        (res) =>
                            new DropdownModel({
                                text: res.countyname,
                                value: res.countyname
                            })
                    ),
                    stateList: result[1].map(
                        (res) =>
                            new DropdownModel({
                                text: res.statename,
                                value: res.stateabbr
                            })
                    ),
                    regions: result[2]['data'].map(
                        (res) =>
                            new DropdownModel({
                                text: res.regionname,
                                value: res.regionid
                            })
                    ),
                    categories: result[3].map(
                        (res) =>
                            new DropdownModel({
                                text: res.description,
                                value: res.agencycategorykey
                            })
                    )
                };
            })
            .share();
        this.countyDropDownItems$ = source.pluck('counties');
        this.stateDropDownItems$ = source.pluck('stateList');
        this.regionDropDownItems$ = source.pluck('regions');
        this.categoryDropDownItems$ = source.pluck('categories');
    }
    searchInvolvedEntities(model: InvolvedEntitySearch) {
        this.involvedEntityData = true;
        this.involvedEntitySearch = model;
        this.getPage(1);
    }
    private getPage(pageNumber: number) {
        ObjectUtils.removeEmptyProperties(this.involvedEntitySearch);
        const source = this._involvedEntitySeachService
            .getAllFilter(
                {
                    limit: this.paginationInfo.pageSize,
                    order: '',
                    page: pageNumber,
                    count: this.paginationInfo.total,
                    where: this.involvedEntitySearch
                },
                NewUrlConfig.EndPoint.Intake.InvolvedEnititesSearchUrl
            )
            .map((result) => {
                this.canShowSSBG = result.data.filter((item) => item.ssbg).length !== 0;
                return {
                    data: result.data,
                    count: result.count,
                    canDisplayPager: result.count > this.paginationInfo.pageSize
                };
            })
            .share();
        this.involvedEntitySearchResponses$ = source.pluck('data');
        if (pageNumber === 1) {
            this.totalRecords$ = source.pluck('count');
            this.canDisplayPager$ = source.pluck('canDisplayPager');
        }
    }
}
