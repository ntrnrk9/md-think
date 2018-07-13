import value from '*.json';
import { HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NgxfUploaderService } from 'ngxf-uploader';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Subject } from 'rxjs/Subject';

import { ControlUtils } from '../../../../@core/common/control-utils';
import { AppUser } from '../../../../@core/entities/authDataModel';
import { CheckboxModel, DropdownModel, PaginationInfo, PaginationRequest } from '../../../../@core/entities/common.entities';
import { ValidationService } from '../../../../@core/services';
import { AlertService } from '../../../../@core/services/alert.service';
import { AuthService } from '../../../../@core/services/auth.service';
import { CommonHttpService } from '../../../../@core/services/common-http.service';
import { GenericService } from '../../../../@core/services/generic.service';
import { AppConfig } from '../../../../app.config';
import { AddressDetails, InvolvedPerson } from '../../../newintake/my-newintake/_entities/newintakeModel';
import { NewUrlConfig } from '../../newintake-url.config';
import { InvolvedPersonAlias, PersonInvolved, SuggestAddress, UserProfileImage } from '../_entities/newintakeModel';

declare var $: any;
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'intake-persons-involved',
    templateUrl: './intake-persons-involved.component.html',
    styleUrls: ['./intake-persons-involved.component.scss']
})
export class IntakePersonsInvolvedComponent implements OnInit, AfterViewInit {
    @Input() intakeNumberNarrative: string;
    @Input() addedPersons: InvolvedPerson[] = [];
    @ViewChild('Dangerousself') Dangerousself: any;
    addEditLabel: string;
    imageChangedEvent: File;
    croppedImage: File;
    progress: { percentage: number } = { percentage: 0 };
    errorValidateAddress = false;
    editAliasForm = false;
    isImageHide: boolean;
    beofreImageCropeHide = false;
    afterImageCropeHide = false;
    addressAnalysis = [];
    suggestedAddress: SuggestAddress[];
    addedPersonsSubject$: Subject<InvolvedPerson[]>;
    involvedPersonFormGroup: FormGroup;
    addAliasForm: FormGroup;
    personAddressForm: FormGroup;
    personPhoneForm: FormGroup;
    personEmailForm: FormGroup;
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
    private token: AppUser;
    userProfilePicture: UserProfileImage;
    finalImage: File;
    userProfile: string;
    isDefaultPhoto = true;
    editImage = true;
    editImagesShow: string;
    addresstypeLabel: string;
    personAddresses$: Observable<AddressDetails[]>;
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _personManageService: GenericService<PersonInvolved>,
        private _commonHttpService: CommonHttpService,
        private _alertService: AlertService,
        private _uploadService: NgxfUploaderService
    ) {}

    ngOnInit() {
        this.token = this._authService.getCurrentUser();
        this.initiateFormGroup();
        this.loadDropDown();
        this.involvedPersonFormGroup.controls['Firstname'].markAsTouched();
        this.involvedPersonFormGroup.controls['Lastname'].markAsTouched();
        this.involvedPersonFormGroup.controls['Gender'].markAsTouched();
    }
    ngAfterViewInit() {
        this.personAddressForm.get('Address2').valueChanges.subscribe((result) => {
            if (result) {
                this.personAddressForm.get('address1').clearValidators();
                this.personAddressForm.get('address1').updateValueAndValidity();
            }
        });
        this.personAddressForm.get('knownDangerAddress').valueChanges.subscribe((result) => {
            if (result === 'yes') {
                this.personAddressForm.get('knownDangerAddressReason').setValidators([Validators.required]);
                this.personAddressForm.get('knownDangerAddressReason').updateValueAndValidity();
            } else {
                this.personAddressForm.get('knownDangerAddressReason').clearValidators();
                this.personAddressForm.get('knownDangerAddressReason').updateValueAndValidity();
            }
            if (result === 'no') {
                this.personAddressForm.get('knownDangerAddressReason').disable();
            } else {
                this.personAddressForm.get('knownDangerAddressReason').enable();
            }
        });
    }
    changeAddressType(event) {
        this.addresstypeLabel = event.value;
    }
    addPersonAddress() {
        if (this.personAddressForm.dirty && this.personAddressForm.valid) {
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
            // if (this.personAddressInput.length !== 0) {
            //     this.personAddressInput.map((item, index) => {
            //         if (item.addresstype !== this.personAddressForm.value.addresstype) {
            //             this.personAddressInput.push({ addressid: '', addresstype: this.personAddressForm.value.addresstype, addressDetail: [] });
            //             this.personAddressInput[this.personAddressInput.length - 1].addressDetail.push(this.personAddressForm.value);
            //         } else {
            //             this.personAddressInput[index].addressDetail.push(this.personAddressForm.value);
            //         }
            //     });
            // } else {
            this.personAddressInput.push(this.personAddressForm.value);
            this.personAddressInput[this.personAddressInput.length - 1].addressid = '';
            this.personAddressInput[this.personAddressInput.length - 1].addresstypeLabel = this.addresstypeLabel.split('-')[1];
            this.personAddressInput[this.personAddressInput.length - 1].addresstype = this.addresstypeLabel.split('-')[0];
            this.personAddressInput[this.personAddressInput.length - 1].activeflag = 1;
            // }
            this.personAddressForm.reset();
            this.personAddressForm.get('address1').setValidators(Validators.required);
        } else {
            ControlUtils.validateAllFormFields(this.personAddressForm);
            ControlUtils.setFocusOnInvalidFields();
            this._alertService.warn('Please fill mandatory fields!');
        }
    }
    deleteAddressInput(modal, index) {
        if (modal.personaddressid) {
            this.personAddressInput.map((item) => {
                if (item.personaddressid === modal.personaddressid) {
                    item.activeflag = 0;
                }
            });
        } else {
            this.personAddressInput.splice(index, 1);
        }
    }
    editPerson(modal, index, text) {
        // if (modal.Pid) {
        //     const url = NewUrlConfig.EndPoint.Intake.PersonAddressesUrl + '?filter';
        //     this._commonHttpService
        //         .getArrayList(
        //             new PaginationRequest({
        //                 method: 'get',
        //                 where: { personid: modal.Pid },
        //                 include: { relation: 'Personaddresstype', scope: { fields: ['typedescription'] } }
        //             }),
        //             url
        //         )
        //         .subscribe((result) => {
        //             if (result && result.length !== 0) {
        //                 result.map((item) => {
        //                     item.addresstype = item.personaddresstypekey;
        //                     item.addresstypeLabel = item.Personaddresstype.typedescription;
        //                     item.address1 = item.address;
        //                     item.Address2 = item.address2;
        //                     item.zipcode = item.zipcode;
        //                     item.state = item.state;
        //                     item.city = item.city;
        //                     item.county = item.country;
        //                     item.addressid = item.personaddressid;
        //                 });
        //                 this.personAddressInput = result;
        //             }
        //         });
        // }
        this.isImageHide = false;
        this.afterImageCropeHide = false;
        this.addEditLabel = text;
        this.involvedPerson.index = index;
        (<any>$('#intake-addperson')).modal('show');
        (<any>$('#profile-click')).click();
        this.personAddressInput = modal.personAddressInput;
        // if (modal.personAddressInput && modal.personAddressInput.length > 0) {
        //     modal.personAddressInput.map((item) => {
        //         this.personAddressInput.push(item);
        //     });
        // }
        if (modal.emailID) {
            this.emailID = modal.emailID;
            this.emailID$ = Observable.of(this.emailID);
        }
        if (modal.phoneNumber) {
            this.phoneNumber = modal.phoneNumber;
            this.phoneNumber$ = Observable.of(this.phoneNumber);
        }
        if (modal.userPhoto && modal.userPhoto.length) {
            this.editImagesShow = modal.userPhoto;
        } else {
            this.editImagesShow = '../../../../../assets/images/female.png';
            this.userProfile = '../../../../../assets/images/female.png';
        }

        this.involvedPersonFormGroup.patchValue({
            Lastname: modal.Lastname,
            Firstname: modal.Firstname,
            Dob: modal.Dob,
            Gender: modal.Gender,
            AliasLastName: modal.AliasLastName,
            religionkey: modal.religionkey,
            stateid: modal.stateid,
            tribalassociation: modal.tribalassociation,
            height: modal.height ? modal.height : '',
            weight: modal.weight ? modal.weight : '',
            tattoo: modal.tattoo ? modal.tattoo : '',
            physicalMark: modal.physicalMark ? modal.physicalMark : '',
            maritalstatus: modal.maritalstatus,
            Ethnicity: modal.Ethnicity,
            occupation: modal.occupation,
            Role: modal.Role,
            ssn: modal.ssn,
            race: modal.race,
            RelationshiptoRA: modal.RelationshiptoRA,
            Dangerousself: modal.Dangerousself,
            DangerousselfReason: modal.DangerousselfReason,
            Dangerousworker: modal.Dangerousworker,
            DangerousWorkerReason: modal.DangerousWorkerReason,
            mentallyimpaired: modal.mentallyimpaired,
            mentallyimpairedReason: modal.mentallyimpairedReason,
            mentalillsign: modal.mentalillsign,
            mentalillsignReason: modal.mentalillsignReason,
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
            religionkey: [''],
            maritalstatus: [''],
            Dangerous: [''],
            Role: ['', Validators.required],
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
            tribalassociation: [''],
            height: [''],
            weight: [''],
            tattoo: [''],
            physicalMark: [''],
            Dangerousself: ['', [Validators.required]],
            DangerousselfReason: [''],
            Dangerousworker: ['', [Validators.required]],
            mentallyimpaired: ['', [Validators.required]],
            mentallyimpairedReason: [''],
            mentalillsign: ['', [Validators.required]],
            mentalillsignReason: [''],
            userPhoto: ['']
        });
        this.addAliasForm = this._formBuilder.group({
            AliasFirstName: [''],
            AliasLastName: ['']
        });
        this.personAddressForm = this._formBuilder.group({
            knownDangerAddress: ['', [Validators.required]],
            knownDangerAddressReason: ['', [Validators.required]],
            addresstype: ['', Validators.required],
            phoneNo: [''],
            address1: ['', Validators.required],
            Address2: [''],
            zipcode: ['', Validators.required],
            state: [''],
            city: [''],
            county: [''],
            startDate: [''],
            endDate: ['']
        });
        this.personPhoneForm = this._formBuilder.group({
            contactnumber: ['', Validators.required],
            ismobile: ['', Validators.required],
            contacttype: ['', Validators.required]
        });
        this.personEmailForm = this._formBuilder.group({
            EmailID: ['', [ValidationService.mailFormat, Validators.required]],
            EmailType: ['', Validators.required]
        });
    }
    validationAddressCall() {
        this.validateAddress();
        this.validateAddressResponse();
    }
    validateAddress() {
        const addressInput = {
            street: this.personAddressForm.value.address1 ? this.personAddressForm.value.address1 : '',
            street2: this.personAddressForm.value.Address2 ? this.personAddressForm.value.Address2 : '',
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
                    religionkey: result[9].map(
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
        this.religionDropdownItems$ = source.pluck('religionkey');
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

    searchAddPerson(involvedPerson) {
        const invDob = involvedPerson.Dob + '';
        const invDate = moment(new Date(invDob.substr(0, 16)));
        const invDobFormatted = invDate.format('MM/DD/YYYY');
        const dDupPerson = this.addedPersons.filter(
            (person) => person.Firstname === involvedPerson.Firstname && person.Lastname === involvedPerson.Lastname && person.DobFormatted === invDobFormatted
        );
        if (dDupPerson.length === 0) {
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
            // let addressDetail = [];
            // addressDetail = involvedPerson.personAddressInput;
            //     {
            //     addresstype: 'P',
            //     addresstypeLabel: 'Primary Address',
            //     address1: involvedPerson.address1,
            //     zipcode: involvedPerson.zipCode,
            //     state: involvedPerson.state,
            //     city: involvedPerson.city,
            //     county: involvedPerson.county,
            //     addressid: ''
            // });
            // const personAddressInput = [];
            // personAddressInput.push({ addressDetail: addressDetail });
            this.addedPersons[this.addedPersons.length - 1].phoneNumber = [];
            this.addedPersons[this.addedPersons.length - 1].Pid = involvedPerson.Pid ? involvedPerson.Pid : '';
            this.addedPersons[this.addedPersons.length - 1].Gender = involvedPerson.Gender ? involvedPerson.Gender : '';
            this.addedPersons[this.addedPersons.length - 1].emailID = [];
            // this.addedPersons[this.addedPersons.length - 1].personAddressInput = [];
            // this.addedPersons[this.addedPersons.length - 1].personAddressInput = Object.assign(addressDetail);
            this.addedPersons[this.addedPersons.length - 1].fullName = this.addedPersons[this.addedPersons.length - 1].Firstname + ' ' + this.addedPersons[this.addedPersons.length - 1].Lastname;
            this.addedPersons[this.addedPersons.length - 1].userPhoto = involvedPerson.userphoto ? involvedPerson.userphoto : '';
            if (this.addedPersons[this.addedPersons.length - 1].personAddressInput && this.addedPersons[this.addedPersons.length - 1].personAddressInput.length > 0) {
                this.addedPersons[this.addedPersons.length - 1].fullAddress =
                    this.addedPersons[this.addedPersons.length - 1].personAddressInput[0].address1 +
                    ' ' +
                    this.addedPersons[this.addedPersons.length - 1].personAddressInput[0].Address2 +
                    ' ' +
                    this.addedPersons[this.addedPersons.length - 1].personAddressInput[0].city +
                    ' ' +
                    this.addedPersons[this.addedPersons.length - 1].personAddressInput[0].state +
                    ' ' +
                    +this.addedPersons[this.addedPersons.length - 1].personAddressInput[0].county +
                    ' ' +
                    this.addedPersons[this.addedPersons.length - 1].personAddressInput[0].zipcode;
            }
        } else {
            this._alertService.error('Person already exists');
        }
    }
    addPerson(involvedPerson: InvolvedPerson) {
        if (this.involvedPersonFormGroup.valid) {
            if (this.validatePerson(involvedPerson)) {
                if (!this.involvedPerson.index && this.involvedPerson.index !== 0) {
                    // this._personManageService
                    //     .create(
                    //         {
                    //             personid: involvedPerson.Pid,
                    //             firstname: involvedPerson.Firstname,
                    //             lastname: involvedPerson.Lastname,
                    //             role: involvedPerson.Role,
                    //             isnew: true,
                    //             isedit: false,
                    //             isdelete: false,
                    //             obj: involvedPerson
                    //         },
                    //         NewUrlConfig.EndPoint.Intake.PersonInvolvedManageUrl
                    //     )
                    //     .subscribe((result) => {
                    const invDob = involvedPerson.Dob + '';
                    const invDate = moment(new Date(invDob.substr(0, 16)));
                    const invDobFormatted = invDate.format('MM/DD/YYYY');
                    const dDupPerson = this.addedPersons.filter(
                        (person) => person.Firstname === involvedPerson.Firstname && person.Lastname === involvedPerson.Lastname && person.DobFormatted === invDobFormatted
                    );
                    if (dDupPerson.length === 0) {
                        this.addedPersons.push(Object.assign(this.involvedPerson, involvedPerson));
                        this.addedPersons[this.addedPersons.length - 1].phoneNumber = [];
                        this.addedPersons[this.addedPersons.length - 1].phoneNumber = Object.assign(this.phoneNumber);

                        this.addedPersons[this.addedPersons.length - 1].emailID = [];
                        this.addedPersons[this.addedPersons.length - 1].emailID = Object.assign(this.emailID);

                        this.addedPersons[this.addedPersons.length - 1].personAddressInput = [];
                        this.addedPersons[this.addedPersons.length - 1].personAddressInput = Object.assign(this.personAddressInput);
                        this.addedPersons[this.addedPersons.length - 1].userPhoto = this.userProfilePicture ? this.userProfilePicture.s3bucketpathname : '';
                        this.addedPersons.map((item) => {
                            if (item.Dob) {
                                const dob = item.Dob + '';
                                const date = moment(new Date(dob.substr(0, 16)));
                                item.DobFormatted = date.format('MM/DD/YYYY');
                            } else {
                                item.DobFormatted = 'N/A';
                            }
                            item.fullName = item.Firstname + ' ' + item.Lastname;
                            if (item.personAddressInput && item.personAddressInput.length !== 0) {
                                item.fullAddress =
                                    item.personAddressInput[0].address1 +
                                    ' ' +
                                    item.personAddressInput[0].Address2 +
                                    ' ' +
                                    item.personAddressInput[0].city +
                                    ' ' +
                                    item.personAddressInput[0].state +
                                    ' ' +
                                    +item.personAddressInput[0].county +
                                    ' ' +
                                    item.personAddressInput[0].zipcode;
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
                    } else {
                        this._alertService.error('Person already exists');
                    }
                    // });
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
                    this.addedPersons[this.involvedPerson.index].fullName = this.addedPersons[this.involvedPerson.index].Firstname + ' ' + this.addedPersons[this.involvedPerson.index].Lastname;
                    this.addedPersons[this.involvedPerson.index].userPhoto = this.userProfilePicture ? this.userProfilePicture.s3bucketpathname : '';
                    if (this.addedPersons[this.involvedPerson.index].personAddressInput && this.addedPersons[this.involvedPerson.index].personAddressInput.length !== 0) {
                        this.addedPersons[this.involvedPerson.index].fullAddress =
                            this.addedPersons[this.involvedPerson.index].personAddressInput[0].address1 +
                            ' ' +
                            this.addedPersons[this.involvedPerson.index].personAddressInput[0].Address2 +
                            ' ' +
                            this.addedPersons[this.involvedPerson.index].personAddressInput[0].city +
                            ' ' +
                            this.addedPersons[this.involvedPerson.index].personAddressInput[0].state +
                            ' ' +
                            +this.addedPersons[this.involvedPerson.index].personAddressInput[0].county +
                            ' ' +
                            this.addedPersons[this.involvedPerson.index].personAddressInput[0].zipcode;
                    }
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
        this.imageChangedEvent = Object.assign({});
        this.isDefaultPhoto = true;
        this.isImageHide = false;
        this.beofreImageCropeHide = false;
        this.afterImageCropeHide = false;
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
        this.isImageHide = true;
        this.beofreImageCropeHide = false;
        (<any>$('#intake-addperson')).modal('show');
        (<any>$('#profile-click')).click();
        this.userProfile = '../../../../../assets/images/female.png';
    }
    navigateNext(modal) {
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
        const phoneNumber = this.personPhoneForm.get('contactnumber').value;
        const phoneType = this.personPhoneForm.get('contacttype').value;
        if (phoneNumber && phoneType) {
            this.phoneNumber.push({ contacttypeid: '', contactnumber: phoneNumber, contacttype: phoneType, isactive: 1 });
            this.phoneNumber$ = Observable.of(this.phoneNumber);
            this.personPhoneForm.reset();
        } else {
            this._alertService.warn('Please fill mandatory fields for Phone');
            ControlUtils.validateAllFormFields(this.personPhoneForm);
            // ControlUtils.setFocusOnInvalidFields();
        }
    }
    addEmail() {
        const emailID = this.personEmailForm.get('EmailID').value;
        const emailType = this.personEmailForm.get('EmailType').value;
        if (emailID && this.personEmailForm.invalid) {
            this._alertService.warn('Please enter a valid email id');
            return;
        }
        if (emailID && emailType && this.personEmailForm.valid) {
            this.emailID.push({ mailtypeid: '', mailid: emailID, mailtype: emailType, isactive: 1 });
            this.emailID$ = Observable.of(this.emailID);
            this.personEmailForm.reset();
        } else {
            this._alertService.warn('Please fill mandatory fields for Email');
            ControlUtils.validateAllFormFields(this.personEmailForm);
            // ControlUtils.setFocusOnInvalidFields();
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
    disabledInput(state: boolean, inputfield: string, manditory: string) {
        if (state === false && manditory === 'isManditory') {
            this.involvedPersonFormGroup.get(inputfield).enable();
            if (inputfield === 'DangerousselfReason') {
                this.involvedPersonFormGroup.get('Dangerousself').valueChanges.subscribe((Dangerousself: any) => {
                    if (Dangerousself === 'yes') {
                        this.involvedPersonFormGroup.get('DangerousselfReason').setValidators([Validators.required]);
                        this.involvedPersonFormGroup.get('DangerousselfReason').updateValueAndValidity();
                    } else {
                        this.involvedPersonFormGroup.get('DangerousselfReason').clearValidators();
                        this.involvedPersonFormGroup.get('DangerousselfReason').updateValueAndValidity();
                    }
                });
            }

            if (inputfield === 'DangerousWorkerReason') {
                this.involvedPersonFormGroup.get('Dangerousworker').valueChanges.subscribe((Dangerousself: any) => {
                    if (Dangerousself === 'yes') {
                        this.involvedPersonFormGroup.get('DangerousWorkerReason').setValidators([Validators.required]);
                        this.involvedPersonFormGroup.get('DangerousWorkerReason').updateValueAndValidity();
                    } else {
                        this.involvedPersonFormGroup.get('DangerousWorkerReason').clearValidators();
                        this.involvedPersonFormGroup.get('DangerousWorkerReason').updateValueAndValidity();
                    }
                });
            }

            if (inputfield === 'DangerousWorkerReason') {
                this.involvedPersonFormGroup.get('Dangerousworker').valueChanges.subscribe((Dangerousself: any) => {
                    if (Dangerousself === 'yes') {
                        this.involvedPersonFormGroup.get('DangerousWorkerReason').setValidators([Validators.required]);
                        this.involvedPersonFormGroup.get('DangerousWorkerReason').updateValueAndValidity();
                    } else {
                        this.involvedPersonFormGroup.get('DangerousWorkerReason').clearValidators();
                        this.involvedPersonFormGroup.get('DangerousWorkerReason').updateValueAndValidity();
                    }
                });
            }
            if (inputfield === 'mentallyimpairedReason') {
                this.involvedPersonFormGroup.get('mentallyimpaired').valueChanges.subscribe((Dangerousself: any) => {
                    if (Dangerousself === 'yes') {
                        this.involvedPersonFormGroup.get('mentallyimpairedReason').setValidators([Validators.required]);
                        this.involvedPersonFormGroup.get('mentallyimpairedReason').updateValueAndValidity();
                    } else {
                        this.involvedPersonFormGroup.get('mentallyimpairedReason').clearValidators();
                        this.involvedPersonFormGroup.get('mentallyimpairedReason').updateValueAndValidity();
                    }
                });
            }
            if (inputfield === 'mentalillsignReason') {
                this.involvedPersonFormGroup.get('mentalillsign').valueChanges.subscribe((Dangerousself: any) => {
                    if (Dangerousself === 'yes') {
                        this.involvedPersonFormGroup.get('mentalillsignReason').setValidators([Validators.required]);
                        this.involvedPersonFormGroup.get('mentalillsignReason').updateValueAndValidity();
                    } else {
                        this.involvedPersonFormGroup.get('mentalillsignReason').clearValidators();
                        this.involvedPersonFormGroup.get('mentalillsignReason').updateValueAndValidity();
                    }
                });
            }
        } else if (state === true) {
            this.involvedPersonFormGroup.get(inputfield).disable();
        } else if (state === false && manditory === 'notManditory') {
            this.involvedPersonFormGroup.get(inputfield).enable();
        }
    }
    relationShipToRO(event: any) {
        if (event.value !== 'RA' && event.value !== 'RC' && event.value !== 'CLI') {
            this.involvedPersonFormGroup.patchValue({ RelationshiptoRA: '' });
            this.involvedPersonFormGroup.get('RelationshiptoRA').setValidators([Validators.required]);
            this.involvedPersonFormGroup.get('RelationshiptoRA').updateValueAndValidity();
        } else {
            this.involvedPersonFormGroup.patchValue({ RelationshiptoRA: '' });
            this.involvedPersonFormGroup.get('RelationshiptoRA').clearValidators();
            this.involvedPersonFormGroup.get('RelationshiptoRA').updateValueAndValidity();
        }
    }
    fileChangeEvent(file: any) {
        this.beofreImageCropeHide = true;
        this.afterImageCropeHide = true;
        this.imageChangedEvent = file;
        this.isDefaultPhoto = false;
        this.isImageHide = true;
    }
    imageCropped(file: File) {
        this.progress.percentage = 0;
        this.croppedImage = file;
        const imageBase64 = this.croppedImage;
        const blob = this.dataURItoBlob(imageBase64);
        this.finalImage = new File([blob], 'image.png');
        this.saveImage(this.finalImage);
    }
    imageLoaded() {}
    loadImageFailed() {
        this._alertService.error('Image failed to upload');
    }
    dataURItoBlob(dataURI) {
        const binary = atob(dataURI.split(',')[1]);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {
            type: 'image/png'
        });
    }
    saveImage(data: any) {
        this._uploadService
            .upload({
                url: AppConfig.baseUrl + '/' + NewUrlConfig.EndPoint.DSDSAction.Attachment.UploadAttachmentUrl + '?access_token=' + this.token.id + '&srno=userprofile',
                headers: new HttpHeaders()
                    .set('access_token', this.token.id)
                    .set('srno', 'userprofile')
                    .set('ctype', 'file'),
                filesKey: ['file'],
                files: data,
                process: true
            })
            .subscribe(
                (response) => {
                    if (response.status) {
                        this.progress.percentage = response.percent;
                    }
                    if (response.status === 1 && response.data) {
                        this.userProfilePicture = response.data;
                    }
                },
                (err) => {
                    console.log(err);
                }
            );
    }
}
