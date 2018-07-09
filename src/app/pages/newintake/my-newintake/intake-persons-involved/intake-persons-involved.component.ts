import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators';

import { ObjectUtils } from '../../../../@core/common/initializer';
import { PaginationInfo, DropdownModel, CheckboxModel } from '../../../../@core/entities/common.entities';
import { CommonHttpService } from '../../../../@core/services/common-http.service';
import { GenericService } from '../../../../@core/services/generic.service';
import { InvolvedPersonSearch, InvolvedPersonSearchResponse, SuggestAddress, ValidatedAddress, InvolvedPersonAlias, PersonInvolved } from '../_entities/newintakeModel';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { InvolvedPerson } from '../../../newintake/my-newintake/_entities/newintakeModel';
import { AlertService } from '../../../../@core/services/alert.service';
import { ControlUtils } from '../../../../@core/common/control-utils';
import { Subject } from 'rxjs/Subject';
import { NewUrlConfig } from '../../newintake-url.config';
import * as moment from 'moment';
import { map } from 'rxjs/operator/map';
import { ValidationService } from '../../../../@core/services';

declare var $: any;
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'intake-persons-involved',
    templateUrl: './intake-persons-involved.component.html',
    styleUrls: ['./intake-persons-involved.component.scss']
})
export class IntakePersonsInvolvedComponent implements OnInit {
    @Input() intakeNumberNarrative: string;
    @Input() addedPersons: InvolvedPerson[] = [];
    addEditLabel: string;
    errorValidateAddress = false;
    editAliasForm = false;
    addressAnalysis = [];
    suggestedAddress: SuggestAddress[];
    addedPersonsSubject$: Subject<InvolvedPerson[]>;
    involvedPersonFormGroup: FormGroup;
    addAliasForm: FormGroup;
    personAddressForm: FormGroup;
    contactPersonForm: FormGroup;
    addedAliasPersons: InvolvedPersonAlias[] = [];
    totalRecords$: Observable<number>;
    genderDropdownItems$: Observable<DropdownModel[]>;
    stateDropdownItems$: Observable<DropdownModel[]>;
    roleDropdownItems$: Observable<DropdownModel[]>;
    ethinicityDropdownItems$: Observable<DropdownModel[]>;
    livingArrangementDropdownItems$: Observable<DropdownModel[]>;
    primaryLanguageDropdownItems$: Observable<DropdownModel[]>;
    relationShipToRADropdownItems$: Observable<DropdownModel[]>;
    maritalDropdownItems$: Observable<DropdownModel[]>;
    religionDropdownItems$: Observable<DropdownModel[]>;
    racetypeDropdownItems$: Observable<DropdownModel[]>;
    addresstypeDropdownItems$: Observable<DropdownModel[]>;
    phoneTypeDropdownItems$: Observable<DropdownModel[]>;
    emailTypeDropdownItems$: Observable<DropdownModel[]>;
    paginationInfo: PaginationInfo = new PaginationInfo();
    private involvedPerson: InvolvedPerson = new InvolvedPerson();
    private involvedPersonAlias: InvolvedPersonAlias = new InvolvedPersonAlias();
    personAddressInput = [];
    phoneNumber = ([] = []);
    phoneNumber$: Observable<Array<any>>;
    emailID = ([] = []);
    emailID$: Observable<Array<any>>;
    constructor(private _formBuilder: FormBuilder, private _personManageService: GenericService<PersonInvolved>, private _commonHttpService: CommonHttpService, private _alertService: AlertService) {}

    ngOnInit() {
        this.initiateFormGroup();
        this.loadDropDown();
    }
    addPersonAddress() {
        if (this.personAddressForm.value.startDate) {
            const startDate = this.personAddressForm.value.startDate + '';
            const date1 = moment(new Date(startDate.substr(0, 16)));
            this.personAddressForm.value.startDate = date1.format('MM/DD/YYYY');
        }
        if (this.personAddressForm.value.endDate) {
            const endDate = this.personAddressForm.value.endDate + '';
            const date2 = moment(new Date(endDate.substr(0, 16)));
            this.personAddressForm.value.endDate = date2.format('MM/DD/YYYY');
        }
        if (this.personAddressInput.length !== 0) {
            this.personAddressInput.map((item, index) => {
                if (item.addressType !== this.personAddressForm.value.addressType) {
                    this.personAddressInput.push({ addressType: this.personAddressForm.value.addressType, addressDetail: [] });
                    this.personAddressInput[this.personAddressInput.length - 1].addressDetail.push(this.personAddressForm.value);
                } else {
                    this.personAddressInput[index].addressDetail.push(this.personAddressForm.value);
                }
            });
        } else {
            this.personAddressInput.push({ addressType: this.personAddressForm.value.addressType, addressDetail: [] });
            this.personAddressInput[0].addressDetail.push(this.personAddressForm.value);
        }
        this.personAddressForm.reset();
    }
    deleteAddressInput(i, j) {
        this.personAddressInput[i].addressDetail.splice(j, 1);
        if (this.personAddressInput[i].addressDetail.length === 0) {
            this.personAddressInput.splice(i, 1);
        }
    }
    editPerson(modal, index, text) {
        this.addEditLabel = text;
        this.involvedPerson.index = index;
        (<any>$('#intake-addperson')).modal('show');
        (<any>$('#profile-click')).click();
        if (modal.personAddressInput) {
            this.personAddressInput = modal.personAddressInput;
        }
        if (modal.emailID) {
            this.emailID = modal.emailID;
            this.emailID$ = Observable.of(this.emailID);
        }
        if (modal.phoneNumber) {
            this.phoneNumber = modal.phoneNumber;
            this.phoneNumber$ = Observable.of(this.phoneNumber);
        }
        this.involvedPersonFormGroup.patchValue({
            Lastname: modal.Lastname,
            Firstname: modal.Firstname,
            Dob: modal.Dob,
            Gender: modal.Gender,
            AliasLastName: modal.AliasLastName,
            religiontype: modal.religiontype,
            stateid: modal.stateid,
            tribalAssociation: modal.tribalAssociation,
            physicalAtt: modal.physicalAtt,
            maritalstatus: modal.maritalstatus,
            Ethnicity: modal.Ethnicity,
            occupation: modal.occupation,
            Role: modal.Role,
            ssn: modal.ssn,
            race: modal.race,
            RelationshiptoRA: modal.RelationshiptoRA,
            dangerToSelf: modal.dangerToSelf,
            dangerToSelfReason: modal.dangerToSelfReason,
            dangerToWorker: modal.dangerToWorker,
            dangerToWorkerReason: modal.dangerToWorkerReason,
            mentalImpaired: modal.mentalImpaired,
            mentalImpairedReason: modal.mentalImpairedReason,
            mentalIllness: modal.mentalIllness,
            mentalIllnessReason: modal.mentalIllnessReason,
            Address: modal.Address,
            Address2: modal.Address2,
            Zip: modal.Zip,
            City: modal.City,
            State: '',
            County: ''
        });
    }

    callSuggestAddress() {
        if (this.involvedPersonFormGroup.value.Address.length > 2) {
            this.suggestAddress();
        }
    }
    getSelectedPerson(modal) {
        console.log(modal);
        this.involvedPersonFormGroup.patchValue({
            Lastname: modal.lastname,
            Firstname: modal.firstname,
            Dob: modal.dob,
            Gender: modal.gendertypekey,
            Address: modal.primaryaddress,
            Address2: '',
            Zip: '',
            City: '',
            State: '',
            County: '',
            Role: modal.personrolesubtype
        });
    }
    initiateFormGroup() {
        this.involvedPersonFormGroup = this._formBuilder.group({
            Lastname: ['', Validators.required],
            Firstname: ['', Validators.required],
            Middlename: [''],
            Dob: [Validators.required],
            Gender: ['', Validators.required],
            religiontype: [''],
            maritalstatus: [''],
            Dangerous: [''],
            Role: [''],
            dangerAddress: [''],
            RelationshiptoRA: [''],
            race: [''],
            Dcn: [],
            ssn: [''],
            Ethnicity: [''],
            occupation: [''],
            stateid: [''],
            PrimaryLanguage: [''],
            AliasLastName: [''],
            potentialSOR: [''],
            eDLHistory: [''],
            dMH: [''],
            Race: [''],
            Address: [''],
            Address2: [''],
            Zip: [''],
            City: [''],
            State: [''],
            County: [''],
            DangerousWorkerReason: [''],
            DangerousAddressReason: [''],
            tribalAssociation: [''],
            physicalAtt: [''],
            dangerToSelf: [''],
            dangerToSelfReason: [''],
            dangerToWorker: [''],
            dangerToWorkerReason: [''],
            mentalImpaired: [''],
            mentalImpairedReason: [''],
            mentalIllness: [''],
            mentalIllnessReason: ['']
        });
        this.addAliasForm = this._formBuilder.group({
            AliasFirstName: [''],
            AliasLastName: ['']
        });
        this.personAddressForm = this._formBuilder.group({
            addressType: [''],
            phoneNo: [''],
            addressLine1: [''],
            addressLine2: [''],
            zipCode: [''],
            state: [''],
            city: [''],
            county: [''],
            startDate: [''],
            endDate: ['']
        });
        this.contactPersonForm = this._formBuilder.group({
            PhoneNumber: [''],
            PhoneType: [''],
            EmailID: ['', [ValidationService.mailFormat]],
            EmailType: ['']
        });
    }
    validationAddressCall() {
        this.validateAddress();
        this.validateAddressResponse();
    }
    validateAddress() {
        const addressInput = {
            street: this.personAddressForm.value.addressLine1 ? this.personAddressForm.value.addressLine1 : '',
            street2: this.personAddressForm.value.addressLine2 ? this.personAddressForm.value.addressLine2 : '',
            city: this.personAddressForm.value.city ? this.personAddressForm.value.city : '',
            state: this.personAddressForm.value.state ? this.personAddressForm.value.state : '',
            zipcode: this.personAddressForm.value.zipCode ? this.involvedPersonFormGroup.value.zipCode : '',
            match: undefined
        };

        this.addressAnalysis = [];
        this._commonHttpService
            .getSingle(
                {
                    method: 'post',
                    where: addressInput
                },
                NewUrlConfig.EndPoint.Intake.ValidateAddressUrl
            )
            .subscribe(
                (result) => {
                    if (result.isValidAddress === false) {
                        this.errorValidateAddress = true;
                    } else {
                        this.errorValidateAddress = false;
                    }
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    validateAddressResponse() {
        const addressInput = {
            street: this.involvedPersonFormGroup.value.Address ? this.involvedPersonFormGroup.value.Address : '',
            street2: this.involvedPersonFormGroup.value.Address2 ? this.involvedPersonFormGroup.value.Address2 : '',
            city: this.involvedPersonFormGroup.value.City ? this.involvedPersonFormGroup.value.City : '',
            state: this.involvedPersonFormGroup.value.State ? this.involvedPersonFormGroup.value.State : '',
            zipcode: this.involvedPersonFormGroup.value.Zip ? this.involvedPersonFormGroup.value.Zip : '',
            match: 'invalid'
        };

        this.addressAnalysis = [];
        this._commonHttpService
            .getSingle(
                {
                    method: 'post',
                    where: addressInput
                },
                NewUrlConfig.EndPoint.Intake.ValidateAddressUrl
            )
            .subscribe(
                (result) => {
                    if (result[0].analysis) {
                        this.involvedPersonFormGroup.patchValue({
                            Zip: result[0].components.zipcode ? result[0].components.zipcode : '',
                            County: result[0].metadata.countyName ? result[0].metadata.countyName : ''
                        });

                        if (result[0].analysis.dpvMatchCode) {
                            this.addressAnalysis.push({
                                text: result[0].analysis.dpvMatchCode
                            });
                        }
                        if (result[0].analysis.dpvFootnotes) {
                            this.addressAnalysis.push({
                                text: result[0].analysis.dpvFootnotes
                            });
                        }
                        if (result[0].analysis.dpvCmra) {
                            this.addressAnalysis.push({
                                text: result[0].analysis.dpvCmra
                            });
                        }
                        if (result[0].analysis.dpvVacant) {
                            this.addressAnalysis.push({
                                text: result[0].analysis.dpvVacant
                            });
                        }
                        if (result[0].analysis.active) {
                            this.addressAnalysis.push({
                                text: result[0].analysis.active
                            });
                        }
                        if (result[0].analysis.ewsMatch) {
                            this.addressAnalysis.push({
                                text: result[0].analysis.ewsMatch
                            });
                        }
                        if (result[0].analysis.lacslinkCode) {
                            this.addressAnalysis.push({
                                text: result[0].analysis.lacslinkCode
                            });
                        }
                        if (result[0].analysis.lacslinkIndicator) {
                            this.addressAnalysis.push({
                                text: result[0].analysis.lacslinkIndicator
                            });
                        }
                        if (result[0].analysis.suitelinkMatch) {
                            this.addressAnalysis.push({
                                text: result[0].analysis.suitelinkMatch
                            });
                        }
                        if (result[0].analysis.footnotes) {
                            this.addressAnalysis.push({
                                text: result[0].analysis.footnotes
                            });
                        }
                    }
                },
                (error) => {
                    console.log(error);
                }
            );
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
                NewUrlConfig.EndPoint.Intake.LivingArrangementTypeUrl + '?filter'
            ),
            this._commonHttpService.getArrayList(
                {
                    where: { activeflag: 1 },
                    method: 'get',
                    nolimit: true
                },
                NewUrlConfig.EndPoint.Intake.LanguageTypeUrl + '?filter'
            ),
            this._commonHttpService.getArrayList(
                {
                    where: { activeflag: 1 },
                    method: 'get',
                    nolimit: true
                },
                NewUrlConfig.EndPoint.Intake.RaceTypeUrl + '?filter'
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
                    where: { activeflag: 1 },
                    method: 'get',
                    nolimit: true
                },
                NewUrlConfig.EndPoint.Intake.ActorTypeUrl + '?filter'
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
                    method: 'get',
                    nolimit: true,
                    order: 'typedescription'
                },
                NewUrlConfig.EndPoint.Intake.MaritalStatusUrl + '?filter'
            ),
            this._commonHttpService.getArrayList(
                {
                    method: 'get',
                    nolimit: true,
                    order: 'typedescription'
                },
                NewUrlConfig.EndPoint.Intake.ReligionTypeUrl + '?filter'
            ),
            this._commonHttpService.getArrayList(
                {
                    method: 'get',
                    nolimit: true,
                    activeflag: 1
                },
                NewUrlConfig.EndPoint.Intake.RaceTypeUrl + '?filter'
            ),
            this._commonHttpService.getArrayList(
                {
                    method: 'get',
                    nolimit: true,
                    activeflag: 1
                },
                NewUrlConfig.EndPoint.Intake.AddressTypeUrl + '?filter'
            ),
            this._commonHttpService.getArrayList(
                {
                    method: 'get',
                    nolimit: true,
                    filter: {}
                },
                NewUrlConfig.EndPoint.Intake.PhoneTypeUrl + '?filter'
            ),
            this._commonHttpService.getArrayList(
                {
                    method: 'get',
                    nolimit: true,
                    filter: {}
                },
                NewUrlConfig.EndPoint.Intake.EmailTypeUrl + '?filter'
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
                    livingArrangements: result[2].map(
                        (res) =>
                            new DropdownModel({
                                text: res.description,
                                value: res.livingarrangementtypekey
                            })
                    ),
                    primaryLanguages: result[3].map(
                        (res) =>
                            new DropdownModel({
                                text: res.languagetypename,
                                value: res.languagetypeid
                            })
                    ),
                    races: result[4].map(
                        (res) =>
                            new CheckboxModel({
                                text: res.typedescription,
                                value: res.racetypekey,
                                isSelected: false
                            })
                    ),
                    relationShipToRAs: result[5].map(
                        (res) =>
                            new DropdownModel({
                                text: res.description,
                                value: res.relationshiptypekey
                            })
                    ),
                    roles: result[6].map(
                        (res) =>
                            new DropdownModel({
                                text: res.typedescription,
                                value: res.actortype
                            })
                    ),
                    states: result[7].map(
                        (res) =>
                            new DropdownModel({
                                text: res.statename,
                                value: res.stateabbr
                            })
                    ),
                    maritalstatus: result[8].map(
                        (res) =>
                            new DropdownModel({
                                text: res.typedescription,
                                value: res.maritalstatustypekey
                            })
                    ),
                    religiontype: result[9].map(
                        (res) =>
                            new DropdownModel({
                                text: res.typedescription,
                                value: res.religiontypekey
                            })
                    ),
                    racetype: result[10].map(
                        (res) =>
                            new DropdownModel({
                                text: res.typedescription,
                                value: res.racetypekey
                            })
                    ),
                    addresstype: result[11].map(
                        (res) =>
                            new DropdownModel({
                                text: res.typedescription,
                                value: res.personaddresstypekey
                            })
                    ),
                    phonetype: result[12].map(
                        (res) =>
                            new DropdownModel({
                                text: res.typedescription,
                                value: res.personphonetypekey
                            })
                    ),
                    emailtype: result[13].map(
                        (res) =>
                            new DropdownModel({
                                text: res.typedescription,
                                value: res.personemailtypekey
                            })
                    )
                };
            })
            .share();
        this.ethinicityDropdownItems$ = source.pluck('ethinicities');
        this.genderDropdownItems$ = source.pluck('genders');
        this.livingArrangementDropdownItems$ = source.pluck('livingArrangements');
        this.primaryLanguageDropdownItems$ = source.pluck('primaryLanguages');
        this.relationShipToRADropdownItems$ = source.pluck('relationShipToRAs');
        this.roleDropdownItems$ = source.pluck('roles');
        this.stateDropdownItems$ = source.pluck('states');
        this.maritalDropdownItems$ = source.pluck('maritalstatus');
        this.religionDropdownItems$ = source.pluck('religiontype');
        this.racetypeDropdownItems$ = source.pluck('racetype');
        this.addresstypeDropdownItems$ = source.pluck('addresstype');
        this.phoneTypeDropdownItems$ = source.pluck('phonetype');
        this.emailTypeDropdownItems$ = source.pluck('emailtype');
    }
    suggestAddress() {
        this._commonHttpService
            .getSingle(
                {
                    method: 'post',
                    where: {
                        prefix: this.involvedPersonFormGroup.value.Address,
                        cityFilter: '',
                        stateFilter: '',
                        geolocate: '',
                        geolocate_precision: '',
                        prefer_ratio: ''
                    }
                },
                NewUrlConfig.EndPoint.Intake.SuggestAddressUrl
            )
            .subscribe(
                (result) => {
                    console.log(result);
                    this.suggestedAddress = result;
                },
                (error) => {
                    console.log(error);
                }
            );
    }
    selectedAddress(model) {
        this.suggestedAddress = [];
        this.involvedPersonFormGroup.patchValue({
            Address: model.streetLine ? model.streetLine : '',
            City: model.city ? model.city : '',
            State: model.state ? model.state : ''
        });
        this.validateAddressResponse();
        this.validateAddress();
    }

    searchAddPerson(involvedPerson: InvolvedPerson) {
        this.addedPersons.push(involvedPerson);
        this.addedPersons.map((item) => {
            if (item.Dob) {
                const dob = item.Dob + '';
                const date = moment(new Date(dob.substr(0, 16)));
                item.DobFormatted = date.format('MM/DD/YYYY');
            } else {
                item.DobFormatted = 'N/A';
            }
        });
        this.addedPersons[this.addedPersons.length - 1].phoneNumber = [];
        this.addedPersons[this.addedPersons.length - 1].emailID = [];
        this.addedPersons[this.addedPersons.length - 1].personAddressInput = [];
    }
    addPerson(involvedPerson: InvolvedPerson) {
        if (this.involvedPersonFormGroup.valid) {
            if (this.validatePerson(involvedPerson)) {
                if (!this.involvedPerson.index && this.involvedPerson.index !== 0) {
                    this._personManageService
                        .create(
                            {
                                personid: involvedPerson.Pid,
                                firstname: involvedPerson.Firstname,
                                lastname: involvedPerson.Lastname,
                                role: involvedPerson.Role,
                                isnew: true,
                                isedit: false,
                                isdelete: false,
                                obj: involvedPerson
                            },
                            NewUrlConfig.EndPoint.Intake.PersonInvolvedManageUrl
                        )
                        .subscribe((result) => {
                            this.addedPersons.push(Object.assign(this.involvedPerson, involvedPerson));
                            this.addedPersons[this.addedPersons.length - 1].phoneNumber = [];
                            this.addedPersons[this.addedPersons.length - 1].phoneNumber = Object.assign(this.phoneNumber);

                            this.addedPersons[this.addedPersons.length - 1].emailID = [];
                            this.addedPersons[this.addedPersons.length - 1].emailID = Object.assign(this.emailID);

                            this.addedPersons[this.addedPersons.length - 1].personAddressInput = [];
                            this.addedPersons[this.addedPersons.length - 1].personAddressInput = Object.assign(this.personAddressInput);
                            this.addedPersons.map((item) => {
                                if (item.Dob) {
                                    const dob = item.Dob + '';
                                    const date = moment(new Date(dob.substr(0, 16)));
                                    item.DobFormatted = date.format('MM/DD/YYYY');
                                } else {
                                    item.DobFormatted = 'N/A';
                                }
                            });
                            this.addedPersons.map((item, ix) => {
                                item.index = ix;
                                return item;
                            });
                            this.clearPerson();
                            (<any>$('#intake-addperson')).modal('hide');
                            this._alertService.success('Involved person added successfully!');
                            // this.addedPersonsSubject$.next(this.addedPersons);
                            this.involvedPerson.index = null;
                        });
                } else {
                    this.addedPersons[this.involvedPerson.index] = involvedPerson;
                    const dob = this.addedPersons[this.involvedPerson.index].Dob + '';
                    const date = moment(new Date(dob.substr(0, 16)));
                    this.addedPersons[this.involvedPerson.index].DobFormatted = date.format('MM/DD/YYYY');

                    this.addedPersons[this.involvedPerson.index].phoneNumber = [];
                    this.addedPersons[this.involvedPerson.index].phoneNumber = Object.assign(this.phoneNumber);

                    this.addedPersons[this.involvedPerson.index].emailID = [];
                    this.addedPersons[this.involvedPerson.index].emailID = Object.assign(this.emailID);

                    this.addedPersons[this.involvedPerson.index].personAddressInput = [];
                    this.addedPersons[this.involvedPerson.index].personAddressInput = Object.assign(this.personAddressInput);
                    this.clearPerson();
                    (<any>$('#intake-addperson')).modal('hide');
                    this._alertService.success('Involved person updated successfully!');
                    // this.addedPersonsSubject$.next(this.addedPersons);
                }
            }
        } else {
            ControlUtils.validateAllFormFields(this.involvedPersonFormGroup);
            ControlUtils.setFocusOnInvalidFields();
            this._alertService.warn('Please fill mandatory fields!');
        }
        this.involvedPersonFormGroup.patchValue({ State: 'IN', TemparoryState: 'IN' });
    }
    private validatePerson(involvedPerson): boolean {
        // if (involvedPerson.Role === 'RA' || involvedPerson.Role === 'RC') {
        //     if (!involvedPerson.reportedPersonForm.livingArrangements) {
        //         this._alertService.warn('Please select living Arrangement');
        //         return false;
        //     }
        //     if (!involvedPerson.RoutingAddress) {
        //         this._alertService.warn('Please select Routing Address');
        //         return false;
        //     }
        //     if (!involvedPerson.reportedPersonForm.Mentealillness) {
        //         this._alertService.warn('Please enter mental illness');
        //         return false;
        //     }
        //     if (involvedPerson.reportedPersonForm.Mentealillness === 'yes' && !involvedPerson.reportedPersonForm.MentealillnessDetail) {
        //         this._alertService.warn('Please enter mental illness notes');
        //         return false;
        //     }

        //     if (!involvedPerson.reportedPersonForm.Mentealimpair) {
        //         this._alertService.warn('Please enter mental impared');
        //         return false;
        //     }

        //     if (involvedPerson.reportedPersonForm.Mentealimpair === 'yes' && !involvedPerson.reportedPersonForm.MentealimpairDetail) {
        //         this._alertService.warn('Please enter mentally impared notes');
        //         return false;
        //     }
        // } else {
        //     if (!involvedPerson.RelationshiptoRA) {
        //         this._alertService.warn('Please select relationship to reported person');
        //         return false;
        //     }
        // }
        // if (involvedPerson.Dangerous === 'Yes' && !involvedPerson.DangerousWorkerReason) {
        //     this._alertService.warn('Please enter Danger Reason');
        //     return false;
        // }
        // if (involvedPerson.dangerAddress === 'Yes' && !involvedPerson.DangerousAddressReason) {
        //     this._alertService.warn('Please enter Address Danger Reason');
        //     return false;
        // }

        return true;
    }

    clearPerson() {
        this.involvedPerson = new InvolvedPerson();
        this.involvedPersonFormGroup.reset();
        this.personAddressForm.reset();
        this.involvedPersonFormGroup.patchValue({
            Role: '',
            livingArrangements: '',
            Gender: '',
            RelationshiptoRA: '',
            Ethicity: '',
            PrimaryLanguage: '',
            State: 'IN',
            TemparoryState: 'IN',
            Mentealillness: 'no',
            MentealillnessDetail: '',
            Mentealimpair: 'no',
            MentealimpairDetail: ''
        });
        this.personAddressInput = [];
        this.phoneNumber = [];
        this.phoneNumber$ = Observable.empty();
        this.emailID = [];
        this.emailID$ = Observable.empty();
    }

    confirmDelete(involvedPerson: InvolvedPerson, index) {
        this.involvedPerson.index = index;
        (<any>$('#delete-person-popup')).modal('show');
    }
    deletePerson() {
        // this.addedPersons = this.addedPersons.map((item, ix) => {
        //     item.index = ix;
        //     return item;
        // });
        // this.addedPersonsSubject$.next(this.addedPersons);
        // this._personManageService;
        // .create(
        //     {
        //         firstname: this.addedPersons[this.involvedPerson.index].Firstname,
        //         lastname: this.addedPersons[this.involvedPerson.index].Lastname,
        //         role: this.addedPersons[this.involvedPerson.index].Role,
        //         isnew: false,
        //         isedit: false,
        //         isdelete: true,
        //         obj: this.addedPersons[this.involvedPerson.index]
        //     },
        //     NewUrlConfig.EndPoint.Intake.PersonInvolvedManageUrl
        // )
        // .subscribe((result) => {
        this.addedPersons.splice(this.involvedPerson.index, 1);
        (<any>$('#delete-person-popup')).modal('hide');
        this.clearPerson();
        this.involvedPerson.index = null;
        // });
    }

    addAlias(involvedPersonAlias: InvolvedPersonAlias) {
        if (this.addAliasForm.get('AliasFirstName').value) {
            this.addedAliasPersons.push(Object.assign(this.involvedPersonAlias, involvedPersonAlias));
            this.addedAliasPersons = this.addedAliasPersons.map((item, ix) => {
                item.index = ix;
                return item;
            });
        }
        this.clearAlias();
    }
    editAliasName(involvedPersonAlias: InvolvedPersonAlias) {
        this.editAliasForm = true;
        this.involvedPersonAlias = involvedPersonAlias;
        this.addAliasForm.patchValue(involvedPersonAlias);
    }
    confirmDeleteAlias(involvedPerson: InvolvedPerson) {
        this.involvedPersonAlias.index = involvedPerson.index;
        (<any>$('#delete-alias-popup')).modal('show');
    }
    deleteAliasName() {
        this.addedAliasPersons.splice(this.involvedPersonAlias.index, 1);
        this.addedAliasPersons = this.addedAliasPersons.map((item, ix) => {
            item.index = ix;
            return item;
        });
        (<any>$('#delete-alias-popup')).modal('hide');
        this.clearAlias();
    }
    updateAlias(involvedPersonAlias: InvolvedPersonAlias) {
        if (this.addAliasForm.get('AliasFirstName').value) {
            this.involvedPersonAlias[this.involvedPersonAlias.index] = Object.assign(this.involvedPersonAlias, involvedPersonAlias);
            this.addedAliasPersons = this.addedAliasPersons.map((item, ix) => {
                item.index = ix;
                return item;
            });
        }
        this.clearAlias();
    }
    clearAlias() {
        this.involvedPersonAlias = new InvolvedPersonAlias();
        this.editAliasForm = false;
        this.addAliasForm.reset();
    }

    toggleAddPopup(text) {
        this.addEditLabel = text;
        (<any>$('#intake-addperson')).modal('show');
        (<any>$('#profile-click')).click();
    }
    navigateNext(modal) {
        console.log(this.involvedPersonFormGroup.value);
        if (modal === 'contacts') {
            (<any>$('#add-contacts-click')).click();
        }
        if (modal === 'address') {
            (<any>$('#add-address-click')).click();
        } else if (modal === 'role') {
            (<any>$('#add-Reporter-click')).click();
        }
    }
    addPhone() {
        const phoneNumber = this.contactPersonForm.get('PhoneNumber').value;
        const phoneType = this.contactPersonForm.get('PhoneType').value;
        if (phoneNumber && phoneType) {
            this.phoneNumber.push({ phone: phoneNumber, type: phoneType });
            this.phoneNumber$ = Observable.of(this.phoneNumber);
            this.contactPersonForm.reset();
        } else {
            this._alertService.warn('Please fill mandatory fields for Phone');
        }
    }
    addEmail() {
        const emailID = this.contactPersonForm.get('EmailID').value;
        const emailType = this.contactPersonForm.get('EmailType').value;
        if (emailID && emailType && this.contactPersonForm.valid) {
            this.emailID.push({ email: emailID, type: emailType });
            this.emailID$ = Observable.of(this.emailID);
            this.contactPersonForm.reset();
        } else {
            this._alertService.warn('Please fill mandatory fields for Email');
        }
    }

    deletePhone(i: number) {
        this.phoneNumber.splice(i, 1);
        this.phoneNumber$ = Observable.of(this.phoneNumber);
    }

    deleteEmail(i: number) {
        this.emailID.splice(i, 1);
        this.emailID$ = Observable.of(this.emailID);
    }
    disabledInput(state, inputfield) {
        if (state) {
            this.involvedPersonFormGroup.get(inputfield).disable();
        } else {
            this.involvedPersonFormGroup.get(inputfield).enable();
        }
    }
}
