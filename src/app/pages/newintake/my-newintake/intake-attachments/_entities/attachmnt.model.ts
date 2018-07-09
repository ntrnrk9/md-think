import { expand } from 'rxjs/operators/expand';

export class Attachment {
    filename: string;
    Documentproperties: string;
    Documentattachment: string;
    documentpropertiesid: string;
    documenttypekey: string;
    documentdate: Date;
    title: string;
    mime: string;
    insertedby: string;
    insertedon: Date;
    documentattachment: AttachmentType;
    userprofile: UserProfile;
    s3bucketpathname: string;
    description: string;
}
export class AttachmentType {
    documentpropertiesid: string;
    attachmenttypekey: string;
    attachmentclassificationtypekey: string;
    updatedby: string;
    attachmentdate: Date;
}

export class UserProfile {
    securityusersid: string;
    firstname: string;
    lastname: string;
    displayname: string;
}
