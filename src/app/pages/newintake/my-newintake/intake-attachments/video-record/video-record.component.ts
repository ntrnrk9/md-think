import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import * as RecordRTC from 'recordrtc/RecordRTC.min';
import { AppConfig } from '../../../../../app.config';
import { FileUtils } from '../../../../../@core/common/file-utils';
import { AppUser } from '../../../../../@core/entities/authDataModel';
import { AttachmentDetailComponent } from '../attachment-detail/attachment-detail.component';
import { ActivatedRoute } from '@angular/router';
import { NgxfUploaderService } from 'ngxf-uploader';
import { AuthService } from '../../../../../@core/services';
import { NewUrlConfig } from '../../../newintake-url.config';
declare var $: any;
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'video-record',
    templateUrl: './video-record.component.html',
    styleUrls: ['./video-record.component.scss']
})
export class VideoRecordComponent implements OnInit, AfterViewInit {
    intakeNumber: string;
    daNumber: string;
    id: string;
    record = false;
    tabActive = false;
    enableSave = false;
    private videoBlob: Blob;
    private stream: MediaStream;
    private recordRTC: any;
    private token: AppUser;
    @ViewChild('video') video;
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
        const video: HTMLVideoElement = this.video.nativeElement;
        video.muted = false;
        video.controls = true;
        video.autoplay = false;
    }

    startRecording() {
        const mediaConstraints = {
            video: {
                width: 640,
                height: 360
            },
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
            stream.getVideoTracks().forEach((track) => track.stop());
        }
    }
    startUpload(): void {
        const fileName = FileUtils.getFileName('webm');
        const fileId = this.id + '/' + this.daNumber;
        // we need to upload "File" --- not "Blob"
        const fileObject = new File([this.videoBlob], fileName, {
            type: 'video/webm'
        });

        this._uploadService
            .upload({
                url: AppConfig.baseUrl + '/' + NewUrlConfig.EndPoint.DSDSAction.Attachment.UploadAttachmentUrl + '?access_token=' + this.token.id + '&filetype=video',
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
                }
            );
    }
    modalDismiss() {
        (<any>$('#upload-attachment')).modal('hide');
    }

    private successCallback(stream: MediaStream) {
        const options = {
            mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 128000,
            bitsPerSecond: 128000 // if this line is provided, skip above two
        };
        this.stream = stream;
        this.recordRTC = RecordRTC(stream, options);
        this.recordRTC.startRecording();
        const video: HTMLVideoElement = this.video.nativeElement;
        video.src = window.URL.createObjectURL(stream);
        this.toggleControls();
    }

    private errorCallback() {
        // handle error here
    }

    private processVideo(audioVideoWebMURL) {
        const video: HTMLVideoElement = this.video.nativeElement;
        const recordRTC = this.recordRTC;
        video.src = audioVideoWebMURL;
        this.toggleControls();
        this.videoBlob = recordRTC.getBlob();
        recordRTC.getDataURL(function(dataURL) {});
    }
    private toggleControls() {
        const video: HTMLVideoElement = this.video.nativeElement;
        video.muted = !video.muted;
        video.controls = !video.controls;
        video.autoplay = !video.autoplay;
    }
}
