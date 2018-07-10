import { Component, OnInit, Input, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonHttpService } from '../../../../@core/services';
import { DropdownModel, PaginationRequest } from '../../../../@core/entities/common.entities';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NewUrlConfig } from '../../newintake-url.config';
import { Subject } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { DispositionCode, DispoistionList, DispostionOutput } from '../_entities/newintakeModel';
import value from '*.json';
import * as moment from 'moment';
import { AuthService } from '../../../../@core/services/auth.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'intake-disposition',
    templateUrl: './intake-disposition.component.html',
    styleUrls: ['./intake-disposition.component.scss']
})
export class IntakeDispositionComponent implements OnInit, AfterViewInit {
    @Input() dispositionInput$ = new Subject<string>();
    @Input() dispositionOutPut$ = new Subject<DispostionOutput>();
    @Input() dispositionRetrive$ = new Subject<DispostionOutput>();
    @Input() timeReceived$ = new Subject<string>();
    statusDropdownItems$: Observable<DropdownModel[]>;
    dispositionList: DispositionCode[];
    dispositionDropDown: DropdownModel[];
    disposition: string;
    dispositionDropdownItems$: Observable<DropdownModel[]>;
    dispositionFormGroup: FormGroup;
    date = new Date();
    serviceTypeId: string;
    calculatedTime: string;
    showReason = false;
    supervisorUser: boolean;
    timeReceived: string;

    constructor(private _commonHttpService: CommonHttpService, private formBuilder: FormBuilder,
        private _authService: AuthService) { }

    ngOnInit() {
        this.dispositionForm();
        this.loadDropdown();
        this.dispositionInput$.subscribe((res) => {
            this.serviceTypeId = res;
        });
        const role = this._authService.getCurrentUser();
        if (role.role.name === 'apcs') {
            this.supervisorUser = true;
        } else {
            this.supervisorUser = false;
        }
        this.dispositionRetrive$.subscribe((data) => {
            this.dispositionFormGroup.patchValue({
                intakeserreqstatustypekey: data.intakeserreqstatustypekey,
                dispositioncode: data.dispositioncode,
                comments: data.comments ? data.comments : '',
                reason: data.reason ? data.reason : '',
            });
        });
        this.dispositionOutPut$.subscribe((data) => {
            const roleId = this._authService.getCurrentUser();
            if (roleId.role.name === 'apcs') {
                this.supervisorUser = true;
            } else {
                this.supervisorUser = false;
            }
            this.loadDropdown();
            if (data) {
                this.onChangeTaskStatus(data.intakeserreqstatustypekey);

                this.dispositionFormGroup.patchValue({
                    intakeserreqstatustypekey: data.intakeserreqstatustypekey,
                    dispositioncode: data.dispositioncode,
                    comments: data.comments
                });
            }
        });
        this.timeReceived$.subscribe((time) => {
            this.timeReceived = time;
            this.enableReasonfordelay();
        });
    }

    ngAfterViewInit() {
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
            reviewcomments: [''],
            comments: [''],
            reason: ['']
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

    changeDisp() {
        this.dispositionOutPut$.next(this.dispositionFormGroup.value);
    }
    enableReasonfordelay() {
        // this.timeReceived$.subscribe((data) => {
        //     this.timeReceived = data;
        // });
        console.log(this.timeReceived);
        // this.timeReceived = '2018-07-08T09:30:51.01';
        const time = this.timeReceived.split('.')[0].replace('T', ' ');
        const date = new Date(time);
        // this.currentTime = time.split('T')[1].split('.')[0];
        // this.receivedTime = this.currentTime.replace(':', '.');
        // const calculateValue = (date.getHours() - this.currentTime);
        const currentTime = new Date();
        const calculatedTime = moment(currentTime, 'DD/MM/YYYY HH:mm:ss').diff(moment(date, 'DD/MM/YYYY HH:mm:ss'));
        // .format('HH:mm:ss');
        const durationValue = moment.duration(calculatedTime);
        this.calculatedTime = Math.floor(durationValue.asHours()) + moment.utc(durationValue.asMilliseconds()).format(':mm:ss');
        if (+this.calculatedTime.split(':')[0] > 2) {
            this.showReason = true;
            this.dispositionFormGroup.get('reason').setValidators([Validators.required]);
            this.dispositionFormGroup.get('reason').updateValueAndValidity();
        }
        console.log(this.calculatedTime);
    }
}
