import * as React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import { wordsPerMinTest } from 'wpmtest/src/wordsPerMinTest';
import Header from '../../Components/Header';
import { createScore } from '../../Core/firebase-functions';
import Finish from './Components/Finish';
import Test from './Components/Test';

interface IState {
  finished: boolean;
  error: string;
  message: string;
  loggedIn: boolean;
}

class TypingTest extends React.Component<{}, IState> {
  private wordsTest: wordsPerMinTest ;
  constructor(props: {}) {
    super(props);
    this.wordsTest = new wordsPerMinTest(this.finishedFunc, 0.5);
    this.checkKey = this.checkKey.bind(this);
    this.getDisplayText = this.getDisplayText.bind(this);
    this.getStats = this.getStats.bind(this);
    this.finishedFunc = this.finishedFunc.bind(this);
    this.loggedIn = this.loggedIn.bind(this);
    this.restartTest = this.restartTest.bind(this);
    this.renderFinish = this.renderFinish.bind(this);
    this.renderTest = this.renderTest.bind(this);
    this.state = {
      error: '',
      finished: false,
      loggedIn: false,
      message: '',
    };
  }

  public componentWillUnmount() {
    this.wordsTest.finishStopWatch();
  }

  public render() {
    const { finished, error, message } = this.state;
    return (
      <Grid>
        <Header loggedIn={this.loggedIn} page="/" />
        <Grid.Column width={3} />
        <Grid.Column width={9}>
          {finished ? (this.renderFinish()) : (this.renderTest())}
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
      </Grid>
    );
  }

  private loggedIn() {
    this.setState({ loggedIn: true });
  }

  private finishedFunc() {
    const { wordCount, averageWPM, minutes } = this.wordsTest;
    const score = {
      WPM: wordCount / minutes,
      averageWPM: +averageWPM.toFixed(2),
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
        restart={this.restartTest}
        wordCount={wordCount}
        minutes={minutes}
        wpm={wordCount / minutes}
        lastTenAvWPM={lastTenAvWPM}
        averageWPM={averageWPM}
      />
    );
  }
}

export default TypingTest;
