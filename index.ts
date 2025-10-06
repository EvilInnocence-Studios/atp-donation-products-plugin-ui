import { IModule } from "@core/lib/module";
import { registerPlugins } from "./lib/plugin/productEditorDetails";

export const module:IModule = {
    name: "donation-product-plugin",
}

registerPlugins();