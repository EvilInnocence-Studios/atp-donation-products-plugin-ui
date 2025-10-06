import { IUpdater } from "@core/lib/useUpdater";
import { storePlugins } from "@store/lib/plugin/slots";
import { Space, Switch } from "antd";

export const registerPlugins = () => {
    storePlugins.product.editor.details.register(900, props => {
        const {history:{entity:product}, updateToggle} = props as IUpdater<IDonatableProduct>;

        return <Space style={{width: "100%"}}>
            Donation Product: <Switch checked={product.isDonation} onChange={updateToggle("isDonation")} checkedChildren="Yes" unCheckedChildren="No"/> 
        </Space>
    });
}
