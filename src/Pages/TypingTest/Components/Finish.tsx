import * as React from 'react';

interface IProps {
  averageWPM: number;
  lastTenAvWPM: number;
  minutes: number;
  restart: () => void;
  wordCount: number;
  wpm: number;
}

class Finish extends React.Component <IProps>  {
  public render() {
    const {
      restart, wordCount, minutes, wpm, lastTenAvWPM, averageWPM,
    } = this.props;
    return (
      <div className="typingTest">
        <h3>You have Finished!</h3>
        <ul>
          <li>
            <p>Words typed: <strong>{wordCount} </strong>
              in <strong>{minutes}</strong> minutes
            </p>
          </li>
          <li>
            Your WPM: <strong>{wpm}</strong>
          </li>
          <li>
            Average words per minute
            <small>(last 10 seconds): </small>
            <strong>{lastTenAvWPM.toFixed(2)}</strong>
          </li>
          <li>
            Average words per minute
            <small>(total): </small>
            <strong>{averageWPM.toFixed(2)}</strong>
          </li>
        </ul>
        <button type="button" className="retry" onClick={restart}>Retry</button>
      </div>
    );
  }
}

export default Finish;
