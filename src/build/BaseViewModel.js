import * as ko from "knockout";
var BaseViewModel = (function () {
    function BaseViewModel(configurator) {
        this.id = ko.observable("");
    }
    BaseViewModel.prototype.put = function () {
        console.log("Put executed.");
    };
    return BaseViewModel;
}());
export { BaseViewModel };
