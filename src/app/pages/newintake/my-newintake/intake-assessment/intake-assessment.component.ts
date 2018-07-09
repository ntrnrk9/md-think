import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { REGEX } from '../../../../@core/entities/constants';
import { CommonHttpService, AuthService, GenericService } from '../../../../@core/services';
import { NewUrlConfig } from '../../newintake-url.config';
import { Subject } from 'rxjs/Subject';
import { AppUser } from '../../../../@core/entities/authDataModel';
import { PaginationRequest, PaginationInfo, DropdownModel } from '../../../../@core/entities/common.entities';
import { Observable } from 'rxjs/Observable';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';
import { IntakeDATypeDetail, IntakeAssessmentRequestIds, Assessments, Allegation, AllegationItem } from '../_entities/newintakeModel';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'intake-assessment',
    templateUrl: './intake-assessment.component.html',
    styleUrls: ['./intake-assessment.component.scss']
})
export class IntakeAssessmentComponent implements OnInit {
    @Input() addedIntakeDATypeDetails: IntakeDATypeDetail[] = [];
    @Input() addedIntakeDATypeSubject$ = new Subject<IntakeDATypeDetail[]>();
    @Input() intakeNumber: string;
    daTypeFormGroup: FormGroup;
    private intakeDATypeDetail: IntakeDATypeDetail;
    private token: AppUser;
    private assessmentRequestDetail: IntakeAssessmentRequestIds[] = [];
    paginationInfo: PaginationInfo = new PaginationInfo();
    startAssessment$: Observable<Assessments[]>;
    totalRecords$: Observable<number>;
    daTypeDropDownItems$: Observable<DropdownModel[]>;
    daSubTypeDropDownItems$: Observable<DropdownModel[]>;
    private allegation: Allegation;
    filteredAllegationItems: AllegationItem[] = [];
    assessmmentName: string;
    formBuilderUrl: string;
    safeUrl: SafeResourceUrl;
    private pageSubject$ = new Subject<number>();

    constructor(
        private formBuilder: FormBuilder,
        private _commonHttpService: CommonHttpService,
        private _authService: AuthService,
        private _service: GenericService<Assessments>,
        public sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        this.loadDropdownItems();
        this.daTypeFormGroup = this.formBuilder.group({
            DaTypeKey: ['', [Validators.required, REGEX.NOT_EMPTY_VALIDATOR]],
            DasubtypeKey: ['', [Validators.required, REGEX.NOT_EMPTY_VALIDATOR]]
        });
    }

    private loadDropdownItems() {
        this.daTypeDropDownItems$ = this._commonHttpService
            .getArrayList(
                {
                    nolimit: true,
                    where: { activeflag: 1 },
                    method: 'get'
                },
                NewUrlConfig.EndPoint.Intake.DATypeUrl + '?filter'
            )
            .map((result) => {
                return result.map((res) => new DropdownModel({ text: res.description, value: res.intakeservreqtypeid }));
            });
    }

    addDAType(model: IntakeDATypeDetail) {
        const this$ = this;
        this._commonHttpService.getArrayList({}, NewUrlConfig.EndPoint.Intake.NextnumbersUrl).subscribe((result) => {
            this$.intakeDATypeDetail = Object.assign(this$.intakeDATypeDetail, model);
            this$.intakeDATypeDetail.ServiceRequestNumber = result['nextNumber'];
            this$.addedIntakeDATypeDetails.push(this$.intakeDATypeDetail);
            this$.intakeDATypeDetail = Object.assign({}, new IntakeDATypeDetail());
            this$.allegation = Object.assign({}, new Allegation());
            this$.filteredAllegationItems = Object.assign([], Array.of(Allegation));
            this$.daTypeFormGroup.reset();
            this$.daTypeFormGroup.patchValue({ DaTypeKey: '', DasubtypeKey: '' });
            this.addedIntakeDATypeSubject$.next(this.addedIntakeDATypeDetails);
        });
        this.getIntakeAssessmentDetails(model);
    }

    getAssessmentPage(page: number) {
        const source = this._service
            .getPagedArrayList(
                new PaginationRequest({
                    page: this.paginationInfo.pageNumber,
                    limit: this.paginationInfo.pageSize,
                    where: {
                        intakenumber: this.intakeNumber,
                        target: 'Intake',
                        assessmenttemplate: this.assessmentRequestDetail
                    },
                    method: 'get'
                }),
                NewUrlConfig.EndPoint.Intake.GetIntakeAssessmentUrl + '?filter'
            )
            .map((result) => {
                return { data: result.data, count: result.count };
            })
            .share();
        this.startAssessment$ = source.pluck('data');
        if (page === 1) {
            this.totalRecords$ = source.pluck('count');
        }
    }

    onDATypeChange(option: any) {
        this.intakeDATypeDetail = new IntakeDATypeDetail();
        this.intakeDATypeDetail.DaTypeKey = option.value;
        this.intakeDATypeDetail.DaTypeText = option.label;
        const url = NewUrlConfig.EndPoint.Intake.DATypeUrl + '?filter';
        this.daSubTypeDropDownItems$ = this._commonHttpService
            .getArrayList(
                {
                    include: 'servicerequestsubtype',
                    where: { intakeservreqtypeid: this.intakeDATypeDetail.DaTypeKey },
                    method: 'get',
                    nolimit: true
                },
                url
            )
            .map((data) => {
                return data[0].servicerequestsubtype.map((res) => new DropdownModel({ text: res.description, value: res.servicerequestsubtypeid }));
            });
    }

    onDASubTypeChange(option: any) {
        if (option.value) {
            this.intakeDATypeDetail.DasubtypeKey = option.value;
            this.intakeDATypeDetail.DasubtypeText = option.label;
        }
    }

    getSavedIntakeAssessmentDetails(daDetails: IntakeDATypeDetail[], intakeNo: string) {
        this.token = this._authService.getCurrentUser();
        this.intakeNumber = intakeNo;
        daDetails.map((item) => {
            const savedAssessmentRequest = new IntakeAssessmentRequestIds();
            savedAssessmentRequest.intakeservicerequesttypeid = item.DaTypeKey;
            savedAssessmentRequest.intakeservicerequestsubtypeid = item.DasubtypeKey;
            this.assessmentRequestDetail.push(savedAssessmentRequest);
        });
        this.getAssessmentPage(1);
    }

    private getIntakeAssessmentDetails(model: IntakeDATypeDetail) {
        this.token = this._authService.getCurrentUser();
        const assessmentRequest = new IntakeAssessmentRequestIds();
        assessmentRequest.intakeservicerequesttypeid = model.DaTypeKey;
        assessmentRequest.intakeservicerequestsubtypeid = model.DasubtypeKey;
        this.assessmentRequestDetail.push(assessmentRequest);
        this.getAssessmentPage(1);
    }

    startAssessment(assessment: Assessments) {
        this.assessmmentName = assessment.titleheadertext;
        this.formBuilderUrl = environment.formBuilderHost + `/#/views/submitform?da=` + this.intakeNumber + `&fid=${assessment.external_templateid}&t=` + this.token.id + '&g=true';
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.formBuilderUrl);
    }
    closeAssessment() {
        this.getAssessmentPage(1);
    }
    editAssessment(assessment: Assessments) {
        this.assessmmentName = assessment.titleheadertext;
        this.formBuilderUrl =
            environment.formBuilderHost +
            `/#/views/completeform?sid=${assessment.assessment.submissionid}&fid=${assessment.external_templateid}&da=` +
            this.intakeNumber +
            `&ro=false&t=` +
            this.token.id;
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.formBuilderUrl);
    }

    submittedAssessment(assessment: Assessments) {
        this.assessmmentName = assessment.titleheadertext;
        this.formBuilderUrl =
            environment.formBuilderHost +
            `/#/views/completeform?sid=${assessment.assessment.submissionid}&fid=${assessment.external_templateid}&da=` +
            this.intakeNumber +
            `&ro=true&t=` +
            this.token.id;
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.formBuilderUrl);
    }

    pageChanged(pageInfo: any) {
        this.paginationInfo.pageNumber = pageInfo.page;
        this.paginationInfo.pageSize = pageInfo.itemsPerPage;
        this.pageSubject$.next(this.paginationInfo.pageNumber);
    }
}
