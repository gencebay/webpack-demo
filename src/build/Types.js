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
export var ResultState;
(function (ResultState) {
    ResultState[ResultState["unset"] = 0] = "unset";
    ResultState[ResultState["success"] = 1] = "success";
    ResultState[ResultState["warning"] = 2] = "warning";
    ResultState[ResultState["error"] = 3] = "error";
    ResultState[ResultState["invalid"] = 4] = "invalid";
    ResultState[ResultState["fail"] = 5] = "fail";
})(ResultState || (ResultState = {}));
var ModelValidationResult = (function () {
    function ModelValidationResult() {
        this.messages = [];
    }
    Object.defineProperty(ModelValidationResult.prototype, "allMessages", {
        get: function () {
            return this.messages.join(",");
        },
        enumerable: true,
        configurable: true
    });
    return ModelValidationResult;
}());
export { ModelValidationResult };
var WebResult = (function () {
    function WebResult() {
        this.duration = 2000;
        this.state = ResultState.success;
        this.validations = [];
    }
    Object.defineProperty(WebResult.prototype, "isValid", {
        get: function () {
            if (this.state != ResultState.success || this.validations.length > 0) {
                return false;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebResult.prototype, "resultState", {
        get: function () {
            return ResultState[this.state];
        },
        enumerable: true,
        configurable: true
    });
    return WebResult;
}());
export { WebResult };
var WebResultOfT = (function (_super) {
    __extends(WebResultOfT, _super);
    function WebResultOfT(instance) {
        var _this = _super.call(this) || this;
        _this.result = instance;
        return _this;
    }
    return WebResultOfT;
}(WebResult));
export { WebResultOfT };
