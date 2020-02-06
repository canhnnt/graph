import React from 'react';
import { BaseWidget } from '@projectstorm/react-diagrams';
import { withApollo } from 'react-apollo';

class CommonPortWidget extends BaseWidget {
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
        }}
        onMouseLeave={() => {
          this.setState({ selected: false });
        }}
        data-name={this.props.name}
        data-nodeid={this.props.node.getID()}
      >{this.props.children}
      </div>
    );
  }
}

export default withApollo(CommonPortWidget);
