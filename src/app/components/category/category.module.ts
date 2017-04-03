import { CategoryController } from './controller/category.controller';
import {CategoryService} from './service/category.service';

module frontend {
  'use strict';
  angular.module('frontend')
    .controller('CategoryController', CategoryController)
    .service('categoryService', CategoryService);
}
