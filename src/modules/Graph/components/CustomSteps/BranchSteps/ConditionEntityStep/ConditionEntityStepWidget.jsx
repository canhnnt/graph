import React from 'react';
import { IconFont } from 'design_system_v2';
import { IconUser } from '../../../Common/IconUser';
import CommonNodeWidget from "../Common/CommonStepWidget";
import { withTranslation } from 'react-i18next';
import { getErrorLinks, truncateStepName } from 'utils/helpers';
import { styles } from '../Common/styles';
import { withApollo } from 'react-apollo';

class ConditionEntityStepWidget extends CommonNodeWidget {

  static defaultProps = {
    iconPos: 'top',
    icon: IconUser,
    stylesOptions: {top: 115, left: -10, zIndex: 10}
  };

  renderStep() {
    const { node:{ ports: { portIn }, state, selected, type}, t, iconPos } = this.props;
    const errors = getErrorLinks(t, portIn);

    return <div className={styles.textNodeColor({ ...state, selected, isError: errors.length > 0})}>
      <div className={styles.nodeTags} />
      <div className={styles.nodeTypeWraper}>
        <div className={styles.nodeType({ ...state, selected, iconPos, isError: errors.length > 0 })}>
          <div className={styles.nodeIcon}>
            <IconFont name={this.props.nodeIcon} />
          </div>
        </div>
        {state.conditionName ?
          <div className={styles.nodeLabel(state.isEdited)} onClick={() => this.onEditStepClick(this.props.node)}>{truncateStepName(state.conditionName)}</div> :
          <div className={styles.stepNameWraper} dangerouslySetInnerHTML={{__html: this.props.t('stepName.conditionEntity')}} />
        }
      </div>
      <div className={styles.hoverPoint(state.waitForUserInput, type)} />
    </div>
  }
}
export default withApollo(withTranslation()(ConditionEntityStepWidget));
