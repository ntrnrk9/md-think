import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewUrlConfig } from '../../../newintake-url.config';
import { GenericService, AlertService, CommonHttpService, AuthService } from '../../../../../@core/services';
import { GLOBAL_MESSAGES } from '../../../../../@core/entities/constants';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs/Rx';
import { DropdownModel } from '../../../../../@core/entities/common.entities';
import { AppUser } from '../../../../../@core/entities/authDataModel';
import { Attachment } from '../_entities/attachmnt.model';
declare var $: any;
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'edit-attachment',
    templateUrl: './edit-attachment.component.html',
    styleUrls: ['./edit-attachment.component.scss']
})
export class EditAttachmentComponent implements OnInit {
    attachmentClassificationTypeDropDown$: Observable<DropdownModel[]>;
    attachmentTypeDropdown$: Observable<DropdownModel[]>;
    fileUpdate: FormGroup;
    token: AppUser;

    @Input() intakeNumber: string;
    attachmentDetail: Attachment;
    @Output() attachment = new EventEmitter();
    constructor(
        private formBuilder: FormBuilder,
        private _authService: AuthService,
        private _dropDownService: CommonHttpService,
        private _service: GenericService<Attachment>,
        private _alertService: AlertService
    ) {
        this.token = this._authService.getCurrentUser();
    }

    ngOnInit() {
        this.loadDropdown();
        console.log(this.attachmentDetail);
        this.fileUpdate = this.formBuilder.group({
            title: [''],
            description: ['', Validators.maxLength(150)],
            attachmentTypeKey: [''],
            attachmentClassificationTypeKey: ['']
        });
    }
    editForm(attachmentDetail) {
        this.fileUpdate.markAsPristine();
        console.log(attachmentDetail);
        this.fileUpdate.patchValue({
            title: attachmentDetail.title ? attachmentDetail.title : '',
            description: attachmentDetail.description ? attachmentDetail.description : '',
            attachmentTypeKey: '',
            attachmentClassificationTypeKey: ''
        });
        if (attachmentDetail.documentattachment) {
            this.fileUpdate.patchValue({
                attachmentTypeKey: attachmentDetail.documentattachment.attachmenttypekey ? attachmentDetail.documentattachment.attachmenttypekey : '',
                attachmentClassificationTypeKey: attachmentDetail.documentattachment.attachmentclassificationtypekey ? attachmentDetail.documentattachment.attachmentclassificationtypekey : ''
            });
        } else {
            attachmentDetail.documentattachment = Object.assign({});
        }
        // this.currDate = new Date();
        this.attachmentDetail = attachmentDetail;
    }

    resetForm() {
        // this.fileUpdate.reset();
        // this.fileUpdate.patchValue({
        //     attachmentTypeKey: '',
        //     attachmentClassificationTypeKey: ''
        // });
        (<any>$('#edit-attachment')).modal('hide');
    }
    saveAttachmentDetails() {
        if (this.fileUpdate.value.title !== '' && this.fileUpdate.value.attachmentTypeKey !== '' && this.fileUpdate.value.attachmentClassificationTypeKey !== '') {
            this.attachmentDetail.title = this.fileUpdate.value.title;
            this.attachmentDetail.description = this.fileUpdate.value.description;
            this.attachmentDetail.documentattachment.attachmenttypekey = this.fileUpdate.value.attachmentTypeKey;
            this.attachmentDetail.documentattachment.attachmentclassificationtypekey = this.fileUpdate.value.attachmentClassificationTypeKey;
            this.attachmentDetail.documentattachment.updatedby = this.token.user.userprofile.displayname;
            this.attachmentDetail.documentattachment.attachmentdate = new Date();
            this.attachmentDetail.documentdate = new Date();
            this._service.endpointUrl = NewUrlConfig.EndPoint.Intake.SaveAttachmentUrl;
            this._service.createArrayList([this.attachmentDetail]).subscribe(
                (response) => {
                    console.log(response);
                    this._alertService.success('Attachment updated successfully!');
                    (<any>$('#edit-attachment')).modal('hide');
                    this.attachment.emit('all');
                },
                (error) => {
                    this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
                }
            );
        } else {
            this._alertService.error('Please fill all mandatory fields');
        }
    }
    private loadDropdown() {
        const source = forkJoin(
            this._dropDownService.getArrayList(
                {
                    nolimit: true
                },
                NewUrlConfig.EndPoint.DSDSAction.Attachment.AttachmentTypeUrl + '?filter={"nolimit": true}'
            ),
            this._dropDownService.getArrayList(
                {
                    nolimit: true
                },
                NewUrlConfig.EndPoint.DSDSAction.Attachment.AttachmentClassificationTypeUrl + '?filter={"nolimit": true}'
            )
        )
            .map((result) => {
                return {
                    attachmentType: result[0].map(
                        (res) =>
                            new DropdownModel({
                                text: res.typedescription,
                                value: res.attachmenttypekey
                            })
                    ),
                    attachmentClassificationType: result[1].map(
                        (res) =>
                            new DropdownModel({
                                text: res.typedescription,
                                value: res.attachmentclassificationtypekey
                            })
                    )
                };
            })
            .share();
        this.attachmentTypeDropdown$ = source.pluck('attachmentType');
        this.attachmentClassificationTypeDropDown$ = source.pluck('attachmentClassificationType');
    }
}
