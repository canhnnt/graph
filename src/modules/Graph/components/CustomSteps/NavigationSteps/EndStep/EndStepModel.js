import { NodeModel } from '@projectstorm/react-diagrams';
import { NavigationPortModel } from '../NavigationPortModel';

/**
 * Example of a custom model using pure javascript
 */
export class EndStepModel extends NodeModel {
	constructor(options = {}) {
    super('End');
		this.state = options;

		// setup an in and out port
		this.addPort(
			new NavigationPortModel({
				in: true,
        name: 'portIn',
        type: 'end'
      })
		);
	}

	serialize() {
		return {
      ...super.serialize(),
      ...this.state
		};
	}
}
