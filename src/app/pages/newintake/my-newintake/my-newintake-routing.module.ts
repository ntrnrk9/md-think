import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttachmentUploadComponent } from './intake-attachments/attachment-upload/attachment-upload.component';
import { AudioRecordComponent } from './intake-attachments/audio-record/audio-record.component';
import { ImageRecordComponent } from './intake-attachments/image-record/image-record.component';
import { VideoRecordComponent } from './intake-attachments/video-record/video-record.component';
import { MyNewintakeComponent } from './my-newintake.component';

const routes: Routes = [
    {
        path: '',
        component: MyNewintakeComponent,
        // canActivate: [RoleGuard],
        children: [
            { path: 'audio-record/:intakeNumber', component: AudioRecordComponent },
            { path: 'video-record/:intakeNumber', component: VideoRecordComponent },
            { path: 'image-record/:intakeNumber', component: ImageRecordComponent },
            { path: 'attachment-upload/:intakeNumber', component: AttachmentUploadComponent }
        ]
    },
    {
        path: ':id',
        component: MyNewintakeComponent,
        children: [
            { path: 'audio-record/:intakeNumber', component: AudioRecordComponent },
            { path: 'video-record/:intakeNumber', component: VideoRecordComponent },
            { path: 'image-record/:intakeNumber', component: ImageRecordComponent },
            { path: 'attachment-upload/:intakeNumber', component: AttachmentUploadComponent }
        ]
        // canActivate: [RoleGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyNewintakeRoutingModule {}
