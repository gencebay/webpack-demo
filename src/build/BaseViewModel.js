var BaseViewModel = (function () {
    function BaseViewModel(configurator) {
        this.excludeProps = ["data", "actionName", "canSave", "options", "objectState"];
    }
    BaseViewModel.prototype.executeWebResult = function (context) {
    };
    return BaseViewModel;
}());
export { BaseViewModel };
