import React, { useState } from 'react';
import { PortWidget } from '@projectstorm/react-diagrams';
import { constants, IconFont } from 'design_system_v2';
import { css } from 'emotion';
import { scale } from 'design_system_v2/dist/primitives/utils';
import EndStepOption from './EndStepOption';
import { useTranslation } from 'react-i18next';

const { COLORS } = constants;

export const EndStepWidget = ({ node }) => {
  const {
    ports: { portIn },
    selected,
    state
  } = node;
  const linked = Object.keys(portIn.links).length > 0;
  const [hovered, setHover] = useState(false);
  const [showTooltipInfo, setTooltipInfo] = useState(false);
  const [t] = useTranslation();

  return (
    <React.Fragment>
      <div className={styles.nodeId}>{state.sequentialId}</div>
      {!linked && (
        <div
          className={styles.infoIcon}
          onMouseEnter={() => setTooltipInfo(true)}
          onMouseLeave={() => setTooltipInfo(false)}
        >
          <IconFont name="round-info-button" />
          {showTooltipInfo && (
            <span className={styles.tooltipInfo}>{t('step.end.tooltip')}</span>
          )}
        </div>
      )}
      <div
        className={styles.startNode(selected)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onDragOver={event => console.log(event)}
      >
        <PortWidget
          name="portIn"
          node={node}
          className={styles.startNodePort(false, linked)}
        />
        <div className={styles.startNodeColor(selected)}>
          <p className={styles.startNodeText}>{t('step.end.title')}</p>
        </div>
        {linked && <div className={styles.startNodePort(false, linked)} />}
        <div className={styles.stepPaddingBottom}></div>
        <EndStepOption
          node={node}
          hovered={hovered}
          setHover={setHover}
          selected={selected}
          style={{ top: 55 }}
        />
      </div>
    </React.Fragment>
  );
};

const styles = {};

styles.nodeId = css`
  font-size: ${scale(2, -2)};
  font-weight: normal;
  height: ${scale(2)};
  letter-spacing: 0px;
  line-height: ${scale(2)};
  position: absolute;
  top: -${scale(2, 2)};
`;

styles.infoIcon = css`
  color: ${COLORS.GREY_MID};
  font-size: ${scale(2, -2)};
  height: ${scale(2)};
  position: absolute;
  right: 0;
  top: -${scale(2, 2)};
  width: ${scale(2)};
`;

styles.tooltipInfo = css`
  background: ${COLORS.GREY_BLACK};
  color: ${COLORS.GREY_WHITE};
  display: block;
  font-size: ${scale(2, -2)};
  line-height: ${scale(3)};
  padding: ${scale(1)} ${scale(2)};
  width: auto;
  min-width: ${scale(16.5)};
  position: absolute;
  left: -${scale(18.5)};
  bottom: ${scale(3)};
`;

styles.startNode = selected => css`
  border: solid 3px
    ${selected ? COLORS.PRIMARY_SATURATED : COLORS.GREY_LIGHT_3_M};
  box-shadow: ${selected ? '0 0 8px 2px #925de2;' : 'none'};
  border-radius: 42px;
  width: 158px;
  height: 44px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;

  &:hover {
    border-color: ${COLORS.SECONDARY_DARK};
  }
`;

styles.startNodeColor = selected => css`
  background: ${selected ? COLORS.GREY_WHITE : COLORS.GREY_LIGHT_1};
  border-radius: 39px;
  height: calc(100% - 4px);
  margin: 1px 0 0 1px;
  padding: 1px;
  position: absolute;
  width: calc(100% - 4px);
`;

styles.startNodePort = (hovered, linked) => css`
  background: ${linked ? COLORS.GREY_LIGHT_1 : COLORS.GREY_WHITE} !important;
  border-radius: 50px 50px 0 0;
  border: 3px solid
    ${!linked
      ? COLORS.GREY_WHITE
      : hovered
      ? COLORS.GREY_MID
      : COLORS.GREY_LIGHT_3_M};
  top: 0px;
  height: 12px !important;
  position: absolute;
  right: calc(50% - 10px);
  width: ${scale(3)} !important;
  z-index: -1;

  &:hover {
    border-color: ${COLORS.GREY_MID};
  }
`;

styles.startNodeText = css`
  color: rgb(58, 55, 56);
  font-size: ${scale(2)};
  font-weight: 500;
  letter-spacing: 0px;
  line-height: 40px;
  margin: 0;
  text-align: center;
`;

styles.stepPaddingBottom = css`
  height: ${scale(1)};
  width: 100%;
  position: absolute;
  top: ${scale(6.25)};
`;
