import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DropdownModel } from '../../../../../@core/entities/common.entities';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { GLOBAL_MESSAGES } from '../../../../../@core/entities/constants';
import { HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../../../../../app.config';
import { FileError, NgxfUploaderService } from 'ngxf-uploader';
import { CommonHttpService, AuthService, AlertService, GenericService } from '../../../../../@core/services';
import { AppUser } from '../../../../../@core/entities/authDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Attachment } from '../_entities/attachmnt.model';
import { NewUrlConfig } from '../../../newintake-url.config';
import { AttachmentUpload } from '../../_entities/newintakeModel';
import { AttachmentDetailComponent } from '../attachment-detail/attachment-detail.component';
declare var $: any;
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'attachment-upload',
    templateUrl: './attachment-upload.component.html',
    styleUrls: ['./attachment-upload.component.scss']
})
export class AttachmentUploadComponent implements OnInit {
    curDate: Date;
    fileToSave = [];
    // intakeNumber: any;
    uploadedFile = [];
    tabActive = false;
    daNumber: string;
    id: string;
    attachmentResponse: AttachmentUpload;
    attachmentClassificationTypeDropDown$: Observable<DropdownModel[]>;
    attachmentTypeDropdown$: Observable<DropdownModel[]>;
    private token: AppUser;
    @Input() intakeNumber: string;
    @Output() attachment = new EventEmitter();
    @ViewChild(AttachmentDetailComponent) attachmentDetail: AttachmentDetailComponent;
    constructor(
        private router: Router,
        private _service: GenericService<Attachment>,
        private _dropDownService: CommonHttpService,
        private route: ActivatedRoute,
        private _uploadService: NgxfUploaderService,
        private _authService: AuthService,
        private _alertService: AlertService
    ) {
        this.id = route.snapshot.parent.params['id'];
        // this.intakeNumber = route.snapshot.params['intakeNumber'];
        this.token = this._authService.getCurrentUser();
    }

    ngOnInit() {
        this.loadDropdown();
        this.curDate = new Date();
        // (<any>$('#upload-attachment')).modal('show');
    }

    uploadFile(file: File | FileError): void {
        if (!(file instanceof Array)) {
            // this.alertError(file);
            return;
        }
        file.map((item, index) => {
            const fileExt = item.name
                .toLowerCase()
                .split('.')
                .pop();
            if (
                fileExt === 'mp3' ||
                fileExt === 'ogg' ||
                fileExt === 'wav' ||
                fileExt === 'acc' ||
                fileExt === 'flac' ||
                fileExt === 'aiff' ||
                fileExt === 'mp4' ||
                fileExt === 'mov' ||
                fileExt === 'avi' ||
                fileExt === '3gp' ||
                fileExt === 'wmv' ||
                fileExt === 'mpeg-4' ||
                fileExt === 'pdf' ||
                fileExt === 'txt' ||
                fileExt === 'docx' ||
                fileExt === 'doc' ||
                fileExt === 'xls' ||
                fileExt === 'xlsx' ||
                fileExt === 'jpeg' ||
                fileExt === 'jpg' ||
                fileExt === 'png' ||
                fileExt === 'gif' ||
                fileExt === 'ppt' ||
                fileExt === 'pptx' ||
                fileExt === 'gif'
            ) {
                // const uploadedFile = [];
                // uploadedFile.push(item);
                // this.uploadedFile = this.uploadedFile.concat(uploadedFile);
                this.uploadedFile.push(item);
                this.uploadAttachment(index);
            } else {
                // tslint:disable-next-line:quotemark
                this._alertService.error(fileExt + " format can't be uploaded");
                return;
            }
            // for (let i = 0; i < this.uploadedFile.length; i++) {
            //     this.uploadAttachment(i);
            // }
        });
        // this.uploadedFile.push(file);
        // this.uploadedFile = this.uploadedFile.concat(uploadedFile);
        // this.uploadedFile.map((item) => {
        //     this.saveAttachment(item);
        // });
    }

    humanizeBytes(bytes: number): string {
        if (bytes === 0) {
            return '0 Byte';
        }
        const k = 1024;
        const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i: number = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    uploadAttachment(index) {
        this._uploadService
            .upload({
                url: AppConfig.baseUrl + '/' + NewUrlConfig.EndPoint.DSDSAction.Attachment.UploadAttachmentUrl + '?access_token=' + this.token.id + '&' + 'srno=' + this.intakeNumber,
                headers: new HttpHeaders().set('access_token', this.token.id).set('ctype', 'file'),
                filesKey: ['file'],
                files: this.uploadedFile[index],
                process: true
            })
            .subscribe(
                (response) => {
                    if (response.status) {
                        // this.progress.percentage = response.percent;
                        this.uploadedFile[index].percentage = response.percent;
                    }
                    if (response.status === 1 && response.data) {
                        this.attachmentResponse = response.data;
                        this.fileToSave.push(response.data);
                        this.fileToSave[this.fileToSave.length - 1].documentattachment = {
                            attachmenttypekey: '',
                            attachmentclassificationtypekey: '',
                            attachmentdate: new Date(),
                            sourceauthor: '',
                            attachmentsubject: '',
                            sourceposition: '',
                            attachmentpurpose: '',
                            sourcephonenumber: '',
                            acquisitionmethod: '',
                            sourceaddress: '',
                            locationoforiginal: '',
                            insertedby: this.token.user.userprofile.displayname,
                            note: '',
                            updatedby: this.token.user.userprofile.displayname,
                            activeflag: 1
                        };
                        this.fileToSave[this.fileToSave.length - 1].description = '';
                        this.fileToSave[this.fileToSave.length - 1].documentdate = new Date();
                        this.fileToSave[this.fileToSave.length - 1].title = '';
                        this.fileToSave[this.fileToSave.length - 1].intakenumber = this.intakeNumber;
                        this.fileToSave[this.fileToSave.length - 1].objecttypekey = 'ServiceRequest';
                        this.fileToSave[this.fileToSave.length - 1].rootobjecttypekey = 'ServiceRequest';
                        this.fileToSave[this.fileToSave.length - 1].activeflag = 1;
                        this.fileToSave[this.fileToSave.length - 1].intakenumber = this.intakeNumber;
                        this.fileToSave[this.fileToSave.length - 1].insertedby = this.token.user.userprofile.displayname;
                        this.fileToSave[this.fileToSave.length - 1].updatedby = this.token.user.userprofile.displayname;

                        // this._alertService.success('File Uploaded Succesfully!');
                    }
                },
                (err) => {
                    console.log(err);
                    this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
                    this.uploadedFile.splice(index, 1);
                },
                () => {
                    console.log('complete');
                }
            );
    }
    formTab() {
        this.attachmentDetail.patchAttachmentDetail(this.attachmentResponse);
        this.attachmentDetail.loadDropdown();
        this.tabActive = true;
        $('#step1').removeClass('active');
        $('#complete').addClass('active');
    }
    modalDismiss() {
        (<any>$('#upload-attachment')).modal('hide');
    }
    deleteUpload(index) {
        // const curIndex = this.uploadedFile.length - index - 1;
        this.uploadedFile.splice(index, 1);
        this.fileToSave.splice(index, 1);
    }
    clearAllUpload() {
        this.uploadedFile = [];
        this.fileToSave = [];
    }
    titleUpdate(event, index) {
        // const curIndex = this.fileToSave.length - index;
        // this.fileToSave[index].title = event.target.value;
        this.uploadedFile[index].title = event.target.value;
        if (event.target.value) {
            this.uploadedFile[index].invalidTitle = false;
        } else {
            this.uploadedFile[index].invalidTitle = true;
        }
    }
    descUpdate(event, index) {
        // const curIndex = this.fileToSave.length - index;
        this.uploadedFile[index].description = event.target.value;
    }
    docDateUpdate(event, index) {
        this.uploadedFile[index].docDate = event.target.value;
    }
    typeUpdate(event, index) {
        // const curIndex = this.fileToSave.length - index;
        this.uploadedFile[index].attachmenttypekey = event.target.value;
        if (event.target.value) {
            this.uploadedFile[index].invalidAttachmentType = false;
        } else {
            this.uploadedFile[index].invalidAttachmentType = true;
        }
    }
    categoryUpdate(event, index) {
        // const curIndex = this.fileToSave.length - index;
        this.uploadedFile[index].attachmentclassificationtypekey = event.target.value;
        if (event.target.value) {
            this.uploadedFile[index].invalidAttachmentClassify = false;
        } else {
            this.uploadedFile[index].invalidAttachmentClassify = true;
        }
    }
    saveAttachmentDetails() {
        if (this.uploadedFile.length !== this.fileToSave.length) {
            this._alertService.error('Please wait till files get uploaded');
        } else {
            this.uploadedFile.map((item, index) => {
                this.fileToSave[index].title = item.title;
                this.fileToSave[index].description = item.description;
                this.fileToSave[index].documentattachment.attachmenttypekey = item.attachmenttypekey;
                this.fileToSave[index].documentattachment.attachmentclassificationtypekey = item.attachmentclassificationtypekey;
            });
            const AttachValidate = this.fileToSave.filter((wer) => !wer.documentattachment.attachmentclassificationtypekey || !wer.documentattachment.attachmenttypekey || !wer.title);
            // this.fileToSave.map((wer) => {
            if (AttachValidate.length === 0) {
                this._service.endpointUrl = NewUrlConfig.EndPoint.Intake.SaveAttachmentUrl;
                this._service.createArrayList(this.fileToSave).subscribe(
                    (response) => {
                        response.map((item, index) => {
                            if (item.documentpropertiesid) {
                                response.splice(index, 1);
                                this.fileToSave.splice(index, 1);
                                this.uploadedFile.splice(index, 1);
                            }
                            const docProp = response.filter((docId) => docId.Documentattachment);
                            if (docProp.length === 0) {
                                this._alertService.success('Attachment(s) added successfully!');
                                this.attachment.emit('all');
                                (<any>$('#upload-attachment')).modal('hide');
                                this.fileToSave = [];
                                this.uploadedFile = [];
                            }
                            if (item.Documentattachment) {
                                const attPos = index + 1;
                                this._alertService.error(item.Documentattachment + ' for Attachment ' + attPos);
                            } else if (!item.documentpropertiesid) {
                                this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
                            }
                        });
                        // if (response[0] && response[0].documentpropertiesid) {
                        //     this._alertService.success('Attachment added successfully!');
                        //     // this.modalDismiss.emit();
                        //     // let currentUrl = '/pages/newintake/my-newintake';
                        //     // if (this.id) {
                        //     //     currentUrl = '/pages/newintake/my-newintake/' + this.id;
                        //     // }
                        //     // this.router.navigateByUrl(currentUrl).then(() => {
                        //     //     this.router.navigated = true;
                        //     //     this.router.navigate([currentUrl]);
                        //     // });
                        //     this.attachment.emit('all');
                        //     (<any>$('#upload-attachment')).modal('hide');
                        //     this.fileToSave = [];
                        //     this.uploadedFile = [];
                    },
                    (error) => {
                        this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
                    }
                );
            } else {
                // tslint:disable-next-line:quotemark
                this._alertService.error('Please fill all mandatory fields');
                this.uploadedFile.map((item) => {
                    if (!item.title) {
                        item.invalidTitle = true;
                    } else {
                        item.invalidTitle = false;
                    }
                    if (!item.attachmentclassificationtypekey) {
                        item.invalidAttachmentClassify = true;
                    } else {
                        item.invalidAttachmentClassify = false;
                    }
                    if (!item.attachmenttypekey) {
                        item.invalidAttachmentType = true;
                    } else {
                        item.invalidAttachmentType = false;
                    }
                });
            }
        }
        // });
        // this.router.routeReuseStrategy.shouldReuseRoute = function() {
        //     return false;
        // };
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
