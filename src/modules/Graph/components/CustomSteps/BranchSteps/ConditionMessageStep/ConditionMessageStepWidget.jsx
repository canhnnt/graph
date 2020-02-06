import React from 'react';
import { IconFont } from 'design_system_v2';
import { IconUser } from '../../../Common/IconUser';
import CommonNodeWidget from "../Common/CommonStepWidget";
import { withTranslation } from 'react-i18next';
import { getErrorLinks, truncateStepName } from 'utils/helpers';
import { styles } from '../Common/styles';
import { withApollo } from 'react-apollo';

export class ConditionMessageStepWidget extends CommonNodeWidget {

  static defaultProps = {
    iconPos: 'top',
    icon: IconUser
  };

  renderStep() {
    const _this = this;
    const { node:{ ports: { portIn }, state, selected}, t, iconPos } = this.props;
    const errors = getErrorLinks(t, portIn);

    return <div className={styles.textNodeColor({ ...state, selected, isError: errors.length > 0})}>
      {iconPos === 'bottom' && <div className={styles.nodeTags(iconPos)} />}
      {_this.renderErrors()}
      <div className={styles.nodeType({ ...state, selected, iconPos, isError: errors.length > 0})}>
        <span>{state.sequentialId}</span>
        <div className={styles.nodeIcon}>
          <IconFont name={this.props.nodeIcon}/>
        </div>
      </div>
      {state.isEdited ?
        <div className={styles.nodeLabel(iconPos)} dangerouslySetInnerHTML={{__html: this.props.t('stepName.conditionMessage')}} /> :
        <div className={styles.nodeLabel(iconPos)} onClick={() => this.onEditStepClick(this.props.node)}>{truncateStepName(state.conditionName)}</div>
      }
      {iconPos !== 'bottom' && <div className={styles.nodeTags(iconPos)} />}
    </div>
  }
}
export default withApollo(withTranslation()(ConditionMessageStepWidget));
