import CommonStepOption from '../../../Common/CommonStepOption';
import { withApollo } from 'react-apollo';
import { withTranslation } from 'react-i18next';

class ConditionMessageStepOption extends CommonStepOption {
  constructor(props) {
    super(props);
    this.stepType = 'ConditionMessage';

    this.state = {
      otherSubmenuHovered: false
    }
    const { t } = this.props;
    this.options = [
      {text: t('options.edit'), icon: "edit", clickHandler: this.onEditStepClick},
      {text: t('options.delete'), icon: "trush", clickHandler: this.onDeleteStepClick},
      {text: t('options.others'),
        icon: "settings-cogwheel-button",
        subMenus: [
          {text: t('options.duplicate')},
          {text: t('options.move')},
          {text: t('options.setIntentKeyword')}
        ]
      }
    ]
    this.setSubMenuHandler();
  }
}

export default withApollo(withTranslation()(ConditionMessageStepOption));
