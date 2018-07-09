import { Component, OnInit } from '@angular/core';
import { CommonHttpService } from '../../../../@core/services';
import { DropdownModel, PaginationRequest } from '../../../../@core/entities/common.entities';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NewUrlConfig } from '../../newintake-url.config';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'intake-disposition',
    templateUrl: './intake-disposition.component.html',
    styleUrls: ['./intake-disposition.component.scss']
})
export class IntakeDispositionComponent implements OnInit {
    statusDropdownItems$: Observable<DropdownModel[]>;
    disposition: string;
    dispositionDropdownItems$: Observable<DropdownModel[]>;
    id = '1dd832cd-44cc-4487-89b1-f1fe637c07b1';
    dispositionFormGroup: FormGroup;
    date = new Date();

    constructor(private _commonHttpService: CommonHttpService, private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.dispositionFormGroup = this.formBuilder.group({
            statusid: [''],
            dispositionid: ['', Validators.required],
            statusdate: [this.date, Validators.required],
            duedate: [this.date],
            completiondate: [this.date],
            dateseen: null,
            financial: [''],
            seenwithin: [this.date],
            edl: [''],
            jointinvestigation: [''],
            investigationsummary: [''],
            visitinfo: [''],
            reviewcomments: ['']
        });
        this.loadDropdown();
    }

    private loadDropdown() {
        this.statusDropdownItems$ = this._commonHttpService
            .getArrayList(
                {
                    method: 'get',
                    nolimit: true
                },
                NewUrlConfig.EndPoint.DSDSAction.Disposition.StatusUrl + '/list/' + this.id + '?data'
            )
            .map((result) => {
                return result.map(
                    (res) =>
                        new DropdownModel({
                            text: res.description,
                            value: res.intakeserreqstatustypeid
                        })
                );
            });
    }

    onChangeTaskStatus(intakeserreqstatustypeid: string, status: string) {
        this.disposition = status;
        this.dispositionDropdownItems$ = this._commonHttpService
            .getArrayList(
                new PaginationRequest({
                    nolimit: true,
                    where: { intakeserreqstatustypeid: intakeserreqstatustypeid },
                    method: 'get'
                }),
                NewUrlConfig.EndPoint.DSDSAction.Disposition.DispositionUrl + '/list/' + this.id + '?filter'
            )
            .map((result) => {
                return result.map(
                    (res) =>
                        new DropdownModel({
                            text: res.description,
                            value: res.servicerequesttypeconfigiddispostionid
                        })
                );
            });
    }
}
