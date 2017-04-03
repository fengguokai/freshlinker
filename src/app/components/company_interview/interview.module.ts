import {CompanyInterviewListController} from './controller/company.interview.list.controller';
import {CandidatePositionService, ICandidate} from  './service/company_interview.service';
import {ICompany} from '../company/service/company.service';

export class InterviewRouteConfig {
  constructor($stateProvider: ng.ui.IStateProvider) {
    $stateProvider
      .state('enterprise-auth.company.interview', {
        url: 'company/{companyId: int}/interview',
        templateUrl: 'app/components/company_interview/template/interview.list.html',
        controller: 'CompanyInterviewListController as interviewCtrl'
      });
  }
}


angular.module('frontend')
  .config(InterviewRouteConfig)
  .controller('CompanyInterviewListController', CompanyInterviewListController)
  .service('candidatePositionService', CandidatePositionService);







