import React from 'react';
import { NodeModel } from '@projectstorm/react-diagrams';
import { NavigationPortModel } from '../NavigationPortModel';
// import { Trans } from 'react-i18next';

/**
 * Example of a custom model using pure javascript
 */
const stepName = <p>Start</p>

export class StartStepModel extends NodeModel {
	constructor(options = {}) {
    super('Start');
    options['name'] = stepName;
		this.state = options;

    // setup an in and out port
    const port = new NavigationPortModel({
      in: false,
      name: 'portOut',
      type: 'start'
    });
		this.addPort(port);
	}

	serialize() {
		return {
      ...super.serialize(),
      ...this.state
		};
	}
}