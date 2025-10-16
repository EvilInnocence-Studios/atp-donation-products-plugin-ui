import { IDonation } from "@donation-products-plugin-shared/donation/types";
import { SafeUser } from "@uac-shared/user/types";

export declare interface IUserDonationListProps {
    user: SafeUser;
    donations: IDonation[];
    isLoading?: boolean;
}

// What gets passed into the component from the parent as attributes
export declare interface IUserDonationListInputProps {
    userId?: string;
    title?: string;
}

export type UserDonationListProps = IUserDonationListInputProps & IUserDonationListProps;