import * as React from 'react';
import {
	DiagramWidget,
	MoveItemsAction,
	PortModel,
	PointModel,
	SelectingAction,
	MoveCanvasAction,
	LinkLayerWidget,
	NodeLayerWidget
} from "@projectstorm/react-diagrams";
import { some, values } from "lodash";
import { EndStepModel } from "../CustomSteps/NavigationSteps/EndStep/EndStepModel";
import { CommonStepModel as BranchStepsModel } from "../CustomSteps/BranchSteps/Common/CommonStepModel";
import { CommonStepModel as BotStepsModel } from "../CustomSteps/BotSteps/Common/CommonStepModel";
import { CustomLinkModel } from "./CustomLinkModel";

export class CustomDiagramWidget extends DiagramWidget {

	onMouseUp(event) {
		var diagramEngine = this.props.diagramEngine;

		if (this.state.action instanceof MoveItemsAction) {
			var element = this.getMouseElement(event);
			if (element && element.element) element.element.style.removeProperty('cursor');

			this.state.action.selectionModels.forEach(model => {
				if (!(model.model instanceof PointModel)) {
					return;
				}
				if (element && element.model instanceof PointModel) {
					let link = model.model.getLink();
					link.remove();
					return;
				}
				if (element && element.model instanceof PortModel && !diagramEngine.isModelLocked(element.model)) {
					let link = model.model.getLink();
					const sourcePort = link.getSourcePort();
					const targetPort = link.getTargetPort();

					if (targetPort !== null) {
						if (targetPort !== element.model && sourcePort !== element.model) {
							let newLink = link.clone({});
							newLink.setSourcePort(element.model);
							newLink.setTargetPort(targetPort);
							link.setTargetPort(element.model);
							targetPort.removeLink(link);
							newLink.removePointsBefore(newLink.getPoints()[link.getPointIndex(model.model)]);
							link.removePointsAfter(model.model);
							diagramEngine.getDiagramModel().addLink(newLink);
						} else if (targetPort === element.model) {
							link.removePointsAfter(model.model);
						} else if (sourcePort === element.model) {
							link.removePointsBefore(model.model);
						}
					} else {
						if (element.model && Object.keys(element.model.links).length === 0) {
							link.setTargetPort(element.model);
						} else {
							link.remove();
						}
					}

					if (sourcePort && Object.keys(sourcePort.links).length > 1) {
						sourcePort.links[Object.keys(sourcePort.links)[0]].remove();
					}
					delete this.props.diagramEngine.linksThatHaveInitiallyRendered[link.getID()];
				}

				if (element && (
					element.model instanceof EndStepModel
					|| element.model instanceof BranchStepsModel
					|| element.model instanceof BotStepsModel)
				) {
					let link = model.model.getLink();
					if (link.getTargetPort() == null) {
						link.setTargetPort(element.model.ports.portIn);
					}
				}
			});

			if (!this.props.allowLooseLinks && this.state.wasMoved) {
				this.state.action.selectionModels.forEach(model => {
					if (!(model.model instanceof PointModel)) {
						return;
					}

					let selectedPoint = model.model;
					let link = selectedPoint.getLink();
					if (link.getSourcePort() === null || link.getTargetPort() === null) {
						link.remove();
					}
				});
			}

			this.state.action.selectionModels.forEach(model => {
				if (!(model.model instanceof PointModel)) {
					return;
				}

				let link = model.model.getLink();
				let sourcePort = link.getSourcePort();
				let targetPort = link.getTargetPort();
				if (sourcePort !== null && targetPort !== null) {
					if (!sourcePort.canLinkToPort(targetPort)) {
						//link not allowed
						link.remove();
					} else if (
						some(values(targetPort.getLinks()), (l) =>
							l !== link && (l.getSourcePort() === sourcePort || l.getTargetPort() === sourcePort)
						)
					) {
						link.remove();
					}
				}
			});

			diagramEngine.clearRepaintEntities();
			this.stopFiringAction(!this.state.wasMoved);
		} else {
			diagramEngine.clearRepaintEntities();
			diagramEngine.canvas.style.removeProperty('cursor');
			this.stopFiringAction();
		}
		this.state.document.removeEventListener("mousemove", this.onMouseMove);
		this.state.document.removeEventListener("mouseup", this.onMouseUp);
	}

	componentWillUpdate(nextProps) {
		const { forceUpdate } = this.props;
		// TODO: waiting for better options
		if (nextProps.forceUpdate && forceUpdate !== nextProps.forceUpdate) {
			this.onMouseMove();
		}
	}

	render() {
		var diagramEngine = this.props.diagramEngine;
		diagramEngine.setMaxNumberPointsPerLink(this.props.maxNumberPointsPerLink);
		diagramEngine.setSmartRoutingStatus(this.props.smartRouting);
		var diagramModel = diagramEngine.getDiagramModel();

		return (
			<div
				{...this.getProps()}
				ref={ref => {
					if (ref) {
						this.props.diagramEngine.setCanvas(ref);
					}
				}}
				onWheel={event => {
					if (this.props.allowCanvasZoom) {
						// event.preventDefault();
						event.stopPropagation();
						const oldZoomFactor = diagramModel.getZoomLevel() / 100;
						let scrollDelta = this.props.inverseZoom ? -event.deltaY : event.deltaY;
						//check if it is pinch gesture
						if (event.ctrlKey && scrollDelta % 1 !== 0) {
							/*Chrome and Firefox sends wheel event with deltaY that
                have fractional part, also `ctrlKey` prop of the event is true
                though ctrl isn't pressed
              */
							scrollDelta /= 3;
						} else {
							scrollDelta /= 60;
						}
						if (diagramModel.getZoomLevel() + scrollDelta > 10) {
							diagramModel.setZoomLevel(diagramModel.getZoomLevel() + scrollDelta);
						}

						const zoomFactor = diagramModel.getZoomLevel() / 100;

						const boundingRect = event.currentTarget.getBoundingClientRect();
						const clientWidth = boundingRect.width;
						const clientHeight = boundingRect.height;
						// compute difference between rect before and after scroll
						const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
						const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;
						// compute mouse coords relative to canvas
						const clientX = event.clientX - boundingRect.left;
						const clientY = event.clientY - boundingRect.top;

						// compute width and height increment factor
						const xFactor = (clientX - diagramModel.getOffsetX()) / oldZoomFactor / clientWidth;
						const yFactor = (clientY - diagramModel.getOffsetY()) / oldZoomFactor / clientHeight;

						diagramModel.setOffset(
							diagramModel.getOffsetX() - widthDiff * xFactor,
							diagramModel.getOffsetY() - heightDiff * yFactor
						);

						diagramEngine.enableRepaintEntities([]);
						this.forceUpdate();
					}
				}}
				onMouseDown={event => {
					this.setState({ ...this.state, wasMoved: false });

					diagramEngine.clearRepaintEntities();
					var model = this.getMouseElement(event);
					//the canvas was selected
					if (model === null) {
						//is it a multiple selection
						if (event.shiftKey) {
							var relative = diagramEngine.getRelativePoint(event.clientX, event.clientY);
							this.startFiringAction(new SelectingAction(relative.x, relative.y));
						} else {
							//its a drag the canvas event
							diagramEngine.canvas.style.setProperty('cursor', 'grabbing');
							this.startFiringAction(new MoveCanvasAction(event.clientX, event.clientY, diagramModel));
						}
					} else if (model.model instanceof PortModel) {
						//its a port element, we want to drag a link
						if (!this.props.diagramEngine.isModelLocked(model.model)) {
							// eslint-disable-next-line no-redeclare
							var relative = diagramEngine.getRelativeMousePoint(event);
							var sourcePort = model.model;

							if ((model.model instanceof PortModel && model.model.label === "portIn")
								|| Object.keys(sourcePort.links).length > 0
							) {
								return;
							}

							var link = sourcePort.createLinkModel();
							link.setSourcePort(sourcePort);

							if (link) {
								link.removeMiddlePoints();
								if (link.getSourcePort() !== sourcePort) {
									link.setSourcePort(sourcePort);
								}
								link.setTargetPort(null);

								link.getFirstPoint().updateLocation(relative);
								link.getLastPoint().updateLocation(relative);

								diagramModel.clearSelection();
								link.getLastPoint().setSelected(true);
								diagramModel.addLink(link);

								this.startFiringAction(
									new MoveItemsAction(event.clientX, event.clientY, diagramEngine)
								);
							}
						} else {
							diagramModel.clearSelection();
						}
					} else if (model.model instanceof CustomLinkModel) {
						let relative = diagramEngine.getRelativeMousePoint(event);
						let targetLink = model.model;
						if (targetLink) {
							targetLink.setTargetPort(null);
							targetLink.getLastPoint().updateLocation(relative);

							diagramModel.clearSelection();
							targetLink.getLastPoint().setSelected(true);
							this.startFiringAction(
								new MoveItemsAction(event.clientX, event.clientY, diagramEngine)
							);
						}

					} else {
						//its some or other element, probably want to move it
						if (!event.shiftKey && !model.model.isSelected()) {
							diagramModel.clearSelection();
						}
						model.model.setSelected(true);
						if (model && model.element) model.element.style.setProperty('cursor', 'grabbing');

						this.startFiringAction(new MoveItemsAction(event.clientX, event.clientY, diagramEngine));
					}
					this.state.document.addEventListener("mousemove", this.onMouseMove);
					this.state.document.addEventListener("mouseup", this.onMouseUp);
				}}
			>
				{this.state.renderedNodes && (
					<LinkLayerWidget
						diagramEngine={diagramEngine}
						pointAdded={(point, event) => {
							this.state.document.addEventListener("mousemove", this.onMouseMove);
							this.state.document.addEventListener("mouseup", this.onMouseUp);
							event.stopPropagation();
							diagramModel.clearSelection(point);
							this.setState({
								action: new MoveItemsAction(event.clientX, event.clientY, diagramEngine)
							});
						}}
					/>
				)}
				<NodeLayerWidget diagramEngine={diagramEngine} />
				{this.state.action instanceof SelectingAction && this.drawSelectionBox()}
			</div>
		);
	}
}
