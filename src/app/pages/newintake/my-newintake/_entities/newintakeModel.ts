import { initializeObject } from '../../../../@core/common/initializer';
import { General, AttachmentIntakes, EvaluationFields, ComplaintTypeCase } from './newintakeSaveModel';

export class UserProfileImage {
    filename: string;
    originalfilename: string;
    mime: string;
    numberofbytes: number;
    s3bucketpathname: string;
}
export class InvolvedPerson {
    index: number;
    id: string;
    Pid: string;
    Role: string;
    userPhoto: string;
    Firstname: string;
    Lastname: string;
    Middlename: string;
    Dob: Date;
    Gender: string;
    Race?: string[];
    PrimaryPhoneNumberext: string;
    TemparoryPhoneNumber: string;
    TemparoryPhoneNumberext: string;
    AddressId?: string;
    Address: string;
    Address2: string;
    City: string;
    State: string;
    Zip: string;
    County: string;
    SSN: string;
    Dcn: string;
    livingArrangements: string;
    RelationshiptoRA: string;
    Dangerous: string;
    DangerousWorkerReason: string;
    DangerousAddressReason: string;
    Mentealillness: string;
    MentealillnessDetail: string;
    Mentealimpair: string;
    MentealimpairDetail: string;
    Ethicity: string;
    PrimaryLanguage: string;
    TemparoryAddressId?: string;
    TemparoryAddress: string;
    TemparoryAddress2: string;
    TemparoryCity: string;
    TemparoryState: string;
    TemparoryZip: string;
    RoutingAddress: string;
    Alias: InvolvedPersonAlias[];
    Coutny: string;
    primaryPhoneNumber: string;
    alternatePhoneNumber: string;
    dangerAddress: string;
    IsAnonymousReporter: boolean;
    tribalAssociation: string;
    physicalAtt: string;
    DobFormatted: string;
    personAddressInput: PersonAddress[];
    phoneNumber: any[];
    emailID: any[];
    fullName: string;
    fullAddress: string;
    contactsmail?: any[];
    contacts?: any[];
    address?: PersonAddress[];
    mentalillsign?: string;
    mentalillsignReason: string;
    AliasLastName: string;
    userProfilePicture: UserProfileImage;
}
export class PersonAddress {
    addressType: string;
    phoneNo?: string;
    address1: string;
    Address2?: string;
    zipcode: string;
    state: string;
    city: string;
    county: string;
    startDate?: Date;
    endDate?: Date;
    addressid: string;
}
export class InvolvedPersonAlias {
    index: number;
    AliasFirstName: string;
    AliasLastName: string;
}
export class InvolvedPersonSearch {
    activeflag = '1';
    personflag = 'T';
    firstname: string;
    lastname: string;
    maidenname: string;
    age: string;
    race: string;
    dob: string;
    gender: string;
    city: string;
    address: string;
    zip: string;
    state: string;
    county: string;
    phone: string;
    dateofdeath: string;
    roletype: string;
    rolesubtype: string;
    interfacetype: string;
    commapos: string;
    dangerous: string;
    region: string;
    dobfrom: string;
    dobto: string;
    ssn: string;
    dcn: string;
    mediasrc: string;
    stateid: string;
    occupation: string;
    dl: string;
    intakeNumber: string;
}
export class InvolvedPersonSearchResponse {
    alias: string;
    personid: string;
    personroleid: string;
    personroletype: string;
    personrolesubtype: string;
    firstname: string;
    middlename: string;
    lastname: string;
    dob: Date;
    dangerlevel: string;
    ssn: string;
    dcn: string;
    primaryaddress: string;
    homephone: string;
    gendertypekey: string;
    loadnumber: string;
    teamname: string;
    addressJson: InvolvedPersonSearchAddressResponse;
    source?: string;
    middleName?: string;
    gender?: string;
    city?: string;
    zipcode?: string;
    county?: string;
    priors: number;
    relationscount: number;
    relations: string;
    socialmediasource: string;
}
export class InvolvedPersonSearchAddressResponse {
    Id: string;
    address1: string;
    address2: string;
    city: string;
    zipcode: string;
    county: string;
    state: string;
}
export class InvolvedEntitySearch {
    name: string;
    status: string;
    ssbg: string;
    agencytype: string;
    agencysubtype: string;
    region: number;
    assignedqas: string;
    specialterms: string;
    sanctions: string;
    activeflag: string;
    activeflag1: string;
    count: string;
    sortcol: string;
    sortdir: string;
    county: string;
    zipcode: string;
    agencyname: string;
    fiscalyear: string;
    provideragreementtype: string;
    locationfilter: string;
    phonenumber: string;
    category: string;
    agencyid: string;
    city: string;
    address1: string;
    address2: string;
    facid: string;
    serviceid: string;
    servicerequestid: string;
    ActiveFlag1 = '1';
    ActiveFlag = '1';
}
export class InvolvedEntitySearchResponse {
    agencyid: string;
    agencyname: string;
    status: string;
    ssbg: string;
    agencytypedesc: string;
    agencysubtype: string;
    assignedqas: string;
    count: number;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    phonenumber: string;
    provideragreementtypekey: string;
    provideragreementtypename: string;
    aliasname: string;
    provideragreementid: string;
    startdate: string;
    enddate: string;
    provideragreementstatuskey: string;
    fiscalyear: string;
    activeflag: string;
    serviceprovider: string;
    areaserved: string;
    provideragreementlocationtypekey: string;
    providernonagreementdetailid: string;
    providernonagreementtypedescription: string;
    agencysubtypedesc: string;
    facid: string;
    country: string;
}

export class AgencyCategory {
    agencycategorykey: string;
    description: string;
}

export class AgencyType {
    agencytypekey: string;
    typedescription: string;
}

export class AgencySubType {
    agencysubtypekey: string;
    typedescription: string;
}

export class Agency {
    agencyid: string;
    activeflag: number;
    agencytypekey: string;
    agencyname: string;
    effectivedate: Date;
    expirationdate: Date;
    agencycategorykey: string;
    agencysubtypekey: string;
    agencycategory: AgencyCategory;
    agencytype: AgencyType;
    agencysubtype: AgencySubType;
    aliasname: string;
    agencyaddress: AgencyAddress[];
    agencyservice: AgencyService[];
}

export class AgencyService {
    areaserviced: string;
    service: InvolvedEntityService;
}

export class InvolvedEntityService {
    serviceid: string;
    description: string;
    servicetypekey: string;
    servicename: string;
}
export class AgencyAddress {
    agencyaddressid: string;
    agencyid: string;
    activeflag: number;
    agencyaddresstypekey: string;
    address: string;
    zipcode: string;
    city: string;
    state: string;
    country: string;
    county: string;
    address2: string;
    region: string;
}

export class InvolvedEntity {
    intakeservicerequestagencyid: string;
    agencyid: string;
    agency: Agency;
    intakeserviceagencyroletype: IntakeServiceAgencyRole[];
    expirationdate: Date;
}
export class AgencyRole {
    agencyroletypekey: string;
    activeflag: number;
    typedescription: string;
    isSelected: boolean;
    intakeserviceagencyroletypeid: string;
    intakeservicerequestagencyid: string;
    effectivedate: Date;
    insertedby: string;
    updatedby: string;
}

export class IntakeServiceAgencyRole {
    intakeserviceagencyroletypeid: string;
    intakeservicerequestagencyid: string;
    agencyroletypekey: string;
    agencyroletype: AgencyRole;
}

export class SelectedRoles {
    intakeservicerequestagencyid: string;
    agencyid: string;
    description: string;
    agencyroletypekey: string;
    intakeserviceid: string;
    intakeserviceagencyroletype: IntakeServiceAgencyRole[];
}

export class IntakeAgencyRole {
    roleTypes: AgencyRole[];
    selectedRoleTypes: SelectedRoles;
}
export class IntakeDATypeDetail {
    index: number;
    DaTypeKey: string;
    DaTypeText: string;
    DasubtypeKey: string;
    DasubtypeText: string;
    Investigatable: boolean;
    Actionable: boolean;
    personid: string;
    DAStatus: string;
    ServiceRequestTypeConfigId: string;
    DAStatusText: string;
    DADisposition: string;
    DADispositionText: string;
    CancelReason: string;
    CancelDescription: string;
    Summary: string;
    ServiceRequestNumber: string;
    GroupNumber: string;
    GroupReasonType: string;
    GroupComment: string;
    RouteTo: string;
    RouteOn: Date;
    Load: string;
    Team: string;
    Allegations: Allegation[] = [];
    agencycode: string;
}
export class AllegationItem {
    allegationname: string;
    allegationid: string;
    indicators: string[];
    constructor(initializer?: AllegationItem) {
        initializeObject(this, initializer);
    }
}
export class Allegation {
    DaType: string;
    DaSubType: string;
    DaNumber: string;
    AllegationId: string;
    AllegationName: string;
    Indicators: string[] = [];
    ParentGridRowIndex: number;
    GridRowIndex: number;
}

export class NarrativeIntake {
    Firstname: string;
    Lastname: string;
    Narrative: string;
    Role: string;
    draftId: string;
    IsAnonymousReporter: boolean;
    finalTranscript: string;
    IsUnknownReporter: boolean;
}
export class AttachmentIntake {
    filename: string;
    mime: string;
    numberofbytes: string;
    s3bucketpathname: string;
    documentdate: string;
    intakenumber: string;
    objecttypekey: string;
    rootobjecttypekey: string;
    activeflag: number;
    insertedby: string;
    updatedby: string;
    title: string;
    description: string;
    documentattachment: {
        attachmentdate: string;
        sourceauthor: string;
        attachmentsubject: string;
        sourceposition: string;
        attachmentpurpose: string;
        sourcephonenumber: string;
        acquisitionmethod: string;
        sourceaddress: string;
        locationoforiginal: string;
        insertedby: string;
        note: string;
        updatedby: string;
        activeflag: number;
        attachmenttypekey: string;
        attachmentclassificationtypekey: string;
    };
}
export class CrossReference {
    id: number;
    CrossRefDA: string;
    CrossRefDAID: string;
    DAType: string;
    DASubType: string;
    ReasonsofCrossref: string;
    Assighnedto: string;
    CrossRefwith: string;
    OGCReferred: string;
    constructor(initializer?: CrossReferenceSearchResponse) {
        this.CrossRefDA = initializer.servicerequestnumber;
        this.ReasonsofCrossref = initializer.ReasonsofCrossref;
        this.Assighnedto = initializer.assignedto;
        this.DAType = initializer.srtype;
        this.DASubType = initializer.srsubtype;
        this.CrossRefwith = initializer.crossRefwith;
        this.CrossRefDAID = initializer.intakeserviceid;
        // todo
    }
}
export class CrossReferenceSearch {
    servicerequestnumber: string;
    status: string[] = ['Open'];
    county: string;
    sid: string;
    region: 0;
    zipcode: string;
    activeflag = '1';
    activeflag1 = '1';
    sortcol: string;
    sortdir: string;
    reporteddate: string;
    reportedenddate: string;
    narrative: string;
    disposition: string;
    reportedadult: string;
    allegedperpetrator: string;
    reporter: string;
    dsdsworker: string;
    overdue: string;
    duedate: string;
    dsdsprovider: string;
    loadnumber: string;
    agencyid: string;
    groupnumber: string;
    groupcreatedate: string;
    monumber: string;
    receivedfrom: string;
    receivedto: string;
    openfrom: string;
    opento: string;
    closefrom: string;
    closeto: string;
    intakeserviceid: string;
    myteam: string;
    ReasonsofCrossref: string;
    firstname?: string;
    lastname?: string;
    role?: string;
}
export class CrossReferenceSearchResponse {
    intakeserviceid: string;
    servicerequestnumber: string;
    srtype: string;
    srsubtype: string;
    raname: string;
    zipcode: string;
    county: string;
    region: string;
    datereceived: string;
    timereceived: string;
    datedue: string;
    timedue: string;
    overdue: string;
    count: string;
    providername: string;
    ssbg: string;
    contractstatus: string;
    provideragrementid: string;
    routingstatustypekey: string;
    areateammemberservicerequestid: string;
    groupnumber: string;
    agencyid: string;
    assignedto: string;
    teamname: string;
    disposition: string;
    srstatus: string;
    insertedby: string;
    teamtypekey: string;
    assignedtosid: string;
    revisited: string;
    investigationid: string;
    ReasonsofCrossref: string;
    crossRefwith?: string;
    insertedon: string;
    pastdue: string;
    dueddate: string;
}
export class Recording {
    recordingid?: string;
    RecordingDA?: string;
    RecordingType?: string;
    RecordingTypeText?: string;
    RecordingsubType?: string;
    RecordingSubTypeText?: string;
    ContactDate?: string;
    ContactName?: string;
    Contactrole?: string;
    ContactroleText?: string;
    ContactPhoneno?: string;
    contactEmail?: string;
    Detail?: string;
}
export class DaDetails {
    dasubtype: string;
    danumber: string;
    description: string;
    firstname: string;
    lastname: string;
    role: string;
    datereceived: string;
    datecompleted: string;
    status: string;
    intakeserviceid?: string;
    county: string;
}
export class PriorAuditLog {
    danumber: string;
    description: string;
    firstname: string;
    lastname: string;
    role: string;
    datereceived: string;
    datecompleted: string;
    status: string;
    priordanumber: string;
    intakeserviceid: string;
}
export class PersonDsdsAction {
    personid?: string;
    daDetails: DaDetails[];
    daTypeName: string;
    highLight = false;
    constructor(initializer?: PersonDsdsAction) {
        initializeObject(this, initializer);
    }
}
export class Personrelative {
    firstname: string;
    lastname: string;
    middlename: string;
    personid: string;
}

export class Personrelationtype {
    personrelationtypeid: string;
    personrelationtypekey: string;
    description: string;
}

export class PersonRelativeDetails {
    personrelativeid: string;
    personrelationtypeid: string;
    personrelative: Personrelative;
    personrelationtype: Personrelationtype;
}

export class RouteDA {
    caseworker_name: string;
    loadnumber: string;
    teamname: string;
}

export class IntakeAssessmentRequestIds {
    intakeservicerequesttypeid: string;
    intakeservicerequestsubtypeid: string;
    agencycode: string;
}

export class IntakeTemporarySaveModel {
    persons: InvolvedPerson[];
    entities: InvolvedEntitySearchResponse[];
    intakeDATypeDetails: IntakeDATypeDetail[];
    crossReference: CrossReferenceSearchResponse[];
    recordings: Recording[];
    general: General;
    narrative: NarrativeIntake;
    attachement: AttachmentIntakes[];
    evaluationFields: EvaluationFields;
    disposition?: DispostionOutput;
    reviewstatus: ReviewStatus;
    createdCases: ComplaintTypeCase[];
    constructor(initializer?: IntakeTemporarySaveModel) {
        this.crossReference = initializer.crossReference;
        this.persons = initializer.persons;
        this.entities = initializer.entities;
        this.intakeDATypeDetails = initializer.intakeDATypeDetails;
        this.recordings = initializer.recordings;
        this.general = initializer.general;
        this.narrative = initializer.narrative;
        this.attachement = initializer.attachement;
        this.evaluationFields = initializer.evaluationFields;
        this.reviewstatus = initializer.reviewstatus;
        this.disposition = initializer.disposition;
        this.createdCases = initializer.createdCases;
    }
}

export class Assessments {
    totalcount: number;
    assessmentid: string;
    assessmenttemplateid: string;
    external_templateid: string;
    submissionid: string;
    description: string;
    updatedon: Date;
    assessmenttype: string;
    assessmentstatustypekey: string;
    assessmentstatustypeid: number;
    name: string;
    assessment: Assessment;
    target: string;
    titleheadertext: string;
}

export class Assessment {
    assessmentid: string;
    assessmenttemplateid: string;
    submissionid: string;
    assessmentstatustypekey: string;
    updatedon: Date;
}
export class ValidateAddress {
    dpv_footnotes: string;
    footnotes: string;
    dpv_match_code: string;
}

export class Narrative {
    Firstname: string;
    Lastname: string;
    Narrative: string;
    Role: string;
    draftId: string;
    IsAnonymousReporter: boolean;
    finalTranscript: string;
    IsUnknownReporter: boolean;
}

export class SuggestAddress {
    text: string;
    streetLine: string;
    city: string;
    state: string;
}
export class ValidatedAddress {
    dpvMatchCode: string;
    dpvFootnotes: string;
    dpvCmra: string;
    dpvVacant: string;
    active: string;
    ewsMatch: string;
    lacslinkCode: string;
    lacslinkIndicator: string;
    suitelinkMatch: string;
    footnotes: string;
}
export class AddressDetails {
    personaddressid: string;
    personid: string;
    activeflag: number;
    Personaddresstype: AddressTypeDetails;
    address: string;
    zipcode: string;
    city: string;
    state: string;
    country: string;
    county: string;
    effectivedate: Date;
    expirationdate?: string;
    oldId?: string;
    address2?: string;
    directions?: string;
    danger?: string;
    dangerreason?: string;
}
export class AddressTypeDetails {
    personaddresstypekey: string;
    typedescription: string;
}

export class AttachmentUpload {
    index?: number;
    filename: string;
    mime: string;
    numberofbytes: number;
    s3bucketpathname: string;
}
export class ResourcePermission {
    id?: string;
    parentid?: string;
    name: string;
    resourceid?: string;
    resourcetype?: number;
    isSelected?: boolean;
    tooltip?: string;
}
export class MyIntakeDetails {
    id: string;
    intakenumber: string;
    datereceived: Date;
    timereceived: Date;
    narrative: string;
    raname: string;
    entityname: string;
    cruworkername: string;
}
export class PersonInvolved {
    personid?: string;
    firstname: string;
    lastname: string;
    role: string;
    isnew: boolean;
    isedit: boolean;
    isdelete: boolean;
    obj: InvolvedPerson;
}

export class Person {
    Lastname?: string;
    Firstname?: string;
    Middlename?: string;
    Dob?: Date;
    Gender?: string;
    religiontype?: string;
    maritalstatus?: string;
    Dangerous?: string;
    Role?: string;
    dangerAddress?: string;
    RelationshiptoRA?: string;
    race?: string;
    Dcn?: string;
    ssn?: string;
    Ethnicity?: string;
    occupation?: string;
    stateid?: string;
    PrimaryLanguage?: string;
    AliasLastName?: string;
    potentialSOR?: string;
    eDLHistory?: string;
    dMH?: string;
    Race?: string;
    Address?: string;
    Address2?: string;
    Zip?: string;
    City?: string;
    State?: string;
    County?: string;
    DangerousWorkerReason?: string;
    DangerousAddressReason?: string;
}

export class ReviewStatus {
    appevent: string;
    status: string;
    commenttext: string;
}

export class DispositionCode {
    description: string;
    servicerequesttypeconfigid: string;
    dispositioncode: string;
    intakeserreqstatustypeid: string;
    intakeserreqstatustypekey: string;
    servicerequesttypeconfigdispositioncode: DispoistionList[];
}

export class DispoistionList {
    description: string;
    dispositioncode: string;
    intakeserreqstatustypeid: string;
    servicerequesttypeconfigid: string;
}
export class DispostionOutput {
    dispositioncode: string;
    intakeserreqstatustypekey: string;
    comments: string;
    reason: string;
    DAStatus: string;
    DADisposition: string;
    Summary: string;
    ReasonforDelay: string;
    supStatus: string;
    supDisposition: string;
    supComments: string;
    isDelayed: string;
}
export class GeneralNarative {
  formkey: string;
  controlindex: number;
  helptext: string;
}
export class IntakePurpose {
    description: string;
    intakeservreqtypeid: string;
    teamtype: { sequencenumber: number; teamtypekey: string };
}
export class SubType {
    activeflag: number;
    classkey: string;
    description: string;
    intakeservreqtypeid: string;
    investigatable: boolean;
    servicerequestsubtypeid: string;
    workloadweight: number;
}
