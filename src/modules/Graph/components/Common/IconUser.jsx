import React, { useState, useEffect } from 'react';
import { IconFont } from 'design_system_v2';
import { styles } from '../CustomSteps/BotSteps/Common/styles';
import { GET_DATA_USER_REPLY, GET_SHOW_PANEL_SETTING, SET_USER_REPLY_SETTING } from 'utils/queries';
import { useQuery } from "@apollo/react-hooks";
import { useTranslation } from 'react-i18next';

export const IconUser = ({ node, ...props }) => {
  const [t] = useTranslation();
  const [isEdit, setIsEdit] = useState(false);

  const { data: { userReply: { NodeEdit } }, client } = useQuery(GET_DATA_USER_REPLY);
  const { data: { Show: { StepSettingPanel } } } = useQuery(GET_SHOW_PANEL_SETTING);
  const { isNodeHighlighted, isOpenUserReply } = props;
  const { stepId, waitForUserInput, saveMessageToEntities, isDisabledWaitMessage } = node.state;

  useEffect(() => {
    setIsEdit(NodeEdit && NodeEdit.id === node.id);
  }, [NodeEdit, node]);

  const onClick = () => {
    if (isOpenUserReply || !node.state.sequentialId) {
      return;
    };
    let newData = {
      userReply: {
        id: 'UserReply',
        __typename: 'UserReply',
        NodeEdit: {
          id: node.id,
          stepId: stepId,
          waitForUserInput: waitForUserInput,
          saveMessageToEntities: saveMessageToEntities,
          isDisabledWaitMessage: isDisabledWaitMessage
        }
      },
      DragablePartScreen: true,
      Show: {
        id: 'ShowPanel',
        __typename: 'ShowPanel',
        DataRegistration: false,
        StepSettingPanel: true,
        StepSettingType: 'userReply'
      },
    };
    if (StepSettingPanel) {
      newData = {
        SwitchStepSetting: {
          id: 'SwitchSetting',
          __typename: 'SwitchSetting',
          Show: true,
          data: JSON.stringify(newData)
        },
      };
    }

    client.writeQuery(
      {
        query: SET_USER_REPLY_SETTING,
        data: newData
      }
    );
  }

  const renderUserReply = (saveMessageToEntities) => {
    return (
      <div className={styles.savedEntities}>
        <div>{t('common.saveTo')}</div>
        <div className={styles.entityWraper}>
          <div className={styles.entityTag}>
            {saveMessageToEntities[0].entityName}
          </div>
          {saveMessageToEntities.length > 1 ? <span className={styles.moreEntities}>..</span> : null}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.iconAvatar(isEdit, waitForUserInput, isNodeHighlighted)} onClick={onClick}>
      <IconFont name='user-shape' className={styles.userShape(isEdit, waitForUserInput)} />
      <div className={styles.downloadButtonWraper(waitForUserInput)}>
        <IconFont name='download-button' className={styles.downloadButton(isEdit, saveMessageToEntities.length > 0, waitForUserInput)} />
      </div>
      <div>
        {waitForUserInput && !saveMessageToEntities.length ? <span className={styles.replyText}>{t('common.withReply')}</span> : waitForUserInput && saveMessageToEntities.length ? renderUserReply(saveMessageToEntities) : <span className={styles.replyText}>{t('common.noReply')}</span>}
      </div>
    </div>
  )
}
