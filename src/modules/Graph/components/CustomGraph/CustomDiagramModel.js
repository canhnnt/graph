import { DiagramModel, Toolkit } from "@projectstorm/react-diagrams";
import { isEqual } from "lodash";

export class CustomDiagramModel extends DiagramModel {

  addListener(listener) {
    for (let i in this.listeners) {
      if (isEqual(Object.keys(this.listeners[i]), Object.keys(listener))) {
        return;
      }
    }
		const uid = Toolkit.UID();
		this.listeners[uid] = listener;
		return uid;
	}
}