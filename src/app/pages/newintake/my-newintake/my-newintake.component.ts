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
import {
    CrossReference,
    CrossReferenceSearchResponse,
    IntakeDATypeDetail,
    IntakeTemporarySaveModel,
    InvolvedEntitySearchResponse,
    InvolvedPerson,
    Narrative,
    NarrativeIntake,
    Recording,
    IntakePurpose
} from './_entities/newintakeModel';
import { Agency, AttachmentIntakes, DATypeDetail, EvaluationFields, General, IntakeScreen, Person, ComplaintTypeCase } from './_entities/newintakeSaveModel';
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
    purposeList:IntakePurpose[];
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
    narrative: NarrativeIntake = new NarrativeIntake();
    addAttachement: AttachmentIntakes[] = [];
    intakeScreen: IntakeScreen = new IntakeScreen();
    addedCrossReference: CrossReferenceSearchResponse[] = [];
    addedPersons: InvolvedPerson[] = [];
    addedEntities: InvolvedEntitySearchResponse[] = [];
    addedIntakeDATypeDetails: IntakeDATypeDetail[] = [];
    addedIntakeDATypeSubject$ = new Subject<IntakeDATypeDetail[]>();
    evalFieldsInputSubject$ = new Subject<EvaluationFields>();
    createdCaseInputSubject$ = new Subject<ComplaintTypeCase[]>();
    createdCaseOuptputSubject$ = new Subject<ComplaintTypeCase[]>();
    evalFieldsOutputSubject$ = new Subject<EvaluationFields>();
    purposeInputSubject$ = new Subject<IntakePurpose>();    
    evalFields: EvaluationFields;
    createdCases: ComplaintTypeCase[];
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
    selectedPurpose: DropdownModel;
    selectedAgency: DropdownModel;
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
        let allDropdownModel = new DropdownModel();
        allDropdownModel.text="all";
        allDropdownModel.value="all";
        this.listPurpose(allDropdownModel);
        this.otherAgencyControlName = this.departmentActionIntakeFormGroup.get('otheragency');
        this.otherAgencyControlName.disable();
        this.evalFieldsInputSubject$.subscribe((evalFileds) => {
            this.evalFields = evalFileds;
            console.log("rec",evalFileds)
        });
        this.createdCaseInputSubject$.subscribe((createdCases) => {
            this.createdCases = createdCases;
        });
    }
    ngAfterViewInit() {
        this.populateIntake();
    }

    ngAfterContentInit() {
        $('.btnNext').click(function() {
            $('.click-triggers > .active')
                .next('li')
                .find('a')
                .trigger('click');
            console.log('next');
        });

        $('.btnPrevious').click(function() {
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
        let teamtypekey = this.selectedAgency.value;
        this.selectteamtypekey = teamtypekey;
        this.djsSelected = false;
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
    getSelectedPurpose(purposeID) {
        return this.purposeList.find(puroposeItem => puroposeItem.intakeservreqtypeid === purposeID) ;
    }
    checkForDJSSelected(puropose) {
                this.djsSelected = false;
                console.log(this.purposeList);
                let selectedPurpose = this.getSelectedPurpose(puropose);

                if(selectedPurpose && selectedPurpose.teamtype.teamtypekey === 'DJS') {
                    this.djsSelected = true;
                    this.purposeInputSubject$.next(selectedPurpose);
                }
                else {
                    this.djsSelected = false;
                }
            /* this.intakePurpose$.subscribe((list) => {
                const si = list.filter((item) => {
                    if (puropose.intakeservreqtypeid === item.value.intakeservreqtypeid && item.value.teamtype.teamtypekey === 'DJS') {
                        return item;
                    }
                });
                if (si.length > 0) {
                    this.djsSelected = true;
                } else {
                    this.djsSelected = false;
                }
            }); */
    }
    listService(puropose: DropdownModel) {
        //Request for services
        let serDescription = puropose.value.intakeservreqtypeid;

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
        this.mainIntake(modal, appevent);
    }
    draftIntake(modal: General, appevent: string) {
        this.mainIntake(modal, appevent);
    }
    mainIntake(modal: General, appevent: string) {
        if (this.departmentActionIntakeFormGroup.valid) {
            if (appevent !== 'DRAFT') {
                this.checkValidation = this.conditionalValidation();
            } else {
                this.checkValidation = true;
            }
            if (this.checkValidation) {
                this.general = Object.assign(new General(), modal);
                this.general.intakeservice = this.intakeservice;
                ObjectUtils.removeEmptyProperties(this.general);
                const intake = this.mapIntakeScreenInfo(this.general);
                switch(this.evalFields.allegedoffenseknown){
                    case 0:{this.evalFields.allegedoffensetodate='';break}
                    case 1:{this.evalFields.allegedoffensetodate='';this.evalFields.allegedoffensedate='';break}
                    case 2:{break;}
                }
                if (intake) {
                    const intakeSaveModel = new IntakeTemporarySaveModel({
                        crossReference: this.addedCrossReference,
                        persons: this.addedPersons,
                        entities: this.addedEntities,
                        intakeDATypeDetails: this.addedIntakeDATypeDetails,
                        recordings: this.recordings,
                        general: this.general,
                        narrative: this.narrative,
                        attachement: this.addAttachement,
                        evaluationFields: this.evalFields,
                        createdCases:this.createdCases
                    });
                    
                    intakeSaveModel.narrative = Object.assign(intake.NarrativeIntake);
                    console.log(JSON.stringify(intakeSaveModel));
                    const finalIntake = {
                        intake: intakeSaveModel,
                        review: {
                            appevent: appevent,
                            status: appevent === 'INTR' ? 'supreview' : '',
                            commenttext: appevent === 'INTR' ? '' : ''
                        }
                    };
                    console.log(JSON.stringify(finalIntake));
                    this._commonHttpService.create(finalIntake, NewUrlConfig.EndPoint.Intake.SendtoSupervisorreviewUrl).subscribe(
                        (response) => {
                            this._alertService.success('Intake saved successfully!');
                            this.onReload();
                            this.btnDraft = false;
                            this.saveIntakeBtn = false;
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
    onReload() {
        Observable.timer(500).subscribe(() => {
            this._router.routeReuseStrategy.shouldReuseRoute = function() {
                return false;
            };
            this._router.navigate(['/pages/newintake/new-saveintake']);
        });
    }
    conditionalValidation(): boolean {
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
        // if (this.addedIntakeDATypeDetails.length === 0) {
        //     this._alertService.error('Please select service type in assessment.');
        //     return false;
        // }
        return true;
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
                        if (response.jsondata) {
                            const intakeModel = response.jsondata as IntakeTemporarySaveModel;
                            this.addedCrossReference = intakeModel.crossReference;
                            this.addedPersons = intakeModel.persons;
                            this.addedEntities = intakeModel.entities;
                            this.addedIntakeDATypeDetails = intakeModel.intakeDATypeDetails;
                            this.recordings = intakeModel.recordings;
                            this.general = intakeModel.general;
                            this.evalFields = intakeModel.evaluationFields;
                            this.createdCases = intakeModel.createdCases;
                            this.createdCaseOuptputSubject$.next(this.createdCases);
                            this.evalFieldsOutputSubject$.next(this.evalFields);
                           
                            this.narrativeDetails.Narrative = this.general.Narrative;
                            this.narrativeDetails.Firstname = intakeModel.narrative ? intakeModel.narrative[0].Firstname : '';
                            this.narrativeDetails.Lastname = intakeModel.narrative ? intakeModel.narrative[0].Lastname : '';
                            this.narrativeDetails.draftId = this.draftId;
                            this.narrativeDetails.IsAnonymousReporter = this.general.IsAnonymousReporter === true ? true : false;
                            this.narrativeDetails.IsUnknownReporter = this.general.IsUnknownReporter === true ? true : false;
                            this.narrativeOutputSubject$.next(this.narrativeDetails);
                            if (this.addedIntakeDATypeDetails.length) {
                                this.daAllegaDispo.getSavedIntakeAssessmentDetails(this.addedIntakeDATypeDetails, intakeModel.general.IntakeNumber);
                            }
                            if (this.general.Agency) {

                                this.listPurpose({text:"",value:this.general.Agency});
                                this.listService({text:"",value:this.general.Purpose});
                                this.intakeservice = this.general.intakeservice;
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
}
