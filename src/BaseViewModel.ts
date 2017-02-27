import { ViewModelConfigurator } from "./ViewModelConfigurator"
import * as ko from "knockout"

export class BaseViewModel {
    excludeProps:string[] = ["data", "actionName", "canSave", "options", "objectState"];
    constructor (configurator: ViewModelConfigurator) {
        
    }

    executeWebResult(context: any) {
        
    }
}