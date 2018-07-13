import { Allegation, CrossReference, IntakeDATypeDetail, InvolvedEntitySearchResponse, InvolvedPerson, Recording, AttachmentIntake } from './newintakeModel';

export class IntakeScreen {
    General: General = new General();
    DAType: DATypeDetails = new DATypeDetails();
    Agency: Agency[] = [];
    CrossReferences: CrossReference[] = [];
    Person: Person[] = [];
    Recording: Recordings = new Recordings();
    Allegations: Allegation[] = [];
    NarrativeIntake: NarrativeIntake = new NarrativeIntake();
    AttachmentIntake: AttachmentIntakes[] = [];
    EvaluationField: EvaluationFields = new EvaluationFields();
}

export class DATypeDetails {
    DATypeDetail: DATypeDetail[] = [];
}

export class Recordings {
    Recordings: Recording[] = [];
}
export class NarrativeIntake {
    NarrativeIntake: NarrativeIntake[] = [];
}
export class AttachmentIntakes {
    AttachmentIntakes: AttachmentIntake[] = [];
}
export class General {
    CreatedDate: Date;
    Source: string;
    Author: string;
    RecivedDate: string;
    Time = new Date();
    Narrative: string;
    GroupReason: string[];
    InputSource: string;
    GroupSummary: string[];
    IsAnonymousReporter: boolean;
    IsUnknownReporter: boolean;
    MisssingPersons: boolean;
    SuspiciousDeath: boolean;
    IllegalActivity: boolean;
    IllegalActivityKey: string;
    SignificantEvent: boolean;
    SignificantEventKey: string;
    IntakeNumber = '';
    MoNumber: string;
    Purpose: string;
    Agency: string;
    intakeservice = [];
    otheragency: string;
    isOtherAgency: boolean;
    dispositioncode: string;
    intakeserreqstatustypekey: string;
    Firstname: string;
    Lastname: string;
    AgencyCode: string;
}

export class DATypeDetail {
    DaTypeKey: string;
    DasubtypeKey: string;
    Investigatable: boolean;
    Actionable: boolean;
    personid: string;
    DAStatus: string;
    DADisposition: string[];
    CancelReason: string[];
    CancelDescription: string[];
    Summary: string[];
    ServiceRequestNumber: string;
    GroupNumber: string;
    GroupReasonType: string;
    GroupComment: string;
    constructor(initializer?: IntakeDATypeDetail) {
        this.Actionable = initializer.Actionable;
        this.DaTypeKey = initializer.DaTypeKey;
        this.DasubtypeKey = initializer.DasubtypeKey;
        this.Investigatable = initializer.Investigatable;
        this.personid = '';
        this.DAStatus = initializer.DAStatus;
        this.DADisposition = [initializer.DADisposition];
        this.CancelReason = [initializer.CancelReason];
        this.CancelDescription = [initializer.CancelDescription];
        this.Summary = [initializer.Summary];
        this.ServiceRequestNumber = initializer.ServiceRequestNumber;
        this.GroupNumber = initializer.GroupNumber;
        this.GroupReasonType = initializer.GroupReasonType;
        this.GroupComment = initializer.GroupComment;
    }
}

export class Agency {
    AgencyId: string;
    OfficialName: string;
    Category: string;
    EntityType: string;
    EntitySubtype: string;
    constructor(initializer?: InvolvedEntitySearchResponse) {
        this.AgencyId = initializer.agencyid;
        this.OfficialName = initializer.agencyname;
        // todo
        this.Category = '';
        this.EntityType = initializer.agencytypedesc;
        this.EntitySubtype = initializer.agencysubtypedesc;
    }
}

export class Person {
    id: number;
    Pid: string;
    Role: string;
    Firstname: string;
    Lastname: string;
    Middlename: string;
    Dob: Date;
    Gender: string;
    Race: string[];
    PrimaryPhoneNumberext: string;
    PrimaryPhoneNumber: string;
    TemparoryPhoneNumber: string;
    TemparoryPhoneNumberext: string;
    AddressId: string;
    Address: string;
    Address2: string;
    City: string;
    State: string;
    Zip: string;
    County: string;
    SSN: string;
    Dcn: string;
    RelationshiptoRA: string;
    Dangerous: string;
    DangerousWorkerReason: string;
    DangerousAddress: string;
    DangerousAddressReason: string;
    Mentealillness: string;
    MentealillnessDetail: string;
    Mentealimpair: string;
    MentealimpairDetail: string;
    Ethicity: string;
    PrimaryLanguage: string;
    TemparoryAddressId: string;
    TemparoryAddress: string;
    TemparoryAddress2: string;
    TemparoryCity: string;
    TemparoryState: string;
    TemparoryZip: string;
    RoutingAddress: string;
    Alias: {
        AliasName: AliasName[];
    };
    constructor(initializer?: InvolvedPerson) {
        this.Firstname = initializer.Firstname;
        // this.id = initializer.id;
        this.Pid = initializer.Pid;
        this.Role = initializer.Role;
        this.Lastname = initializer.Lastname;
        this.Middlename = initializer.Middlename;
        this.Dob = initializer.Dob;
        this.Gender = initializer.Gender;
        this.Race = initializer.Race;
        this.PrimaryPhoneNumber = initializer.primaryPhoneNumber;
        this.TemparoryPhoneNumber = initializer.alternatePhoneNumber;
        this.TemparoryPhoneNumberext = initializer.TemparoryPhoneNumberext;
        this.AddressId = initializer.AddressId;
        this.Address = initializer.Address;
        this.Address2 = initializer.Address2;
        this.City = initializer.City;
        this.State = initializer.State; // initializer.State; //Till Address search function value hardcode + for demo
        this.Zip = initializer.Zip;
        this.County = initializer.County;
        this.SSN = initializer.SSN;
        this.Dcn = initializer.Dcn;
        this.RelationshiptoRA = initializer.RelationshiptoRA;
        this.Dangerous = initializer.Dangerous;
        this.DangerousWorkerReason = initializer.DangerousWorkerReason;
        this.DangerousAddress = initializer.dangerAddress;
        this.DangerousAddressReason = initializer.DangerousAddressReason;
        this.Mentealillness = initializer.Mentealillness;
        this.MentealillnessDetail = initializer.MentealillnessDetail;
        this.Mentealimpair = initializer.Mentealimpair;
        this.MentealimpairDetail = initializer.MentealimpairDetail;
        this.Ethicity = initializer.Ethicity;
        this.PrimaryLanguage = initializer.PrimaryLanguage;
        this.TemparoryAddressId = initializer.TemparoryAddressId;
        this.TemparoryAddress = initializer.TemparoryAddress;
        this.TemparoryAddress2 = initializer.TemparoryAddress2;
        this.TemparoryCity = initializer.TemparoryCity;
        this.TemparoryState = initializer.TemparoryState; // initializer.TemparoryState; //Till Address search function value hardcode + for demo
        this.TemparoryZip = initializer.TemparoryZip;
        this.RoutingAddress = initializer.RoutingAddress;
    }
}
export class AliasName {
    index: number;
    id: string;
    Pid: string;
    AliasFirstName: string;
    AliasLastName: string;
}
export class EvaluationFields {
    requestdetention: boolean;
    petitionid: string;
    adultpetitionid: string;
    sourceagency: string;
    source: string;
    complaintid: string;
    wvrnumber: number;
    offenselocation: string;
    complaintrcddate: string;
    arrestdate: string;
    zipcode: string;
    allegedoffense: string;
    allegedoffenseknown: number;
    allegedoffensedate: string;
    allegedoffensetodate: string;
}

export class ComplaintTypeCase {
    caseID: string;
    serviceTypeID: string;
    serviceTypeValue: string;
    subServiceTypeID: string;
    subSeriviceTypeValue: string;
}
