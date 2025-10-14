import { IModule } from "@core/lib/module";
import { registerPlugins } from "./lib/plugin/product";

export const module:IModule = {
    name: "donation-product-plugin",
}

registerPlugins();