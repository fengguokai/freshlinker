import { SearchController } from './controller/search.controller';
import {SearchService} from './service/search.service';

angular.module('frontend')
  .controller('SearchController', SearchController)
  .service('searchService', SearchService);
