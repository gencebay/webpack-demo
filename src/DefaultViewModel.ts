import { ViewModelConfigurator } from './ViewModelConfigurator'
import { BaseViewModel } from './BaseViewModel'
import * as ko from "knockout";

export class DefaultViewModel extends BaseViewModel {
    private readonly _initCallback: (model: DefaultViewModel) => void;
    private count: KnockoutObservable<number>;
    constructor(configurator: ViewModelConfigurator, initCallback?: (model: DefaultViewModel) => void ) {
        super(configurator);
        this._initCallback = initCallback;
        this.count = ko.observable(0);
    }
    create() {
        console.log("View model created.");
        if(this._initCallback) {
            console.log("init Callback Context:", this._initCallback(this));
        }
        return;
    }
    counter() {
        var count = this.count();
        console.log("Counter triggered:", count);
        this.count(count + 1);
    }
}