import { HomeController } from './controller/home.controller';
import {HomeService} from './service/home.service';

angular.module('frontend')

  .controller('HomeController', HomeController)
  .service('homeService', HomeService);

