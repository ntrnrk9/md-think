import value from '*.json';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';

import { DropdownModel, PaginationRequest } from '../../../../@core/entities/common.entities';
import { CommonHttpService } from '../../../../@core/services';
import { AuthService } from '../../../../@core/services/auth.service';
import { DispositionCode, DispostionOutput } from '../_entities/newintakeModel';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'intake-disposition',
    templateUrl: './intake-disposition.component.html',
    styleUrls: ['./intake-disposition.component.scss']
})
export class IntakeDispositionComponent implements OnInit, AfterViewInit, AfterViewChecked {
    @Input() dispositionInput$ = new Subject<string>();
    @Input() dispositionOutPut$ = new Subject<DispostionOutput>();
    @Input() dispositionRetrive$ = new Subject<DispostionOutput>();
    @Input() timeReceived$ = new Subject<string>();
    statusDropdownItems$: Observable<DropdownModel[]>;
    dispositionList: DispositionCode[];
    dispositionDropDown: DropdownModel[];
    supDispositionDropDown: DropdownModel[];
    disposition: string;
    dispositionDropdownItems$: Observable<DropdownModel[]>;
    dispositionFormGroup: FormGroup;
    date = new Date();
    serviceTypeId: string;
    calculatedTime: string;
    showReason = false;
    supervisorUser: boolean;
    timeReceived: string;
    showStatus = true;

    constructor(private _commonHttpService: CommonHttpService, private formBuilder: FormBuilder, private _authService: AuthService, private _changeDetect: ChangeDetectorRef) {}

    ngOnInit() {
        this.dispositionForm();
        this.loadDropdown();
        this.dispositionInput$.subscribe((res) => {
            this.serviceTypeId = res;
        });
        const role = this._authService.getCurrentUser();
        if (role.role.name === 'apcs') {
            this.supervisorUser = true;
            this.dispositionFormGroup.get('intake');
        } else {
            this.supervisorUser = false;
        }
        this.dispositionOutPut$.subscribe((data) => {
            const roleId = this._authService.getCurrentUser();
            if (roleId.role.name === 'apcs') {
                this.supervisorUser = true;
                this.showStatus = false;
            } else {
                this.supervisorUser = false;
            }
            this._commonHttpService
                .getArrayList(
                    new PaginationRequest({
                        nolimit: true,
                        where: { intakeservreqtypeid: '247a8b26-cdee-4ce8-b36e-b37e49fd0103', servicerequestsubtypeid: 'ca495817-fdf6-41d9-9b37-43a933f2d2fe' },
                        method: 'get'
                    }),
                    'Intakeservicerequestdispositioncodes/getdispositionstatus?filter'
                )
                .subscribe((result) => {
                    this.dispositionList = result;
                    if (data) {
                        if (data.intakeserreqstatustypekey) {
                            this.onChangeTaskStatus(data.intakeserreqstatustypekey);

                            this.dispositionFormGroup.patchValue({
                                intakeserreqstatustypekey: data.intakeserreqstatustypekey,
                                dispositioncode: data.dispositioncode,
                                comments: data.comments
                            });
                        }
                        if (data.supStatus) {
                            this.supOnChangeTaskStatus(data.supStatus);

                            this.dispositionFormGroup.patchValue({
                                reason: data.reason,
                                supStatus: data.supStatus,
                                supDisposition: data.supDisposition,
                                supComments: data.supComments
                            });
                        }
                    }
                });
        });
        this.timeReceived$.subscribe((time) => {
            this.timeReceived = time;
            this.enableReasonfordelay();
        });
    }

    ngAfterViewInit() {}
    ngAfterViewChecked() {
        this._changeDetect.detectChanges();
    }
    dispositionForm() {
        this.dispositionFormGroup = this.formBuilder.group({
            intakeserreqstatustypekey: ['', Validators.required],
            dispositioncode: ['', Validators.required],
            statusdate: [this.date],
            duedate: [this.date],
            completiondate: [this.date],
            dateseen: null,
            financial: [''],
            seenwithin: [this.date],
            edl: [''],
            jointinvestigation: [''],
            investigationsummary: [''],
            visitinfo: [''],
            supStatus: [''],
            supDisposition: [''],
            supComments: [''],
            comments: [''],
            reason: [''],
            isDelayed: [false]
        });
    }

    loadDropdown() {
        this.statusDropdownItems$ = this._commonHttpService
            .getArrayList(
                new PaginationRequest({
                    nolimit: true,
                    where: { intakeservreqtypeid: '247a8b26-cdee-4ce8-b36e-b37e49fd0103', servicerequestsubtypeid: 'ca495817-fdf6-41d9-9b37-43a933f2d2fe' },
                    method: 'get'
                }),
                'Intakeservicerequestdispositioncodes/getdispositionstatus?filter'
            )
            .map((result) => {
                this.dispositionList = result;
                return result.map(
                    (res) =>
                        new DropdownModel({
                            text: res.description,
                            value: res.intakeserreqstatustypekey
                        })
                );
            });
    }

    onChangeTaskStatus(id: any) {
        this.dispositionDropDown = [];
        this.dispositionList.map((data) => {
            if (data.intakeserreqstatustypekey === id) {
                this.dispositionDropDown = data.servicerequesttypeconfigdispositioncode.map(
                    (res) =>
                        new DropdownModel({
                            text: res.description,
                            value: res.dispositioncode
                        })
                );
            }
        });
    }
    supOnChangeTaskStatus(id: any) {
        this.supDispositionDropDown = [];
        this.dispositionList.map((data) => {
            if (data.intakeserreqstatustypekey === id) {
                this.supDispositionDropDown = data.servicerequesttypeconfigdispositioncode.map(
                    (res) =>
                        new DropdownModel({
                            text: res.description,
                            value: res.dispositioncode
                        })
                );
            }
        });
    }

    changeDisp() {
        this.dispositionRetrive$.next(this.dispositionFormGroup.value);
    }
    enableReasonfordelay() {
        // const time = this.timeReceived.split('.')[0].replace('T', ' ');
        // const date = new Date(time);
        // const currentTime = new Date();
        // const calculatedTime = moment(currentTime, 'DD/MM/YYYY HH:mm:ss').diff(moment(date, 'DD/MM/YYYY HH:mm:ss'));
        // const durationValue = moment.duration(calculatedTime);
        // this.calculatedTime = Math.floor(durationValue.asHours()) + moment.utc(durationValue.asMilliseconds()).format(':mm:ss');
        // if (+this.calculatedTime.split(':')[0] > 2) {
        if (this.timeReceived === 'Overdue') {
            this.dispositionFormGroup.patchValue({ isDelayed: true });
            this.showReason = true;
            this.dispositionFormGroup.get('reason').setValidators([Validators.required]);
            this.dispositionFormGroup.get('reason').updateValueAndValidity();
        } else {
            this.dispositionFormGroup.get('reason').clearValidators();
            this.dispositionFormGroup.get('reason').updateValueAndValidity();
            this.dispositionFormGroup.patchValue({ isDelayed: false });
        }
    }
}
