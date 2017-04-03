export interface IErrorMessage {
  data?: {
    result?: {
      code?: string;
      message?: string;
    }
  };
}

export class MessageService {

  /* @ngInject */
  constructor(private toaster: ngtoaster.IToasterService) {
    //
  }
  formError(result: IErrorMessage): void {
    try {
      this.toaster.pop('error', '', result.data.result.message);
    } catch (err) {
      //
    }
  }


}

