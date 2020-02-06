import { DefaultLinkWidget } from "@projectstorm/react-diagrams";
import React from 'react';
import PathFinding from "./PathFinding";

class CustomLinkWidget extends DefaultLinkWidget {

	constructor(props) {
		super(props);
		this.refLabels = {};
		this.refPaths = [];
		this.state = {
      selected: false,
		};

		if (props.diagramEngine.isSmartRoutingEnabled()) {
			this.pathFinding = new PathFinding(this.props.diagramEngine);
		}
	}

	generateLink(path, extraProps, id) {
		const { diagramEngine, link } = this.props;
		const { selected } = this.state;

		const Link = React.cloneElement(
			diagramEngine
				.getFactoryForLink(link)
				.generateLinkSegment(
					link,
					this,
					selected || link.isSelected(),
					path,
				),
			{
				...extraProps,
				strokeLinecap: "round",
				onMouseLeave: () => {
					this.setState({ selected: false });
				},
				onMouseEnter: () => {
					this.setState({ selected: true });
				},
				"data-linkid": link.getID(),
				onContextMenu: event => {
					if (!this.props.diagramEngine.isModelLocked(link)) {
						event.preventDefault();
						link.remove();
					}
				}
			}
		);

		const LinkClone = (
			<path
				strokeWidth={1}
				stroke="rgba(256,0,0,1)"
				d={path}
				ref={ref => ref && this.refPaths.push(ref)}
			/>
		);

		return (
			<g key={"link-" + id} style={{opacity: link.deleted ? .32 : 1}}>
				{LinkClone}
				{Link}
			</g>
		);
	}
}

export default CustomLinkWidget;
