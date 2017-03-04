import { DefaultViewModel } from './DefaultViewModel';
import { ViewModelConfigurator, InputType } from './Types';
import * as ko from "knockout";
var containerId = "container";
var prop1 = {
    id: "1",
    inputType: InputType.Text,
    label: "User Fullname",
    name: "Fullname",
    originalName: "fullname",
    type: "String"
};
var prop2 = {
    id: "2",
    inputType: InputType.Text,
    label: "Phone Number",
    name: "Phone Number",
    originalName: "phone",
    type: "String"
};
var properties = [
    prop1,
    prop2
];
var configurator = new ViewModelConfigurator(containerId);
configurator.properties = [
    prop1,
    prop2
];
var viewModel = new DefaultViewModel(configurator, function (model) { console.log("init callback", model); });
window.viewModel = viewModel;
for (var key in viewModel) {
    console.log("instance prop name:", key);
}
// test
ko.applyBindings(viewModel, document.getElementById(containerId));
