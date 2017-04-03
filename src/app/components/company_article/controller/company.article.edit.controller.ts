import {BreadcrumbService} from '../../breadcrumb/service/breadcrumb.service';
import {MetaService} from '../../../main/meta.service';
import {DashboardTabsService} from '../../dashboard_tabs/service/dashboard_tabs.service';
import {EnterpriseArticleService, IArticle, IArticleCategory} from '../service/company.article.service';
import {UserService} from '../../user/service/user.service';


export class EnterpriseArticleEditController {

    public articleCategorySelected: any = [];
    public articleCategoryChildren: IArticleCategory[] = [];
    public selectedArticleCategory: IArticleCategory[] = [];
    public selectedArticleCategoryIds: any = [];
    public categoryShow: boolean = true;

    public saveLoading: boolean = false;


    public upload: any;
    public files: any;
    public companyId: string;

    public cover: string = "";

    public articleNew: any;

    public defaultTags: any = [];
    public saveTags: any = [];
    public tags: any = [];

    public article: IArticle = {};
    public loading: boolean = false;

    public categoryError: boolean = false;
    public tagsError: boolean = false;
    public contentError: boolean = false;
    public coverError: string;
    public showError: boolean = false;

    /* @ngInject */
    constructor(private breadcrumbService: BreadcrumbService,
                private $translate: angular.translate.ITranslateService,
                private MetaService: MetaService,
                private dashboardTabsService: DashboardTabsService,
                private enterpriseArticleService: EnterpriseArticleService,
                private toaster: ngtoaster.IToasterService,
                private $timeout: ng.ITimeoutService,
                private $state: ng.ui.IStateService,
                private localStorageService: any,
                private userService: UserService,
                private articleCategory: IArticleCategory[],
                private enterpriseArticleService: EnterpriseArticleService,
                private $stateParams: ng.ui.IStateParamsService) {
        //
        var vm = this;
        vm.dashboardTabsService.set('article');
        // set page config
        MetaService.pageTitle = vm.$translate.instant('enterprise.article');
        vm.loading = true;
        if(!_.isUndefined($stateParams['articleId'])) {
            vm.enterpriseArticleService.find(localStorageService.get('company'), $stateParams['articleId'], {}, {cache: false}).then(function(result: IArticle) {
                vm.article = result;
                _.each(vm.article.categories, function (value: any) {
                    vm.articleCategorySelected.push(value.id);
                });
                vm.categoryShow = true;
                vm.setSelectedArticleCategory(articleCategory);
                if(!_.isUndefined(vm.article.tags)) {
                    _.each(vm.article.tags, function(value: any) {
                        vm.tags.push(value.name);
                    });
                    vm.article.tags = vm.tags;
                }
                if(vm.article.cover !== null && !_.isUndefined(vm.article.cover) ) vm.cover = vm.article.cover.url['200'];
                vm.loading = false;
            });
        } else {
            vm.article.content = '';
            vm.loading = false;
        }

        vm.companyId = vm.localStorageService.get('company');

        vm.userService.getSkill({'type': 'PostTag'}, {cache: false}).then(function (result: any) {
            _.each(result, function (value: any) {
                vm.defaultTags.push(value.name);
            });
        });


    }



    // category

    setSelectedArticleCategory(item: any) {
        var vm = this;
        if(vm.categoryError) vm.categoryError = false;
        angular.forEach(item, function (value: any) {
            value.selected = false;
            if (vm.articleCategorySelected.indexOf(value.id) !== -1) {
                value.selected = true;
                vm.selectedArticleCategory.push(value);
                vm.selectedArticleCategoryIds.push(value.id);
            } else {
                value.selected = false;
            }
        });
        vm.article.categoryIds = vm.selectedArticleCategoryIds;
    }



    addSelectedArticleCategory(data: IArticleCategory) {
        var vm = this;
        var result = _.findIndex(vm.selectedArticleCategory, {id: data.id});
        if (result === -1) {
            if (vm.selectedArticleCategory.length < 3) {
                data['selected'] = true;
                vm.selectedArticleCategory.push(data);
                vm.selectedArticleCategoryIds.push(data.id);
            }
        } else {
            data['selected'] = false;
            vm.selectedArticleCategory.splice(result, 1);
            vm.selectedArticleCategoryIds.splice(result, 1);
        }
        vm.article.categoryIds = vm.selectedArticleCategoryIds;
        vm.categoryError = vm.selectedArticleCategory.length === 0 ? true : false;
    }




    // 上传/修改 图片.
    uploadFile(file?: any): any {
        var vm = this;
        if(vm.showError) vm.showError = false;
        vm.files = file;
    }


    // article content
    contentInput() {
        var vm = this;
        if(vm.article.content !== '') vm.contentError = false;
        if(vm.tagsError) vm.tagsError = false;
    }


    // Add article
    post(): void {
        var vm = this;
        vm.saveLoading = true;
        var data = angular.copy(vm.article);
        // add data
        if(data.categoryIds === undefined || data.categoryIds.length === 0) {
            vm.categoryError = true;
            vm.$timeout(function() {
                vm.saveLoading = false;
            }, 1000);

        } else if (data.tags === undefined || data.tags.length === 0) {
            vm.tagsError = true;
            vm.$timeout(function() {
                vm.saveLoading = false;
            }, 1000);
        } else if (data.content === '' || _.isUndefined(data.content)) {
            vm.contentError = true;
            vm.toaster.pop('error', '', vm.$translate.instant('article.article_content_input_error_msg'));
            vm.$timeout(function() {
                vm.saveLoading = false;
            }, 1000);
        } else {
            _.each(data.tags, function (value: any) {
                vm.saveTags.push({name: value});
            });
            data.tags = vm.saveTags;


            var savePromise = data.id === undefined ? vm.enterpriseArticleService.store(vm.companyId, {
                'categoryIds': data.categoryIds,
                'title': data.title,
                'tags': data.tags,
                'content': data.content
            }) : vm.enterpriseArticleService.update(vm.companyId, data.id, data);
            savePromise.then(function (result: any) {
                vm.articleNew = result;
                if (!_.isUndefined(vm.articleNew.id)) {
                    var params = angular.copy(vm.articleNew);
                    // Company logo
                    if (!_.isUndefined(vm.files)) {
                        vm.enterpriseArticleService.uploadCover(vm.companyId, vm.articleNew.id, vm.files, params).then(function (result: any) {
                            vm.cover = result.url['200'];
                            vm.saveLoading = false;
                            vm.toaster.pop('success', '', vm.$translate.instant('message.article_edit_success_msg'));
                            vm.$state.go('enterprise-auth.company.article-list', {companyId: vm.companyId});
                        }, function(err: any) {
                            switch(err.data.validation) {
                                case 'dimensions':
                                    vm.coverError = 'message.icon_dimensions_error_message';
                                    vm.toaster.pop('error', '', vm.$translate.instant('message.article_create_success_cover_dimensions_error'));
                                    vm.$state.go('enterprise-auth.company.article-edit', {companyId: vm.companyId, articleId: vm.articleNew.id});
                                    break;
                                case 'image':
                                    vm.coverError = 'message.icon_size_error_message';
                                    vm.toaster.pop('error', '', vm.$translate.instant('message.article_create_success_cover_size_error'));
                                    vm.$state.go('enterprise-auth.company.article-edit', {companyId: vm.companyId, articleId: vm.articleNew.id});
                                    break;
                            }

                            vm.showError = true;
                            vm.saveLoading = false;
                        });
                    } else {
                        vm.saveLoading = false;
                        vm.toaster.pop('success', '', vm.$translate.instant('message.article_edit_success_msg'));
                        vm.$state.go('enterprise-auth.company.article-list', {companyId: vm.companyId});
                    }
                }
            }, function (err: any) {
                vm.saveLoading = false;
            });
        }
    }


}
