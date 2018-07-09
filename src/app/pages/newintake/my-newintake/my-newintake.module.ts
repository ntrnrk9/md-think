import 'trumbowyg/dist/trumbowyg.min.js';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { A2Edatetimepicker } from 'ng2-eonasdan-datetimepicker';
import { PaginationModule } from 'ngx-bootstrap';
import { PopoverModule } from 'ngx-popover';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgxMaskModule } from 'ngx-mask';
import { TrumbowygNgxModule } from 'trumbowyg-ngx';
import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatRadioModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';

import { SharedDirectivesModule } from '../../../@core/directives/shared-directives.module';
import { SharedPipesModule } from '../../../@core/pipes/shared-pipes.module';
import { SpeechRecognitionService } from '../../../@core/services/speech-recognition.service';
import { ControlMessagesModule } from '../../../shared/modules/control-messages/control-messages.module';
import { SortTableModule } from '../../../shared/modules/sortable-table/sortable-table.module';
import { IntakeAssessmentComponent } from './intake-assessment/intake-assessment.component';
import { IntakeAttachmentsComponent } from './intake-attachments/intake-attachments.component';
import { IntakeCommunicationsComponent } from './intake-communications/intake-communications.component';
import { IntakeCrossRefferenceComponent } from './intake-cross-refference/intake-cross-refference.component';
import { IntakeEntitiesComponent } from './intake-entities/intake-entities.component';
import { IntakePersonsInvolvedComponent } from './intake-persons-involved/intake-persons-involved.component';
import { IntakeServiceSubtypeComponent } from './intake-service-subtype/intake-service-subtype.component';
import { MyNewintakeRoutingModule } from './my-newintake-routing.module';
import { MyNewintakeComponent } from './my-newintake.component';
import { NewintakeNarrativeComponent } from './newintake-narrative/newintake-narrative.component';
import { SpeechRecognizerService } from '../../../shared/modules/web-speech/shared/services/speech-recognizer.service';
import { NgxfUploaderService, NgxfUploaderModule } from 'ngxf-uploader';
import { IntakePersonSearchComponent } from './intake-persons-involved/intake-person-search.component';
import { AudioRecordComponent } from './intake-attachments/audio-record/audio-record.component';
import { VideoRecordComponent } from './intake-attachments/video-record/video-record.component';
import { ImageRecordComponent } from './intake-attachments/image-record/image-record.component';
import { AttachmentUploadComponent } from './intake-attachments/attachment-upload/attachment-upload.component';
import { AttachmentDetailComponent } from './intake-attachments/attachment-detail/attachment-detail.component';
import { EditAttachmentComponent } from './intake-attachments/edit-attachment/edit-attachment.component';
import { IntakeDispositionComponent } from './intake-disposition/intake-disposition.component';
import { IntakeEvaluationFieldsComponent } from './intake-evaluation-fields/intake-evaluation-fields.component';
import { IntakeComplaintTypeComponent } from './intake-complaint-type/intake-complaint-type.component';

@NgModule({
    imports: [
        CommonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatRadioModule,
        MyNewintakeRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        PaginationModule,
        TimepickerModule,
        ControlMessagesModule,
        SharedDirectivesModule,
        SharedPipesModule,
        NgSelectModule,
        SortTableModule,
        NgxMaskModule.forRoot(),
        TrumbowygNgxModule.withConfig({
            svgPath: '../../../../assets/images/icons.svg'
        }),
        A2Edatetimepicker,
        NgxMaskModule.forRoot(),
        PopoverModule,
        NgxfUploaderModule.forRoot()
    ],
    declarations: [
        MyNewintakeComponent,
        NewintakeNarrativeComponent,
        IntakePersonsInvolvedComponent,
        IntakeEntitiesComponent,
        IntakeServiceSubtypeComponent,
        IntakeAssessmentComponent,
        IntakeCrossRefferenceComponent,
        IntakeCommunicationsComponent,
        IntakeAttachmentsComponent,
        IntakePersonSearchComponent,
        AudioRecordComponent,
        VideoRecordComponent,
        ImageRecordComponent,
        AttachmentUploadComponent,
        AttachmentDetailComponent,
        EditAttachmentComponent,
        IntakeDispositionComponent,
        IntakeEvaluationFieldsComponent,
        IntakeComplaintTypeComponent
    ],
    exports: [MyNewintakeComponent],
    providers: [SpeechRecognitionService, SpeechRecognizerService, NgxfUploaderService]
})
export class MyNewintakeModule {}
