import CustomLinkWidget from "./CustomLinkWidget";
import CustomLinkSegment from "./CustomLinkSegment";
import { CustomLinkModel } from "./CustomLinkModel";
import React from "react";
import { AbstractLinkFactory } from '@projectstorm/react-diagrams';

export class CustomLinkFactory extends AbstractLinkFactory {
	constructor() {
		super();
		this.type = "custom-link-model";
	}

	getNewInstance(initialConfig) {
		return new CustomLinkModel();
	}

	generateReactWidget(diagramEngine, link) {
		return React.createElement(CustomLinkWidget, {
			link: link,
			diagramEngine: diagramEngine
		});
	}

	generateLinkSegment(model, widget, selected, path) {
		return (
			<g>
				<CustomLinkSegment
					model={model}
					path={path}
					inversed={widget.pathFinding.isInversed}
					hasTargetPort={!!model.targetPort}
				/>
			</g>
		);
	}
}
