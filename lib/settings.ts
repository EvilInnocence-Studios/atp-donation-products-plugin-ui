import { ISettingContainer } from "@common/lib/setting/types";

export const donationProductSettings:ISettingContainer = {
    Ecommerce: {
        "Donation Products": {
            "donationProduct.donationModalTitle": {
                displayName: "Donation Modal Title",
                type: "string",
                defaultValue: "Donate",
                description: "Title for the donation modal",
            },
            "donationProduct.donationModalCopy": {
                displayName: "Donation Modal Copy",
                type: "string",
                defaultValue: "Thank you for your support!",
                description: "Copy for the donation modal",
            },
            "donationProduct.pwywModalTitle": {
                displayName: "Pay What You Want Modal Title",
                type: "string",
                defaultValue: "Pay What You Want",
                description: "Title for the pay what you want modal",
            },
            "donationProduct.pwywModalCopy": {
                displayName: "Pay What You Want Modal Copy",
                type: "string",
                defaultValue: "Thank you for your support!",
                description: "Copy for the pay what you want modal",
            },
        },
    },
}
