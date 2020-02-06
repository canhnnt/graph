import React from 'react';
import { StartStepModel } from './StartStepModel';
import { StartStepWidget } from './StartStepWidget';
import * as RD from '@projectstorm/react-diagrams';

export class StartStepFactory extends RD.AbstractNodeFactory {
	constructor() {
		super('Start');
	}

	getNewInstance() {
		return new StartStepModel();
	}

	generateReactWidget(diagramEngine, node) {
		return <StartStepWidget node={node} />;
	}
}
