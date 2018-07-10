import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonHttpService } from '../../../../@core/services/common-http.service';
import { Observable, Subject } from 'rxjs/Rx';
import { DropdownModel, PaginationRequest } from '../../../../@core/entities/common.entities';
import { NewUrlConfig } from '../../newintake-url.config';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { EvaluationFields } from '../_entities/newintakeSaveModel';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'intake-evaluation-fields',
    templateUrl: './intake-evaluation-fields.component.html',
    styleUrls: ['./intake-evaluation-fields.component.scss']
})
export class IntakeEvaluationFieldsComponent implements OnInit {
    @Input() evalFieldsInputSubject$ = new Subject<EvaluationFields>();
    @Input() evalFieldsOutputSubject$ = new Subject<EvaluationFields>();
    intakeEvalForm: FormGroup;
    incidentDateOption: number;
    mdCountys$: Observable<DropdownModel[]>;
    offenceCategories$: Observable<DropdownModel[]>;
    oldDate = {
        beginDate: '',
        endDate: ''
    };
    maxDate = new Date();
    constructor(private formBuilder: FormBuilder, private _commonHttpService: CommonHttpService) { }

    ngOnInit() {
        this.incidentDateOption = 0;
        this.intakeEvalForm = this.formBuilder.group({
            requestdetention: false,
            petitionid: [''],
            adultpetitionid: [''],
            sourceagency: [''],
            complaintid: [''],
            wvrnumber: [''],
            offenselocation: [''],
            complaintrcddate: [''],
            arrestdate: [''],
            zipcode: [''],
            countyid: ['all'],
            allegedoffense: ['all'],
            allegedoffenseknown: [0],
            allegedoffensedate: [''],
            allegedoffensetodate: [''],
            dateUnknown: false,
            dateRange: false
        });
        this.evalFieldsOutputSubject$.subscribe((data) => {
            this.patchForm(data);
        });

        this.loadDroddowns();
        this.intakeEvalForm.valueChanges.subscribe((val) => {
            this.evalFieldsInputSubject$.next(val);
        });
    }

    private loadDroddowns() {
        const source = forkJoin([
            this._commonHttpService.getArrayList({ where: { state: 'MD' }, order: 'countyname', nolimit: true, method: 'get' }, NewUrlConfig.EndPoint.Intake.MDCountryListUrl + '?filter'),
            this._commonHttpService.getArrayList({}, NewUrlConfig.EndPoint.Intake.OffenceCategoryListUrl + '?filter={"nolimit":true}')
            // this._commonHttpService.getArrayList({}, NewUrlConfig.EndPoint.Intake.IntakeAgencies)
        ])
            .map(([sourseListResult, offenceCategoryListResult]) => {
                return {
                    sourceList: sourseListResult.map(
                        (res) =>
                            new DropdownModel({
                                text: res.countyname,
                                value: res.countyid
                            })
                    ),
                    offenceCategoryList: offenceCategoryListResult.map(
                        (res) =>
                            new DropdownModel({
                                text: res.description,
                                value: res.offensecategoryid
                            })
                    )
                };
            })
            .share();
        this.mdCountys$ = source.pluck('sourceList');
        this.offenceCategories$ = source.pluck('offenceCategoryList');
    }

    onIncidentDateOptionChange(event: boolean, option: string) {
        if (option === 'range' && event) {
            this.incidentDateOption = 2;
            this.intakeEvalForm.patchValue({
                dateUnknown: false,
                allegedoffenseknown: 2,
                allegedoffensedate: this.oldDate.beginDate,
                allegedoffensetodate: this.oldDate.endDate
            });
        } else if (option === 'range' && !event) {
            if (this.intakeEvalForm.value.dateUnknown) {
                this.incidentDateOption = 1;
                this.intakeEvalForm.patchValue({
                    allegedoffenseknown: 1,
                    allegedoffensedate: '',
                    allegedoffensetodate: ''
                });
            } else {
                this.incidentDateOption = 0;
                this.intakeEvalForm.patchValue({
                    allegedoffenseknown: 0,
                    allegedoffensedate: this.oldDate.beginDate
                });
            }
        } else if (option === 'unknown' && event) {
            this.incidentDateOption = 1;
            this.intakeEvalForm.patchValue({
                dateRange: false,
                allegedoffenseknown: 1,
                allegedoffensedate: '',
                allegedoffensetodate: ''
            });
        } else if (option === 'unknown' && !event) {
            this.incidentDateOption = 0;
            this.intakeEvalForm.patchValue({
                allegedoffenseknown: 0,
                allegedoffensedate: this.oldDate.beginDate
            });
        }
    }

    patchForm(data: EvaluationFields) {
        if (data) {
            this.intakeEvalForm.patchValue(data);
            this.intakeEvalForm.patchValue({
                complaintrcddate: data.complaintrcddate ? new Date(data.complaintrcddate) : '',
                arrestdate: data.arrestdate ? new Date(data.arrestdate) : '',
                allegedoffensedate: data.allegedoffensedate ? new Date(data.allegedoffensedate) : '',
                allegedoffensetodate: data.allegedoffensetodate ? new Date(data.allegedoffensetodate) : ''
            });
            this.incidentDateOption = data.allegedoffenseknown;
            this.oldDate.beginDate = data.allegedoffensedate;
            this.oldDate.endDate = data.allegedoffensetodate;
            if (data.allegedoffenseknown === 0) {
                this.intakeEvalForm.patchValue({
                    dateUnknown: false,
                    dateRange: false
                });
            } else if (data.allegedoffenseknown === 1) {
                this.intakeEvalForm.patchValue({
                    dateRange: false,
                    dateUnknown: true
                });
            } else if (data.allegedoffenseknown === 2) {
                this.intakeEvalForm.patchValue({
                    dateRange: true,
                    dateUnknown: false
                });
            }
        }
    }
}
