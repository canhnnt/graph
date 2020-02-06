import { NodeModel } from '@projectstorm/react-diagrams';

/**
 * Example of a custom model using pure javascript
 */
export class CommonStepModel extends NodeModel {
	constructor(name, options) {
		super(name);
		this.state = options;
	}

	serialize() {
		return {
			...super.serialize(),
      ...this.state
		};
	}
}
