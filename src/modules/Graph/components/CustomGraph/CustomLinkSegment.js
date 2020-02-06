import React, { PureComponent } from "react";
import { constants } from 'design_system_v2';

const { COLORS } = constants;

class CustomLinkSegment extends PureComponent {

  static defaultProps = {
    show: () => { },
    hide: () => { },
  }

  constructor(props) {
    super(props);
    this.state = {
      active: false,
      ...props
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.inversed !== this.props.inversed) {
      
      const linkCoords = this.props.path.split(" ");

      // start link x coordinate
      const startXCoord = linkCoords[1];
      // end link x coordinate
      const endXCoord = linkCoords[linkCoords.length - 2];
      /* eslint-disable eqeqeq */
      // eslint-disable-next-line no-mixed-operators
      const inversed = this.props.inversed != startXCoord > endXCoord;
      this.setState({ inversed });
    }
  }

  setPathMarker = () => {
    if (!this.props.hasTargetPort || this.state.active) {
      return this.state.inversed
        ? { markerStart: `url(#markerHeadInversedDrag)` }
        : { markerEnd: `url(#markerHeadDrag)` }
    } 
    return this.state.inversed
      ? { markerStart: `url(#markerHeadInversed)` }
      : { markerEnd: `url(#markerHead)` }
  }

  onMouseEnter = (e) => {
    this.setState({ active: true });
  }

  onMouseLeave = (e) => {
    this.setState({ active: false });
  }

  render() {
    const { path, model } = this.props;

    return (
      <g className="link-segment">
        <path
          className="link-segment__path"
          ref={ref => this.path = ref}
          strokeWidth={model.width}
          strokeLinecap="round"
          d={path}
          style={this.setPathMarker()}
        />
        <path
          className="link-segment__path link-segment__path_shadow"
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          strokeWidth={model.width * 3}
          style={{stroke: (!this.props.hasTargetPort || this.state.active)  ? "#f5a623" : COLORS.GREY_MID}}
          d={path}
        />
      </g>
    );
  }
}

export default CustomLinkSegment;
