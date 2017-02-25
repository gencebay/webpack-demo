import { ViewModelConfigurator } from './ViewModelConfigurator'
import { BaseViewModel } from './BaseViewModel'
import * as ko from "knockout";

export class DefaultViewModel extends BaseViewModel {
    constructor(configurator: ViewModelConfigurator, initCallback: (model: DefaultViewModel) => void ) {
        super(configurator);
    }
}