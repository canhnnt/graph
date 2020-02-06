import gql from 'graphql-tag';
import { EntityFragments, GraphFragments } from './fragments';

export const GET_SIMULATOR_SETTINGS = gql`
  {
    SimulatorSetting @client
    AreaSetting @client
  }
`;

export const GET_AREA_SETTINGS = gql`
  {
    AreaSetting @client
  }
`;

export const GET_NODE_SELECTEDS = gql`
  {
    nodeSelecteds @client
  }
`;

export const GET_DATA_USER_REPLY = gql`
  {
    userReply @client {
      NodeEdit
    },
    customEntities @client
  }
`;

export const GET_SHOW_PANEL_SETTING = gql`
  {
    Show @client {
      StepSettingPanel,
      SettingPanel,
      StepSettingType,
      SettingType,
      SettingTypeBack
    },
    userReply @client {
      NodeEdit
      StepSettingTypeBack
      stepData
    }
  }
`;

export const GET_DATA_RIGHT_PANEL = gql`
{
  nodeSelecteds @client
  Show @client {
    StepSettingPanel,
    SettingPanel,
    StepSettingType
  }
  stepEditing @client
  userReply @client {
    NodeEdit
  }
}
`;

export const GET_STEP_EDITING = gql`
  {
    stepEditing @client
  }
`;

export const GET_EDIT_NODES = gql`
  {
    editNodes @client
  }
`;

export const SET_USER_REPLY_SETTING = gql`
  {
    stepEditing @client
    SwitchStepSetting @client {
      Show
      data
    }
    DragablePartScreen @client
    Show @client {
      StepSettingType
      SimulatorPanel
      StepSettingPanel
    }
    userReply @client {
      NodeEdit
    }
  }
`;


export const SET_SWITCH_DATA = gql`
  {
    DragablePartScreen @client
    stepEditing @client
    editNodes @client
    deleteNodes @client
    SwitchStepSetting @client {
      Show
      data
    }
    SwitchToCreateEntity @client {
      Show
      data
    }
    modalAddStepIsOpen @client
    portOutNameSelected @client
    Show @client {
      StepSettingType
      SimulatorPanel
      StepSettingPanel
    }
    userReply @client {
      NodeEdit
      isGetUserReply
      isSaveUserReply
      stepData
      StepSettingTypeBack
    }
  }
`;

export const GET_ENTITY_SETTING_DATA = gql`
  {
    Show @client {
      SettingTypeBack
      NewEntityId
      CurrentSelectInputName
      CurrentEditEntity {
        ...ClientGeneralDetail
      }
    }
  }
  ${EntityFragments.clientGeneralDetail}
`;

export const GET_ENTITY_ID_SELECTED = gql`
  {
    Show @client {
      CurrentSelectedEntity
    }
  }
`;

export const GET_SERVICES = gql`
  {
    editorService @client {
      id
      name
      serviceId
      serviceVersion
      originalServiceId
      botClientId
      simulatorToken {
        accessToken
        secretToken
      }
    }
  }
`;

export const GET_USER_REPLY_DATA = gql`
  {
    userReply @client {
      isGetUserReply
      isSaveUserReply
      stepData
      StepSettingTypeBack
    }
  }
`;

export const GET_STEP_NODE_ID_MAPPING = gql`
  {
    stepAndNodeIdMapping @client 
  }
`;

export const GET_USED_ENTITIES = gql`
  {
    listUsedEntities @client
  }
`;

export const GET_APP_DATA = gql`
  {
    DragablePartScreen @client
    Show @client {
      SettingPanel
      SimulatorPanel
      StepSettingPanel
      StepSettingType
    }
    addNodes @client
    editNodes @client
    deleteNodes @client
    nodeSelecteds @client
    portOutNameSelected @client
    stepEditing @client
    SwitchStepSetting @client {
      Show
      data
    }
    SwitchToCreateEntity @client {
      Show
      data
    }
    DeleteNodeIdConfirm @client
    userReply @client {
      NodeEdit
      isGetUserReply
      isSaveUserReply
      stepData
      StepSettingTypeBack
    }
    stepAndNodeIdMapping @client
  }
`;
export const GET_GRAPH_DATA = gql`
  query getGraphData($editorServiceId: Int!) {
    findGraphByEditorServiceId(editorServiceId: $editorServiceId) {
      status
      steps {
        ...StepGeneralDetail
      }
      edges {
        ...EdgeGeneralDetail
      }
    }
    entities(editorServiceId: $editorServiceId) {
      ...ServerGeneralDetail
    }
  }
  ${EntityFragments.generalDetail}
  ${GraphFragments.stepGeneralDetail}
  ${GraphFragments.edgeGeneralDetail}
`
