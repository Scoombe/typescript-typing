import * as React from 'react';
import {
    Grid, Icon, List,
} from 'semantic-ui-react';
import Header from '../../Components/Header';
import { getUserScores } from '../../Core/firebase-functions';

interface IState {
  loggedIn: boolean;
}

class ScoresPage extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loggedIn: false,
    };
    this.loggedIn = this.loggedIn.bind(this);
  }
  public render() {
    return(
      <Grid>
        <Grid.Column width={16} >
          <Header page="scores" loggedIn={this.loggedIn}/>
        </Grid.Column>
      </Grid>
    );
  }

  private loggedIn() {
    this.setState({ loggedIn: true });
  }
}

export default ScoresPage;
