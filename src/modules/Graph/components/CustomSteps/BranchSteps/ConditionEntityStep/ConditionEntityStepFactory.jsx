import * as React from 'react';
import { ConditionEntityStepModel } from './ConditionEntityStepModel';
import ConditionEntityStepWidget from './ConditionEntityStepWidget';
import ConditionEntityStepOption from './ConditionEntityStepOption';
import * as RD from '@projectstorm/react-diagrams';

export class ConditionEntityStepFactory extends RD.AbstractNodeFactory {
	constructor() {
		super('ConditionEntity');
	}

	getNewInstance() {
		return new ConditionEntityStepModel();
	}

	generateReactWidget(diagramEngine, node) {
		return <ConditionEntityStepWidget node={node} nodeIcon='version-control' options={ConditionEntityStepOption}/>;
	}
}
