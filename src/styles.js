import { constants } from 'design_system_v2';
import { scale } from 'design_system_v2/dist/primitives/utils';
import { css } from 'emotion';
const { COLORS } = constants;

export const styles = {
  container: css`
    background-color: ${COLORS.GREY_LIGHT_1};
    width: 100%;
    height: 100%;
  `,
  topMenu: css`
  `,
  Menu: css`
    display: flex;
  `,
  FlexBox: css`
    display: flex;
    height: calc(100% - 255px);
  `,
  dragableArea: css`
    border: 1px solid ${COLORS.PROGRESS_BAR_BORDER};
    box-shadow: 0px 0px 2px 0px ${COLORS.TRANSPARENT_BLACK_56};
    height: 100%;
    margin: 0 10px 10px 10px;
    flex-grow: 1;
    overflow-y: hidden;
  `,
  Panels: (SettingPanel, SimulatorPanel) => {
    let isFull = SettingPanel || SimulatorPanel;
    return css`
      width: 650px;
      height: calc(100% + ${isFull ? scale(8.125) : '0px'});
      background: ${COLORS.GREY_LIGHT_1};
      margin: ${isFull ? '-65px' : '0px'} 10px 0px 0px;
      z-index: 1;
    `;
  },

  Panel: half => css`
    background: ${COLORS.GREY_WHITE};
    height: ${half ? 'calc(50% - 7px)' : 'calc(100% - 2px)'};
    position: relative;
  `,
};
