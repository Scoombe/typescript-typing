import * as React from 'react';
import {
    Grid, Header, Icon, List,
} from 'semantic-ui-react';
import TypingHeader from '../../Components/TypingHeader';
import { IScoreObj } from '../../Core/definitions';
import { getUserScores } from '../../Core/firebase-functions';
import { sortObj } from '../../Core/sort-functions';

interface IState {
  scores: {
    [key: string]: IScoreObj;
  };
}

class ScoresPage extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      scores: {},
    };
    this.loggedIn = this.loggedIn.bind(this);
    this.getUserScoresCallback = this.getUserScoresCallback.bind(this);
    this.userScoreElements = this.userScoreElements.bind(this);
    this.sortedUserScoreElements = this.sortedUserScoreElements.bind(this);
    this.returnScoreListItem = this.returnScoreListItem.bind(this);
  }
  public render() {
    return(
      <Grid>
        <Grid.Column width={16} >
          <TypingHeader page="scores" loggedIn={this.loggedIn}/>
        </Grid.Column>
        <Grid.Row centered={true}>
          <Grid.Column width="4">
            <Header as="h2" icon={true} textAlign="center">
              <Icon name="user" circular={true} />
              <Header.Content>User Scores</Header.Content>
            </Header>
            <List size="large" celled={true}>
              {
                this.userScoreElements()
              }
            </List>
          </Grid.Column>
          <Grid.Column width="4">
            <Header as="h2" icon={true} textAlign="center">
              <Icon name="user" circular={true} />
              <Header.Content>Best User Scores</Header.Content>
            </Header>
            <List size="large" celled={true}>
              {
                this.sortedUserScoreElements()
              }
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  private loggedIn() {
    getUserScores(this.getUserScoresCallback);
  }

  private getUserScoresCallback(score: IScoreObj) {
    const { scores } = this.state;
    scores[score.key] = score;
    this.setState({ scores });
  }

  private userScoreElements(): JSX.Element[] {
    const { scores } = this.state;
    return Object.keys(scores).map((key: string) => {
      return this.returnScoreListItem(scores[key], false);
    });
  }

  private sortedUserScoreElements(): JSX.Element[] {
    const { scores } = this.state;
    const sortedScores: IScoreObj[] =  Object.keys(scores).map((key: string) => {
      return scores[key];
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

  private returnScoreListItem(score: IScoreObj, first: boolean): JSX.Element {
    return(
      <List.Item key={score.key}>
      <List.Content>
       {first && <Icon name="trophy" color="yellow" />}
        WPM: {score.WPM}  <br />
        Average WPM: {score.averageWPM}
      </List.Content>
    </List.Item>
    );
  }
}

export default ScoresPage;
