import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import { Button, Grid, Header } from 'semantic-ui-react';
import TypingHeader from '../../Components/TypingHeader';
import { IRaceObj } from '../../Core/definitions';
import { getRace } from '../../Core/firebase-functions';

interface IState {
  race: IRaceObj;
  raceId: string;
}

class Races extends React.Component <ReactRouter.RouteComponentProps, IState> {
  constructor(props: ReactRouter.RouteComponentProps) {
    super(props);
    this.loggedIn = this.loggedIn.bind(this);
    this.raceCallback = this.raceCallback.bind(this);
    const raceId =  new URLSearchParams(props.location.search).get('name');
    this.state = {
      race: {
        createdOn: 0,
        key: '',
        scores: {},
        script: '',
        stars: {},
        title: '',
        userId: '',
      },
      raceId: raceId ? raceId : '',
    };
  }
  public render() {
    const { race, raceId } = this.state;
    return(
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <TypingHeader page={`races/${raceId}`} loggedIn={this.loggedIn} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered={true} columns={2}>
          <Grid.Column>
            {raceId}
            <Header>{race.title}</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered={true} columns={2}>
          <Grid.Column>
            {race.script}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered={true} columns={2}>
          <Button>
            Race
          </Button>
        </Grid.Row>
      </Grid>
    );
  }
  private loggedIn() {
    const { raceId } = this.state;
    getRace(this.raceCallback, raceId);
  }

  private raceCallback(race: IRaceObj) {
    this.setState({ race });
  }
}

export default ReactRouter.withRouter(Races);