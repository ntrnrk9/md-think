import { AfterViewInit, ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms/src/model';
import { ActivatedRoute } from '@angular/router';
import { Popover } from 'ngx-popover';
import { NgxfUploaderService } from 'ngxf-uploader';
import { Subject } from 'rxjs/Rx';

import { REGEX } from '../../../../@core/entities/constants';
import { GenericService } from '../../../../@core/services';
import { AlertService } from '../../../../@core/services/alert.service';
import { AuthService } from '../../../../@core/services/auth.service';
import { SpeechRecognitionService } from '../../../../@core/services/speech-recognition.service';
import { ActionContext } from '../../../../shared/modules/web-speech/shared/model/strategy/action-context';
import { SpeechRecognizerService } from '../../../../shared/modules/web-speech/shared/services/speech-recognizer.service';
import { NewUrlConfig } from '../../newintake-url.config';
import { Narrative, AttachmentUpload, ResourcePermission } from '../_entities/newintakeModel';

declare var $: any;
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'newintake-narrative',
    templateUrl: './newintake-narrative.component.html',
    styleUrls: ['./newintake-narrative.component.scss', '../../../../../styles/trumbowyg.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NewintakeNarrativeComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() narrativeInputSubject$ = new Subject<Narrative[]>();
    @Input() intakeNumberNarrative: string;
    @Input() narrativeOutputSubject$ = new Subject<Narrative>();
    @Input() draftId: string;
    @Input() finalNarrativeText$ = new Subject<string>();
    audioCollection: AttachmentUpload[] = [];
    intakeNarrativeForm: FormGroup;
    speechRecogninitionOn: boolean;
    speechData: string;
    notification: string;
    finalTranscript = '';
    recognizing = false;
    actionContext: ActionContext = new ActionContext();
    currentLanguage: string;
    firstNameControlName: AbstractControl;
    lastNameControlName: AbstractControl;
    tooltip: string;
    @ViewChild('myPopover') myPopover: Popover;
    constructor(
        private formBuilder: FormBuilder,
        private speechRecognizer: SpeechRecognizerService,
        private _alertService: AlertService,
        private _changeDetect: ChangeDetectorRef,
        private _uploadService: NgxfUploaderService,
        private _authService: AuthService,
        private route: ActivatedRoute,
        private _speechRecognitionService: SpeechRecognitionService,
        private _resourceService: GenericService<ResourcePermission>,
        private zone: NgZone
    ) {
        this.speechRecogninitionOn = false;
        this.speechData = '';
    }

    ngOnInit() {
        this.myPopover.show();
        this.narrativeForm();
        this.currentLanguage = 'en-US';
        this.speechRecognizer.initialize(this.currentLanguage);
        this.notification = null;
        $('.trumbowyg-textarea').trumbowyg('disable');
        this.intakeNarrativeForm.get('Narrative').valueChanges.subscribe((text) => {
            this.finalTranscript = text;
            this.narrativeInputSubject$.next(this.intakeNarrativeForm.value);
            this.finalNarrativeText$.next(this.finalTranscript);
        });

        this.firstNameControlName = this.intakeNarrativeForm.get('Firstname');
        this.lastNameControlName = this.intakeNarrativeForm.get('Lastname');
        if (this.draftId !== '0') {
            this.narrativeTooltip();
            this.narrativeOutputSubject$.subscribe((data) => {
                this.intakeNarrativeForm.patchValue(data);
                if (data.IsUnknownReporter === true) {
                    this.firstNameControlName.disable();
                    this.lastNameControlName.disable();
                }
                this.narrativeInputSubject$.next(this.intakeNarrativeForm.value);
            });
        }
    }
    ngAfterViewInit() {
        const self = this;
        this.zone.run(() => {
            $('.trumbowyg-textarea')
                .trumbowyg()
                .on('tbwfocus', function () {
                    self.openPopover();
                });
        });
    }
    openPopover() {
        this.myPopover.show();
    }
    closePopover() {
        this.myPopover.hide();
    }
    private narrativeForm() {
        this.intakeNarrativeForm = this.formBuilder.group({
            Firstname: [''],
            Lastname: [''],
            Narrative: ['', [Validators.required, REGEX.NOT_EMPTY_VALIDATOR]],
            Role: ['Rep'],
            IsAnonymousReporter: false,
            IsUnknownReporter: false
        });
    }
    onChange(event) {
        this.narrativeInputSubject$.next(this.intakeNarrativeForm.value);
    }
    changeReport(event: any, type: string) {
        if (type === 'Anonymous') {
            if (event.target.checked) {
                this.intakeNarrativeForm.value.IsAnonymousReporter = true;
                this.intakeNarrativeForm.value.IsUnknownReporter = false;
                // this.firstNameControlName.disable();
                // this.lastNameControlName.disable();
                this.firstNameControlName.enable();
                this.lastNameControlName.enable();
                this.intakeNarrativeForm.patchValue({
                    Role: '',
                    Firstname: '',
                    Lastname: '',
                    IsUnknownReporter: false
                });
            } else {
                this.firstNameControlName.enable();
                this.lastNameControlName.enable();
                this.intakeNarrativeForm.patchValue({
                    Role: 'Rep'
                });
                this.intakeNarrativeForm.value.IsAnonymousReporter = false;
            }
        } else if (type === 'Unknown') {
            if (event.target.checked) {
                this.intakeNarrativeForm.value.IsUnknownReporter = true;
                this.intakeNarrativeForm.value.IsAnonymousReporter = false;
                this.firstNameControlName.disable();
                this.lastNameControlName.disable();
                this.intakeNarrativeForm.patchValue({
                    Role: '',
                    Firstname: '',
                    Lastname: '',
                    IsAnonymousReporter: false
                });
            } else {
                this.firstNameControlName.enable();
                this.lastNameControlName.enable();
                this.intakeNarrativeForm.patchValue({
                    Role: '',
                    Firstname: '',
                    Lastname: '',
                    IsAnonymousReporter: false
                });
                this.intakeNarrativeForm.value.IsUnknownReporter = false;
            }
        }

        this.narrativeInputSubject$.next(this.intakeNarrativeForm.value);
    }
    ngOnDestroy() {
        this._speechRecognitionService.destroySpeechObject();
        // (<any>$('#show-myModal')).modal('show');
    }

    activateSpeechToText(): void {
        this.recognizing = true;
        this.speechRecogninitionOn = !this.speechRecogninitionOn;
        if (this.speechRecogninitionOn) {
            this._speechRecognitionService.record().subscribe(
                // listener
                (value) => {
                    this.speechData = value;
                    this.intakeNarrativeForm.patchValue({ Narrative: this.speechData });
                },
                // errror
                (err) => {
                    console.log(err);
                    this.recognizing = false;
                    if (err.error === 'no-speech') {
                        this.notification = `No speech has been detected. Please try again.`;
                        this._alertService.warn(this.notification);
                        this.activateSpeechToText();
                    } else if (err.error === 'not-allowed') {
                        this.notification = `Your browser is not authorized to access your microphone. Verify that your browser has access to your microphone and try again.`;
                        this._alertService.warn(this.notification);
                        // this.activateSpeechToText();
                    } else if (err.error === 'not-microphone') {
                        this.notification = `Microphone is not available. Plese verify the connection of your microphone and try again.`;
                        this._alertService.warn(this.notification);
                        // this.activateSpeechToText();
                    }
                },
                // completion
                () => {
                    this.speechRecogninitionOn = true;
                    console.log('--complete--');
                    this.activateSpeechToText();
                }
            );
        } else {
            this.recognizing = false;
            this.deActivateSpeechRecognition();
        }
    }
    deActivateSpeechRecognition() {
        this.speechRecogninitionOn = false;
        this._speechRecognitionService.destroySpeechObject();
    }
    private narrativeTooltip() {
        this._resourceService
            .getArrayList(
                {
                    method: 'get',
                    where: {
                        resourcetype: [3],
                        // parentid: '5c70b495-4a13-4b70-83fa-ab0e2b341cb8'
                        parentid: 'f9c6ea93-5699-4df2-b7a9-92c32b9b325c'
                    }
                },
                NewUrlConfig.EndPoint.Intake.ResourceTooltipUrl + '?filter'
            )
            .subscribe((result) => {
                result.map((item) => {
                    if (item.name === 'Narrative') {
                        this.tooltip = item.tooltip;
                        return;
                    }
                });
            });
    }
}
