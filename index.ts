import { IModule } from "@core/lib/module";
import { registerPlugins } from "./lib/plugin/product";
import { donationProductSettings } from "./lib/settings";

export const module:IModule = {
    name: "donation-product-plugin",
    settings: donationProductSettings,
}

registerPlugins();