import React from 'react';
import PropTypes from 'prop-types';
import { PortWidget } from '@projectstorm/react-diagrams';
import { IconFont } from 'design_system_v2';
import CommonPortWidget from './CommonPortWidget';
import { styles } from './styles';
import { IconUser } from '../../../Common/IconUser';
import { getErrorLinks, updateDataToLocalState } from 'utils/helpers';

class CommonStepWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      subMenuHovered: false,
      showTooltipInfo: false,
    };
  }

  static propTypes = {
    iconPos: PropTypes.string,
    icon: PropTypes.func,
  };

  static defaultProps = {
    iconPos: 'top',
    icon: IconUser,
  };

  setHover = (hovered) => {
    this.setState({ hovered: hovered });
  }

  setSubMenuHover = (hovered) => {
    this.setState({ subMenuHovered: hovered });
  }

  setTooltipInfo = state => this.setState({ showTooltipInfo: state });

  onEditStepClick = (node) => {
    updateDataToLocalState({
      DragablePartScreen: true,
      Show: {
        id: 'ShowPanel',
        __typename: 'ShowPanel',
        StepSettingType: node.type,
        SimulatorPanel: false,
        StepSettingPanel: true,
      },
      stepEditing: [node.serialize()]
    }, this.props.client);
  }

  render() {
    const { node, t, iconPos } = this.props;
    const { ports: { portOut, portIn }, selected, state } = node;
    const errors = getErrorLinks(t, portIn, portOut);
    let portOutlinked = false;
    const _this = this;

    if (portOut) {
      portOutlinked = Object.keys(portOut.links).length > 0;
    }

    return (
      <div
        className={styles.textNode(state.isHighlighted, selected, state.isEdited)}
        onMouseEnter={() => this.setHover(true)}
        onMouseLeave={() => this.setHover(false)}
      >
        {portOut &&
          <div className={styles.portWrapper}>
            <PortWidget
              name="portOut"
              node={node}
              className={styles.textNodePortOut(false, portOutlinked)}
            />
          </div>}
        {errors && errors.length ? (<div className={styles.infoIcon} onMouseEnter={() => _this.setTooltipInfo(true)} onMouseLeave={() => _this.setTooltipInfo(false)}>
          <IconFont name='round-info-button' />
          {errors.length > 0 && _this.state.showTooltipInfo && <div className={styles.tooltipInfo(errors.length)}>{errors.join('\n')}</div>}
        </div>) : null}

        <div className={styles.infoID}>{state.sequentialId && <span>{state.sequentialId}</span>}</div>
        <div className={styles.textNodeColor({ ...state, selected, isError: errors.length > 0 })}>
          <div className={styles.nodeTags} />
          <div className={styles.nodeTypeWraper}>
            <div className={styles.nodeType({ ...state, selected, iconPos, isError: errors.length > 0 })}>
              <div className={styles.nodeIcon}>
                <IconFont name={this.props.nodeIcon} />
              </div>
            </div>
            <div className={styles.nodeLabel(state.isEdited, node.state.sequentialId)} onClick={() => this.onEditStepClick(node)}>{this.props.nodeLabel}</div>
          </div>
          {portIn && <CommonPortWidget name="portIn" node={node} className={styles.textNodePortIn} />}
        </div>
        <this.props.icon
          node={node}
          waitForUserInput={state.waitForUserInput}
          saveMessageToEntities={state.saveMessageToEntities}
          isNodeEdited={state.isEdited}
          isOpenUserReply={state.isOpenUserReply}
        />
        {!(state.isEdited || state.isOpenUserReply) && <this.props.options
          node={node}
          setHover={this.setHover}
          hovered={this.state.hovered}
          className={styles.dropDownOptions}
          style={{
            top: state.waitForUserInput ? 126 : 114,
            left: -10,
            zIndex: 2
          }}
          portOutName="portOut"
        />}
      </div>
    );
  }
}

export default CommonStepWidget;
