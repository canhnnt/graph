import CommonNodeWidget from "../Common/CommonStepWidget";
import { IconUser } from '../../../Common/IconUser';
import { withTranslation } from 'react-i18next';
import { withApollo } from 'react-apollo';

class ButtonStepWidget extends CommonNodeWidget{

  static defaultProps = {
    iconPos: 'bottom',
    icon: IconUser
  };


}

export default withApollo(withTranslation()(ButtonStepWidget));
