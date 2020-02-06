import { CommonStepModel } from "../Common/CommonStepModel";
import { CommonPortModel } from '../../../Common/CommonPortModel';

/**
 * Example of a custom model using pure javascript
 */
export class ConditionMessageStepModel extends CommonStepModel {
	constructor(options) {
		super('ConditionMessage', options);

		// setup an in and out port
		this.addPort(new CommonPortModel(true, 'portIn'));
		options.childs && options.childs.forEach((_, index) =>
			this.addPort(new CommonPortModel(false,`childPortOut${index}`))
		)
	}
}
