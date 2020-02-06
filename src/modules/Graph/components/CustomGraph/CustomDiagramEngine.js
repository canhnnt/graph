import { DiagramEngine } from "@projectstorm/react-diagrams";

export class CustomDiagramEngine extends DiagramEngine {

  /**
	 * Calculate rectangular coordinates of the port passed in.
	 */
	getPortCoords(port) {
    try {
      const sourceElement = this.getNodePortElement(port);
      const sourceRect = sourceElement.getBoundingClientRect();
      const canvasRect = this.canvas.getBoundingClientRect();

      return {
        x:
          (sourceRect.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0) -
          canvasRect.left,
        y:
          (sourceRect.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0) -
          canvasRect.top,
        width: sourceRect.width,
        height: sourceRect.height
      };
    } catch (error) {
      return null;
    }
  }

  getPortCenter(port) {
    try {
      var sourceElement = this.getNodePortElement(port);
      var sourceRect = sourceElement.getBoundingClientRect();

      var rel = this.getRelativePoint(sourceRect.left, sourceRect.top);

      return {
        x:
          sourceElement.offsetWidth / 2 +
          (rel.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0),
        y:
          sourceElement.offsetHeight / 2 +
          (rel.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0)
      };
    } catch (error) {
      return null;
    }
  }
}
