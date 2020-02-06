import * as React from 'react';
import { ConditionMessageStepModel } from './ConditionMessageStepModel';
import ConditionMessageStepWidget from './ConditionMessageStepWidget';
import ConditionMessageStepOption from './ConditionMessageStepOption';
import * as RD from '@projectstorm/react-diagrams';

export class ConditionMessageStepFactory extends RD.AbstractNodeFactory {
	constructor() {
		super('ConditionMessage');
	}

	getNewInstance() {
		return new ConditionMessageStepModel();
	}

	generateReactWidget(diagramEngine, node) {
		return <ConditionMessageStepWidget node={node} nodeIcon='version-control' options={ConditionMessageStepOption}/>;
	}
}
