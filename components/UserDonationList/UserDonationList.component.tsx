import { Spin } from "antd";
import { UserDonationListProps } from "./UserDonationList.d";
import styles from './UserDonationList.module.scss';
import clsx from "clsx";
import { Date } from "@core/components/Date";
import { overridable } from "@core/lib/overridable";

export const UserDonationListComponent = overridable(({ user: _user, donations, isLoading, title, classes = styles }: UserDonationListProps) =>
    <Spin spinning={isLoading}>
        <h1 className={classes.donationTitle}>
            {title || <>My Donations</>}
        </h1>
        {donations.length === 0 && !isLoading && <div>No donations found</div>}
        <div className={clsx(classes.donationList, "user-donation-list")}>
            {donations.map(donation =>
                <div key={donation.id} className={classes.donation}>
                    <div className={classes.header}>
                        <div className={classes.amount}>${(donation.amount).toFixed(2)}</div>
                        <div className={classes.date}><Date date={donation.createdAt} /></div>
                    </div>
                    <hr />
                    <div className={classes.note}>
                        {donation.note || "No note provided"}
                    </div>
                </div>
            )}
        </div>
    </Spin>
);
