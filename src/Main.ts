import { BaseViewModel } from './BaseViewModel'
import { DefaultViewModel } from './DefaultViewModel'
import { ViewModelConfigurator, PropertyDefinition, InputType, Events } from './Types'
import * as ps from "./PubSub"
import * as ko from "knockout"

// dom element id
let containerId = "container";

var prop1:PropertyDefinition = {
    id:"1",
    inputType:InputType.Text,
    label:"User Fullname",
    name:"Fullname",
    originalName:"fullname",
    type:"String"
};

var prop2:PropertyDefinition = {
    id:"2",
    inputType:InputType.Text,
    label:"Phone Number",
    name:"Phone Number",
    originalName:"phone",
    type:"String"
};

let properties:PropertyDefinition[] = [
    prop1,
    prop2
];

let configurator = new ViewModelConfigurator(containerId);
configurator.properties = [
    prop1,
    prop2
];

let viewModel = new DefaultViewModel(configurator, (model) => { console.log("init callback", model) });
(<any>window).viewModel = viewModel;

for(var key in viewModel){
    console.log("instance prop name:", key);
}

ps.PubSub.subscribe(Events[Events.PropertyChanged], (topic, context) => {
    console.log("Global PubSub PropertyChanged: ", context)
});

(<any>window).PubSub = ps.PubSub;

// apply bindings
ko.applyBindings(viewModel, document.getElementById(containerId));