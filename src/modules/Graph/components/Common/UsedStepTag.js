import React from 'react';
import { usedEntityTag as styles } from './styles'

const UsedStepTag = ({id, type}) => {
  return (
    <div className={styles.tag}>
      <div className={styles.id}>{id}</div>
      <div className={styles.type}>{type}</div>
    </div>
  )
}

export default UsedStepTag;