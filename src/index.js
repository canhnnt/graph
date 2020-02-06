import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/index.css';
import ScenarioEditor from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from 'react-apollo';
import { client } from './config/apollo-client-config';
import './config/i18n';

ReactDOM.render(<ApolloProvider client={client}>
  <ScenarioEditor />
</ApolloProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
