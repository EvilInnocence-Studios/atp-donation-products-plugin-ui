import { onInputChange, onNumberChange } from "@core/lib/onInputChange";
import { IUpdater } from "@core/lib/useUpdater";
import { IDonatableProduct } from "@donation-products-plugin-shared/product/types";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { storePlugins } from "@store/lib/plugin/slots";
import { Button, Input, Modal, Space, Switch } from "antd";
import { useState } from "react";
import styles from "./product.module.scss";
import { useModal } from "@core/lib/useModal";
import { PayPalButtons } from "@paypal/react-paypal-js";
import clsx from "clsx";

export const registerPlugins = () => {
    // Add a toggle for donation products in the product editor details section
    storePlugins.product.editor.details.register(900, props => {
        const {history:{entity:product}, updateToggle} = props as IUpdater<IDonatableProduct>;

        return <Space style={{width: "100%"}}>
            Donation Product: <Switch checked={product.isDonation} onChange={updateToggle("isDonation")} checkedChildren="Yes" unCheckedChildren="No"/> 
        </Space>
    });

    // Show "pay what you want" for the product price
    storePlugins.product.price.register({
        priority: 900,
        filter: ({product}) => (product as IDonatableProduct).isDonation,
        plugin: () => <></>,
    });

    storePlugins.cart.addButton.register({
        priority: 900,
        filter: ({product}) => (product as IDonatableProduct).isDonation,
        plugin: ({product, size}) => {
            const [price, setPrice] = useState(product.price);
            const modal = useModal();

            return <div className={clsx([styles.addToCart, styles[size]])}>
                <Modal title={`Donate to ${product.name}`} open={modal.visible} onCancel={modal.close} footer={null}>
                    <p>You can choose to donate any amount equal to or greater than the minimum price of ${product.price}.</p>
                    <p>Thank you for your generosity!</p>
                    <Input
                        addonBefore="$"
                        value={price}
                        type="number"
                        min={product.price}
                        step={1}
                        onChange={onInputChange(onNumberChange(setPrice))}
                        style={{marginBottom: "1em"}}
                    />
                    <PayPalButtons style={{layout: "horizontal"}}
                        createOrder={(_, actions) => {
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                        value: price.toString(),
                                    },
                                }],
                            });
                        }}
                        onApprove={(_, actions) => {
                            return actions.order?.capture().then(() => {
                                // TODO: Finalize donation
                                modal.close();
                            });
                        }}
                        onCancel={() => {
                            modal.close();
                        }}
                    />
                </Modal>
                <Input
                    addonBefore="$"
                    value={price}
                    type="number"
                    min={product.price}
                    step={1}
                    onChange={onInputChange(onNumberChange(setPrice))}
                />
                <Button className={styles.donateButton} type="primary" onClick={modal.open}>
                    <FontAwesomeIcon icon={faHandHoldingDollar} />
                    Donate
                </Button>
            </div>;
        },
    });
}
