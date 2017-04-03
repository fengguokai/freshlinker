import { UserController } from './controller/user.controller';
import {UserService} from './service/user.service';
import { ProfileController } from './../user/controller/profile.controller';
import { ProfileFormExperienceController } from './../user/controller/profile.form.experience.controller';
import { UserExperienceService } from './../user/service/user_experience.service';
import {ProfileFormEducationController} from './controller/profile.form.education.controller';
import { UserEducationService } from './../user/service/user_education.service';
import {ProfileFormLanguageController} from './controller/profile.form.language.controller';
import {UserLanguageService} from './../user/service/user_language.service';
import { ProfileFormExpectController } from './../user/controller/profile.form.expectJobs.controller';
import {UserExpectService } from './../user/service/user_expectJobs.service';
import {BookmarkService, IBookmark} from '../position/service/bookmark.service';
import {UserTabsController} from '../user/controller/user_tabs.controller';
import {UserInfomationController} from '../user/controller/user.infomatrion.controller';
import {CountryService, ICountry} from '../company/service/country.service';
import {ProfileLeftController} from '../user/controller/profile.left.controller';
import {UserPositionController} from '../user/controller/user.applied.position.controller';
import {BookmarkController} from '../user/controller/bookmark.controller';
import {ResumeController} from '../user/controller/resume.controller';
import {JobInviteController} from '../user/controller/job.invite.controller';
import {ProfileFormIconController} from '../user/controller/profile.icon.controller';
import {UserDashboardController} from '../user/controller/user.dashboard.controller';


module frontend {
  'use strict';
  export class RouteConfig {
    constructor($stateProvider: ng.ui.IStateProvider) {
      $stateProvider
        .state('main-auth.profile', {
          url: 'profile',
          templateUrl: 'app/components/user/template/profile.html',
          controller: 'profileController as profileCtrl',
          data: {
            userAuthenticate: true
          }
        })
        .state('main-auth.positions', {
          url: 'user-positions',
          templateUrl: 'app/components/user/template/user.applied.position.html',
          controller: 'UserPositionController as userPositionCtrl',
          resolve: {
            /* @ngInject */
            user: function (userService: UserService) {
              return userService.find({}, {cache: false});
            }
          }
        })
        .state('main-auth.user-resume', {
          url: 'user-resume',
          templateUrl: 'app/components/user/template/user.resume.html',
          controller: 'UserController as userCtrl'
        })
        .state('main-auth.user', {
          url: 'user-information',
          templateUrl: 'app/components/user/template/user.information.html',
          controller: 'UserInfomationController as userCtrl',
          resolve: {
            /* @ngInject */
            countries: function (countryService: CountryService) {
              return countryService.get({}, {cache: false});
            }
          }
        })
        .state('main.resume', {
          url: 'resume/:id/show',
          templateUrl: 'app/components/user/template/resume.html',
          controller: 'ResumeController as userCtrl'
        })
        .state('main-auth.user-bookmark', {
          url: 'bookmark',
          templateUrl: 'app/components/user/template/bookmark.html',
          controller: 'BookmarkController as bookmarkCtrl',
          resolve: {
            user: function (userService: UserService) {
              return userService.find({}, {cache: false});
            }
          }
        })
        .state('main-auth.job-invite', {
          url: 'job-invite',
          templateUrl: 'app/components/user/template/job_invite.html',
          controller: 'JobInviteController as inviteCtrl'
        })
          .state('main-auth.userDashboard', {
            url: 'user-dashboard',
            templateUrl: 'app/components/user/template/user.dashboard.html',
            controller: 'UserDashboardController as dashboardCtrl'
          })

    }
  }
  angular.module('frontend')
    .controller('UserController', UserController)
    .service('userService', UserService)
    .config(RouteConfig)
    .controller('profileController', ProfileController)
    .controller('ProfileFormExperienceController', ProfileFormExperienceController)
    .service('userExperienceService', UserExperienceService)
    .controller('ProfileFormEducationController', ProfileFormEducationController)
    .service('userEducationService', UserEducationService)
    .service('userLanguageService', UserLanguageService)
    .controller('ProfileFormLanguageController', ProfileFormLanguageController)
    .service('userExpectService', UserExpectService)
    .controller('ProfileFormExpectController', ProfileFormExpectController)
    .controller('UserTabsController', UserTabsController)
    .controller('UserInfomationController', UserInfomationController)
    .controller('ProfileLeftController', ProfileLeftController)
    .controller('UserPositionController', UserPositionController)
    .controller('BookmarkController', BookmarkController)
    .controller('ResumeController', ResumeController)
    .controller('JobInviteController', JobInviteController)
      .controller('ProfileFormIconController', ProfileFormIconController)
      .controller('UserDashboardController', UserDashboardController);
}







