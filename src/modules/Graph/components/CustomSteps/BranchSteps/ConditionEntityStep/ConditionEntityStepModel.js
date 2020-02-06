import { CommonStepModel } from "../Common/CommonStepModel";
import { CommonPortModel } from '../../../Common/CommonPortModel';

/**
 * Example of a custom model using pure javascript
 */
export class ConditionEntityStepModel extends CommonStepModel {
	constructor(options) {
		super('ConditionEntity', options);

		// setup an in and out port
		this.addPort(new CommonPortModel(true, 'portIn'));

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
