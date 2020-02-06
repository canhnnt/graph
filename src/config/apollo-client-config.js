import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { getLocale } from '../utils/helpers';


const cache = new InMemoryCache();
const locale = getLocale();

const logError = error => console.error(error);
const createErrorLink = () =>
  onError(({ graphQLErrors, networkError, operation }) => {
    if (networkError) {
      const { statusCode } = networkError;
      if (statusCode === 401) {
        window.location.href = `${process.env.REACT_APP_AUTH_HOST}/users/sign_out`;
      } else if (500 <= statusCode && statusCode <= 511) {
        console.log("NetworkError");
      } else {
        logError('GraphQL - NetworkError', networkError);
      }
    }
    if (graphQLErrors) {
      logError('GraphQL - Error', {
        errors: graphQLErrors,
        operationName: operation.operationName,
        variables: operation.variables
      });
    }
  });

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_API_HOST,
  credentials: 'include'
});

const langLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      locale
    }
  }
});

const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    createErrorLink(),
    langLink.concat(httpLink)
  ]),
  cache,
  resolvers: {}
});

const systemDefaultData = {
  editorService: {
    id: null,
    name: null,
    serviceId: 4885,
    serviceVersion: 2,
    botClientId: 17044287,
    originalServiceId: 3909,
    thumbUrl: null,
    simulatorToken: {
      accessToken: '7781959fbbe1a0b5c4d39b5e60f97c56',
      secretToken: 'c22e3f044b4169d95058951dfd946a26',
      __typename: 'SimulatorToken'
    },
    __typename: 'EditorService'
  },
  DragablePartScreen: false,
  Show: {
    id: 'ShowPanel',
    __typename: 'ShowPanel',
    SimulatorPanel: false,
    SettingPanel: false,
    DataRegistration: false,
    StepSettingPanel: false,
    SettingShowing: '',
    StepSettingType: null,
    SettingType: null,
    SettingTypeBack: null,
    NewEntityId: null,
    CurrentSelectedEntity: null,
    CurrentEditEntity: null,
    CurrentSelectInputName: null

  },
  nodeSelecteds: [],
  stepEditing: [],
  addNodes: [],
  editNodes: [],
  deleteNodes: [],
  portOutNameSelected: null,
  SwitchStepSetting: {
    id: 'SwitchSetting',
    __typename: 'SwitchSetting',
    Show: false,
    data: null
  },
  SwitchToCreateEntity: {
    id: 'SwitchCreateEntity',
    __typename: 'SwitchCreateEntity',
    Show: false,
    data: null
  },
  DeleteNodeIdConfirm: null,
  customEntities: [],
  systemEntities: [],
  userReply: {
    id: 'UserReply',
    __typename: 'UserReply',
    NodeEdit: null,
    isGetUserReply: false,
    isSaveUserReply: false,
    stepData: null,
    StepSettingTypeBack: null
  },
  stepAndNodeIdMapping: '{}',
  listUsedEntities: []
};

cache.writeData({ data: systemDefaultData });
apolloClient.onResetStore(() => cache.writeData({ data: systemDefaultData }));

export const client = apolloClient;
