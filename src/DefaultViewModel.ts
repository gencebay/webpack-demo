import { ViewModelConfigurator, PropertyChangedExtenderContext } from "./Types";
import { BaseViewModel } from "./BaseViewModel";
import * as ko from "knockout";

export class DefaultViewModel extends BaseViewModel {
  private readonly _initCallback: (model: DefaultViewModel) => void;
  private count: KnockoutObservable<number>;
  private phone: KnockoutObservable<string>;
  constructor(
    configurator: ViewModelConfigurator,
    initCallback?: (model: DefaultViewModel) => void
  ) {
    super(configurator);
    this._initCallback = initCallback;
    this.count = ko.observable(0);
    this.phone = ko.observable("").extend({
      propertyChanged: new PropertyChangedExtenderContext(
        configurator.containerId,
        "phone"
      )
    });
  }
  counter() {
    var count = this.count();
    console.log("Count Trigger:", count);
    count = count + 1;
    this.submitText("Clicked-" + count);
    this.count(count);
  }
}
