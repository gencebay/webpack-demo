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
    ResultState[ResultState["Unset"] = 0] = "Unset";
    ResultState[ResultState["Success"] = 1] = "Success";
    ResultState[ResultState["Warning"] = 2] = "Warning";
    ResultState[ResultState["Error"] = 3] = "Error";
    ResultState[ResultState["Invalid"] = 4] = "Invalid";
    ResultState[ResultState["Fail"] = 5] = "Fail";
})(ResultState || (ResultState = {}));
export var Events;
(function (Events) {
    Events[Events["PropertyChanged"] = 0] = "PropertyChanged";
})(Events || (Events = {}));
export var InputType;
(function (InputType) {
    InputType[InputType["CheckBox"] = 0] = "CheckBox";
    InputType[InputType["Hidden"] = 1] = "Hidden";
    InputType[InputType["Password"] = 2] = "Password";
    InputType[InputType["Radio"] = 3] = "Radio";
    InputType[InputType["Text"] = 4] = "Text";
    InputType[InputType["Enum"] = 5] = "Enum";
    InputType[InputType["Select"] = 6] = "Select";
    InputType[InputType["DateTime"] = 7] = "DateTime";
})(InputType || (InputType = {}));
var PropertyDefinition = (function () {
    function PropertyDefinition() {
    }
    return PropertyDefinition;
}());
export { PropertyDefinition };
var ViewModelConfigurator = (function () {
    function ViewModelConfigurator(containerId) {
        this.containerId = containerId;
    }
    return ViewModelConfigurator;
}());
export { ViewModelConfigurator };
var PropertyChangedContext = (function () {
    function PropertyChangedContext(name, newValue, viewModel, propertyDefinition) {
        this.name = name;
        this.newValue = newValue;
        this.viewModel = viewModel;
        this.propertyDefinition = propertyDefinition;
    }
    return PropertyChangedContext;
}());
export { PropertyChangedContext };
var PropertyChangedExtenderContext = (function () {
    function PropertyChangedExtenderContext(containerId, propertyName) {
        this.containerId = containerId;
        this.propertyName = propertyName;
    }
    return PropertyChangedExtenderContext;
}());
export { PropertyChangedExtenderContext };
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
        this.state = ResultState.Success;
        this.validations = [];
    }
    Object.defineProperty(WebResult.prototype, "isValid", {
        get: function () {
            if (this.state != ResultState.Success || this.validations.length > 0) {
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
