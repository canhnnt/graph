
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
    border-radius: ${scale(1)} ${scale(1)} 0 0;
    margin: ${scale(0.125)} 0 0 ${scale(0.125)};
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

styles.nodeContent = css`
  background-color: ${COLORS.GREY_WHITE};
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
    margin-top: ${scale(0.625)};
  }
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
  white-space: wrap;
  cursor: ${isEdited ? 'default' : 'pointer'};
  pointer-events: ${(isEdited || !sequentialId) ? 'none' : 'auto'};
`;

styles.textNodePortIn = css`
  position: absolute;
  top: ${scale(0.9375)};
  left: ${scale(10.25)};
`;

styles.portWrapper = css`
  position: absolute;
  bottom: -29px;
  width: 100%;
  height: ${scale(3.25)};
  z-index: -1;
`;

styles.textNodePortOut = (hovered, linked) => css`
  background: ${linked ? COLORS.GREY_LIGHT_1 : COLORS.GREY_WHITE} !important;
  border-radius: 0 0 ${scale(6.25)} ${scale(6.25)};
  border: 2px solid ${hovered ? COLORS.GREY_MID : COLORS.GREY_LIGHT_3_M};
  height: ${scale(1.5)} !important;
  width: ${scale(3)} !important;
  margin: auto;
  border-top: unset;

  &:hover {
    border-color: ${COLORS.SECONDARY_DARK};
  }
`;

styles.menu = hovered => css`
  display: ${hovered ? "block" : "none"};
  border: solid ${scale(0.375)} ${COLORS.GREY_LIGHT_3_M};
  background-color: ${COLORS.GREY_WHITE};
  position: absolute;
  left: 0;
  top: ${scale(12.5)};
  width: ${scale(20.5)};
  margin: 0px 0px 0px ${scale(0.125)};
  padding-left: 0;
  list-style: none;
  z-index: 10;
  & > li {
    height: ${scale(3)};
    font-size: ${scale(1.75)};
    padding: ${scale(0.375)} ${scale(1.25)};
    box-sizing: border-box;
    &:hover {
      background: rgb(71, 192, 176);
      color: ${COLORS.GREY_WHITE};
    }
    & > i {
      font-size: ${scale(1.75)};
      margin-right: ${scale(0.625)};
      top: 2px;
    }
  }
`;

styles.infoButton = css`
  position: absolute;
  right: ${scale(0.625)};
  top: ${scale(0.625)};
  color: ${COLORS.GREY_MID};
`;

styles.nodeTags = css`
  background-color: ${COLORS.GREY_LIGHT_3_M};
  height: ${scale(1.75)};
  width: 100%;
  border-radius: ${scale(0.625)} ${scale(0.625)} 0 0;
`;

styles.hover = css`

  &:hover {
    background-color: black;
  }

`;

styles.userShape = (isEdit, waitForUserInput) => css`
  color: ${waitForUserInput ? COLORS.PRIMARY_BASE : COLORS.GREY_LIGHT_3_M};
  font-size: ${waitForUserInput ? scale(3) : scale(2.5)};
  margin-left: ${scale(1.25)};
  margin-bottom: ${waitForUserInput ? scale(1) : scale(0.625)};
`;

styles.downloadButtonWraper = waitForUserInput => css`
  margin: ${waitForUserInput ? `${scale(0.45)} 0 ${scale(1.25)} ${scale(0.5)}` : `0 0 ${scale(0.5)} ${scale(0.5)}`}
`;

styles.downloadButton = (isEdit, isSaveMessage, waitForUserInput) => {
  let color = COLORS.GREY_LIGHT_3_M;
  if(isSaveMessage) {
    color = COLORS.PRIMARY_BASE;
  } else if (waitForUserInput) {
    color = '#f6f6f6';
  }
  return css`
    color: ${color};
    font-size: ${scale(1.75)};
  `
}

styles.iconAvatar = (isEdit, waitForUserInput, isHighlighted) => {
  const hoverState = isEdit ? '' : `
    cursor: pointer;
    :hover {
      border-color : ${waitForUserInput ? '#47c0b0' : '#47c0b036'};
      background-color: ${waitForUserInput ? '#47c0b032' : '#47c0b010'};
    }
  `;
  return css`
    display: flex;
    align-items: center;
    height: ${waitForUserInput ? scale(5) : scale(3.125)};
    padding-bottom: ${waitForUserInput ? '1.5px' : ''};
    margin: ${scale(0.125)} ${scale(0.125)};
    border-radius: ${scale(0.5)};
    border : ${scale(0.1875)} solid ${isEdit ? '#f9be6b24' : (waitForUserInput ? '#47c0b036' : COLORS.GREY_LIGHT_3_M)};
    background-color: ${isEdit ? COLORS.INPUT_WARN : (waitForUserInput ? '#47c0b024' : COLORS.GREY_WHITE)};
    ${hoverState}
    ${isHighlighted ?
      `&:after {
        content: '';
        width: 100%;
        height: ${scale(3.75)};
        box-shadow: 0 0 ${scale(1.875)} #ff3f85;
      }` : ''
    }
  `;
}

styles.replyText = css`
  margin-left: ${scale(1)};
  font-size: ${scale(1.5)};
`;

styles.savedEntities = css`
  font-size: ${scale(1.5)};
  height: ${scale(4.25)};
`;

styles.entityTag = css`
  line-height: ${scale(2.25)};
  margin: ${scale(0.125)};
  width: ${scale(10.75)};
  height: ${scale(2.25)};
  text-align: center;
  margin-left: 0;
  background: #ffcee4;
  padding: 0 ${scale(0.75)};
  border-radius: ${scale(0.625)};
  font-size: ${scale(1.625)};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

styles.moreEntities = css`
  margin-bottom: ${scale(0.125)};
`

styles.entityWraper = css`
  display: flex;
  align-items: flex-end;
`
