import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Grid, Input, Message } from 'semantic-ui-react';
import Header from '../../Components/Header';
import { createUser, signIn } from '../../Core/firebase-functions';

interface IState  {
  error: string;
}

interface IProps extends RouteComponentProps<any> {

}

interface IFormTarget extends EventTarget {
  email: {value: string};
  password: {value: string};
}

interface IFormSubmit<HTMLFormElement> extends React.FormEvent<HTMLFormElement> {
  target: IFormTarget;
}

class LoginPage extends React.Component <IProps, IState> {
  private signUp: boolean;
  constructor(props: IProps) {
    super(props);
    this.state = {
      error: '',
    };
    this.signUp = false;
    this.loggedIn = this.loggedIn.bind(this);
    this.onSignup = this.onSignup.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.signinCallback = this.signinCallback.bind(this);
    this.createUserCallback = this.createUserCallback.bind(this);
  }

  public render() {
    const { error } = this.state;
    this.signUp = this.props.location.pathname === '/signup';
    const buttonText = this.signUp ? 'Sign up' : 'Log in';
    const errorHeader = `${buttonText} error!`;
    return (
      <div>
        <Header page={'/login'} loggedIn={this.loggedIn}/>
        <Grid centered={true}>
          <Grid.Row />
          <Grid.Column computer={4} mobile={14}>
            <Form onSubmit={this.onSubmit} error={true}>
              { error && (
                <Message
                  error={true}
                  header={errorHeader}
                  content={error}
                />
              )}
               {this.signUp && <Form.Field control={Input} label="Username" name="username" placeholder="Username" />}
              <Form.Field control={Input} label="Email" name="email" placeholder="Email" />
              <Form.Field
                control={Input}
                type="password"
                name="password"
                label="Password"
                autoComplete="login-password"
                placeholder="Password"
              />
              <Form.Group inline={true}>
                <Form.Field control={Button}>{buttonText}</Form.Field>
                { !this.signUp
                  && (
                    <Form.Field
                      control={Button}
                      onClick={this.onSignup}
                    > Create Account
                    </Form.Field>
                  )
                }
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
  private loggedIn(): void {
    if (this.signUp) {
      this.signUp = true;
    }
  }

  private onSubmit(event: React.FormEvent<HTMLFormElement>): void {
    if (this.signUp) {
      createUser(
        {
          email: event.currentTarget.email.value.trim(),
          password: event.currentTarget.password.value.trim(),
          username: event.currentTarget.username.value.trim(),
        },
        this.createUserCallback,
      );
    } else {
      signIn(event.currentTarget.email.value.trim(), event.currentTarget.password.value.trim(), this.signinCallback);
    }
  }

  private onSignup(e: HTMLFormElement) {
    e.preventDefault();
    const { history } = this.props;
    this.signUp = true;
    history.push('/signup');
  }

  private createUserCallback(error: {message: string, error: boolean}) {
    if (error.error) {
      this.setState({ error: error.message });
    }
  }

  private signinCallback(error: {message: string, error: boolean}) {
    const { history } = this.props;
    if (error.error) {
      this.setState({ error: error.message });
    } else {
      history.push('/');
    }
  }
}

export default LoginPage;
