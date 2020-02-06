import React from 'react';
import { BaseWidget } from '@projectstorm/react-diagrams';

export class CommonPortWidget extends BaseWidget {
  constructor(props) {
    super("common-port", props);
    this.state = {
      selected: false
    };
  }
  getClassName() {
    return "port " + super.getClassName() + (this.state.selected ? this.bem("--selected") : "");
  }
  render() {
    return (
      <div
        {...this.getProps()}
        onMouseEnter={() => {
          this.setState({ selected: true });
          this.props.setNodeHover && this.props.setNodeHover(true);
        }}
        onMouseLeave={() => {
          this.setState({ selected: false });
          this.props.setNodeHover && this.props.setNodeHover(false);
        }}
        data-name={this.props.name}
        data-nodeid={this.props.node.getID()}
      >{this.props.children}
      </div>
    );
  }
}
