import { CustomLinkModel } from "../../CustomGraph/CustomLinkModel";
import { DefaultPortModel } from '@projectstorm/react-diagrams';

export class NavigationPortModel extends DefaultPortModel {
  constructor(options = {}) {
    super(options.in, options.name);
    this.type = options.type || 'default';
  }

  canLinkToPort(port) {
    if (this.type === 'end') {
      return false;
    }
    return super.canLinkToPort(port);
  }

  createLinkModel() {
    return new CustomLinkModel();
  }
}

