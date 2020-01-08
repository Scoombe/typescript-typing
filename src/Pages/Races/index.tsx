import { format } from 'date-fns';
import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import { Button, Grid, Header, Icon, List, Pagination, PaginationProps } from 'semantic-ui-react';
import TypingHeader from '../../Components/TypingHeader';
import { IRaceObj, IRaceScoreObj } from '../../Core/definitions';
import { createRaceStar, getRace } from '../../Core/firebase-functions';
import { sortObj } from '../../Core/sort-functions';
import Race from './Components/Race';

interface IState {
  page: number;
  race: IRaceObj;
  raceId: string;
  showRace: boolean;
}

class Races extends React.Component <ReactRouter.RouteComponentProps, IState> {
  constructor(props: ReactRouter.RouteComponentProps) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.goHome = this.goHome.bind(this);
    this.loggedIn = this.loggedIn.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.raceCallback = this.raceCallback.bind(this);
    this.showTest = this.showTest.bind(this);
    this.sortedUserScoreElements = this.sortedUserScoreElements.bind(this);
    this.starRace = this.starRace.bind(this);
    const raceId =  new URLSearchParams(props.location.search).get('race');
    this.state = {
      page: 1,
      race: {
        createdOn: 0,
        key: '',
        scores: {},
        script: '',
        stars:0,
        title: '',
        userId: '',
        userName: '',
        userStarred: false,
      },
      raceId: raceId ? raceId : '',
      showRace: false,
    };
  }
  public render() {
    const { page, race, raceId, showRace } = this.state;
    return(
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <TypingHeader page={`/races/?race=${raceId}`} loggedIn={this.loggedIn} />
          </Grid.Column>
        </Grid.Row>
        {!showRace && (
          <React.Fragment>
            <Grid.Row columns="2">
              <Grid.Column width={3} floated="left">
                <Icon size="big" name="arrow left" onClick={this.goHome} />
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {race.userStarred && <Icon color="yellow" size="big" name="star"/>}
                {!race.userStarred && <Icon size="big" name="star outline" onClick={this.starRace}/>}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered={true} columns={2}>
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
                {Object.keys(race.scores).length > 5 &&
                <Pagination
                  totalPages={Math.ceil(Object.keys(race.scores).length / 5)}
                  activePage={page}
                  onPageChange={this.onPageChange}
                />}
              </Grid.Column>
            </Grid.Row>
          </React.Fragment>
        )}
        {showRace && (
          <Grid.Row centered={true} columns={1}>
            <Grid.Column>
              <Race script={race.script} raceId={raceId} goBack={this.goBack}/>
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

  private goBack() {
    this.setState({ showRace: false });
  }

  private goHome() {
    this.props.history.push('/');
  }

  private onPageChange(event: React.MouseEvent, data: PaginationProps) {
    if (data.activePage) {
      this.setState({ page: +data.activePage });
    }
  }

  private sortedUserScoreElements(): JSX.Element[] {
    const { scores } = this.state.race;
    const { page } = this.state;
    if (typeof(scores) === 'undefined' || Object.keys(scores).length === 0) {
      return ([(
        <List.Content key="empty">
          No Scores
        </List.Content>
      )]);
    }
    let sortedScores: IRaceScoreObj[] =  Object.keys(scores).map((key: string) => {
      const score: IRaceScoreObj = scores[key];
      score.key = key;
      return score;
    });
    sortedScores.sort(sortObj('WPM'));
    const sortedScoreElements: JSX.Element[] = [];
    let firstScore = true;
    sortedScores = sortedScores.slice(page * 5 - 5, page * 5);
    for (const score of sortedScores) {
      sortedScoreElements.push(
        this.returnScoreListItem(score, firstScore),
      );
      firstScore = false;
    }
    return sortedScoreElements;
  }

  private returnScoreListItem(score: IRaceScoreObj, first: boolean): JSX.Element {
    const { page } = this.state;
    return(
      <List.Item key={score.key}>
      <List.Content>
       {(first && page === 1) && <Icon name="trophy" color="yellow" />}
        WPM: {score.WPM}  <br />
        Average WPM: {score.averageWPM} <br />
        User Name: {score.userName} <br />
        Done on: {format(score.createdOn, 'dd/MM/yy')}
      </List.Content>
    </List.Item>
    );
  }

  private starRace() {
    const { race } = this.state;
    createRaceStar(race.key);
    race.userStarred = true;
    this.setState({ race });
  }
}

export default ReactRouter.withRouter(Races);
