import CommonStepOption from '../../../Common/CommonStepOption';
import { withApollo } from 'react-apollo';
import { withTranslation } from 'react-i18next';

class TextStepOption extends CommonStepOption {
  constructor(props) {
    super(props);
    this.stepType = 'Text';
    this.state = {
      otherSubmenuHovered: false
    }
    const { t } = this.props;
    this.options = [
      {text: t('options.addNewStep'), icon: "add-button-inside-black-circle", clickHandler: this.onAddStepClick, checkLinkToNextStep: true},
      {text: t('options.delete'), icon: "trush", clickHandler: this.onDeleteStepClick},
      {text: t('options.others'),
        icon: "settings-cogwheel-button",
        subMenus: [
          {text: t('options.duplicate'), disabled: true},
          {text: t('options.move'), disabled: true},
          {text: t('options.setIntentKeyword'), disabled: true},
          {text: t('options.setAsEndPoint'), checkLinkToEndStep: true,  clickHandler: this.onSetAsEndPointClick},
          {text: t('options.setJumpDestination'), disabled: true}
        ]
      }
    ]
    this.setSubMenuHandler();
  }
}

export default withApollo(withTranslation()(TextStepOption));
