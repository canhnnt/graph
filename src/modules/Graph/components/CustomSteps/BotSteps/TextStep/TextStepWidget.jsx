import CommonStepWidget from "../Common/CommonStepWidget";
import { IconUser } from '../../../Common/IconUser';
import { withTranslation } from 'react-i18next';
import { withApollo } from 'react-apollo';

class TextStepWidget extends CommonStepWidget{
  static defaultProps = {
    iconPos: 'top',
    icon: IconUser
  };
}

export default withApollo(withTranslation()(TextStepWidget));
