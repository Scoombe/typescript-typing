import * as React from 'react';

interface IProps {
  getDisplayText: (errorText?: string) => JSX.Element;
  checkKey: (key: string) => { newWord: boolean, isCharCorrect: boolean, errorText?: string };
  startStopWatch: () => void;
  wordText?: string;
}

interface IState {
  displayString: JSX.Element;
}

class Test extends React.Component <IProps, IState> {
  private mounted: boolean;
  constructor (props: IProps) {
    super(props);
    const { getDisplayText } = this.props;
    this.mounted = false;
    this.countdown = this.countdown.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.setDisplayText = this.setDisplayText.bind(this);
    this.state = {
      displayString: getDisplayText(),
    };
  }
  public componentDidMount() {
    this.mounted = true;
    document.addEventListener('keydown', this.onInputChange, false);
    this.countdown();
  }

  public componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener('keydown', this.onInputChange, false);
  }

  public  render() {
    const { displayString } = this.state;
    return (
      <div className="typingTest">
        {displayString}
      </div>
    );
  }

  private  countdown() {
    const { startStopWatch } = this.props;
    this.setDisplayText('3');
    setTimeout(
      () => {
        this.setDisplayText('2');
      },
      1000);
    setTimeout(
      () => {
        this.setDisplayText('1');
      },
      2000);
    setTimeout(
      () => {
        this.setDisplayText('Type!');
        startStopWatch();
      },
      3000);
  }

  private onInputChange(event: {key: string}): void {
    const { checkKey } = this.props;
    const keyCheck = checkKey(event.key);
    if (keyCheck !== null) {
      if (keyCheck.isCharCorrect === true) {
        this.setDisplayText();
      } else {
        this.setDisplayText(keyCheck.errorText);
      }
    }
  }

  private setDisplayText(errorText?: string) {
    if (this.mounted) {
      const { getDisplayText } = this.props;
      const displayText = getDisplayText(errorText);
      this.setState({ displayString: displayText });
    }
  }
}

export default Test;
