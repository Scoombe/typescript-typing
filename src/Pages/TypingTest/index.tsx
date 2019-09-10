import * as React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import {} from 'wpmtest';
import { createScore } from '../../Core/firebase-functions';


interface IState {
  finished: boolean;
  error: string;
  message: string;
}

class TypingTest extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.wordsTest = 
    this.state = {
      error: '',
      finished: false,
      message: '',
    };
  }

  public render() {
    const { finished, error, message } = this.state;
    return (
      <Grid>
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

  private renderTest(): JSX.Element {
    return (
      <Test
        getDisplayText={this.getDisplayText}
        checkKey={this.checkKey}
        startStopWatch={this.startStopWatch}
      />
    );
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
