import { services } from "@core/lib/api";
import { useLoaderAsync } from "@core/lib/useLoader";
import { IDonation } from "@donation-products-plugin-shared/donation/types";
import { SafeUser } from "@uac-shared/user/types";
import { useLoggedInUser } from "@uac/lib/login/services";
import { useEffect, useState } from "react";
import { createInjector, inject, mergeProps } from "unstateless";
import { UserDonationListComponent } from "./UserDonationList.component";
import { IUserDonationListInputProps, IUserDonationListProps, UserDonationListProps } from "./UserDonationList.d";

const injectUserDonationListProps = createInjector(({userId}:IUserDonationListInputProps):IUserDonationListProps => {
    const [loggedInUser] = useLoggedInUser();
    const [user, setUser] = useState<SafeUser>(loggedInUser.user);
    const loader = useLoaderAsync();
    const [donations, setDonations] = useState<IDonation[]>([]);

    useEffect(() => {
        if (userId && userId !== user.id) {
            loader(async () => {
                services().user.get(userId).then(setUser);
            });
        }
     }, [userId]);

    const refresh = () => {
        console.log('load orders');
        loader(async () => {
            services().donation.search(user.id).then(setDonations);
        });
    }

    useEffect(() => {
        if(user.id && user.id !== loggedInUser.user.id) {
            loader(async () => {
                services().user.get(user.id).then(setUser);
            });
        }
        refresh();
    }, [user.id]);

    return {user, donations, isLoading: loader.isLoading};
});

const connect = inject<IUserDonationListInputProps, UserDonationListProps>(mergeProps(
    injectUserDonationListProps,
));

export const UserDonationList = connect(UserDonationListComponent);
