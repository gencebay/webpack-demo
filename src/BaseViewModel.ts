import { ViewModelConfigurator } from "./ViewModelConfigurator"
import * as ko from "knockout"

export class BaseViewModel extends Object {
    constructor (configurator: ViewModelConfigurator) {
        super();
    }
}