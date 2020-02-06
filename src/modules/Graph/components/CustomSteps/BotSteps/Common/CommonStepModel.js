import { NodeModel } from '@projectstorm/react-diagrams';

/**
 * Example of a custom model using pure javascript
 */
export class CommonStepModel extends NodeModel {
	constructor(name, options) {
		super(name);
		this.state = options;

		// setup an in and out port
		// this.addPort(
		// 	new DefaultPortModel(
		// 		false,
		// 		'portOut'
		// 	)
		// );
	}

	serialize() {
		return {
			...super.serialize(),
      ...this.state
		};
	}
}
