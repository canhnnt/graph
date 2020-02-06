import CommonStepOption from '../../../Common/CommonStepOption';
import { withApollo } from 'react-apollo';
import { withTranslation } from 'react-i18next';

class EndStepOption extends CommonStepOption {
  constructor(props) {
    super(props);
    this.state = {
      otherSubmenuHovered: false
    }
    const { t } = this.props;
    this.options = [
      {text: t('options.delete'), icon: "trush", clickHandler: this.onDeleteStepClick},
    ]
  }
}

export default withApollo(withTranslation()(EndStepOption));
