import React from 'react';
import { IconFont } from 'design_system_v2';
import { CommonStepOption as styles } from  './styles';
import { updateDataToLocalState } from 'utils/helpers';

export default class CommonStepOption extends React.Component {
  constructor(props) {
    super(props);
    this.options = [];
  }

  onAddStepClick = (e, portOutName, node) => {
    updateDataToLocalState({
      modalAddStepIsOpen: true,
      portOutNameSelected: portOutName
    }, this.props.client);
  }

  onEditStepClick = (e, portOutName, node) => {
    updateDataToLocalState({
      DragablePartScreen: true,
      Show: {
        id: 'ShowPanel',
        __typename: 'ShowPanel',
        StepSettingType: this.stepType,
        SimulatorPanel: false,
        StepSettingPanel: true,
      },
      stepEditing: [node.serialize()]
    }, this.props.client);
  }

  onDeleteStepClick = (e, portOutName, node) => {
    if(!['Start', 'End'].includes(node.type)){
      this.props.client.writeData({data: { DeleteNodeIdConfirm: node.id }});
    } else {
      this.props.client.writeData({data: { deleteNodes: [node.id] }});
    }
  }

  onSetAsEndPointClick = (e, portOutName, node) => {
    this.props.client.writeData(
      { data:
        {
          portOutNameSelected: portOutName,
          addNodes: ['End']
        }
      }
    );
  }

  isLinkToEndStep = () => {
    const ports = this.props.node.ports;
    if(!ports) return false;
    let isLinkTo = false;

    Object.entries(ports).forEach(([portName, port]) => {
      const links = port.links;
      if(!links) return;

      Object.entries(links).forEach(([linkName, link]) => {
        const node = link.targetPort ? link.targetPort.parent : null;
        if(node && node.type === 'end-node'){
          isLinkTo = true;
        }
      });
    });

    return isLinkTo;
  }

  isExistLinkToNextStep = (portOutName = 'portOut') => {
    const ports = this.props.node.ports;
    if (!ports) return false;

    const port = ports[portOutName];
    if (!port) return false;

    return port.links && Object.entries(port.links).length;
  }

  setSubMenuHandler() {
    const hasSubOptions = this.options.filter(option => option.subMenus !== null)
    if(hasSubOptions.count === 0)return;
    hasSubOptions.forEach(option => {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state = {
        ...this.state,
        [option.text]: false
      }
    })
  }

  renderSingleOption(option) {
    const { portOutName, node , setHover} = this.props;
    const disable = (option.checkLinkToEndStep && this.isLinkToEndStep()) || (option.checkLinkToNextStep && this.isExistLinkToNextStep(portOutName)) || option.disabled;
    return (
      <li key={option.text} onClick={(e) => {
        option.clickHandler && option.clickHandler(e, portOutName, node);
        setHover && setHover(false);
      }} className={styles.optionDisable(disable)}>
        {option.icon && <IconFont name={option.icon} />}{option.text}
      </li>
    )
  }

  render() {
    const { hovered, style } = this.props;
    const listMainMenu = this.options.map((option) => {
      if(option.subMenus) {
        const subMenus = option.subMenus.map(subOption => this.renderSingleOption(subOption));
        return(
          <li
            key={option.text}
            onMouseEnter={() => this.setState({[option.text]: true})}
            onMouseLeave={() => this.setState({[option.text]: false})}
          >
            {option.icon && <IconFont name={option.icon} />}
            {option.text}
            <ul className={styles.submenu(this.state[option.text])}>
              {subMenus}
            </ul>
          </li>
        );
      } else {
        return this.renderSingleOption(option);
      }
    })
    return (
      <ul className={styles.menu(hovered)} style={style}>
        {listMainMenu}
      </ul>
    );
  }
}
