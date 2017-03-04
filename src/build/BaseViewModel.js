import { PropertyChangedContext, PropertyChangedExtenderContext } from './Types';
import * as ajax from "./Ajax";
import * as ko from "knockout";
ko.extenders.propertyChanged = function (target, extenderContext) {
    if (target) {
        target.subscribe(function (newValue) {
            var domContainer;
            domContainer = document.getElementById(extenderContext.containerId);
            if (!domContainer) {
                throw new Error("ContainerId");
            }
            var viewModel = ko.dataFor(domContainer);
            var properties = viewModel.configurator.properties;
            var propertyDefinition = ko.utils.arrayFirst(properties, function (prop) { return prop.originalName == extenderContext.propertyName; });
            var changedContext = new PropertyChangedContext(extenderContext.propertyName, newValue, viewModel, propertyDefinition);
            console.log("Property changed context:", changedContext);
        });
    }
};
var BaseViewModel = (function () {
    function BaseViewModel(configurator) {
        this.excludeProps = ["data", "submitText", "canSave", "configurator", "objectState"];
        this.configurator = configurator;
        this.submitText = ko.observable("Create")
            .extend({ propertyChanged: new PropertyChangedExtenderContext(configurator.containerId, "submitText") });
    }
    BaseViewModel.prototype.successCallback = function (context) {
    };
    BaseViewModel.prototype.failureCallback = function (context) {
    };
    BaseViewModel.prototype.executeWebResult = function (context) {
    };
    BaseViewModel.prototype.create = function () {
        ajax.httpPost("/api/savemodel", { id: 1, name: "jhon" }, this.successCallback, this.failureCallback);
    };
    return BaseViewModel;
}());
export { BaseViewModel };
