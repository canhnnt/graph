import CommonStepOption from '../../../Common/CommonStepOption';
import { withApollo } from 'react-apollo';
import { withTranslation } from 'react-i18next';

class StartStepOption extends CommonStepOption {
  constructor(props) {
    super(props);
    this.state = {
      otherSubmenuHovered: false
    }
    const { t } = this.props;
    this.options = [
      {text: t('options.addNewStep'), icon: "add-button-inside-black-circle", clickHandler: this.onAddStepClick, checkLinkToNextStep: true},
    ]

    if(props.node.state.allowsDelete){
      this.options = [...this.options, {text: t('options.delete'), icon: "trush", clickHandler: this.onDeleteStepClick}];
    }
  }
}

export default withApollo(withTranslation()(StartStepOption));
