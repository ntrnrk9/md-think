import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Observable, Subject } from 'rxjs/Rx';
import { PaginationRequest, DropdownModel } from '../../../../@core/entities/common.entities';
import { CommonHttpService, AlertService, GenericService } from '../../../../@core/services';
import { EditAttachmentComponent } from './edit-attachment/edit-attachment.component';
import { GLOBAL_MESSAGES } from '../../../../@core/entities/constants';
import { Attachment } from './_entities/attachmnt.model';
import { NewUrlConfig } from '../../newintake-url.config';
declare var $: any;
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'intake-attachments',
    templateUrl: './intake-attachments.component.html',
    styleUrls: ['./intake-attachments.component.scss']
})
export class IntakeAttachmentsComponent implements OnInit {
    documentPropertiesId: any;
    @Input() addAttachementSubject$ = new Subject<Attachment[]>();
    filteredAttachmentGrid: Attachment[] = [];
    intakeNumber: string;
    attachmentTypeDropdown$: Observable<DropdownModel[]>;
    daNumber: string;
    id: string;
    attachmentType: FormGroup;
    private allAttachmentGrid: Attachment[];
    @ViewChild(EditAttachmentComponent) editAttach: EditAttachmentComponent;
    constructor(
        private formBuilder: FormBuilder,
        private _dropDownService: CommonHttpService,
        private _service: GenericService<Attachment>,
        private route: ActivatedRoute,
        private _alertService: AlertService
    ) {
        this.id = route.snapshot.params['id'];
    }

    ngOnInit() {
        this.loadDropdown();
        this.attachmentType = this.formBuilder.group({
            selectedAttachment: ['All']
        });
    }
    getIntakeNumber(intakeNumber) {
        this.intakeNumber = intakeNumber;
        this.attachment('All');
    }
    filterAttachment(attachType) {
        if (attachType.selectedAttachment === 'All') {
            this.filteredAttachmentGrid = this.allAttachmentGrid;
        } else if (attachType.selectedAttachment === 'Exhibit') {
            this.filteredAttachmentGrid = this.allAttachmentGrid.filter((item) => item.documenttypekey === attachType.selectedAttachment);
        } else {
            this.filteredAttachmentGrid = this.allAttachmentGrid.filter((item) => item.documentattachment && item.documentattachment.attachmenttypekey === attachType.selectedAttachment);
        }
    }
    checkFileType(file: string, accept: string): boolean {
        if (accept) {
            const acceptedFilesArray = accept.split(',');
            return acceptedFilesArray.some((type) => {
                const validType = type.trim();
                if (validType.charAt(0) === '.') {
                    return file.toLowerCase().endsWith(validType.toLowerCase());
                }
                return false;
            });
        }
        return true;
    }
    editAttachment(modal) {
        this.editAttach.editForm(modal);
        (<any>$('#edit-attachment')).modal('show');
    }
    confirmDelete(modal) {
        this.documentPropertiesId = modal.documentpropertiesid;
        (<any>$('#delete-attachment')).modal('show');
    }
    deleteAttachment() {
        this._service.endpointUrl = NewUrlConfig.EndPoint.Intake.DeleteAttachmentUrl;
        this._service.remove(this.documentPropertiesId).subscribe(
            (result) => {
                (<any>$('#delete-attachment')).modal('hide');
                this.attachment('All');
                this._alertService.success('Attachment Deleted successfully!');
            },
            (err) => {
                this._alertService.error(GLOBAL_MESSAGES.ERROR_MESSAGE);
            }
        );
    }
    attachment(attachType) {
        this._dropDownService
            .getArrayList(
                new PaginationRequest({
                    nolimit: true,
                    order: 'originalfilename',
                    method: 'get'
                }),
                NewUrlConfig.EndPoint.Intake.AttachmentGridUrl + '/' + this.intakeNumber + '?data'
            )
            .subscribe((result) => {
                this.allAttachmentGrid = result;
                // this.filteredAttachmentGrid = this.allAttachmentGrid;
                result.map((item) => {
                    item.numberofbytes = this.humanizeBytes(item.numberofbytes);
                });
                this.filteredAttachmentGrid = result;
                this.addAttachementSubject$.next(result);
            });
    }

    private loadDropdown() {
        this.attachmentTypeDropdown$ = this._dropDownService.getArrayList({}, NewUrlConfig.EndPoint.DSDSAction.Attachment.AttachmentTypeUrl).map((result) => {
            return result.map(
                (res) =>
                    new DropdownModel({
                        text: res.typedescription,
                        value: res.attachmenttypekey
                    })
            );
        });
    }
    private humanizeBytes(bytes: number): string {
        if (bytes === 0) {
            return '0 Byte';
        }
        const k = 1024;
        const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i: number = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
