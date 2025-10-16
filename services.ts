import { IMethods } from "@core/lib/types";
import { getResults } from "@core/lib/util";
import { IDonation, NewDonation } from "@donation-products-plugin-shared/donation/types";

export const donationServices = ({get, post, remove}:IMethods) => ({
    donation: {
        search: (userId:string):Promise<IDonation[]> => get(`user/${userId}/donation`).then(getResults<IDonation[]>),
        get: (userId:string, donationId:string):Promise<IDonation> => get(`user/${userId}/donation/${donationId}`).then(getResults<IDonation>),
        remove: (userId:string, donationId:string):Promise<void> => remove(`user/${userId}/donation/${donationId}`),
        start: (userId:string, donation:Partial<NewDonation>):Promise<IDonation> => post(`user/${userId}/donation/start`, donation).then(getResults<IDonation>),
        finalize: (userId:string, transactionId:string):Promise<IDonation> => post(`user/${userId}/donation/finalize`, {transactionId}).then(getResults<IDonation>),
    }
})