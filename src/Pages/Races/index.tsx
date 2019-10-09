import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import { Button, Grid, Header } from 'semantic-ui-react';
import TypingHeader from '../../Components/TypingHeader';
import { IRaceObj } from '../../Core/definitions';
import { getRace } from '../../Core/firebase-functions';
import Race from './Components/Race';

interface IState {
  race: IRaceObj;
  raceId: string;
  showRace: boolean;
}

class Races extends React.Component <ReactRouter.RouteComponentProps, IState> {
  constructor(props: ReactRouter.RouteComponentProps) {
    super(props);
    this.loggedIn = this.loggedIn.bind(this);
    this.raceCallback = this.raceCallback.bind(this);
    this.showTest = this.showTest.bind(this);
    const raceId =  new URLSearchParams(props.location.search).get('race');
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
      showRace: false,
    };
  }
  public render() {
    const { race, raceId, showRace } = this.state;
    return(
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <TypingHeader page={`/races/?race=${raceId}`} loggedIn={this.loggedIn} />
          </Grid.Column>
        </Grid.Row>
        {!showRace && (
          <React.Fragment>
            <Grid.Row centered={true} columns={2}>
              <Grid.Column>
                <Header>{race.title}</Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered={true} columns={2}>
              <Grid.Column>
                {race.script}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered={true} columns={2}>
              <Button onClick={this.showTest}>
                Race
              </Button>
            </Grid.Row>
          </React.Fragment>
        )}
        {showRace && <Race script={race.script} />}
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

  private showTest() {
    this.setState({ showRace: true });
  }
}

export default ReactRouter.withRouter(Races);
