import { settings } from '../config/setting';
import { GET_SHOW_PANEL_SETTING, SET_SWITCH_DATA, GET_USED_ENTITIES } from './queries';
import { uniqWith, isEqual } from 'lodash';
import * as eaw from 'eastasianwidth';

const setLocale = locale => {
  localStorage.setItem('locale', locale);
  return locale;
};

export const getLocale = () => {
  const locale = localStorage.getItem('locale');
  return locale && settings.locales.includes(locale) ? locale : setLocale('en');
}

export const updateDataToLocalState = async (stepData, client) => {
  const { data: { Show: { StepSettingPanel } } } = await client.query({query: GET_SHOW_PANEL_SETTING});
  let newData = stepData;
  if(StepSettingPanel) {
    newData = {
      SwitchStepSetting: {
        id: 'SwitchSetting',
        __typename: 'SwitchSetting',
        Show: true,
        data: JSON.stringify(stepData)
      }
    };
  }
  client.writeQuery(
    {
      query: SET_SWITCH_DATA,
      data: newData
    }
  );
}

export const convertStartStep = (baseData, t) => {
  return {
    name: t('stepName.start'),
    allowsDelete: !baseData.sequentialId || baseData.sequentialId > 1,
    ...baseData
  }
}

export const convertEndStep = (baseData, t) => {
  return {
    name: t('stepName.end'),
    ...baseData
  }
}

export const convertTextStep = (baseData, step, t) => {
  return {
    name: t('stepName.text'),
    waitForUserInput: step.waitForUserInput || step.isGetUserReply || false,
    message: step.message,
    isSaveUserReply: step.isSaveUserReply || false,
    ...baseData
  }
}

export const convertButtonStep = (baseData, step, t) => {
  let buttons = step.buttons || [];
  buttons = buttons.map( ({__typename, ...button}) => button );

  let childs = [...buttons];

  if(step.isAllButtonSameFlow) {
    childs = [{id: 'All', label: t('step.button.allButtons')}];
  } else if (step.isCustomizeFlowElse) {
    childs.push({id: 'Else', label: t('step.button.else')});
  }

  return {
    name: t('stepName.button'),
    waitForUserInput: step.waitForUserInput || step.isGetUserReply || true,
    isAllButtonSameFlow: step.isAllButtonSameFlow || false,
    isCustomizeFlowElse: step.isCustomizeFlowElse || false,
    childs: childs,
    buttons: buttons,
    isSaveUserReply: step.isSaveUserReply || false,
    isDisabledWaitMessage: true,
    isSendMessage: step.isSendMessage,
    message: step.isSendMessage ? step.message : '',
    ...baseData
  }
}

export const convertConditionEntityStep = (baseData, step, t, entities) => {
  let branches = step.branches || [{
    label: t('stepSettings.conditionEntity.newBranchDefaulName', {num: 1}),
    conditions: [],
    deleted: false,
  }];
  branches = branches.map( ({__typename, ...branch}) => {
    branch.save = true;
    branch.conditions = branch.conditions.map(({__typename, ...condition}) => {
      let condition_value = condition.value;
      const entity = entities.find(entity => entity.id === condition.entityId);
      if(condition.operator === "equal_entity"){
        condition_value = entities.find(entity => entity.id === condition.equalEntityId);
      } else if (["before", "after"].includes(condition.operator)
      || (condition.operator === 'equal_value' && entity.type === settings.EntityType.DateEntity)) {
        condition_value = condition_value ? JSON.parse(condition_value) : {};
      }
      return { condition_type: condition.operator, condition_value: condition_value, entity: entity, ...condition }
    });
    return branch;
  });

  if (branches.length > 0) {
    branches = [...branches, {
      id: 'Else',
      label: t('step.button.else'),
      conditions: [
        {
          condition_type: 'Else',
          condition_value: 'Else'
        }
      ]
    }];
  }

  return {
    name: t('stepName.conditionEntity'),
    waitForUserInput: step.waitForUserInput || false,
    childs: branches,
    conditionName: step.conditionName,
    ...baseData
  }
}

export const convertConditionMessageStep = (baseData, step, t) => {
  return {
    name: t('stepName.conditionMessage'),
    waitForUserInput: step.waitForUserInput || false,
    childs: [],
    ...baseData
  }
}

export const findEntityByIds = (ids, entities) => {
  if (Array.isArray(ids) && entities.length) {
    return entities.filter(entity => ids.includes(entity.id));
  }

  return [];
}

export const convertStepJsonDataToGraphData = (step, t, entities = []) => {
  const saveMessageToEntities = findEntityByIds(step.saveMessageToEntities, entities)
  const baseData = {
    stepId: step.id,
    type: step.type,
    sequentialId: step.sequentialId,
    position: {
      x: step.x,
      y: step.y
    },
    saveMessageToEntities: saveMessageToEntities
  };

  switch (baseData.type) {
    case 'Start':
      return convertStartStep(baseData, t)
    case 'Text':
      return convertTextStep(baseData, step, t)
    case 'Button':
      return convertButtonStep(baseData, step, t)
    case 'ConditionEntity':
      return convertConditionEntityStep(baseData, step, t, entities)
    case 'ConditionMessage':
      return convertConditionMessageStep(baseData, step, t)
    case 'End':
      return convertEndStep(baseData, t)
    default:
      return baseData;
  }
}

export const pushEntityWithText = (listMatchRegex, usedEntityMap, listEntities, step) => {
  let usedEntities = [...usedEntityMap];
  listMatchRegex.forEach(name => {
    if (name.includes('.')) {
      const dotIndex = name.indexOf('.');
      const newName = name.substring(0, dotIndex);
      listEntities.forEach(e => {
        if (e.entityName === newName) {
          return usedEntities.push({
            entityId: e.id,
            usedStep: step.sequentialId,
            usedStepType: step.type
          });
        }
      });
    } else {
      listEntities.forEach(e => {
        if (e.entityName === name) {
          return usedEntities.push({
            entityId: e.id,
            usedStep: step.sequentialId,
            usedStepType: step.type
          });
        }
      });
    }
  });

  return uniqWith(usedEntities, isEqual);
};

const checkUsedEntityByMessage = (steps, usedEntityMap, listEntities) => {
  let usedEntities = [...usedEntityMap];
  const messageRegex = /\{([^}]+)\}/g;
  steps.forEach(e => {
    let list = e.message.match(messageRegex) || [];
    list = list.map(m => m.replace(/[{}]/g, ""));
    usedEntities = pushEntityWithText(list, usedEntities, listEntities, e);
  });
  return usedEntities;
};

const checkUsedEntityByButtonLabel = (steps, usedEntityMap, listEntities) => {
  let usedEntities = [...usedEntityMap];
  const messageRegex = /\{([^}]+)\}/g;
  steps.forEach(e => {
    let listMessage = e.message.match(messageRegex) || [];
    listMessage = listMessage.map(m => m.replace(/[{}]/g, ""));
    usedEntities = pushEntityWithText(listMessage, usedEntities, listEntities, e);
    e.buttons.forEach(b => {
      const listLabel = b.label.match(messageRegex) || [];
      usedEntities = pushEntityWithText(listLabel, usedEntities, listEntities, e);
    });
  });
  return usedEntities;
};

const checkUsedEntityByCondition = (steps, usedEntityMap, listEntities) => {
  let listId = listEntities.map(e => e.id);
  let usedEntities = [...usedEntityMap];
  const messageRegex = /\{([^}]+)\}/g;
  steps.forEach(e => {
    e.branches.forEach(b => {
      let list = b.label.match(messageRegex) || [];
      list = list.map(m => m.replace(/[{}]/g, ""));
      usedEntities = pushEntityWithText(list, usedEntities, listEntities, e);
      b.conditions.forEach(c => {
        if (listId.includes(c.entityId)) {
          usedEntities.push({
            entityId: c.entityId,
            usedStep: e.sequentialId,
            usedStepType: e.type
          });
        }
        if (listId.includes(c.equalEntityId)) {
          usedEntities.push({
            entityId: c.equalEntityId,
            usedStep: e.sequentialId,
            usedStepType: e.type
          });
        }
      });
    });
  });
  return usedEntities;
};

const checkUsedEntityBySavedMessage = (steps, usedEntityMap, listEntities) => {
  let usedEntities = [...usedEntityMap];
  steps.forEach(e => {
    listEntities.forEach(entity => {
      if (e.saveMessageToEntities && e.saveMessageToEntities.includes(entity.id)) {
        return usedEntities.push({
          entityId: entity.id,
          usedStep: e.sequentialId,
          usedStepType: e.type
        });
      }
    });
  });
  return usedEntities;
};

export const combineUsedEntity = (steps, entities, client) => {
  const listEntities = entities.map(e => ({
    id: e.id,
    entityName: e.entityName
  }));

  let textStep = [];
  let conditionStep = [];
  let buttonStep = [];
  let usedEntityMap = [];

  steps.forEach(step => {
    switch (step.type) {
      case 'Text':
        textStep.push(step);
        break;
      case 'ConditionEntity':
        conditionStep.push(step);
        break;
      case 'Button':
        buttonStep.push(step);
        break;
      default:
        break;
    }
  });
  /*Check all saved message to entity */
  usedEntityMap = checkUsedEntityBySavedMessage(steps, usedEntityMap, listEntities);
  /*Check text step message */
  usedEntityMap = checkUsedEntityByMessage(textStep, usedEntityMap, listEntities);
  /*Check button step label */
  usedEntityMap = checkUsedEntityByButtonLabel(buttonStep, usedEntityMap, listEntities);
  /*Check condition step label and conditions */
  usedEntityMap = checkUsedEntityByCondition(conditionStep, usedEntityMap, listEntities);

  usedEntityMap = uniqWith(usedEntityMap, isEqual);

  client.writeQuery({ query: GET_USED_ENTITIES,
    data: {
      listUsedEntities: usedEntityMap
    }
  });
};

export const getErrorLinks = (t, portIn, portOut) => {
  let errors = [];

  if (portIn && Object.keys(portIn.links).length === 0) {
    errors = [...errors, t('notifications.setPrevStep')];
  }

  if (portOut && Object.keys(portOut.links).length === 0) {
    errors = [...errors, t('notifications.setNextStep')];
  }

  return errors;
};

export const truncateLabelName = (labelName, width = 34) => {
  let newLabelName = '';
  if (labelName) {
    let labelNameWidth = eaw.length(labelName);
    if (labelNameWidth >= width) {
      for (var i = 0; i < labelName.length; i++) {
        newLabelName += labelName.charAt(i);
        if (eaw.length(newLabelName) >= width - 2) break;
      }
      newLabelName += '...';
      const regex = /\{(\w*)\.+/; // checking for this case: "abc xyz {Stri..."
      newLabelName = newLabelName.replace(regex, '...');
    } else {
      newLabelName = labelName;
    }
  }


  return newLabelName;
};

export const truncateStepName = (stepName, width = 32) => {
  let newStepName = '';
  if (stepName) {
    let stepNameWidth = eaw.length(stepName);
    if (stepNameWidth >= width) {
      for (var i = 0; i < stepName.length; i++) {
        newStepName += stepName.charAt(i);
        if (eaw.length(newStepName) >= width - 2) break;
      }
      newStepName += '...';
    } else {
      newStepName = stepName;
    }
  }
  return newStepName;
};