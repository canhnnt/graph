import React from 'react';
import { toast } from "react-toastify";
import { styles } from './styles';

import Notification from './Notification';

const showNotification = (type, isError) => {
  toast(<Notification type={type} isError={isError} />, {
    autoClose: 2000,
    hideProgressBar: true,
    closeButton: false,
    className: styles.customToast
  });
};

export default showNotification;
