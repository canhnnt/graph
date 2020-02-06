import { constants } from 'design_system_v2';
import { css } from 'emotion';
import { scale } from 'design_system_v2/dist/primitives/utils';

const { COLORS } = constants;

export const styles = {};

styles.textNode = (isHighlighted, selected, isEdited) => {
  let borderColor = COLORS.GREY_LIGHT_3_M;
  let boxShadow = null;
  if (isHighlighted) {
    borderColor = '#ff3f87'
    boxShadow = `box-shadow: 0 0 ${scale(1.25)} #ff3f87;`
  } else if (selected) {
    borderColor = COLORS.SECONDARY_BASE
    boxShadow = `box-shadow: 0 0 ${scale(1)} ${scale(0.25)} ${COLORS.SECONDARY_BASE};`
  } else if (isEdited) {
    borderColor = COLORS.WARNING_BASE
    boxShadow = `box-shadow: 0 0 ${scale(1)} ${scale(0.25)} ${COLORS.WARNING_BASE};`
  }

  return css`
    border: solid ${scale(0.375)} ${borderColor};
    border-radius: ${scale(1)};
    width: ${scale(19.75)};
    display: block;
    position: relative;
    background-color: white;
    z-index: 1;
    ${boxShadow}
    &:hover {
      border-color: ${isHighlighted ? '#c50d52' : COLORS.SECONDARY_DARK};
      ${!isHighlighted && isEdited && `box-shadow: 0 0 ${scale(1)} ${scale(0.25)} ${COLORS.SECONDARY_DARK};`}
      ${isHighlighted && `box-shadow: 0 0 ${scale(1)} ${scale(0.25)} #c50d52;`}
    }
  `;
}

styles.textNodeColor = state => {
  let backgroundColor = COLORS.GREY_LIGHT_1;
  if (!state.isEdited && !state.isHighlighted) {
    backgroundColor = state.isError ? '#de4e4a24' : '#925de210';
  } if (state.isEdited || state.selected || state.isHighlighted) {
    backgroundColor = COLORS.GREY_WHITE;
  }
  return css`
    background: ${state.isEdited || state.selected || state.isHighlighted ? COLORS.GREY_WHITE : COLORS.GREY_LIGHT_1};
    width: calc(100% - ${scale(0.25)});
    border-radius: ${scale(0.5)};
    margin: ${scale(0.125)};
    & > i {
      position: absolute;
      right: ${scale(0.625)};
      top: ${scale(0.625)};
      color: ${COLORS.GREY_MID};
    };
    &:hover {
      background: ${backgroundColor};
    }
    `
};

styles.nodeUserIcon = css`
  position: absolute;
  border-radius: 9999px;
  width: ${scale(7)};
  left: ${scale(5)};
  top: 0;
  z-index: 999;
`;

styles.nodeTypeWraper = css`
  display: flex;
  align-items: center;
  height: ${scale(5.5)};
`;

styles.nodeType = (state) => {
  let backgroundColor = COLORS.GREY_MID;
  if (state.isError) {
    backgroundColor = COLORS.STATES_DANGER;
  }
  if (state.isEdited) {
    backgroundColor = COLORS.WARNING_BASE;
  }
  return css`
    display: flex;
    float: left;
    width: ${scale(5.5)};
    height: ${scale(5.5)};
    background-color: ${backgroundColor};
    border-radius: 0 0 0 ${scale(.5)};
    & > span {
      display: block;
      width: 100%;
      height: ${scale(3)};
      font-size: ${scale(1.75)};
      padding: ${scale(0.375)} ${scale(0.625)};
      box-sizing: border-box;
      color: ${COLORS.GREY_WHITE};
    }
    i {
      font-size: ${scale(2.75)};
      color: ${COLORS.GREY_MID};
      line-height: ${scale(4.5)};
      width: ${scale(4)};
    }`
};

styles.nodeIcon = css`
  background-color: ${COLORS.GREY_WHITE};
  width: ${scale(4)};
  height: ${scale(4)};
  text-align: center;
  border-radius: 50%;
  margin: auto;
  & > img {
    width: ${scale(2.75)};
    margin-top: 5px;
  }
`;

styles.stepNameWraper = css`
  font-size: ${scale(1.5)};
  margin-left: ${scale(1.25)};
  width: ${scale(12)};
  line-height: 1.5;
`;

styles.nodeLabel = (isEdited, sequentialId) => css`
  display: flex;
  justify-content: center;
  display: -webkit-box;
  height: ${scale(4.5)};
  width: ${scale(12)};
  padding-left:  ${scale(1.25)};
  font-size: ${scale(1.5)};
  -webkit-line-clamp: 2;
  line-height: 1.5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  cursor: ${isEdited ? 'default' : 'pointer'};
  pointer-events: ${(isEdited || !sequentialId) ? 'none' : 'auto'};
`;

styles.textNodePortIn = css`
  position: absolute;
  top: ${scale(0.9375)};
  left: ${scale(10.25)};
`;

styles.portIn = (hovered, isBottom) => css`
  background: ${COLORS.GREY_WHITE};
  border-radius: ${scale(6.25)} ${scale(6.25)} 0 0;
  border: 3px solid ${hovered ? COLORS.GREY_MID : COLORS.GREY_LIGHT_3_M};
  bottom: ${scale(9.75)};
  height: ${scale(1.5)} !important;
  width: ${scale(3)} !important;
  position: absolute;
  right: calc(50% - ${scale(1.5)});
  top: ${isBottom ? "-2px" : scale(-4.25)};
  z-index: -1;
  &:hover {
    border-color: ${COLORS.GREY_MID};
  }
`;

styles.menu = hovered => css`
  display: ${hovered ? "block" : "none"};
  border: solid 3px ${COLORS.GREY_LIGHT_3_M};
  background-color: ${COLORS.GREY_WHITE};
  position: absolute;
  left: 0px;
  top: ${scale(12.5)};
  width: ${scale(22.5)};
  margin: 0px 0px 0px 1px;
  padding-left: 0px;
  list-style: none;
  z-index: 10;
  & > li {
    height: ${scale(3)};
    font-size: ${scale(1.75)};
    padding: 3px ${scale(1.25)};
    box-sizing: border-box;
    &:hover {
      background: rgb(71, 192, 176);
      color: ${COLORS.GREY_WHITE};
    }
    & > i {
      font-size: ${scale(1.75)};
      margin-right: 5px;
      top: 2px;
    }
  }
`;

styles.infoButton = css`
  position: absolute;
  right: 5px;
  top: 5px;
  color: ${COLORS.GREY_MID};
`;

styles.nodeTags = css`
  background-color: ${COLORS.GREY_LIGHT_3_M};
  height: ${scale(1.75)};
  width: 100%;
  border-radius: ${scale(0.625)} ${scale(0.625)} 0 0;
`;

styles.branchContainer = (branchNo, waitForUserInput, type) => {
  let width = 0;
  let left = 79;
  let top = scale(10.5);
  width = (164 + 16) * (branchNo - 1);
  if (branchNo && branchNo % 2 === 0) {
    left = -(164 + 16) * (branchNo / 2 - 1) - 12;
  } if (branchNo > 1 && branchNo % 2 !== 0) {
    left = -(164/2 + 16) * Math.floor(branchNo / 2);
  }
  if (type === 'ConditionEntity') {
    top = scale(6.625);
  } else if (waitForUserInput) {
    top = scale(11.75);
  }
  return css`
    height:  ${scale(3.5)};
    border: ${scale(1)} solid ${COLORS.GREY_LIGHT_3_M};
    border-right: none;
    border-bottom: none;
    display: flex;
    position: absolute;
    z-index: -1;
    width: ${width}px;
    top: ${top};
    left: ${left}px;
  `;
}

styles.branchContainer1 = (nodeType, branchNo) => {
  let width = 82;
  let left = 102;
  width = (164 + 16) * (branchNo - 1);
  if (branchNo && branchNo % 2 === 0) {
    left = -(164 + 16) * (branchNo / 2 - 1) - 12;
  } if (branchNo > 1 && branchNo % 2 !== 0) {
    left = -(164/2 + 16) * Math.floor(branchNo / 2);
  }
  return css`
    width: ${width}px;
    display: flex;
    position: absolute;
    top: ${nodeType === 'ConditionEntity' ? scale(8) : scale(12)};
    left: ${left}px;
  `;
}

styles.splitLine = css`
  flex: 1;
  height: 100%;
  border-right: ${scale(1)} solid ${COLORS.GREY_LIGHT_3_M};
`;

styles.childTooltipInfo = css`
  background: ${COLORS.GREY_BLACK};
  color: ${COLORS.GREY_WHITE};
  display: block;
  font-size: ${scale(2, -2)};
  line-height: ${scale(3)};
  padding: ${scale(1)} ${scale(2)};
  width: ${scale(15.5)};
  position: absolute;
  bottom: ${scale(3)};
  z-index: 3;
  left: -${scale(18.5)};
`;

styles.childLabel = (childNo, hovered, childsNumber, waitForUserInput, deleted) => {
  const width = 164;
  const halfPart = width/2 - 3;
  const spaceBetweenLabel = 16;
  const border = deleted ? 'rgba(220, 219, 216, 0.32)' : hovered ? COLORS.SECONDARY_DARK : COLORS.GREY_LIGHT_3_M;
  return css`
    background-color: ${deleted ? 'rgba(246, 246, 246, 0.32)' : COLORS.GREY_LIGHT_1};
    width: ${scale(20.5)};
    height: ${scale(6)};
    border: 3px solid ${border};
    position: absolute;
    top: ${waitForUserInput ? scale(4.25) : scale(3)};
    left: ${childsNumber === 1 ? -102 : (width * childNo) - halfPart + childNo * spaceBetweenLabel}px;
    border-radius: ${scale(1)};
    padding: 1px;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .label {
      color: ${deleted ? 'rgba(58, 55, 56, 0.32)' : COLORS.GREY_BLACK};
      font-size: ${scale(1.5)};
      display: block;
      border-radius: ${scale(1, -3)};
      line-height: ${scale(2.25)};
      width: ${scale(19.5)}; /* because border 3px and 1px padding so 20.5 - 1 = 19.5 */
      justify-content: center;
      text-align: center;
      padding: 0 ${scale(1)};
      height: ${scale(5)};
      display: -webkit-box;
      word-break: break-word;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      &.nopadding {
        padding: unset;
        white-space: pre-wrap;
      }
    };
  `;
}

styles.portWrapper = css`
  width: 100%;
  position: absolute;
  top: ${scale(5.625)};
  height: ${scale(2.75)};
  z-index: -1;
`;

styles.textNodePortOut = (hovered, linked) => css`
  background: transparents;
  height: ${scale(1.5)} !important;
  width: ${scale(3)} !important;
`;

styles.portOut = (hovered, deleted) => css`
  background: ${COLORS.GREY_WHITE} !important;
  border-radius: 0 0 ${scale(6.25)} ${scale(6.25)};
  border: 2px solid ${deleted ? 'rgba(220, 219, 216, 0.32)' : hovered ? COLORS.GREY_MID : COLORS.GREY_LIGHT_3_M};
  height: ${scale(1.5)} !important;
  width: ${scale(3)} !important;
  margin: auto;
  border-top: unset;

  &:hover {
    border-color: ${deleted ? 'rgba(220, 219, 216, 0.32)' : COLORS.SECONDARY_DARK};
  }
`;

styles.paddingBottom = isIconBottom => css`
  width: 100%;
  height: ${scale(5)};
  position: absolute;
  top: ${isIconBottom ? '100%' : '80%'};
  z-index: 1;
`;

styles.errorInfo = css`
  position: absolute;
  top: -${scale(2.5)};
  right: -5px;
  color: ${COLORS.GREY_MID};
`;

styles.tooltipInfo = length => css`
  background: ${COLORS.GREY_BLACK};
  color: ${COLORS.GREY_WHITE};
  display: block;
  white-space:pre-wrap;
  font-size: ${scale(2, -2)};
  line-height: ${scale(3)};
  padding: ${scale(1)} ${scale(2)};
  width: ${scale(22.875)};
  position: absolute;
  left: -${scale(17.5)};
  top: -${scale(2.5, length * 24)};
  z-index: 1;
`;

styles.infoID = css`
  color: ${COLORS.GREY_MID};
  font-size: ${scale(2, -2)};
  height: ${scale(2)};
  position: absolute;
  left: ${scale(.5)};
  top: ${scale(-3)};
  width: ${scale(2)};
`;

styles.infoIcon = css`
  color: ${COLORS.GREY_MID};
  font-size: ${scale(2, -2)};
  height: ${scale(2)};
  position: absolute;
  right: ${scale(.5)};
  top: ${scale(-3)};
  width: ${scale(2)};
`;

styles.hoverPoint = (waitForUserInput, nodeType) => css`
  position: absolute;
  top: ${scale(nodeType === 'ConditionEntity' ? 8 : (waitForUserInput ? 12.5 : 11))};
  width: 100%;
  height: ${scale(1.5)};
`;
