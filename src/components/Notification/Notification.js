import React from 'react';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import { IconFont } from 'design_system_v2';

const SuccessNotication = ({ type, closeToast, isError = false }) => {
  const [t] = useTranslation();

  return (
    <div className={styles.NotificationWrapper(isError)}>
      <div
        className={styles.NotificationCloseBtn}
        onClick={closeToast}
      >
        <IconFont name="close-button" />
      </div>
      <div className={styles.NotificationIcon}>
        {isError ? <IconFont name="flash-on-indicator" /> : <IconFont name="circle-with-check-symbol" />}
      </div>
      <div className={styles.NotificationContent}>
        <span>{t('notifications.' + type)}</span>
      </div>
    </div>
  );
};

export default SuccessNotication;
