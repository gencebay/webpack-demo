import { BaseViewModel } from "./BaseViewModel"

export enum ResultState {
    Unset = 0,
    Success,
    Warning,
    Error,
    Invalid,
    Fail
}

export enum InputType
{
    CheckBox=0,
    Hidden,
    Password,
    Radio,
    Text,
    Enum,
    Select,
    DateTime
}

export class PropertyDefinition {
    id:string;
    name:string;
    originalName:string;
    label:string;
    type:string;
    inputType:InputType;
}

export class ViewModelConfigurator {
    containerId:string;
    formId:string;
    apiUrlRoot:string;
    properties:PropertyDefinition[];
    constructor(containerId:string) {
        this.containerId = containerId;
    }
}

export class PropertyChangedContext {
    name:string;
    viewModel:BaseViewModel;
    newValue:any;
    propertyDefinition: PropertyDefinition    
    constructor(name:string, newValue:any, viewModel:BaseViewModel, propertyDefinition: PropertyDefinition) {
        this.name = name;
        this.newValue = newValue;
        this.viewModel = viewModel;
        this.propertyDefinition = propertyDefinition
    }
}

export class PropertyChangedExtenderContext {
    containerId:string;    
    propertyName:string;
    constructor(containerId: string, propertyName:string) {
        this.containerId = containerId;
        this.propertyName = propertyName;
    }
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
    state:ResultState = ResultState.Success;
    validations:ModelValidationResult[] = [];
    get isValid(): boolean {
        if(this.state != ResultState.Success || this.validations.length > 0) {
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