import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as RecordRTC from 'recordrtc/RecordRTC.min';
import { FileUtils } from '../../../../../@core/common/file-utils';
import { HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../../../../../app.config';
import { AppUser } from '../../../../../@core/entities/authDataModel';
import { NgxfUploaderService } from 'ngxf-uploader';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../@core/services';
import { AttachmentDetailComponent } from '../attachment-detail/attachment-detail.component';
import { NewUrlConfig } from '../../../newintake-url.config';

declare var $: any;
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'audio-record',
    templateUrl: './audio-record.component.html',
    styleUrls: ['./audio-record.component.scss']
})
export class AudioRecordComponent implements OnInit, AfterViewInit {
    intakeNumber: string;
    daNumber: string;
    id: string;
    tabActive = false;
    record = false;
    enableSave = false;
    private stream: MediaStream;
    private recordRTC: any;
    private videoBlob: any;
    private token: AppUser;

    @ViewChild('audio') audio;
    @ViewChild(AttachmentDetailComponent) attachmentDetail: AttachmentDetailComponent;

    constructor(private route: ActivatedRoute, private _uploadService: NgxfUploaderService, private _authService: AuthService) {
        this.id = route.snapshot.parent.params['id'];
        this.intakeNumber = route.snapshot.params['intakeNumber'];
        this.token = this._authService.getCurrentUser();
    }

    ngOnInit() {
        (<any>$('#upload-attachment')).modal('show');
    }

    ngAfterViewInit() {
        // set the initial state of the audio
        const audio: HTMLAudioElement = this.audio.nativeElement;
        audio.muted = false;
        audio.controls = true;
        audio.autoplay = false;
    }

    startRecording() {
        const mediaConstraints = {
            audio: true
        };
        navigator.mediaDevices.getUserMedia(mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));
        this.record = true;
    }

    stopRecording() {
        this.record = false;
        this.enableSave = true;
        if (this.recordRTC) {
            this.recordRTC.stopRecording(this.processVideo.bind(this));
            const stream = this.stream;
            stream.getAudioTracks().forEach((track) => track.stop());
        }
    }

    startUpload(): void {
        const fileName = FileUtils.getFileName('mp3');
        // we need to upload "File" --- not "Blob"
        const fileObject = new File([this.videoBlob], fileName, {
            type: 'audio/mp3'
        });
        this._uploadService
            .upload({
                url: AppConfig.baseUrl + '/' + NewUrlConfig.EndPoint.DSDSAction.Attachment.UploadAttachmentUrl + '?access_token=' + this.token.id + '&filetype=audio',
                headers: new HttpHeaders().set('access_token', this.token.id).set('ctype', 'file'),
                filesKey: ['file'],
                files: fileObject,
                process: true
            })
            .subscribe(
                (response) => {
                    if (response.data) {
                        this.attachmentDetail.patchAttachmentDetail(response.data);
                        this.attachmentDetail.loadDropdown();
                        this.tabActive = true;
                        $('#step1').removeClass('active');
                        $('#complete').addClass('active');
                    }
                },
                (err) => {
                    console.log(err);
                },
                () => {
                    console.log('complete');
                }
            );
    }
    modalDismiss() {
        (<any>$('#upload-attachment')).modal('hide');
    }

    private successCallback(stream: MediaStream) {
        const options = {
            mimeType: 'audio/mp3',
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 128000,
            bitsPerSecond: 128000 // if this line is provided, skip above two
        };
        this.stream = stream;
        this.recordRTC = RecordRTC(stream, options);
        this.recordRTC.startRecording();
        const audio: HTMLAudioElement = this.audio.nativeElement;
        audio.src = window.URL.createObjectURL(stream);
        this.toggleControls();
    }

    private errorCallback() {
        // handle error here
    }

    private processVideo(audioVideoWebMURL) {
        const audio: HTMLAudioElement = this.audio.nativeElement;
        const recordRTC = this.recordRTC;
        audio.src = audioVideoWebMURL;
        this.toggleControls();
        this.videoBlob = recordRTC.getBlob();
        recordRTC.getDataURL(function(dataURL) {});
    }
    private toggleControls() {
        const audio: HTMLAudioElement = this.audio.nativeElement;
        audio.muted = !audio.muted;
        audio.controls = !audio.controls;
        audio.autoplay = !audio.autoplay;
    }
}
