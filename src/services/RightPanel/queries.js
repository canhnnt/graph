import gql from 'graphql-tag';
import { EntityFragments } from 'utils/fragments';

export const GET_ENTITIES = gql`
  query getEntities($editorServiceId: Int!, $systemCreated: Boolean){
    entities(editorServiceId: $editorServiceId, systemCreated: $systemCreated) {
      ...ServerGeneralDetail
    }
  }
  ${EntityFragments.generalDetail}
`
