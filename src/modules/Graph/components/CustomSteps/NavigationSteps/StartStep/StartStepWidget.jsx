import React, { useState } from 'react';
import { PortWidget } from '@projectstorm/react-diagrams';
import { constants, IconFont } from 'design_system_v2';
import { css } from 'emotion';
import { scale } from 'design_system_v2/dist/primitives/utils';
import StartStepOption from './StartStepOption';
import { useTranslation } from 'react-i18next';

const { COLORS } = constants;

export const StartStepWidget = ({ node }) => {
  const {
    ports: { portOut },
    selected,
    state: { sequentialId }
  } = node;
  const linked = Object.keys(portOut.links).length > 0;
  const [hovered, setHover] = useState(false);
  const [showTooltipInfo, setTooltipInfo] = useState(false);
  const [t] = useTranslation();

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={styles.nodeId}>{sequentialId}</div>
      {!linked && (
        <div
          className={styles.infoIcon}
          onMouseEnter={() => setTooltipInfo(true)}
          onMouseLeave={() => setTooltipInfo(false)}
        >
          <IconFont name="round-info-button" />
          {showTooltipInfo && (
            <span className={styles.tooltipInfo}>
              {t('step.start.tooltip')}
            </span>
          )}
        </div>
      )}
      <div className={styles.startNode(selected)}>
        <div className={styles.portWrapper}>
          <PortWidget
            name="portOut"
            node={node}
            className={styles.startNodePort(false, linked)}
          />
        </div>
        <div className={styles.startNodeColor(selected)}>
          <p className={styles.startNodeText}>{t('step.start.title')}</p>
        </div>
      </div>
      <StartStepOption
        node={node}
        setHover={setHover}
        hovered={hovered}
        selected={selected}
        portOutName="portOut"
        style={{ top: scale(9.25), left: scale(-1) }}
      />
    </div>
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

styles.portWrapper = css`
  width: 100%;
  height: ${scale(3.25)};
  position: relative;
  top: 47px;
  z-index: -1;
`;

styles.startNodePort = (hovered, linked) => css`
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

styles.startNodeText = css`
  color: rgb(58, 55, 56);
  font-size: ${scale(2)};
  font-weight: 500;
  letter-spacing: 0px;
  line-height: 40px;
  margin: 0;
  text-align: center;
`;
