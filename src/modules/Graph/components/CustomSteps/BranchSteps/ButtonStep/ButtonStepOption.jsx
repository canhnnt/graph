import CommonStepOption from '../../../Common/CommonStepOption';
import { withApollo } from 'react-apollo';
import { withTranslation } from 'react-i18next';

class ButtonStepOption extends CommonStepOption {
  constructor(props) {
    super(props);
    this.stepType = 'Button';

    this.state = {
      otherSubmenuHovered: false
    }
    const { t } = this.props;
    this.options = [
      {text: t('options.delete'), icon: "trush", clickHandler: this.onDeleteStepClick},
      {text: t('options.others'),
        icon: "settings-cogwheel-button",
        subMenus: [
          {text: t('options.duplicate'), disabled: true},
          {text: t('options.move'), disabled: true},
          {text: t('options.setIntentKeyword'), disabled: true}
        ]
      }
    ]
    this.setSubMenuHandler();
  }
}

export default withApollo(withTranslation()(ButtonStepOption));
