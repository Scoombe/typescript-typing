import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import { Button, Grid, Header, Icon, List } from 'semantic-ui-react';
import TypingHeader from '../../Components/TypingHeader';
import { IRaceObj, IRaceScoreObj } from '../../Core/definitions';
import { getRace } from '../../Core/firebase-functions';
import { sortObj } from '../../Core/sort-functions';
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
    this.sortedUserScoreElements = this.sortedUserScoreElements.bind(this);
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
            <Grid.Row centered={true} columns={1}>
              <Grid.Column width="6">
                <Header>{race.title}</Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered={true} columns={1}>
              <Grid.Column width="6">
                {race.script}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered={true} columns={2}>
              <Button onClick={this.showTest}>
                Race
              </Button>
            </Grid.Row>
            <Grid.Row  centered={true} columns={2}>
              <Grid.Column width="4">
              <Header as="h2" icon={true} textAlign="center">
                <Header.Content>Scores</Header.Content>
              </Header>
               <List size="large" celled={true}>
                {this.sortedUserScoreElements()}
                </List>
              </Grid.Column>
            </Grid.Row>
          </React.Fragment>
        )}
        {showRace && (
          <Grid.Row centered={true} columns={1}>
            <Grid.Column>
              <Race script={race.script} raceId={raceId}/>
            </Grid.Column>
          </Grid.Row>
        )}
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

  private sortedUserScoreElements(): JSX.Element[] {
    const { scores } = this.state.race;
    if (typeof(scores) === 'undefined' || Object.keys(scores).length === 0) {
      return ([(
        <List.Content key="empty">
          No Scores
        </List.Content>
      )]);
    }
    const sortedScores: IRaceScoreObj[] =  Object.keys(scores).map((key: string) => {
      const score: IRaceScoreObj = scores[key];
      score.key = key;
      return score;
    });
    sortedScores.sort(sortObj('WPM'));
    const sortedScoreElements: JSX.Element[] = [];
    let firstScore = true;
    for (const score of sortedScores) {
      sortedScoreElements.push(
        this.returnScoreListItem(score, firstScore),
      );
      firstScore = false;
    }
    return sortedScoreElements;
  }

  private returnScoreListItem(score: IRaceScoreObj, first: boolean): JSX.Element {
    return(
      <List.Item key={score.key}>
      <List.Content>
       {first && <Icon name="trophy" color="yellow" />}
        WPM: {score.WPM}  <br />
        Average WPM: {score.averageWPM} <br />
        User Name: {score.userName}
      </List.Content>
    </List.Item>
    );
  }
}

export default ReactRouter.withRouter(Races);
