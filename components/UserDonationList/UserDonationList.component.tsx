import { Spin } from "antd";
import {UserDonationListProps} from "./UserDonationList.d";
import styles from './UserDonationList.module.scss';
import clsx from "clsx";
import { Date } from "@core/components/Date";

export const UserDonationListComponent = ({user:_user, donations, isLoading, title}:UserDonationListProps) =>
    <Spin spinning={isLoading}>
        <h1 className={styles.donationTitle}>
            {title || <>My Donations</>}
        </h1>
        {donations.length === 0 && !isLoading && <div>No donations found</div>}
        <div className={clsx(styles.donationList, "user-donation-list")}>
            {donations.map(donation => 
                <div key={donation.id} className={styles.donation}>
                    <div className={styles.header}>
                        <div className={styles.amount}>${(donation.amount).toFixed(2)}</div>
                        <div className={styles.date}><Date date={donation.createdAt} /></div>
                    </div>
                    <hr />
                    <div className={styles.note}>
                        {donation.note || "No note provided"}
                    </div>
                </div>
            )}
        </div>
    </Spin>;
