import { constants } from 'design_system_v2';
import { css } from 'emotion';
import { scale } from 'design_system_v2/dist/primitives/utils';

const { COLORS } = constants;

export const CommonStepOption = {
  optionDisable: (disable) =>  css`
    ${!disable ? '' : `color: ${COLORS.GREY_LIGHT_3_M} !important;`}
    &:hover {
      color: ${COLORS.GREY_WHITE} !important;
    }
    cursor: ${disable ? 'none' : 'pointer'};
    pointer-events: ${disable ? 'none' : ''};
  `,

  menu: (hovered) =>  css`
    background-color: ${COLORS.GREY_LIGHT_1};
    border-radius: ${scale(0.5)};
    border: 2px solid ${COLORS.PRIMARY_BASE};
    box-shadow: 0px 0px ${scale(0.5)} 0px ${COLORS.GREY_BLACK};
    display: ${hovered ? "block" : "none"};
    left: -${scale(1.5)};
    list-style: none;
    margin: 0px 0px 0px 1px;
    padding-left: 0px;
    position: absolute;
    top: 124%;
    width: ${scale(22.5)};
    z-index: 1000;
    & > li {
      position: relative;
      height: ${scale(3)};
      font-size: ${scale(1.75)};
      padding: 3px 10px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        background: ${COLORS.ALTERNATIVE_GREENISH};
        color: #fff;
      }
      & > i {
        font-size: ${scale(1.75)};
        margin-right: 5px;
        top: 2px;
      }

      &:nth-of-type(1):hover li {
        background: grey;
      }
    }
  `,

  submenu: hovered => css`
    background-color: ${COLORS.GREY_LIGHT_1};
    border-radius: ${scale(0.5)};
    border: 2px solid ${COLORS.PRIMARY_BASE};
    box-shadow: 0px 0px ${scale(0.5)} 0px ${COLORS.GREY_BLACK};
    display: ${hovered ? "block" : "none"};
    left: 90%;
    list-style: none;
    margin: 0px 0px 0px 18px;
    padding-left: 0px;
    position: absolute;
    top: 0px;
    width: 180px;
    z-index: 1000;
    & > li {
      color: #000;
      height: 24px;
      font-size: 14px;
      padding: 3px 10px;
      box-sizing: border-box;
      &:hover {
        background: rgb(71, 192, 176);
        color: #fff;
      }
    }
  `
};

export const usedEntityTag = {
  tag: css`
    height: ${scale(4.5)};
    width: ${scale(16.25)};
    background: ${COLORS.SECONDARY_DARK_P};
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${COLORS.GREY_WHITE};
    font-size: ${scale(1.75)};
    border-radius: ${scale(1)};
    margin-bottom: ${scale(0.25)};
  `,
  id: css`
    width: ${scale(5)};
    display: flex;
    justify-content: center;
    padding-left: ${scale(0.5)};
    padding-right: ${scale(0.5)};
  `,
  type: css`
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  `
}
