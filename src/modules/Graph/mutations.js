import gql from 'graphql-tag';
import { GraphFragments } from 'utils/fragments';

export const POST_STEP = gql`
  mutation postStep($editorServiceId: Int!, $step: StepInput!) {
    saveStep(editorServiceId: $editorServiceId, step: $step) {
      status
      step {
        ...StepGeneralDetail
      }
      edges {
        ...EdgeGeneralDetail
      }
      errors {
        message
        fieldName
      }
    }
  }
  ${GraphFragments.stepGeneralDetail}
  ${GraphFragments.edgeGeneralDetail}
`;

export const DELETE_STEP = gql`
  mutation($editorServiceId: Int!, $stepId: ID!) {
    deleteStep(editorServiceId: $editorServiceId, stepId: $stepId) {
      status
      step {
        id
        type
        sequentialId
        waitForUserInput
        saveMessageToEntities
      }
      edges {
        id
      }
      errors {
        message
      }
    }
  }
`;

export const SAVE_EDGE = gql`
  mutation saveEdge($editorServiceId: Int!, $edge: EdgeInput!) {
    saveEdge(editorServiceId: $editorServiceId, edge: $edge) {
      status
      edge {
        id
      }
      errors {
        message
      }
    }
  }
`;

export const DELETE_EDGE = gql`
  mutation deleteEdge($editorServiceId: Int!, $edgeId: ID!) {
    deleteEdge(editorServiceId: $editorServiceId, edgeId: $edgeId) {
      status
      edge {
        id
      }
      errors {
        message
      }
    }
  }
`;
