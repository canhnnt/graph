import React from 'react';
import PropTypes from 'prop-types';
import { PortWidget } from '@projectstorm/react-diagrams';
import { IconFont } from 'design_system_v2';
import ChildConditionWidget from './ChildConditionWidget';
import { CommonPortWidget } from './CommonPortWidget';
import { IconUser } from '../../../Common/IconUser';
import { getErrorLinks, updateDataToLocalState } from 'utils/helpers';
import { styles } from './styles';
import sortBy from 'lodash/sortBy';

class CommonStepWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      subMenuHovered: false,
      childsHovered: {}
    };

    this.renderBranchs = this.renderBranchs.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
    this.renderStep = this.renderStep.bind(this);
  }

  static propTypes = {
    iconPos: PropTypes.string,
    icon: PropTypes.func
  };

  static defaultProps = {
    iconPos: 'top',
    icon: IconUser
  };

  setChildHover(index, hovered) {
    let childsHovered = this.state.childsHovered
    childsHovered[index] = { ...childsHovered[index], hovered: hovered }
    this.setState({ childsHovered: childsHovered });
  }

  setHover = (hovered) => {
    this.setState({ hovered: hovered });
  }

  setSubMenuHover = (hovered) => {
    this.setState({ subMenuHovered: hovered });
  }

  isLinked(name) {
    let port = this.props.node.ports[name]
    return port && Object.keys(Object(port).links).length > 0
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

  renderErrors() {
    const _this = this;
    const { node: { ports: { portIn } }, t } = this.props;
    const errors = getErrorLinks(t, portIn);
    if(errors && errors.length > 0){
      return <div className={styles.infoIcon} onMouseEnter={() => _this.setTooltipInfo(true)} onMouseLeave={() => _this.setTooltipInfo(false)}>
        <IconFont name='round-info-button'/>
        {_this.state.showTooltipInfo && <div className={styles.tooltipInfo(errors.length)}>{errors.join('\n')}</div>}
      </div>
    }
    return null;
  }

  renderBranchs() {
    const { node: { state, type }, node } = this.props;
    let childs = JSON.parse(JSON.stringify(state.childs));
    childs = sortBy(childs, 'order');
    const stepId = state ? state.stepId : undefined;
    if(!stepId){
      childs = childs.filter(child => !child.deleted);
    }
    if (state.childs.length > 0) {
      return (
        <>
          <div className={styles.branchContainer(childs.length, state.waitForUserInput, type)}>
            {childs.slice(0, -1).map((item, index) => {
              return <div className={styles.splitLine} key={index}></div>
            })}
          </div>
          <div className={styles.branchContainer1(type, childs.length)}>
            {childs.map((item, index) => {
              return (
                <ChildConditionWidget
                  index={index} node={node} key={index} item={item}
                  label={item.label} portOutName={"childPortOut" + item.id}
                  port={this.props.node.ports["childPortOut" + item.id]}
                  isEdited={state.isEdited}
                  isOpenUserReply={state.isOpenUserReply}
                  childsNumber={childs.length}
                  deleted={item.deleted}
                />
              );
            })}
          </div>
        </>
      )
    }
  }

  renderStep() {
    const { node: { ports: { portIn }, state, selected, type }, t, iconPos } = this.props;
    const errors = getErrorLinks(t, portIn);

    return <div className={styles.textNodeColor({ ...state, selected, isError: errors.length > 0 })}>
      <div className={styles.nodeTags} />
      <div className={styles.nodeTypeWraper}>
        <div className={styles.nodeType({ ...state, selected, iconPos, isError: errors.length > 0 })}>
          <div className={styles.nodeIcon}>
            <IconFont name={this.props.nodeIcon} />
          </div>
        </div>
        <div className={styles.nodeLabel(state.isEdited, this.props.node.state.sequentialId)} onClick={() => this.onEditStepClick(this.props.node)} >{this.props.nodeLabel}</div>
      </div>
      <div className={styles.hoverPoint(state.waitForUserInput, type)} />
    </div>
  }

  render() {
    const _this = this;
    const { ports: { portIn, portOut }, selected, state } = this.props.node;
    const { node } = this.props;
    let portOutlinked = false;

    if (portOut) {
      portOutlinked = Object.keys(portOut.links).length > 0;
    }

    return (
      <>
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
          {_this.renderErrors()}
          <div className={styles.infoID}>{state.sequentialId && <span>{state.sequentialId}</span>}</div>
          {_this.renderStep()}
          {
            node.type !== 'ConditionEntity' && <this.props.icon
              node={node}
              waitForUserInput={state.waitForUserInput}
              saveMessageToEntities={state.saveMessageToEntities}
              isNodeEdited={state.isEdited}
              isOpenUserReply={state.isOpenUserReply}
            />
          }
          {portIn && <CommonPortWidget name="portIn" node={node} className={styles.textNodePortIn} />}
          {!(state.isEdited || state.isOpenUserReply) && <this.props.options
            node={node}
            selected={selected}
            setHover={this.setHover}
            hovered={this.state.hovered}
            style={{
              top: node.type === 'ConditionEntity' ? 72 : (state.waitForUserInput ? 112 : 100),
              left: -10,
              zIndex: 10
            }}
          />}
        </div>
        {_this.renderBranchs()}
      </>
    );
  }
}
export default CommonStepWidget;
