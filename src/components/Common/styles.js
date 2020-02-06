import { constants } from 'design_system_v2';
import { css } from 'emotion';
import { scale } from 'design_system_v2/dist/primitives/utils';

const { COLORS } = constants;

export const entityView = {
  container: css`
    display: inline-block;
  `,

  tooltip: isGraph => css`
    background-color: ${COLORS.GREY_BLACK};
    border-radius: 1px;
    box-shadow: ${COLORS.TRANSPARENT_BLACK_56} 0 ${scale(.25)} ${scale(.5)} 0;
    color: ${COLORS.GREY_WHITE};
    font-size: ${scale(1.75)};
    ${isGraph ? 'width: 100%;' : ''}
    max-width: ${scale(25)};
    opacity: 0;
    padding: ${scale(1)} ${scale(2)};
    pointer-events: none;
    position: ${isGraph ? 'absolute' : 'fixed'};
    transition: opacity ease-in-out 240ms;
    text-align: left;
    white-space:pre-wrap;
    z-index: -1;
  `,

  displayingTooltip: ({ left, right, top , hovered }) => css`
    left: ${left !== undefined ? `${left}px` : ''};
    right: ${right !== undefined ? `${right}px` : ''};
    top: ${top}px;
    ${hovered ?
      `
        opacity: 1;
        z-index: 1;
      `
      :
      `
        height: 0px;
        padding: 0px ${scale(2)};
        overflow: hidden;
      `
    }
  `,

  entity: css`
    display: inline-block;
    text-align: center;
    width: ${scale(11.5)};
    font-size: ${scale(1.75)};
    color: ${COLORS.GREY_BLACK};
    background-color: #ffcee4;
    border-radius: ${scale(.5)};
    padding: 1px 3px;
    cursor: pointer;
    white-space: nowrap;
    margin-bottom: 2px;
    line-height: ${scale(2)};
    &:hover {
      background: #e0b5c9;
    }
  `
}