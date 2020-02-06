import { CustomLinkModel } from "../CustomGraph/CustomLinkModel";
import { DefaultPortModel } from '@projectstorm/react-diagrams';

export class CommonPortModel extends DefaultPortModel {

	canLinkToPort(port) {
    if(port.type === 'start'){
      return false;
    }
		return super.canLinkToPort(port);
  }

  createLinkModel() {
		return new CustomLinkModel();
	}
}
