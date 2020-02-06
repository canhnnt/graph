import { constants } from 'design_system_v2';
import { scale } from 'design_system_v2/dist/primitives/utils';
import { css } from 'emotion';

const { COLORS } = constants;

export const styles = {
  customToast: css`
    padding: 0 !important;
  `,
  NotificationWrapper: isError => css`
    display: flex;
    background-color: ${COLORS.GREY_WHITE};
    width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-left: ${isError ? '5px solid #de4f4a' : '5px solid #47c0b0'};
    padding: 0 14px;
  `,
  NotificationIcon: css`
    padding: 33px 17px 33px 27px;
    i {
      font-size: ${scale(3)};
      width: ${scale(3)};
      color: ${COLORS.GREY_MID};
    }
  `,
  NotificationContent: css`
    padding: 34px 14px 16px 0;
    min-width: 200px;
    span {
      margin: 0px;
      font-size: ${scale(1.5)};
      font-weight: 500;
      letter-spacing: 0px;
      line-height: ${scale(3)};
      color: ${COLORS.GREY_MID};
      white-space: pre-line;
    }
  `,
  NotificationCloseBtn: css`
    i {
      position: absolute;
      right: ${scale(1.5)};
      top: ${scale(1.75)};
      font-size: ${scale(1.25)};
      width: ${scale(1.25)};
      color: ${COLORS.GREY_MID};
    }
  `
};
