import { AboutUsController } from '../aboutUs/controller/about.us.controller';
import { AboutUsLeftController } from '../aboutUs/controller/about.us.left.controller';
import { ContactController } from '../aboutUs/controller/contact.controller';
import { PrivacyController } from '../aboutUs/controller/privacy.controller';
import { TermsController } from '../aboutUs/controller/terms_conditions.controller';
import { JobFlatformController } from '../aboutUs/controller/job_flatform.controller';
import {OurStoryController} from '../aboutUs/controller/our_story.controller';
import {JobsController} from '../aboutUs/controller/jobs.controller';
import {IndustryFeedController} from '../aboutUs/controller/industry_feed.controller';
import {PricingController} from '../aboutUs/controller/pricing.controller';
import {CareerController} from '../aboutUs/controller/career.controller';

module frontend {
    'use strict';
    export class RouteConfig {
        constructor($stateProvider: ng.ui.IStateProvider) {
            $stateProvider
                .state('main.aboutUs', {
                    url: 'aboutUs',
                    templateUrl: 'app/components/aboutUs/template/about_us.html',
                    controller: 'AboutUsController as aboutCtrl'
                })
                .state('main.ourStory', {
                    url: 'ourStory',
                    templateUrl: 'app/components/aboutUs/template/our_story.html',
                    controller:'OurStoryController as ourStoryCtrl'
                })
                .state('main.contact', {
                    url: 'contact',
                    templateUrl: 'app/components/aboutUs/template/contact.html',
                    controller: 'ContactController as aboutCtrl'
                })
                .state('main.privacy', {
                    url: 'privacy',
                    templateUrl: 'app/components/aboutUs/template/privacy.html',
                    controller: 'PrivacyController as aboutCtrl'
                })
                .state('main.terms_conditions', {
                    url: 'terms_conditions',
                    templateUrl: 'app/components/aboutUs/template/terms.html',
                    controller: 'TermsController as termsCtrl'
                })
                .state('main.jobFlatform', {
                    url: 'job_flatform',
                    templateUrl: 'app/components/aboutUs/template/job_flatform.html',
                    controller: 'JobFlatformController as jobCtrl'
                })
                .state('main.jobs',{
                    url:'jobs',
                    templateUrl: 'app/components/aboutUs/template/jobs.html',
                    controller:'JobsController as jobsCtrl'
                })
                .state('main.industry_feed',{
                    url:'industry_feed',
                    templateUrl:'app/components/aboutUs/template/industry_feed.html',
                    controller:'IndustryFeedController as industryFeedCtrl'
                })
                .state('enterprise.pricing',{
                    url:'company/pricing',
                    templateUrl:'app/components/aboutUs/template/pricing.html',
                    controller:'PricingController as pricingCtrl'
                })
                .state('main.career', {
                    url: 'career',
                    templateUrl: 'app/components/aboutUs/template/career.html',
                    controller: 'CareerController as careerCtrl'
                })
        }
    }
    angular.module('frontend')
        .config(RouteConfig)
        .controller('AboutUsController', AboutUsController)
        .controller('AboutUsLeftController', AboutUsLeftController)
        .controller('ContactController', ContactController)
        .controller('PrivacyController', PrivacyController)
        .controller('TermsController', TermsController)
        .controller('JobFlatformController', JobFlatformController)
        .controller('OurStoryController', OurStoryController)
        .controller('JobsController',JobsController)
        .controller('IndustryFeedController',IndustryFeedController)
        .controller('PricingController',PricingController)
        .controller('CareerController', CareerController);

}




