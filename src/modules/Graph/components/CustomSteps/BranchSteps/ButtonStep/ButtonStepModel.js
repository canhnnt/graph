import { CommonStepModel } from "../Common/CommonStepModel";
import { CommonPortModel } from '../../../Common/CommonPortModel';


/**
 * Example of a custom model using pure javascript
 */
export class ButtonStepModel extends CommonStepModel {
	constructor(options) {
		super('Button', options);

		// setup an in and out port
		this.addPort(new CommonPortModel(true, 'portIn'));
		const portOut = new CommonPortModel(false, 'portOut');
		portOut.setLocked(true);
		this.addPort(portOut);

		options.childs && options.childs.map((item, index) =>
			this.addPort(
				new CommonPortModel(
					false,
					'childPortOut' + item.id
				)
			)
		);
	}
}
