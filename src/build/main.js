import { DefaultViewModel } from './DefaultViewModel';
import { ViewModelConfigurator } from './ViewModelConfigurator';
import * as ko from "knockout";
var viewModel = new DefaultViewModel(new ViewModelConfigurator(), function (model) { console.log("init callback", model); });
window.viewModel = viewModel;
for (var key in viewModel) {
    console.log("instance prop name:", key);
}
// test
ko.applyBindings(viewModel, document.getElementById('container'));
