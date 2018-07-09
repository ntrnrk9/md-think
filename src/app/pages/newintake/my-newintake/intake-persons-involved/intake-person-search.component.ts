import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InvolvedPersonSearchResponse, InvolvedPersonSearch, PersonDsdsAction, PersonRelativeDetails, AddressDetails, InvolvedPerson } from '../_entities/newintakeModel';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { ObjectUtils } from '../../../../@core/common/initializer';
import { DropdownModel, PaginationInfo, PaginationRequest } from '../../../../@core/entities/common.entities';
import { CommonHttpService } from '../../../../@core/services/common-http.service';
import { GenericService } from '../../../../@core/services/generic.service';
import { NewUrlConfig } from '../../newintake-url.config';
import { AlertService } from '../../../../@core/services/alert.service';
import { Subject } from 'rxjs/Subject';
import { ValidationService } from '../../../../@core/services/validation.service';
declare var $: any;
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'intake-person-search',
    templateUrl: './intake-person-search.component.html',
    styleUrls: ['./intake-person-search.component.scss']
})
export class IntakePersonSearchComponent implements OnInit {
    selectedPerson: any;
    @Input() intakeNumber: string;
    @Output() intakePersonAdd = new EventEmitter();
    @Output() newPersonAdd = new EventEmitter();
    roleDropdownItems$: Observable<DropdownModel[]>;
    stateDropdownItems$: Observable<DropdownModel[]>;
    relationShipToRADropdownItems$: Observable<DropdownModel[]>;
    involvedPersonSearchForm: FormGroup;
    personSearchAddForm: FormGroup;
    involvedPersondata = false;
    showPersonDetail = -1;
    involvedPersonSearchResponses$: Observable<InvolvedPersonSearchResponse[]>;
    personDSDSActions$: Observable<PersonDsdsAction[]>;
    personRelations$: Observable<PersonRelativeDetails[]>;
    personAddresses$: Observable<AddressDetails[]>;
    genderDropdownItems$: Observable<DropdownModel[]>;
    totalRecords$: Observable<number>;
    canDisplayPager$: Observable<boolean>;
    paginationInfo: PaginationInfo = new PaginationInfo();
    profileDetails: InvolvedPersonSearchResponse;
    private pageStream$ = new Subject<number>();
    private involvedPersonSearch: InvolvedPersonSearch;
    constructor(
        private _formBuilder: FormBuilder,
        private _alertService: AlertService,
        private _commonHttpService: CommonHttpService,
        private _involvedPersonSeachService: GenericService<InvolvedPersonSearchResponse>
    ) {}

    ngOnInit() {
        this.initiateFormGroup();
        this.loadDropDown();
        this.pageStream$.subscribe((pageNumber) => {
            this.paginationInfo.pageNumber = pageNumber;
            this.getPage(this.paginationInfo.pageNumber);
        });
    }

    initiateFormGroup() {
        this.personSearchAddForm = this._formBuilder.group({
            Lastname: [''],
            Firstname: [''],
            Middlename: [''],
            Gender: [''],
            Dob: [''],
            Role: [''],
            RelationshiptoRA: [''],
            dangerToSelf: [''],
            dangerToSelfReason: [''],
            dangerToWorker: [''],
            dangerToWorkerReason: [''],
            mentalImpaired: [''],
            mentalImpairedReason: [''],
            mentalIllness: [''],
            mentalIllnessReason: ['']
        });
        this.involvedPersonSearchForm = this._formBuilder.group({
            lastname: [''],
            firstname: [''],
            maidenname: [''],
            gender: [''],
            dob: [''],
            dateofdeath: [''],
            ssn: [''],
            mediasrc: [''],
            mediasrctxt: [''],
            occupation: [''],
            dl: [''],
            stateid: [''],
            address1: [''],
            address2: [''],
            zip: [''],
            city: [''],
            county: [''],
            selectedPerson: [''],
            cjisnumber: [''],
            complaintnumber: [''],
            fein: [''],
            age: [''],
            email: ['', [ValidationService.mailFormat]],
            phone: [''],
            petitionid: [''],
            alias: [''],
            oldId: ['']
        });
    }
    searchPersonDetailsRow(id: number, model: PersonDsdsAction) {
        this.searchPersonDetails(id);
        this.getPersonDSDSAction(model);
    }
    searchPersonDetails(id: number) {
        if (this.showPersonDetail !== id) {
            this.showPersonDetail = id;
        } else {
            this.showPersonDetail = -1;
        }
    }
    private loadDropDown() {
        const source = forkJoin([
            this._commonHttpService.getArrayList(
                {
                    where: { activeflag: 1 },
                    method: 'get',
                    nolimit: true
                },
                NewUrlConfig.EndPoint.Intake.EthnicGroupTypeUrl + '?filter'
            ),
            this._commonHttpService.getArrayList(
                {
                    where: { activeflag: 1 },
                    method: 'get',
                    nolimit: true
                },
                NewUrlConfig.EndPoint.Intake.GenderTypeUrl + '?filter'
            ),
            this._commonHttpService.getArrayList(
                {
                    where: { activeflag: 1 },
                    method: 'get',
                    nolimit: true
                },
                NewUrlConfig.EndPoint.Intake.ActorTypeUrl + '?filter'
            ),
            this._commonHttpService.getArrayList(
                {
                    where: { activeflag: 1 },
                    method: 'get',
                    nolimit: true
                },
                NewUrlConfig.EndPoint.Intake.RelationshipTypesUrl + '?filter'
            ),
            this._commonHttpService.getArrayList(
                {
                    method: 'get',
                    nolimit: true
                },
                NewUrlConfig.EndPoint.Intake.StateListUrl + '?filter'
            )
        ])
            .map((result) => {
                return {
                    ethinicities: result[0].map(
                        (res) =>
                            new DropdownModel({
                                text: res.typedescription,
                                value: res.ethnicgrouptypekey
                            })
                    ),
                    genders: result[1].map(
                        (res) =>
                            new DropdownModel({
                                text: res.typedescription,
                                value: res.gendertypekey
                            })
                    ),
                    roles: result[2].map(
                        (res) =>
                            new DropdownModel({
                                text: res.typedescription,
                                value: res.actortype
                            })
                    ),
                    relationShipToRAs: result[3].map(
                        (res) =>
                            new DropdownModel({
                                text: res.description,
                                value: res.relationshiptypekey
                            })
                    ),
                    states: result[4].map(
                        (res) =>
                            new DropdownModel({
                                text: res.statename,
                                value: res.stateabbr
                            })
                    )
                };
            })
            .share();
        this.genderDropdownItems$ = source.pluck('genders');
        this.roleDropdownItems$ = source.pluck('roles');
        this.relationShipToRADropdownItems$ = source.pluck('relationShipToRAs');
        this.stateDropdownItems$ = source.pluck('states');
    }
    searchInvolvedPersons(model: InvolvedPersonSearch) {
        this.showPersonDetail = -1;
        this.selectedPerson = '';
        if (model.dob) {
            const event = new Date(model.dob);
            model.dob = event.getMonth() + 1 + '/' + event.getDate() + '/' + event.getFullYear();
        }
        this.involvedPersondata = true;
        this.involvedPersonSearch = Object.assign(new InvolvedPersonSearch(), model);
        this.involvedPersonSearch.intakeNumber = this.intakeNumber;
        if (this.involvedPersonSearchForm.value.address1) {
            this.involvedPersonSearch.address = this.involvedPersonSearchForm.value.address1 + '' + this.involvedPersonSearchForm.value.address2;
        }
        this.involvedPersonSearch.stateid = this.involvedPersonSearchForm.value.dl;
        this.getPage(1);
        this.tabNavigation('searchresult');
    }
    private getPage(pageNumber: number) {
        ObjectUtils.removeEmptyProperties(this.involvedPersonSearch);
        const source = this._involvedPersonSeachService
            .getPagedArrayList(
                {
                    limit: this.paginationInfo.pageSize,
                    order: this.paginationInfo.sortBy,
                    page: pageNumber,
                    count: this.paginationInfo.total,
                    where: this.involvedPersonSearch,
                    method: 'post'
                },
                NewUrlConfig.EndPoint.Intake.GlobalPersonSearchUrl
            )
            .map((result) => {
                return {
                    data: result.data,
                    count: result.count,
                    canDisplayPager: result.count > this.paginationInfo.pageSize
                };
            })
            .share();
        this.involvedPersonSearchResponses$ = source.pluck('data');
        if (pageNumber === 1) {
            this.totalRecords$ = source.pluck('count');
            this.canDisplayPager$ = source.pluck('canDisplayPager');
        }
    }

    clearPersonSearch() {
        this.involvedPersonSearchForm.reset();
        this.involvedPersonSearchForm.patchValue({
            occupation: '',
            gender: '',
            mediasrctxt: '',
            stateid: ''
        });
        this.personSearchAddForm.reset();
        this.personSearchAddForm.patchValue({
            Role: '',
            RelationshiptoRA: ''
        });
    }

    getPersonDSDSAction(model: PersonDsdsAction) {
        const url = NewUrlConfig.EndPoint.Intake.IntakeServiceRequestsUrl + `?personid=` + model.personid + '&filter';
        const source = this._commonHttpService
            .getArrayList(
                new PaginationRequest({
                    method: 'get',
                    where: { intakerequestid: null }
                }),
                url
            )
            .share();
        this.personDSDSActions$ = source.pluck('data');
    }

    getPersonRelations(personid) {
        const url = NewUrlConfig.EndPoint.Intake.PersonRelativeUrl + '/list?filter';
        this.personRelations$ = this._commonHttpService.getArrayList(
            new PaginationRequest({
                method: 'get',
                where: { personid: personid }
            }),
            url
        );
    }
    getPersonAddress(personid) {
        const url = NewUrlConfig.EndPoint.Intake.PersonAddressesUrl + '?filter';
        this.personAddresses$ = this._commonHttpService.getArrayList(
            new PaginationRequest({
                method: 'get',
                where: { personid: personid },
                include: { relation: 'Personaddresstype', scope: { fields: ['typedescription'] } }
            }),
            url
        );
    }
    selectPerson(row) {
        this.selectedPerson = row;
    }
    addSearchPerson() {
        if (this.selectedPerson) {
            this.personSearchAddForm.patchValue({
                Lastname: this.selectedPerson.lastname,
                Firstname: this.selectedPerson.firstname,
                Middlename: this.selectedPerson.middlename,
                Gender: this.selectedPerson.gendertypekey,
                Dob: this.selectedPerson.dob
            });
            // console.log(this.selectedPerson);
            this.tabNavigation('reporterrole');
        } else {
            this._alertService.warn('Please select a person');
        }
    }
    addPerson(involvedPerson: InvolvedPerson) {
        if (this.personSearchAddForm.valid && this.personSearchAddForm.dirty) {
            // console.log(involvedPerson);
            this.intakePersonAdd.emit(involvedPerson);
            this.clearSearchDetails();
        } else {
            this._alertService.warn('Please fill mandatory fields');
        }
    }
    addNewPerson() {
        this.newPersonAdd.emit();
        this.tabNavigation('profileinfo');
        (<any>$('#intake-findperson')).modal('hide');
    }
    clearSearchDetails() {
        this.involvedPersonSearchResponses$ = Observable.empty();
        this.tabNavigation('profileinfo');
        (<any>$('#intake-findperson')).modal('hide');
        this.clearPersonSearch();
    }

    viewProfileDetails(vieeDetails: InvolvedPersonSearchResponse) {
        (<any>$('#info-details')).modal('show');
        this.profileDetails = vieeDetails;
    }
    closeInformation() {
        (<any>$('#info-details')).modal('hide');
    }
    pageChanged(event: any) {
        this.paginationInfo.pageNumber = event.page;
        this.paginationInfo.pageSize = event.itemsPerPage;
        this.pageStream$.next(this.paginationInfo.pageNumber);
    }
    disabledInput(state, inputfield) {
        if (state) {
            this.personSearchAddForm.get(inputfield).disable();
        } else {
            this.personSearchAddForm.get(inputfield).enable();
        }
    }
    tabNavigation(id) {
        (<any>$('#' + id )).click();
    }
}
