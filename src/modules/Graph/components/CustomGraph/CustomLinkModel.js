import { DefaultLinkModel } from "@projectstorm/react-diagrams";

export class CustomLinkModel extends DefaultLinkModel {
	constructor() {
		super("custom-link-model");
		this.width = 1;
	}
}