export enum ResultState {
    unset = 0,
    success,
    warning,
    error,
    invalid,
    fail
}

export class ModelValidationResult {
    name:string;
    messages:string[] = [];
    get allMessages(): string {
        return this.messages.join(",");
    }
}

export class WebResult {
    id:string;
    title:string;
    content:string;
    duration:number = 2000;
    state:ResultState = ResultState.success;
    validations:ModelValidationResult[] = [];
    get isValid(): boolean {
        if(this.state != ResultState.success || this.validations.length > 0) {
            return false;
        }
        return true;
    }
    get resultState(): string {
        return ResultState[this.state]
    }
}

export class WebResultOfT<T> extends WebResult {
    result:T;
    constructor(instance:T) {
        super();
        this.result = instance;
    }
}