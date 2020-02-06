import React from 'react';
import Graph from './modules/Graph';
import { styles } from './styles.js';
import i18n from './config/i18n';

import './assets/styles/main.css';
import './assets/styles/App.css';
import './assets/styles/canvas.css';
import './assets/styles/notification.css';
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';

i18n();

const ScenarioEditor = () => {
  return(
  <div className={styles.container}>
    <ToastContainer style={{ top: '64px', right: '10px'}} />
    <div className={styles.topMenu}>
      
    </div>
    <div className={styles.Menu}>
      
    </div>
    <div className={styles.FlexBox}>
      <div className={styles.dragableArea}>
        <Graph />
      </div>
    </div>
  </div>);
};

export default ScenarioEditor;
