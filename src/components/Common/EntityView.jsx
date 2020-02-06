import React, { useCallback, useRef, useState, useMemo } from 'react';
import { constants, element } from 'design_system_v2';
import { entityView as styles } from './styles';
import { ellipsisText } from 'utils/string';
import { useApolloClient } from 'react-apollo';
import { cx } from 'emotion';
import { useTranslation } from 'react-i18next';

const { BASE_SCALE } = constants;

export const EntityView = ({
  className = '',
  height = BASE_SCALE * 4,
  position = 'top',
  spacing = {
    boundary: BASE_SCALE,
    containerTop: BASE_SCALE * 3,
    containerBottom: BASE_SCALE
  },
  ...props
}) => {
  const [ t ] = useTranslation();
  const client = new useApolloClient();
  const isGraph = props.isGraph;
  const { viewName, entityName, type, id: entityId } = props.entity;
  const name = viewName || entityName;
  const containerRef = useRef();
  const tooltipRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [left, setLeft] = useState(undefined);
  const [top, setTop] = useState(undefined);
  const [right, setRight] = useState(undefined);

  const handleClick = useCallback( () => {
    client.writeData({
      data: {
        DragablePartScreen: true,
        Show: {
          id: 'ShowPanel',
          __typename: 'ShowPanel',
          DataRegistration: false,
          SettingType: 'entity',
          SimulatorPanel: false,
          CurrentSelectedEntity: entityId,
        }
      }
    });
  }, [client, entityId]);

  const getTooltipPosition = useCallback(() => {
    const container = containerRef.current;
    const containerOffset = element.getOffset(container);
    const containerRect = container.getBoundingClientRect();
    const isTop = position === 'top';
    const viewportHeight = window.innerHeight;

    let top = containerOffset.top - height - spacing.containerTop;
    if (
      (isTop && containerRect.top - spacing.boundary < height) ||
      (!isTop &&
        viewportHeight - containerRect.bottom - spacing.boundary >= height)
    ) {
      top = containerOffset.top + container.offsetHeight + spacing.containerBottom;
    }

    const tooltip = tooltipRef.current;
    const width = tooltip.offsetWidth;
    const halfWidth = width / 2;
    const containerRectCenterX = (containerRect.left + containerRect.right) / 2;
    const containerOffsetCenterX = containerOffset.left + container.offsetWidth / 2;
    const viewportWidth = window.innerWidth;
    let left = containerOffsetCenterX - halfWidth;
    if (containerRectCenterX - halfWidth < spacing.boundary) {
      left = spacing.boundary;
    }

    if (containerRectCenterX + halfWidth + spacing.boundary > viewportWidth) {
      return {
        right: spacing.boundary,
        top
      };
    }

    return {
      left,
      top
    };
  }, [height, position, spacing.boundary, spacing.containerBottom, spacing.containerTop]);

  const handleMouseEnter = useCallback(() => {
    if(isGraph){
      setLeft(-12);
      setTop(-45);
    }else{
      const tooltipPosition = getTooltipPosition();
      setLeft(tooltipPosition.left);
      setTop(tooltipPosition.top);
      setRight(tooltipPosition.right);
    }
      setHovered(true);
  }, [getTooltipPosition, isGraph]);

  const tooltipClasses = useMemo(
    () => cx(styles.tooltip(isGraph), styles.displayingTooltip({ left, right, top , hovered })),
    [hovered, isGraph, left, right, top]
  );
  const containerClassName = useMemo(() => cx(className, styles.container), [className]);

  return (
    <div
      className={containerClassName}
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      <span className={styles.entity} onClick={handleClick}>{ellipsisText(name, 12)}</span>
      <div className={tooltipClasses} ref={tooltipRef}>
        {t(`common.entityType.${type}`) + '\n' + name}
      </div>
    </div>
  )
}
