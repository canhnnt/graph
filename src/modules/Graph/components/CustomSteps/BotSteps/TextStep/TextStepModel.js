import { CommonStepModel } from "../Common/CommonStepModel"
import { CommonPortModel } from '../../../Common/CommonPortModel';

/**
 * Example of a custom model using pure javascript
 */
export class TextStepModel extends CommonStepModel {
	constructor(options) {
		super('Text', options);
		this.addPort(
			new CommonPortModel(
				true,
				'portIn'
			)
    );

		this.addPort(
			new CommonPortModel(
				false,
				'portOut'
      )
    );
	}
}
