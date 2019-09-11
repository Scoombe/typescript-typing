import * as React from 'react';
import * as reactRouter from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import LoginPage from '../../Pages/LoginPage';
import TypingTest from '../../Pages/TypingTest';
import './App.css';

class App extends React.Component {
  public render() {
    return (
    <div className="App">
      <reactRouter.Switch>
      <reactRouter.Route exact={true} path="/" component={TypingTest} />
        <reactRouter.Route exact={true} path="/login" component={LoginPage} />
        <reactRouter.Route exact={true} path="/signup" component={LoginPage} />
      </reactRouter.Switch>
      </div>
    );
  }
}

export default App;
