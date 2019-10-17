import * as React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { IRaceObj } from '../../../Core/definitions';
import { sortObj } from '../../../Core/sort-functions';

interface IProps {
  yourRaces: {
    [key: string]: IRaceObj;
  };
  globalRaces: {
    [key: string]: IRaceObj;
  };
  onClick: (key: string) => void;
}

class Races extends React.Component <IProps> {
  constructor (props: IProps) {
    super(props);
    this.globalRaceElements = this.globalRaceElements.bind(this);
    this.raceClicked = this.raceClicked.bind(this);
    this.raceElements = this.raceElements.bind(this);
    this.returnScoreListItem = this.returnScoreListItem.bind(this);
    this.returnGlobalScoreListItem = this.returnGlobalScoreListItem.bind(this);
  }
  public render() {
    return(
      <React.Fragment>
        <Grid.Row centered={true} columns={2}>
          <Grid.Column width="12">
            <Header as="h2" icon={true} textAlign="center">
              <Header.Content>Your Races</Header.Content>
            </Header>
            <Segment.Group>
              {
                this.raceElements()
              }
            </Segment.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered={true} columns={2}>
          <Grid.Column width="12">
            <Header as="h2" icon={true} textAlign="center">
              <Header.Content>Global Races</Header.Content>
            </Header>
            <Segment.Group>
              {
                this.globalRaceElements()
              }
            </Segment.Group>
          </Grid.Column>
        </Grid.Row>
      </React.Fragment>
    );
  }

  private raceElements(): JSX.Element[] {
    const { yourRaces } = this.props;
    const raceElements: JSX.Element[] = [];
    for (const key of Object.keys(yourRaces)) {
      raceElements.push(this.returnScoreListItem(yourRaces[key]));
    }
    return raceElements;
  }

  private globalRaceElements(): JSX.Element[] {
    const { globalRaces } = this.props;
    const raceElements: JSX.Element[] = [];
    const sortedRaces: IRaceObj[] = Object.keys(globalRaces).map((key: string) => {
      return globalRaces[key];
    });
    sortedRaces.sort(sortObj('stars'));
    for (const key of Object.keys(globalRaces)) {
      raceElements.push(this.returnGlobalScoreListItem(globalRaces[key]));
    }
    return raceElements;
  }

  private returnScoreListItem(race: IRaceObj): JSX.Element {
    return(
      <Segment key={race.key} data-key={race.key} onClick={this.raceClicked}>
        {race.title}
      </Segment>
    );
  }

  private returnGlobalScoreListItem(race: IRaceObj): JSX.Element {
    return(
      <Segment key={race.key} data-key={race.key} onClick={this.raceClicked}>
        {race.title} by {race.userName}
      </Segment>
    );
  }

  private raceClicked(e: {currentTarget: {dataset: {key: string}}}) {
    const { onClick } = this.props;
    onClick(e.currentTarget.dataset.key);
  }
}

export default Races;
