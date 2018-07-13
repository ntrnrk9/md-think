import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownModel, PaginationRequest } from '../../../../@core/entities/common.entities';
import { CommonHttpService } from '../../../../@core/services/common-http.service';
import { NewUrlConfig } from '../../newintake-url.config';
import { Subject } from 'rxjs/Rx';
import { ComplaintTypeCase } from '../_entities/newintakeSaveModel';
import { IntakePurpose, SubType } from '../_entities/newintakeModel';
import { AlertService } from '../../../../@core/services/alert.service';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

declare var $: any;
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'intake-complaint-type',
    templateUrl: './intake-complaint-type.component.html',
    styleUrls: ['./intake-complaint-type.component.scss']
})
export class IntakeComplaintTypeComponent implements OnInit {
    serviceTypes$: Observable<DropdownModel[]>;
    subServiceTypes$: Observable<DropdownModel[]>;
    servicetype: DropdownModel;
    createdCases: ComplaintTypeCase[] = [];
    caseCreationFormGroup: FormGroup;
    caseEditFormGroup: FormGroup;
    selectedPurpose: IntakePurpose;
    purposeList: IntakePurpose[];
    subServiceTypes: SubType[];
    editCase: ComplaintTypeCase;
    deleteCaseID: string;
    pdfFiles: { fileName: string; images: string[] }[] = [];
    images: string[] = [];
    @Input() purposeInputSubject$ = new Subject<IntakePurpose>();
    @Input() createdCaseInputSubject$ = new Subject<ComplaintTypeCase[]>();
    @Input() createdCaseOuptputSubject$ = new Subject<ComplaintTypeCase[]>();
    constructor(private _commonHttpService: CommonHttpService, private formBuilder: FormBuilder, private _alertService: AlertService) {}

    ngOnInit() {
        this.buildFormGroup();
        this.purposeInputSubject$.subscribe((purpose) => {
            this.selectedPurpose = purpose;
            if (purpose.teamtype) {
                this.listServicetypes(purpose.teamtype.teamtypekey);
            }

            if (purpose.intakeservreqtypeid) {
                this.listServiceSubtype(purpose.intakeservreqtypeid);
            }
            this.caseCreationFormGroup.patchValue({
                serviceType: this.selectedPurpose.intakeservreqtypeid
            });
        });
        this.createdCaseOuptputSubject$.subscribe((createdCases) => {
            if (createdCases) {
                this.createdCases = createdCases;
            } else {
                this.createdCases = [];
            }
        });
    }

    buildFormGroup() {
        this.caseCreationFormGroup = this.formBuilder.group({
            serviceType: ['', Validators.required],
            subServiceType: ['', Validators.required]
        });
        this.caseEditFormGroup = this.formBuilder.group({
            serviceType: ['', Validators.required],
            subServiceType: ['', Validators.required]
        });
    }

    listServicetypes(teamtypekey) {
        const checkInput = {
            nolimit: true,
            where: { teamtypekey: teamtypekey },
            method: 'get'
        };

        this.serviceTypes$ = this._commonHttpService.getArrayList(new PaginationRequest(checkInput), NewUrlConfig.EndPoint.Intake.IntakePurposes + '/list?filter').map((result) => {
            this.purposeList = result;
            return result.map(
                (res) =>
                    new DropdownModel({
                        text: res.description,
                        value: res.intakeservreqtypeid
                    })
            );
        });
    }

    getSelectedPurpose(purposeID): IntakePurpose {
        return this.purposeList.find((puroposeItem) => puroposeItem.intakeservreqtypeid === purposeID);
    }

    getSelectedSubtype(subTypeID): SubType {
        return this.subServiceTypes.find((subServiceType) => subServiceType.servicerequestsubtypeid === subTypeID);
    }

    listServiceSubtype(intakeservreqtypeid) {
        const checkInput = {
            include: 'servicerequestsubtype',
            nolimit: true,
            where: { intakeservreqtypeid: intakeservreqtypeid },
            method: 'get'
        };
        this.subServiceTypes$ = this._commonHttpService.getArrayList(new PaginationRequest(checkInput), NewUrlConfig.EndPoint.Intake.DATypeUrl + '/?filter').map((result) => {
            this.subServiceTypes = result[0].servicerequestsubtype;
            return result[0].servicerequestsubtype.map(
                (res) =>
                    new DropdownModel({
                        text: res.description,
                        value: res.servicerequestsubtypeid
                    })
            );
        });
    }

    loadSubServiceTypes(serviceType: DropdownModel) {
        this.listServiceSubtype(serviceType.value);
    }
    isSubTypeExists(servicerequestsubtypeid: string) {
        if (this.createdCases) {
            return this.createdCases.find((createdCase) => createdCase.subServiceTypeID === servicerequestsubtypeid);
        }
        return false;
    }

    addCase() {
        if (this.caseCreationFormGroup.valid) {
            if (this.isSubTypeExists(this.caseCreationFormGroup.value.subServiceType)) {
                this._alertService.error('Already Case created for this sub type ');
                return false;
            }
            this._commonHttpService.getArrayList({}, NewUrlConfig.EndPoint.Intake.NextnumbersUrl).subscribe((result) => {
                const complaintTypeCase: ComplaintTypeCase = new ComplaintTypeCase();
                complaintTypeCase.caseID = result['nextNumber'];
                const selectedPurpose = this.getSelectedPurpose(this.caseCreationFormGroup.value.serviceType);
                const selectedSubtype = this.getSelectedSubtype(this.caseCreationFormGroup.value.subServiceType);
                complaintTypeCase.serviceTypeID = this.caseCreationFormGroup.value.serviceType;
                complaintTypeCase.serviceTypeValue = selectedPurpose.description;
                complaintTypeCase.subServiceTypeID = selectedSubtype.servicerequestsubtypeid;
                complaintTypeCase.subSeriviceTypeValue = selectedSubtype.description;
                this.createdCases.push(complaintTypeCase);
                this.updateCreatedCases();
            });
        }
    }

    deleteCase(intakeCase: ComplaintTypeCase) {
        this.deleteCaseID = intakeCase.caseID;
    }

    onEditCase(intakeCase: ComplaintTypeCase) {
        this.caseEditFormGroup.patchValue({
            serviceType: intakeCase.serviceTypeID,
            subServiceType: intakeCase.subServiceTypeID
        });
        this.editCase = intakeCase;
    }

    updateCreatedCases() {
        this.createdCaseInputSubject$.next(this.createdCases);
    }
    isUpdateDisabled() {
        if (this.editCase) {
            return this.caseEditFormGroup.value.subServiceType === this.editCase.subServiceTypeID;
        }
        return false;
    }
    updateSubTypes() {
        if (this.caseEditFormGroup.valid) {
            if (this.isSubTypeExists(this.caseEditFormGroup.value.subServiceType)) {
                this._alertService.error('Already Case created for this sub type ');
                return false;
            }
            this.createdCases.find((complaintTypeCase) => {
                if (complaintTypeCase.caseID === this.editCase.caseID) {
                    const selectedPurpose = this.getSelectedPurpose(this.caseEditFormGroup.value.serviceType);
                    const selectedSubtype = this.getSelectedSubtype(this.caseEditFormGroup.value.subServiceType);
                    complaintTypeCase.serviceTypeID = this.caseEditFormGroup.value.serviceType;
                    complaintTypeCase.serviceTypeValue = selectedPurpose.description;
                    complaintTypeCase.subServiceTypeID = selectedSubtype.servicerequestsubtypeid;
                    complaintTypeCase.subSeriviceTypeValue = selectedSubtype.description;
                    $('#editClose').click();
                    return true;
                }
            });
        }
    }

    deleteCaseConfirm() {
        this.createdCases = this.createdCases.filter((createdCase) => createdCase.caseID !== this.deleteCaseID);
        this.updateCreatedCases();
        (<any>$('#delete-case-popup')).modal('hide');
    }

    isPeaceOrder(complaintCase: ComplaintTypeCase): boolean {
        return complaintCase.subSeriviceTypeValue === 'Peace Order';
    }
}
