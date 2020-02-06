import React from 'react';
import ChildConditionOption from './ChildConditionOption';
import { PortWidget } from '@projectstorm/react-diagrams';
import { IconFont } from 'design_system_v2';
import { isEmpty } from "lodash";
import { formatEntityText } from 'utils/string';
import { styles } from './styles';
import { withTranslation } from 'react-i18next';
import { Query } from 'react-apollo';
import { GET_ENTITIES } from 'services/RightPanel/queries';
import { GET_SERVICES } from 'utils/queries';
import { truncateLabelName } from 'utils/helpers';

class ChildConditionWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      subMenuHovered: false,
      showTooltipInfo: false
    };
    this.renderLabel = this.renderLabel.bind(this);
  }

  static defaultProps = {
    stylesOptions: {top: "calc(114% + 17px)"}
  };

  setHover = (hovered) => {
    this.setState({hovered});
  }

  setSubMenuHover = (subMenuHovered) => {
    this.setState({subMenuHovered});
  }

  setTooltipInfo = (showTooltipInfo) => {
    this.setState({
      showTooltipInfo,
      hovered: !showTooltipInfo
    });
  }

  isLinked() {
    return this.props.port && Object.keys(Object(this.props.port).links).length > 0
  }

  renderLabel(){
    const { label } = this.props;
    return <Query query={GET_SERVICES}>
      {({ loading, error, data }) => {
        const {editorService: { id }} = data;
        return <Query query={GET_ENTITIES} variables={{editorServiceId: id}}>{
          ({ loading, error, data }) => {
            const { entities } = data;
            return formatEntityText(truncateLabelName(label), entities || [], true)
          }
        }</Query>
      }}
    </Query>
  }

  render() {
    const { t, index, item, portOutName, node, stylesOptions, childsNumber, isEdited, isOpenUserReply, deleted } = this.props;
    const isError = isEmpty(node.ports['childPortOut' + item.id] ? node.ports['childPortOut' + item.id].links : []);

    return (
      <div className={styles.childLabel(index, this.state.hovered, childsNumber, node.state.waitForUserInput, deleted)}
        onMouseLeave={(e) => this.setHover(false)}
        onMouseEnter={(e) => this.setHover(true)}
      >
        <div
          className={styles.errorInfo}
          onMouseEnter={(e) => this.setTooltipInfo(true)}
          onMouseLeave={(e) => this.setTooltipInfo(false)}
        >
          {isError && <IconFont name='round-info-button'/>}
          {this.state.showTooltipInfo && <span className={styles.childTooltipInfo}>{t('notifications.setNextStep')}</span>}
        </div>
        <div className='label'>{this.renderLabel()}</div>
        <div className={styles.portWrapper}>
          <PortWidget
            name={portOutName}
            node={node}
            className={styles.portOut(false, deleted)}
          />
        </div>
        {!(isEdited || isOpenUserReply) && <ChildConditionOption
          node={node}
          style={stylesOptions}
          setHover={this.setHover}
          hovered={this.state.hovered}
          portOutName={portOutName}
        />}
      </div>
    );
  }
}

export default withTranslation()(ChildConditionWidget);
