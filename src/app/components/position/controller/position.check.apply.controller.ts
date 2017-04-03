import {PositionQuestionService, IPositionQuestionNum, IPositionQuestion} from '../../position_question/service/position.question.service';
import {PositionService, IPosition} from '../../position/service/position.service';
import {CandidateService, ICandidate} from '../../position/service/candidate.service';


interface IQuestion {
    questionId: string,
    answer: string
}

export class CheckApplyPositionController {
    public positionQuestion: IPositionQuestionNum[] = [];
    public positionAnswer: IQuestion[] = [];
    public post: any = {
        positionAnswer: [],
        isisCheckApply: false
    };
    public answerNum: number = 0;
    public pastNum: number = 0;

    public initPromise: any = [];
    /* @ngInject */
    constructor(private toaster: ngtoaster.IToasterService,
                private $translate: angular.translate.ITranslateService,
                private $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance,
                private positionQuestionService: PositionQuestionService,
                private position: IPosition,
                private candidateService: CandidateService) {
        var vm = this;
        var getAnswerNum = vm.positionQuestionService.getQuestion(position.id, {}, {cache:false}).then(function(result: IPositionQuestionNum[]) {

            vm.positionQuestion = result;
            _.each(vm.positionQuestion, function(value: IPositionQuestionNum) {
                if(value.isRequired) {
                    vm.answerNum++;
                }
            });
        });

        vm.initPromise.push(getAnswerNum);
    }


    checkApply() {
        var vm = this;
        if(vm.positionQuestion.length > 0) {
            var getPositionAnswer = _.each(vm.positionQuestion, function(value: IPositionQuestionNum) {
                var index = _.findIndex(vm.post.positionAnswer, {'id': value.id});
                if(index === -1) {
                    if(!_.isUndefined(value.answer)) vm.post.positionAnswer.push({'answer': value.answer, 'questionId': value.id});
                }
                if(value.isRequired && !_.isUndefined(value.answer)) {
                    vm.pastNum++;
                }

            });
            vm.initPromise.push(getPositionAnswer);
            Promise.all(vm.initPromise).then(function (result) {
                if(vm.answerNum === vm.pastNum) {
                    vm.post.isCheckApply = true;
                    vm.$uibModalInstance.close(vm.post);
                }
            });


        } else {
            vm.post.isCheckApply = true;
            vm.$uibModalInstance.close(vm.post);
        }


    }

    cancel() {
        this.$uibModalInstance.dismiss();
    }


}





