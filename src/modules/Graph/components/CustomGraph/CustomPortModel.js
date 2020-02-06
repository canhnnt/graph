import { DefaultPortModel } from "@projectstorm/react-diagrams";
import { CustomLinkModel } from "./CustomLinkModel";

export class CustomPortModel extends DefaultPortModel {
	createLinkModel() {
		return new CustomLinkModel();
	}
}
