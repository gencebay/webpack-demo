import { BaseViewModel } from './BaseViewModel'
import { DefaultViewModel } from './DefaultViewModel'
import { ViewModelConfigurator } from './ViewModelConfigurator'
import * as ko from "knockout"

let viewModel = new DefaultViewModel(new ViewModelConfigurator(), (model) => { console.log("init callback", model) });
(<any>window).viewModel = viewModel;

for(var key in viewModel){
    console.log("instance prop name:", key);
}

// test
ko.applyBindings(viewModel, document.getElementById('container'));