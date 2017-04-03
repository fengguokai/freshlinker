import {ICompany} from '../../company/service/company.service';
import {IPositionCategory} from '../../company_position/service/company.position.service';
import {IEducationLevel} from "../../education_level/service/education_level.service";
import {ILocation} from "../../location/service/location.service";

export interface ISearch {
  search?: string;
  categoryIds?: IPositionCategory[];
  companyId?: ICompany;
  minSalary?: number;
  maxSalary?: number;
  salaryType?: string;
  educationLevelIds?: IEducationLevel[];
  experience?: number;
  type?: string;
  locationIds?: ILocation[];
  jobNatureId?: number;
}

export class SearchService {
  /* @ngInject */
  constructor(private Restangular: any,
              private $location: ng.ILocationService) {
    //
  }



}
