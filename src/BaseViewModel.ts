import { 
    ViewModelConfigurator, 
    PropertyChangedContext, 
    PropertyChangedExtenderContext,
    Events
} from './Types'
import * as ajax from "./Ajax"
import * as ko from "knockout"
import * as ps from "./PubSub"

(<any>ko.extenders).propertyChanged = function(target:KnockoutObservable<any>, extenderContext:PropertyChangedExtenderContext):any {
    if(target) {
        target.subscribe(function(newValue) {
            let domContainer:any;
            domContainer = document.getElementById(extenderContext.containerId);
            if(!domContainer) {
                throw new Error("ContainerId");
            }
            let viewModel: BaseViewModel = ko.dataFor(domContainer);
            var properties = viewModel.configurator.properties;
            var propertyDefinition = ko.utils.arrayFirst(properties, (prop) => prop.originalName == extenderContext.propertyName);
            let changedContext = new PropertyChangedContext(
                extenderContext.propertyName,
                newValue,
                viewModel,
                propertyDefinition
            )
            ps.PubSub.publish(Events[Events.PropertyChanged], changedContext);
        });
    }
}

export class BaseViewModel {
    configurator: ViewModelConfigurator;
    submitText:KnockoutObservable<any>
    excludeProps:string[] = ["data", "submitText", "canSave", "configurator", "objectState"];
    
    constructor (configurator: ViewModelConfigurator) {
        this.configurator = configurator;
        this.submitText = ko.observable("Create")
        .extend({ propertyChanged: new PropertyChangedExtenderContext(configurator.containerId, "submitText") });
    }

    private successCallback(context:any) {

    } 

    private failureCallback(context:any) {

    }

    executeWebResult(context: any) {
    }

    create() {
        ajax.httpPost("/api/savemodel", {id: 1, name: "jhon"}, this.successCallback, this.failureCallback);       
    }
}