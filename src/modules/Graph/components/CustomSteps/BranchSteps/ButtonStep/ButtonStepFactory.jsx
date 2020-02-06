import * as React from 'react';
import { ButtonStepModel } from './ButtonStepModel';
import ButtonStepWidget from './ButtonStepWidget';
import ButtonStepOption from './ButtonStepOption';
import * as RD from '@projectstorm/react-diagrams';
// import { Trans } from 'react-i18next';

export class ButtonStepFactory extends RD.AbstractNodeFactory {
	constructor() {
		super('Button');
	}

	getNewInstance() {
		return new ButtonStepModel();
	}

	generateReactWidget(diagramEngine, node) {
		return (
			<ButtonStepWidget
				node={node}
				nodeIcon='button-on'
				nodeLabel={<span>nodeLabel</span>}
				options={ButtonStepOption}
			/>
		);
	}
}
