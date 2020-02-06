import * as React from 'react';
import { TextStepModel } from './TextStepModel';
import TextStepWidget from './TextStepWidget';
import TextStepOption from "./TextStepOption";
import * as RD from '@projectstorm/react-diagrams';
// import { Trans } from 'react-i18next';

export class TextStepFactory extends RD.AbstractNodeFactory {
	constructor() {
		super('Text');
	}

	getNewInstance() {
		return new TextStepModel();
	}

	generateReactWidget(diagramEngine, node) {
		return <TextStepWidget
						node={node}
						nodeIcon='underline-text-button'
						nodeLabel={<span>nodeLabel</span>}
						options={TextStepOption}
					/>;
	}
}
