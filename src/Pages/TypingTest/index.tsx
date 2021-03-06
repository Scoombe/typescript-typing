import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import { Button, Grid, Message } from 'semantic-ui-react';
import { wordsPerMinTest } from 'wpmtest';
import TypingHeader from '../../Components/TypingHeader';
import { IRaceObj } from '../../Core/definitions';
import { createScore, getGlobalRaces, getStarredRaces, getUserRaces } from '../../Core/firebase-functions';
import Finish from './Components/Finish';
import RaceModal from './Components/RaceModal';
import Races from './Components/Races';
import Test from './Components/Test';
import './TypingTest.css';

interface IState {
  finished: boolean;
  error: string;
  message: string;
  loggedIn: boolean;
  raceModalOpen: boolean;
  raceScript: string;
  races: {
    [key: string]: IRaceObj;
  };
  globalRaces: {
    [key: string]: IRaceObj;
  };
  starredRaces: {
    [key: string]: IRaceObj;
  };
  started: boolean;
}

class TypingTest extends React.Component<ReactRouter.RouteComponentProps, IState> {
  public wordsTest: wordsPerMinTest;
  constructor(props: ReactRouter.RouteComponentProps) {
    super(props);
    this.finishedFunc = this.finishedFunc.bind(this);
    this.wordsTest = new wordsPerMinTest(this.finishedFunc, 0.5);
    this.checkKey = this.checkKey.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.changeScript = this.changeScript.bind(this);
    this.createRace = this.createRace.bind(this);
    this.getDisplayText = this.getDisplayText.bind(this);
    this.getGlobalRacesCallback = this.getGlobalRacesCallback.bind(this);
    this.getRacesCallback = this.getRacesCallback.bind(this);
    this.getStarredRacesCallback = this.getStarredRacesCallback.bind(this);
    this.getStats = this.getStats.bind(this);
    this.homeClicked = this.homeClicked.bind(this);
    this.loggedIn = this.loggedIn.bind(this);
    this.openModal = this.openModal.bind(this);
    this.raceClick = this.raceClick.bind(this);
    this.restartTest = this.restartTest.bind(this);
    this.renderFinish = this.renderFinish.bind(this);
    this.renderTest = this.renderTest.bind(this);
    this.startStopWatch = this.startStopWatch.bind(this);
    this.startTest = this.startTest.bind(this);
    this.state = {
      error: '',
      finished: false,
      globalRaces: {},
      loggedIn: false,
      message: '',
      raceModalOpen: false,
      raceScript: '',
      races: {},
      starredRaces: {},
      started: false,
    };
  }

  public componentWillUnmount() {
    this.wordsTest.finishStopWatch();
  }

  public render() {
    const { finished, error, globalRaces, message, raceModalOpen,
      raceScript, races, starredRaces, started } = this.state;
    return (
      <Grid>
        <Grid.Column width={16}>
          <TypingHeader loggedIn={this.loggedIn} page="/" />
        </Grid.Column>
        <Grid.Row centered={true}>
          {!finished && !started && (
            <Grid.Column width={10}>
              {this.renderButton()}
            </Grid.Column>
          )}
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={3} />
          <Grid.Column width={9}>
            {finished && (this.renderFinish())}
            {started && !finished && (this.renderTest())}
            { error
              && (
                <Message negative={true}>
                  <Message.Header> Score update failed </Message.Header>
                  <p>{error}</p>
                </Message>
              )}
            { message
            && (
              <Message>
                <p>{message}</p>
              </Message>
            )}
          </Grid.Column>
          <Grid.Column width={3} />
        </Grid.Row>
        <RaceModal
          modalOpen={raceModalOpen}
          closeModal={this.closeModal}
          newScript={raceScript}
          scriptChange={this.changeScript}
        />
        {!started &&
          (<Races yourRaces={races} globalRaces={globalRaces} starredRaces={starredRaces} onClick={this.raceClick}/>)
        }
      </Grid>
    );
  }

  private loggedIn() {
    this.setState({ loggedIn: true });
    getUserRaces(this.getRacesCallback);
    getGlobalRaces(this.getGlobalRacesCallback);
    getStarredRaces(this.getStarredRacesCallback);
  }

  private getRacesCallback(race: IRaceObj) {
    const { races } = this.state;
    races[race.key] = race;
    this.setState({ races });
  }

  private getGlobalRacesCallback(race: IRaceObj) {
    const { globalRaces } = this.state;
    globalRaces[race.key] = race;
    this.setState({ globalRaces });
  }

  private getStarredRacesCallback (race: IRaceObj) {
    const { starredRaces } = this.state;
    starredRaces[race.key] = race;
    this.setState({ starredRaces });
  }
  private raceClick(raceKey: string) {
    const { history } = this.props;
    history.push({ pathname: '/races', search: `?race=${raceKey}` });
  }

  private finishedFunc() {
    const { wordCount, averageWPM, minutes } = this.wordsTest;
    const score = {
      WPM: wordCount / minutes,
      averageWPM: +averageWPM.toFixed(2),
      createdOn: 0,
      key: '',
      userId: '',
      userName: '',
    };
    createScore(score);
    this.setState({ finished: true });
  }

  private restartTest() {
    this.wordsTest.restartTest();
    this.setState({ finished: false });
  }

  private getDisplayText(errorText?: string): JSX.Element {
    return (
      <div className="displayText">
        <div className={`error ${errorText ? 'show' : ''}`}>
          {
            errorText !== undefined
            && (
              <p className="red">
                {errorText}
              </p>
            )
          }
        </div>
        <p>{this.wordsTest.curDisplayText}</p>
        {this.getStats()}
      </div>
    );
  }

  private getStats(): JSX.Element {
    return (
      <div>
        <ul>
          <li>
            Words typed:
            <strong>{this.wordsTest.wordCount}</strong>
          </li>
          <li>
            Average words per minute
            <small>(last 10 seconds): </small>
            <strong>{this.wordsTest.lastTenAvWPM.toFixed(2)}</strong>
          </li>
          <li>
            Average words per minute
            <small>(total): </small>
            <strong>{this.wordsTest.averageWPM.toFixed(2)}</strong>
          </li>
        </ul>
      </div>
    );
  }

  private checkKey(value: string): { newWord: boolean, isCharCorrect: boolean, errorText?: string } {
    if (this.wordsTest.started) {
      const charCheck = this.wordsTest.checkKeyChar(value);
      return charCheck;
    }
    return { newWord: false, isCharCorrect: true };
  }

  private renderTest(): JSX.Element {
    return (
      <Test
        getDisplayText={this.getDisplayText}
        checkKey={this.checkKey}
        startStopWatch={this.startStopWatch}
      />
    );
  }

  private startStopWatch() {
    this.wordsTest.started = true;
    this.wordsTest.startStopWatch();
  }

  private renderFinish(): JSX.Element {
    const {
      wordCount,
      minutes,
      lastTenAvWPM,
      averageWPM,
    } = this.wordsTest;
    return (
      <Finish
        createRace={this.createRace}
        home={this.homeClicked}
        restart={this.restartTest}
        wordCount={wordCount}
        minutes={minutes}
        wpm={wordCount / minutes}
        lastTenAvWPM={lastTenAvWPM}
        averageWPM={averageWPM}
      />
    );
  }
  private createRace(): void {
    const raceScript = this.wordsTest.completeText.slice(0, this.wordsTest.charPos);
    this.setState({ raceScript }, this.openModal);
  }

  private changeScript(script: string) {
    this.setState({ raceScript: script });
  }

  private homeClicked(): void {
    this.setState({ finished: false, started: false });
  }
  private renderButton(): JSX.Element {
    return(
      <Grid.Row centered={true}>
        <Grid.Column width={3}>
          <Button onClick={this.startTest}>
            Start New Typing Test
          </Button>
          <Button onClick={this.openModal}>
            Create new race
          </Button>
        </Grid.Column>
      </Grid.Row>
    );
  }
  private startTest(): void {
    this.setState({ started: true });
  }
  private openModal() {
    this.setState({ raceModalOpen: true });
  }
  private closeModal() {
    this.setState({ raceModalOpen: false });
  }
}

export default  ReactRouter.withRouter(TypingTest);
