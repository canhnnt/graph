import React from 'react';
import { EndStepModel } from './EndStepModel';
import { EndStepWidget } from './EndStepWidget';
import * as RD from '@projectstorm/react-diagrams';

export class EndStepFactory extends RD.AbstractNodeFactory {
	constructor() {
		super('End');
	}

	getNewInstance() {
		return new EndStepModel();
	}

	generateReactWidget(diagramEngine, node) {
		return <EndStepWidget node={node} />;
	}
}
