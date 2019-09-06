import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as router from 'react-router-dom';
import App from './Components/App';
import './index.css';
import * as serviceWorker from './serviceWorker';

ReactDom.render(
  (
    <router.BrowserRouter>
       <App />
    </router.BrowserRouter>
  ),
  document.getElementById('root'));

serviceWorker.register();
