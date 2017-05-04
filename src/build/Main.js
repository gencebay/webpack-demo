import { DefaultViewModel } from './DefaultViewModel';
import { ViewModelConfigurator, InputType, Events } from './Types';
import * as ps from "./PubSub";
import * as ko from "knockout";
// dom element id
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
ps.PubSub.subscribe(Events[Events.PropertyChanged], function (topic, context) {
    console.log("Global PubSub PropertyChanged: ", context);
});
window.PubSub = ps.PubSub;
// apply bindings
ko.applyBindings(viewModel, document.getElementById(containerId));
