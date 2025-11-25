import { IMethods } from "@core/lib/types";
import { donationServices } from "../services";

export const donationProductsPluginServices = (methods:IMethods) => ({
    ...donationServices(methods),
})