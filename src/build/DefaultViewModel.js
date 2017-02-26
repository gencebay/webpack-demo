var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { BaseViewModel } from './BaseViewModel';
import * as ko from "knockout";
var DefaultViewModel = (function (_super) {
    __extends(DefaultViewModel, _super);
    function DefaultViewModel(configurator, initCallback) {
        var _this = _super.call(this, configurator) || this;
        _this._initCallback = initCallback;
        _this.count = ko.observable(0);
        return _this;
    }
    DefaultViewModel.prototype.create = function () {
        console.log("View model created.");
        if (this._initCallback) {
            console.log("init Callback Context:", this._initCallback(this));
        }
        return;
    };
    DefaultViewModel.prototype.counter = function () {
        var count = this.count();
        console.log("Counter triggered:", count);
        this.count(count + 1);
    };
    return DefaultViewModel;
}(BaseViewModel));
export { DefaultViewModel };
