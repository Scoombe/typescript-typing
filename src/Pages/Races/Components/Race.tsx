import * as React from 'react';
import { Button, Grid, Message } from 'semantic-ui-react';
import { wordsPerMinTest } from 'wpmtest';
import Finish from '../../TypingTest/Components/Finish';
import Test from '../../TypingTest/Components/Test';

interface IProps {
  script: string;
}

interface IState {
  error: string;
  message: string;
  finishTime: number;
  finished: boolean;
  started: boolean;
}

class Race extends React.Component<IProps, IState> {
  public wordsTest: wordsPerMinTest;
  constructor (props: IProps) {
    super(props);
    this.wordsTest = new wordsPerMinTest(this.testFinished, 2);
    this.wordsTest.completeText = props.script;
    this.wordsTest.curDisplayText = props.script;
    this.checkKey = this.checkKey.bind(this);
    this.getDisplayText = this.getDisplayText.bind(this);
    this.getStats = this.getStats.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.renderFinish = this.renderFinish.bind(this);
    this.renderTest = this.renderTest.bind(this);
    this.restartTest = this.restartTest.bind(this);
    this.startStopWatch = this.startStopWatch.bind(this);
    this.startTest = this.startTest.bind(this);
    this.testFinished = this.testFinished.bind(this);
    this.state = {
      error: '',
      finishTime: 0,
      finished: false,
      message: '',
      started: true,
    };
  }

  public componentWillUnmount() {
    this.wordsTest.finishStopWatch();
  }

  public render() {
    const { finished, error, message, started } = this.state;
    return (
      <Grid>
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
      </Grid>
    );
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

  private checkKey(value: string): { newWord: boolean, isCharCorrect: boolean, errorText?: string } {
    if (this.wordsTest.started) {
      const charCheck = this.wordsTest.checkKeyChar(value);
      if (charCheck.isCharCorrect && this.wordsTest.charPos === this.wordsTest.completeText.length) {
        this.testFinished();
      }
      return charCheck;
    }
    return { newWord: false, isCharCorrect: true };
  }
  private renderFinish(): JSX.Element {
    const {
      wordCount,
      lastTenAvWPM,
      averageWPM,
    } = this.wordsTest;
    const { finishTime } = this.state;
    const elapsedTime: string =   ((120 - finishTime)  / 60).toFixed(2);
    console.log(elapsedTime);
    return (
      <Finish
        restart={this.restartTest}
        minutes={+elapsedTime}
        wpm={wordCount / +elapsedTime}
        wordCount={wordCount}
        lastTenAvWPM={lastTenAvWPM}
        averageWPM={averageWPM}
      />
    );
  }

  private renderButton(): JSX.Element {
    return(
      <Grid.Row centered={true}>
        <Grid.Column width={3}>
          <Button onClick={this.startTest}>
            Start New Typing Test
          </Button>
        </Grid.Column>
      </Grid.Row>
    );
  }

  private startTest(): void {
    this.setState({ started: true });
  }

  private restartTest() {
    const { script } = this.props;
    this.wordsTest.restartTest();
    this.wordsTest.completeText = script;
    this.wordsTest.curDisplayText = script;
    this.setState({ finished: false });
  }

  private testFinished() {
    this.setState({ finishTime: (this.wordsTest.stopwatch.ms / 1000) });
    this.wordsTest.finishStopWatch();
    this.wordsTest.started = false;
    this.setState({ finished: true });
  }
}

export default Race;
