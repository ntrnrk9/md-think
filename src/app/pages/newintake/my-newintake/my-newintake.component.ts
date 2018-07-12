import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Subject } from 'rxjs/Rx';

import { ControlUtils } from '../../../@core/common/control-utils';
import { ObjectUtils } from '../../../@core/common/initializer';
import { DropdownModel, PaginationRequest } from '../../../@core/entities/common.entities';
import { AlertService } from '../../../@core/services/alert.service';
import { AuthService } from '../../../@core/services/auth.service';
import { CommonHttpService } from '../../../@core/services/common-http.service';
import { SpeechRecognizerService } from '../../../shared/modules/web-speech/shared/services/speech-recognizer.service';
import { NewUrlConfig } from '../newintake-url.config';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import {
    CrossReference,
    CrossReferenceSearchResponse,
    DispostionOutput,
    IntakeDATypeDetail,
    IntakePurpose,
    IntakeTemporarySaveModel,
    InvolvedEntitySearchResponse,
    InvolvedPerson,
    Narrative,
    NarrativeIntake,
    Recording,
    ReviewStatus
} from './_entities/newintakeModel';
import { Agency, AttachmentIntakes, ComplaintTypeCase, DATypeDetail, EvaluationFields, General, IntakeScreen, Person } from './_entities/newintakeSaveModel';
import { IntakeAssessmentComponent } from './intake-assessment/intake-assessment.component';
import { IntakeAttachmentsComponent } from './intake-attachments/intake-attachments.component';

declare var $: any;
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'my-newintake',
    templateUrl: './my-newintake.component.html',
    styleUrls: ['./my-newintake.component.scss']
})
export class MyNewintakeComponent implements OnInit, AfterViewInit, AfterContentInit {
    departmentActionIntakeFormGroup: FormGroup;
    intakeSourceList$: Observable<DropdownModel[]>;
    intakeCommunication$: Observable<DropdownModel[]>;
    intakeAgencies$: Observable<DropdownModel[]>;
    intakePurpose$: Observable<DropdownModel[]>;
    intakeServices$: Observable<DropdownModel[]>;
    intakeId: string;
    narrativeInputSubject$ = new Subject<Narrative>();
    finalNarrativeText$ = new Subject<string>();
    narrativeOutputSubject$ = new Subject<Narrative>();
    addAttachementSubject$ = new Subject<AttachmentIntakes[]>();
    narrativeDetails: Narrative = new Narrative();
    addPerson: string;
    draftId: string;
    btnDraft: boolean;
    intakeNumber: string;
    intakeNumberNarrative: string;
    general: General = new General();
    reviewstatus: ReviewStatus = new ReviewStatus();
    narrative: NarrativeIntake = new NarrativeIntake();
    addAttachement: AttachmentIntakes[] = [];
    intakeScreen: IntakeScreen = new IntakeScreen();
    addedCrossReference: CrossReferenceSearchResponse[] = [];
    addedPersons: InvolvedPerson[] = [];
    addedEntities: InvolvedEntitySearchResponse[] = [];
    addedIntakeDATypeDetails: IntakeDATypeDetail[] = [];
    addedIntakeDATypeSubject$ = new Subject<IntakeDATypeDetail[]>();
    evalFieldsInputSubject$ = new Subject<EvaluationFields>();
    evalFieldsOutputSubject$ = new Subject<EvaluationFields>();
    dispositionInput$ = new Subject<string>();
    dispositionOutPut$ = new Subject<DispostionOutput>();
    dispositionRetrive$ = new Subject<DispostionOutput>();
    agencyCodeSubject$ = new Subject<IntakeDATypeDetail>();
    assessmentInput: IntakeDATypeDetail;
    timeReceived$ = new Subject<string>();
    evalFields: EvaluationFields;
    recordings: Recording[] = [];
    Person: Person[] = [];
    addNarrative: Narrative;
    selectteamtypekey: string;
    itnakeServiceGrid: boolean;
    intakeservice = [];
    otherAgencyControlName: AbstractControl;
    djsSelected = false;
    checkValidation: boolean;
    saveIntakeBtn: boolean;
    intakeType: string;
    disposition: DispostionOutput;
    purposeList: IntakePurpose[] = [];
    createdCases: ComplaintTypeCase[];
    createdCaseInputSubject$ = new Subject<ComplaintTypeCase[]>();
    purposeInputSubject$ = new Subject<IntakePurpose>();
    createdCaseOuptputSubject$ = new Subject<ComplaintTypeCase[]>();
    selectedPurpose: DropdownModel;
    selectedAgency: DropdownModel;
    roleValue = false;
    pdfFiles: { 'fileName': string, 'images': string[] }[] = [];
    downloadInProgress = false;
    @ViewChild(IntakeAttachmentsComponent) intakeAttachment: IntakeAttachmentsComponent;
    @ViewChild(IntakeAssessmentComponent) daAllegaDispo: IntakeAssessmentComponent;
    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private _authService: AuthService,
        private _alertService: AlertService,
        private _commonHttpService: CommonHttpService,
        private speechRecognizer: SpeechRecognizerService
    ) {
        this.draftId = route.snapshot.params['id'];
    }

    ngOnInit() {
        this.buildFormGroup();
        this.loadDroddowns();
        this.loadDefaults();
        this.narrativeInputSubject$.subscribe((narrative) => {
            this.addNarrative = narrative;
        });
        this.finalNarrativeText$.subscribe((text) => {
            this.addNarrative.Narrative = text;
        });
        this.addAttachementSubject$.subscribe((attach) => {
            this.addAttachement = attach;
        });
        this.addedIntakeDATypeSubject$.subscribe((intakeDAType) => {
            this.addedIntakeDATypeDetails = intakeDAType;
        });
        this.dispositionOutPut$.subscribe((disposot) => {
            this.disposition = disposot;
        });
        this.listPurpose({ text: '', value: 'all' });
        this.otherAgencyControlName = this.departmentActionIntakeFormGroup.get('otheragency');
        this.otherAgencyControlName.disable();
        this.evalFieldsInputSubject$.subscribe((evalFileds) => {
            this.evalFields = evalFileds;
        });
        this.createdCaseInputSubject$.subscribe((createdCases) => {
            this.createdCases = createdCases;
        });
    }
    ngAfterViewInit() {
        this.populateIntake();
    }

    ngAfterContentInit() {
        $('.btnNext').click(function () {
            $('.click-triggers > .active')
                .next('li')
                .find('a')
                .trigger('click');
            console.log('next');
        });

        $('.btnPrevious').click(function () {
            $('.click-triggers > .active')
                .prev('li')
                .find('a')
                .trigger('click');
            console.log('prev');
        });
    }

    buildFormGroup() {
        this.departmentActionIntakeFormGroup = this.formBuilder.group(
            {
                Source: [''],
                InputSource: ['', Validators.required],
                RecivedDate: [new Date(), [Validators.required, Validators.minLength(1)]],
                CreatedDate: [new Date()],
                Author: [''],
                IntakeNumber: [''],
                Agency: ['all', Validators.required],
                Purpose: ['', Validators.required],
                IntakeService: [''],
                otheragency: ['', Validators.maxLength(50)],
                isOtherAgency: false
            },
            { validator: this.dateFormat }
        );
    }
    dateFormat(group: FormGroup) {
        if (group.controls.RecivedDate.value !== '' && group.controls.RecivedDate.value !== null) {
            if (group.controls.RecivedDate.value > new Date()) {
                return { futureDate: true };
            }
            return null;
        }
    }
    private loadDroddowns() {
        const source = forkJoin([
            this._commonHttpService.getArrayList({}, NewUrlConfig.EndPoint.Intake.CommunicationUrl),
            this._commonHttpService.getArrayList({}, NewUrlConfig.EndPoint.Intake.IntakeServiceRequestInputTypeUrl),
            this._commonHttpService.getArrayList({}, NewUrlConfig.EndPoint.Intake.IntakeAgencies)
        ])
            .map((result) => {
                return {
                    sourceList: result[0].map(
                        (res) =>
                            new DropdownModel({
                                text: res.description,
                                value: res.intakeservreqinputsourceid
                            })
                    ),
                    communicationList: result[1].map(
                        (res) =>
                            new DropdownModel({
                                text: res.description,
                                value: res.intakeservreqinputtypeid
                            })
                    ),
                    agenciesList: result[2].map(
                        (res) =>
                            new DropdownModel({
                                text: res.description,
                                value: res.teamtypekey
                            })
                    )
                };
            })
            .share();
        this.intakeSourceList$ = source.pluck('sourceList');
        this.intakeCommunication$ = source.pluck('communicationList');
        this.intakeAgencies$ = source.pluck('agenciesList');
    }

    private loadDefaults() {
        this._commonHttpService.getArrayList({}, NewUrlConfig.EndPoint.Intake.GetNextNumberUrl).subscribe((result) => {
            this.departmentActionIntakeFormGroup.patchValue({
                IntakeNumber: result['nextNumber']
            });
            this.intakeNumberNarrative = result['nextNumber'];
            this.intakeNumber = result['nextNumber'];
            if (!this.draftId) {
                this.intakeAttachment.getIntakeNumber(result['nextNumber']);
            }
        });
        this._authService.currentUser.subscribe((userInfo) => {
            this.departmentActionIntakeFormGroup.patchValue({
                Author: userInfo.user.userprofile.displayname ? userInfo.user.userprofile.displayname : ''
            });
        });
    }
    changeOtherAgency(event: any) {
        if (event.target.checked) {
            this.otherAgencyControlName.enable();
        } else {
            this.otherAgencyControlName.disable();
            this.departmentActionIntakeFormGroup.patchValue({
                otheragency: ''
            });
        }
    }
    listPurpose(agency: DropdownModel) {
        this.selectedAgency = agency;
        const teamtypekey = this.selectedAgency.value;
        this.departmentActionIntakeFormGroup.patchValue({
            Purpose: ''
        });
        this.itnakeServiceGrid = false;
        const checkInput = {
            nolimit: true,
            where: { teamtypekey: teamtypekey },
            method: 'get'
        };
        this.intakePurpose$ = this._commonHttpService.getArrayList(new PaginationRequest(checkInput), NewUrlConfig.EndPoint.Intake.IntakePurposes + '/list?filter').map((result) => {
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

    listService(puropose: DropdownModel) {
        const serDescription = puropose.value;
        this.selectteamtypekey = serDescription;
        this.dispositionInput$.next(this.selectteamtypekey);
        const assessment = {
            agencycode: this.selectedAgency.value,
            DaTypeKey: this.selectteamtypekey,
            DasubtypeKey: this.selectteamtypekey
        };
        this.assessmentInput = Object.assign(assessment);
        this.agencyCodeSubject$.next(this.assessmentInput);
        if (serDescription === 'd207bdd4-f281-4ec8-949c-8fd9657227f9' || serDescription === '9d1c2be9-72af-4527-a603-45913feff080') {
            this.intakeservice = [];
            this.itnakeServiceGrid = true;
            this.intakeServices$ = this._commonHttpService
                .getArrayList(
                    new PaginationRequest({
                        nolimit: true,
                        where: { teamtypekey: this.selectteamtypekey },
                        method: 'get'
                    }),
                    NewUrlConfig.EndPoint.Intake.Intakeservs + '/list?filter'
                )
                .map((result) => {
                    return result;
                });
        } else {
            this.itnakeServiceGrid = false;
        }
        this.checkForDJSSelected(puropose.value);
    }
    selectService(event: any, selectedItem: any) {
        if (event.target.checked) {
            this.intakeservice.push(selectedItem);
        } else {
            this.intakeservice = this.intakeservice.map((item) => {
                if (item.intakeservid !== selectedItem.intakeservid) {
                    return item;
                } else {
                    return {};
                }
            });
        }
    }
    isSelectedItems(modal) {
        const index = this.intakeservice.filter((item) => item.intakeservid === modal.intakeservid);
        if (index.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    submitIntake(modal: General, appevent: string) {
        this.checkValidation = this.conditionalValidation();
        if (this.checkValidation) {
            if (this.disposition.intakeserreqstatustypekey === 'Approved') {
                this.approveIntake(modal, appevent);
            } else {
                this.mainIntake(modal, appevent);
            }
        }
    }
    draftIntake(modal: General, appevent: string) {
        this.mainIntake(modal, appevent);
    }
    mainIntake(modal: General, appevent: string) {
        this.intakeType = appevent;
        if (this.departmentActionIntakeFormGroup.valid) {
            if (appevent !== 'DRAFT') {
                this.checkValidation = this.conditionalValidation();
            } else {
                // this.checkValidation = this.conditionalValidation();
                this.checkValidation = true;
            }
            if (this.checkValidation) {
                this.general = Object.assign(new General(), modal);
                this.general.intakeservice = this.intakeservice;
                ObjectUtils.removeEmptyProperties(this.general);
                const intake = this.mapIntakeScreenInfo(this.general);
                if (this.evalFields) {
                    switch (this.evalFields.allegedoffenseknown) {
                        case 0: {
                            this.evalFields.allegedoffensetodate = '';
                            break;
                        }
                        case 1: {
                            this.evalFields.allegedoffensetodate = '';
                            this.evalFields.allegedoffensedate = '';
                            break;
                        }
                        case 2: {
                            break;
                        }
                    }
                }

                const reviewStatus = {
                    appevent: appevent,
                    status: appevent === 'INTR' ? 'supreview' : '',
                    commenttext: appevent === 'INTR' ? '' : ''
                };
                if (intake) {
                    const intakeSaveModel = new IntakeTemporarySaveModel({
                        crossReference: this.addedCrossReference,
                        persons: this.addedPersons,
                        entities: this.addedEntities,
                        intakeDATypeDetails: this.addedIntakeDATypeDetails,
                        recordings: this.recordings,
                        general: this.general,
                        narrative: this.narrative,
                        disposition: this.disposition,
                        attachement: this.addAttachement,
                        evaluationFields: this.evalFields,
                        reviewstatus: reviewStatus,
                        createdCases: this.createdCases
                    });
                    intakeSaveModel.narrative = Object.assign(intake.NarrativeIntake);
                    // console.log(JSON.stringify(intakeSaveModel));
                    const finalIntake = {
                        intake: intakeSaveModel,
                        review: reviewStatus
                    };
                    // console.log(JSON.stringify(finalIntake));
                    this._commonHttpService.create(finalIntake, NewUrlConfig.EndPoint.Intake.SendtoSupervisorreviewUrl).subscribe(
                        (response) => {
                            this.onReload();
                            this.btnDraft = false;
                        },
                        (error) => {
                            this._alertService.error('Unable to save intake, please try again.');
                            console.log('Save Intake Error', error);
                            return false;
                        }
                    );
                }
            }
        } else {
            ControlUtils.validateAllFormFields(this.departmentActionIntakeFormGroup);
            this._alertService.warn('Please input the mandatory fields.');
        }
    }
    approveIntake(modal: General, appevent: string) {
        this.intakeType = appevent;
        if (this.departmentActionIntakeFormGroup.valid) {
            if (appevent !== 'DRAFT') {
                this.checkValidation = this.conditionalValidation();
            } else {
                this.checkValidation = this.conditionalValidation();
            }
            if (this.checkValidation) {
                this.general = Object.assign(new General(), modal);
                this.general.intakeservice = this.intakeservice;
                ObjectUtils.removeEmptyProperties(this.general);
                const intake = this.mapIntakeScreenInfo(this.general);
                const reviewStatus = {
                    appevent: appevent,
                    status: 'approved',
                    commenttext: ''
                };
                if (this.addedPersons.length > 0) {
                    this.addedPersons.map((item) => {
                        if (item.Role === 'RA' || item.Role === 'RC' || item.Role === 'CLI') {
                            this.roleValue = true;
                        }
                    });
                } else {
                    this._alertService.error('Please add a person.');
                    return false;
                }
                if (this.roleValue === false) {
                    this._alertService.error('Please add user of role RA/RC/CLI.');
                    return false;
                }
                this.addedPersons.map((item) => {
                    item.Pid = item.Pid ? item.Pid : '';
                    if (item.emailID) {
                        item.contactsmail = item.emailID;
                    } else {
                        item.contactsmail = [];
                    }
                    if (item.phoneNumber) {
                        item.contacts = item.phoneNumber;
                    } else {
                        item.contacts = [];
                    }
                    if (item.personAddressInput) {
                        item.address = item.personAddressInput;
                    } else {
                        item.address = [];
                    }
                    item.Middlename = item.AliasLastName ? item.AliasLastName : '';
                });
                const disposition = {
                    personid: '',
                    Summary: this.disposition.comments ? this.disposition.comments : '',
                    DAStatus: this.disposition.intakeserreqstatustypekey ? this.disposition.intakeserreqstatustypekey : '',
                    DADisposition: this.disposition.dispositioncode ? this.disposition.dispositioncode : '',
                    DaTypeKey: this.general.Purpose ? this.general.Purpose : '',
                    DasubtypeKey: this.general.Purpose ? this.general.Purpose : '',
                    ServiceRequestNumber: this.departmentActionIntakeFormGroup.get('IntakeNumber').value,
                    CancelReason: '',
                    CancelDescription: '',
                    ReasonforDelay: this.disposition.reason
                };
                if (this.addedPersons.length) {
                    disposition.personid = this.addedPersons[0].Pid ? this.addedPersons[0].Pid : '';
                }
                if (intake) {
                    const dATypeDetail = [];
                    dATypeDetail.push(disposition);
                    const intakeSaveModel = {
                        CrossReferences: this.addedCrossReference,
                        persondetails: { Person: this.addedPersons },
                        entities: this.addedEntities,
                        intakeDATypeDetails: this.addedIntakeDATypeDetails,
                        recordings: this.recordings,
                        General: this.general,
                        attachement: this.addAttachement,
                        evaluationFields: this.evalFields,
                        DAType: { DATypeDetail: dATypeDetail },
                        reviewstatus: reviewStatus,
                        Allegations: []
                    };
                    intakeSaveModel.General.Firstname = this.narrative.Firstname ? this.narrative.Firstname : '';
                    intakeSaveModel.General.Lastname = this.narrative.Lastname ? this.narrative.Lastname : '';
                    intakeSaveModel.General.AgencyCode = intakeSaveModel.General.Agency ? intakeSaveModel.General.Agency : '';
                    intakeSaveModel.General.Source = intakeSaveModel.General.InputSource ? intakeSaveModel.General.InputSource : '';
                    // console.log(JSON.stringify(intakeSaveModel));
                    const finalIntake = {
                        intake: intakeSaveModel,
                        review: reviewStatus
                    };
                    // console.log(JSON.stringify(finalIntake));
                    this._commonHttpService.create(finalIntake, NewUrlConfig.EndPoint.Intake.SupervisorApprovalUrl).subscribe(
                        (response) => {
                            this.onReload();
                            this.btnDraft = false;
                        },
                        (error) => {
                            this._alertService.error('Unable to approve intake, please try again.');
                            console.log('Approve Intake Error', error);
                            return false;
                        }
                    );
                }
            }
        } else {
            ControlUtils.validateAllFormFields(this.departmentActionIntakeFormGroup);
            this._alertService.warn('Please input the mandatory fields.');
        }
    }
    onReload() {
        const role = this._authService.getCurrentUser();
        if (role.role.name === 'apcs') {
            this._alertService.success('Intake saved successfully!');
            Observable.timer(500).subscribe(() => {
                this._router.routeReuseStrategy.shouldReuseRoute = function () {
                    return false;
                };
                this._router.navigate(['/pages/cjams-dashboard']);
            });
        } else {
            this._alertService.success('Intake saved successfully!');
            Observable.timer(500).subscribe(() => {
                this._router.routeReuseStrategy.shouldReuseRoute = function () {
                    return false;
                };
                this._router.navigate(['/pages/newintake/new-saveintake']);
            });
        }
    }
    conditionalValidation(): boolean {
        if (this.disposition) {
            if (!this.disposition.dispositioncode || !this.disposition.intakeserreqstatustypekey) {
                this._alertService.error('Please fill status and disposition');
                return false;
            }
        } else {
            this._alertService.error('Please fill status and disposition');
            return false;
        }
        if (this.departmentActionIntakeFormGroup.value.isOtherAgency) {
            if (this.departmentActionIntakeFormGroup.value.otheragency === '') {
                this._alertService.error('Please fill request from other agency');
                return false;
            }
        }
        if (this.addNarrative.Narrative === '') {
            this._alertService.error('Please fill narrative');
            return false;
        } else if (this.addNarrative.IsAnonymousReporter === false) {
            if (this.addNarrative.Firstname === '' || this.addNarrative.Lastname === '') {
                this._alertService.error('Please fill first name and last name');
                return false;
            }
        }
        return true;
    }

    getSelectedPurpose(purposeID) {

        if (this.purposeList) {
            return this.purposeList.find((puroposeItem) => puroposeItem.intakeservreqtypeid === purposeID);
        }
        return null;
    }
    checkForDJSSelected(puropose) {
        this.djsSelected = false;
        const selectedPurpose = this.getSelectedPurpose(puropose);

        if (selectedPurpose && selectedPurpose.teamtype.teamtypekey === 'DJS') {
            this.djsSelected = true;
            this.purposeInputSubject$.next(selectedPurpose);
        } else {
            this.djsSelected = false;
        }
    }
    private mapIntakeScreenInfo(model: General): IntakeScreen {
        model.Narrative = this.addNarrative.Narrative;
        model.IsAnonymousReporter = this.addNarrative.IsAnonymousReporter;
        model.IsUnknownReporter = this.addNarrative.IsUnknownReporter;
        this.intakeScreen.Person = this.addedPersons.map((item) => {
            ObjectUtils.removeEmptyProperties(item);
            return new Person(item);
        });
        this.intakeScreen.NarrativeIntake = [].concat.apply(
            Object.assign({
                Firstname: this.addNarrative.Firstname,
                Lastname: this.addNarrative.Lastname,
                Role: this.addNarrative.Role
            })
        );
        this.intakeScreen.EvaluationField = this.evalFields;
        this.intakeScreen.DAType.DATypeDetail = this.addedIntakeDATypeDetails.map((item) => new DATypeDetail(item));
        this.intakeScreen.CrossReferences = this.addedCrossReference.map((item) => new CrossReference(item));
        this.intakeScreen.Recording.Recordings = this.recordings;
        this.intakeScreen.General = model;
        this.intakeScreen.Allegations = [].concat.apply(
            [],
            this.addedIntakeDATypeDetails.map((item) => {
                return item.Allegations;
            })
        );
        this.intakeScreen.Agency = this.addedEntities.map((item) => new Agency(item));
        this.intakeScreen.AttachmentIntake = this.addAttachement;

        return this.intakeScreen;
    }
    private populateIntake() {
        this.route.params.subscribe((item) => {
            this.intakeId = item['id'];
            if (this.intakeId) {
                this._commonHttpService.getSingle({}, NewUrlConfig.EndPoint.Intake.TemporarySavedIntakeUrl + '/' + this.intakeId).subscribe(
                    (response) => {
                        this.btnDraft = true;
                        this.timeReceived$.next(response.timerecieved);
                        if (response.jsondata) {
                            const intakeModel = response.jsondata as IntakeTemporarySaveModel;
                            this.addedCrossReference = intakeModel.crossReference;
                            this.addedPersons = intakeModel.persons;
                            this.addedEntities = intakeModel.entities;
                            this.addedIntakeDATypeDetails = intakeModel.intakeDATypeDetails;
                            this.recordings = intakeModel.recordings;
                            this.general = intakeModel.general;
                            this.reviewstatus = intakeModel.reviewstatus;
                            this.evalFields = intakeModel.evaluationFields;
                            this.createdCases = intakeModel.createdCases;
                            this.evalFieldsOutputSubject$.next(this.evalFields);
                            this.dispositionOutPut$.next(intakeModel.disposition);
                            this.createdCaseOuptputSubject$.next(this.createdCases);
                            this.narrativeDetails.Narrative = this.general.Narrative;
                            this.narrativeDetails.Firstname = intakeModel.narrative ? intakeModel.narrative[0].Firstname : '';
                            this.narrativeDetails.Lastname = intakeModel.narrative ? intakeModel.narrative[0].Lastname : '';
                            this.narrativeDetails.draftId = this.draftId;
                            this.narrativeDetails.IsAnonymousReporter = this.general.IsAnonymousReporter === true ? true : false;
                            this.narrativeDetails.IsUnknownReporter = this.general.IsUnknownReporter === true ? true : false;
                            this.narrativeOutputSubject$.next(this.narrativeDetails);
                            // if (this.general) {
                            //     this.disposition.dispositioncode = this.general.dispositioncode !== '' ? this.general.dispositioncode : '';
                            //     this.disposition.intakeserreqstatustypekey = this.general.intakeserreqstatustypekey !== '' ? this.general.intakeserreqstatustypekey : '';
                            //     this.dispositionRetrive$.next(this.disposition);
                            // }
                            if (this.addedIntakeDATypeDetails.length) {
                                this.daAllegaDispo.getSavedIntakeAssessmentDetails(this.addedIntakeDATypeDetails, intakeModel.general.IntakeNumber);
                            }
                            if (this.general.Agency) {
                                // this.listPurpose(this.general.Agency);
                                // this.listService(this.general.Purpose);
                                this.listPurpose({ text: '', value: this.general.Agency });
                                this.listService({ text: '', value: this.general.Purpose });
                                this.intakeservice = this.general.intakeservice;
                            }
                            if (this.reviewstatus.appevent === 'INTR') {
                                this.saveIntakeBtn = true;
                            }
                            this.patchFormGroup(this.general);
                            ControlUtils.markFormGroupTouched(this.departmentActionIntakeFormGroup);
                        } else {
                            this.loadDefaults();
                        }
                    },
                    (error) => {
                        this._alertService.error('Unable to fetch saved intake details.');
                        this.loadDefaults();
                    }
                );
            } else {
                this.loadDefaults();
            }
        });
    }
    patchFormGroup(general: General = new General()) {
        this.departmentActionIntakeFormGroup.patchValue({
            Source: general.Source ? general.Source : '',
            InputSource: general.InputSource ? general.InputSource : '',
            RecivedDate: new Date(this.general.RecivedDate),
            CreatedDate: general.CreatedDate ? general.CreatedDate : '',
            Author: general.Author ? general.Author : '',
            IntakeNumber: general.IntakeNumber ? general.IntakeNumber : '',
            Agency: general.Agency ? general.Agency : '',
            Purpose: general.Purpose ? general.Purpose : '',
            otheragency: general.otheragency ? general.otheragency : '',
            isOtherAgency: general.isOtherAgency ? general.isOtherAgency : false
        });
        if (this.draftId) {
            this.intakeAttachment.getIntakeNumber(general.IntakeNumber);
        }
        if (this.departmentActionIntakeFormGroup.value.isOtherAgency) {
            this.otherAgencyControlName.enable();
        }
    }


    collectivePdfCreator() {
        this.downloadInProgress = true;
        const pdfList = ["Appeal-Letter", "Formal-Action-Letter", "Formal-Action-Letter-Complaint", "Process-Letter"];
        pdfList.forEach(element => {
            this.downloadCasePdf(element);
        });
    }

    async downloadCasePdf(element: string) {
        const source = document.getElementById(element);
        const pages = source.getElementsByClassName('pdf-page');
        let pageImages = [];
        for (let i = 0; i < pages.length; i++) {
            console.log(pages.item(i).getAttribute('data-page-name'));
            const pageName = pages.item(i).getAttribute('data-page-name');
            const isPageEnd = pages.item(i).getAttribute('data-page-end');
            await html2canvas(<HTMLElement>pages.item(i),{letterRendering: true}).then((canvas) => {
                const img = canvas.toDataURL('image/jpeg');
                pageImages.push(img);
                if (isPageEnd === 'true') {
                    this.pdfFiles.push({ 'fileName': pageName, 'images': pageImages });
                    pageImages = [];
                }
            });
        }
        this.convertImageToPdf();
    }

    convertImageToPdf() {
        this.pdfFiles.forEach((pdfFile) => {
            const doc = new jsPDF();
            pdfFile.images.forEach((image, index) => {
                doc.addImage(image, 'JPEG', 0, 0);
                if (pdfFile.images.length > index + 1) {
                    doc.addPage();
                }
            });
            doc.save(pdfFile.fileName);
        });
        (<any>$('#intake-complaint-pdf1')).modal('hide');
        this.pdfFiles = [];
        this.downloadInProgress = false;
    }
}
