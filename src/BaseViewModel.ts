import { ViewModelConfigurator } from "./ViewModelConfigurator"
import * as ko from "knockout"

export class BaseViewModel {
    id: KnockoutObservable<string>

    constructor (configurator: ViewModelConfigurator) {
        this.id = ko.observable("");
    }
    put() {
        console.log("Put executed.");
    }
}