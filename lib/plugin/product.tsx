import { Snippet } from "@common/components/Snippet";
import { services } from "@core/lib/api";
import { flash } from "@core/lib/flash";
import { onInputChange, onNumberChange } from "@core/lib/onInputChange";
import { useLoaderAsync } from "@core/lib/useLoader";
import { useModal } from "@core/lib/useModal";
import { IUpdater } from "@core/lib/useUpdater";
import { IDonation } from "@donation-products-plugin-shared/donation/types";
import { IDonatableProduct } from "@donation-products-plugin-shared/product/types";
import { UserDonationList } from "@donation-products-plugin/components/UserDonationList";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { storePlugins } from "@store/lib/plugin/slots";
import { useLoggedInUser } from "@uac/lib/login/services";
import { uacPlugins } from "@uac/lib/plugin/slots";
import { Button, Input, Modal, Space, Switch } from "antd";
import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./product.module.scss";

export const registerPlugins = () => {
    // Add a toggle for donation products in the product editor details section
    storePlugins.product.editor.details.register(900, props => {
        const {history:{entity:product}, updateToggle} = props as IUpdater<IDonatableProduct>;

        return <Space style={{width: "100%"}}>
            Donation Product:   <Switch checked={product.isDonation}         onChange={updateToggle("isDonation")}         checkedChildren="Yes" unCheckedChildren="No"/> 
            Set Your Own Price: <Switch checked={product.isSetYourOwnAmount} onChange={updateToggle("isSetYourOwnAmount")} checkedChildren="Yes" unCheckedChildren="No"/> 
        </Space>
    });

    // Show "pay what you want" for the product price
    storePlugins.product.price.register({
        priority: 900,
        filter: ({product}) => (product as IDonatableProduct).isSetYourOwnAmount,
        plugin: ({product}) => <div>${product.price.toFixed(2)} and up</div>,
    });

    // Show a donation form instead of the add to cart button
    storePlugins.cart.addButton.register({
        priority: 900,
        filter: ({product}) => (product as IDonatableProduct).isDonation || (product as IDonatableProduct).isSetYourOwnAmount,
        plugin: ({product:p, size}) => {
            const product = p as IDonatableProduct;
            const [price, setPrice] = useState(product.price);
            const modal = useModal();
            const [user] = useLoggedInUser();
            const [note, setNote] = useState("");
            const loader = useLoaderAsync();
            const navigate = useNavigate();

            const createDonation = async () => {
                const donation = await services().donation.start(user.user.id, {
                    productId: product.id,
                    amount: product.isSetYourOwnAmount ? price : product.price,
                    note,
                });
                return donation.transactionId;
            }

            const finishDonation = (donation:IDonation) => {
                    flash.success("Donation placed successfully")();
                    modal.close();
                    navigate(`/my-account/orders/${donation.orderId}`);
            }

            const onApprove = (_data:any, actions:any) => 
                actions.order.capture().then((details:any) => 
                    loader(() => services().donation.finalize(user.user.id, details.id)
                        .then(finishDonation)
                    )
                );        

            return <div className={clsx([styles.addToCart, size && styles[size]])}>
                <Modal
                    title={<Snippet slug={product.isDonation ? "donation-modal-title" : "pwyw-modal-title"} />}
                    open={modal.visible}
                    onCancel={modal.close}
                    footer={null}
                >
                    <Snippet slug={product.isDonation ? "donation-modal-copy" : "pwyw-modal-copy"} /><br/>
                    {product.isSetYourOwnAmount && <Input
                        addonBefore="$"
                        value={price}
                        type="number"
                        min={product.price}
                        step={1}
                        onChange={onInputChange(onNumberChange(setPrice))}
                        style={{marginBottom: "1em"}}
                    />}
                    {!product.isSetYourOwnAmount
                        ? <p>Your donation amount is <strong>${product.price.toFixed(2)}</strong></p>
                        : <p>You can choose any amount at or above <strong>${product.price.toFixed(2)}</strong></p>
                    }
                    <Input.TextArea
                        value={note}
                        onChange={onInputChange(setNote)}
                        placeholder={`Add a note to your ${product.isDonation ? "donation" : "purchase"} (optional)`}
                        rows={4}
                        style={{marginBottom: "1em"}}
                    />
                    <PayPalButtons style={{layout: "horizontal"}}
                        createOrder={createDonation}
                        onApprove={onApprove}
                        onCancel={() => {
                            modal.close();
                        }}
                    />
                </Modal>
                {product.isSetYourOwnAmount && <Input
                    addonBefore="$"
                    value={price}
                    type="number"
                    min={product.price}
                    step={1}
                    onChange={onInputChange(onNumberChange(setPrice))}
                />}
                <Button className={clsx([product.isSetYourOwnAmount && styles.pwywBtn])} type="primary" onClick={modal.open}>
                    <FontAwesomeIcon icon={faHandHoldingDollar} />
                    {product.isDonation ? "Donate Now" : "Pick Your Price"}
                </Button>
            </div>;
        },
    });

    // Add donation list to user account
    uacPlugins.myAccount.tabs.register({
        priority: 900,
        key: "donations",
        title: "My Donations",
        icon: faHandHoldingDollar,
        component: UserDonationList,
    });

    // Add donation list to admin user manager
    uacPlugins.userManager.tabs.register({
        priority: 900,
        key: "donations",
        title: "Donations",
        icon: faHandHoldingDollar,
        component: ({userId}) => <UserDonationList userId={userId} title="Donations"/>,
    });
}
