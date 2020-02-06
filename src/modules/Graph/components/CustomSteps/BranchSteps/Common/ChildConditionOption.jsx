import CommonStepOption from "../../../Common/CommonStepOption";
import { withApollo } from 'react-apollo';
import { withTranslation } from "react-i18next";

class ChildConditionOption extends CommonStepOption {
  constructor(props) {
    super(props);
    this.state = {
      otherSubmenuHovered: false
    }
    const { t } = this.props;
    this.options = [
      {text: t('options.addNewStep'), icon: "add-button-inside-black-circle", clickHandler: this.onAddStepClick, checkLinkToNextStep: true},
      {text: t('options.setJumpDestination'), icon: "back-arrow", disabled: true}
    ]
    this.setSubMenuHandler();
  }
}

export default withApollo(withTranslation()(ChildConditionOption));
