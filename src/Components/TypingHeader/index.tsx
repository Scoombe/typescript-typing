import * as firebase from 'firebase';
import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import {
  Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import { firebaseAuth as Auth } from '../../config/fire';
import { IUserNameObj } from '../../Core/definitions';
import { getUsername, signOut } from '../../Core/firebase-functions';
import './TypingHeader.css';

interface IProps extends ReactRouter.RouteComponentProps {
  loggedIn: () => void;
  page: string;
}

interface IState {
  loggedIn: boolean;
  userName: string;
}

class TypingHeader extends React.Component <IProps, IState> {
  private fireBaseListener: firebase.Unsubscribe;
  constructor(props: IProps) {
    super(props);
    this.state = { loggedIn: false, userName: '' };
    this.navigatePage = this.navigatePage.bind(this);
    this.headerAuthListener = this.headerAuthListener.bind(this);
    this.fireBaseListener = this.onTokenChanged();
    this.updateUserName = this.updateUserName.bind(this);
  }

  public componentDidMount() {
    this.headerAuthListener();
  }

  public componentWillUnmount() {
    this.fireBaseListener();
  }
  public render() {
    const { loggedIn, userName } = this.state;
    const loggedInHeading = loggedIn !== null ? `hello ${userName}` : 'Log in!';
    const loggedInSubHeading = loggedIn !== null ? 'Logout!' : 'Login to save your scores ';
    return (
      <div className="typingHeader">
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column data-page="/" onClick={this.navigatePage}>
              <Segment inverted={true} color="yellow">
                <Header as="h2" icon={true}>
                  <Icon name="play" />
                  {'Typing Test'}
                  <Header.Subheader> start a test</Header.Subheader>
                </Header>
              </Segment>
            </Grid.Column>
            <Grid.Column data-page="/login" onClick={this.navigatePage}>
              <Segment inverted={true} color="blue">
                <Header as="h2" icon={true}>
                  <Icon name="user" />
                  {loggedInHeading}
                  <Header.Subheader>
                    {loggedInSubHeading}
                  </Header.Subheader>
                </Header>
              </Segment>
            </Grid.Column>
            <Grid.Column data-page="/scores" onClick={this.navigatePage}>
              <Segment inverted={true} color="green">
                <Header as="h2" icon={true}>
                  <Icon name="trophy" />
                  {'Scores'}
                  <Header.Subheader> Your high scores </Header.Subheader>
                </Header>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
  private navigatePage(e: any) {
    const page = e.currentTarget.dataset.page;
    const { history } = this.props;
    history.push(`${page}`);
  }

  private headerAuthListener(): void {
    this.fireBaseListener = this.onTokenChanged();
  }

  private onTokenChanged(): firebase.Unsubscribe {
    const auth =  Auth.onIdTokenChanged((user: any) => {
      const { history, page, loggedIn } = this.props;
      if (user !== null) {
        loggedIn();
        getUsername(this.updateUserName);
        this.setState({ loggedIn: true });
        history.push(`${page}`);
      } else if (user === null) {
        this.setState({ loggedIn: false });
        history.push('/login');
      }
    });
    return auth;
  }

  private updateUserName(usernameObj: IUserNameObj) {
    this.setState({ userName: usernameObj.username });
  }

  private logOut(e: any) {
    const { history } = this.props;
    signOut();
    history.push('/');
  }
}

export default  ReactRouter.withRouter(TypingHeader);
