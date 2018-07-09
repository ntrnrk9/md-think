import { Injectable, OnInit } from '@angular/core';
declare var $: any;

export interface Token {
    id: string;
    ttl: number;
    created: Date;
    userId: string;
}

@Injectable()
export class AppToken implements Token {
    id: string;
    ttl: number;
    created: Date;
    userId: string;
    user: UserInfo;
}

@Injectable()
export class AppUser extends AppToken {
    role: AppRole;
    resources: AppResource[];
}

export class UserLogin {
    public email: string;
    public password: string;
}

export class AppRole {
    id: string;
    name: string;
    description: string;
}

export class AppResource {
    id: string;
    parentid: string;
    name: string;
    resourcetype: number;
}
export class UserInfo {
    realm: string;
    username: string;
    email: string;
    securityusersid: string;
    emailVerified: boolean;
    id: number;
    userphoto: string;
    userprofile: UserProfile;
}

export class UserProfile {
    securityusersid: string;
    firstname: string;
    lastname: string;
    displayname: string;
    fullname: string;
    activeflag: number;
    otherfields: string;
    onprobation: boolean;
    expirationdate: Date;
    email: string;
    oldId: string;
    title: string;
    isavailable: boolean;
    userworkstatustypekey: string;
    voidedby: string;
    voidedon: Date;
    voidreasonid: string;
    calendarkey: string;
    orgname: string;
    orgnumber: string;
    usertypekey: string;
    autonotification: boolean;
    userphoto: string;
    gendertypekey: string;
    middlename: string;
    dob: Date;
}
