import * as React from 'react';
import { Grid, Header, Icon, Pagination, PaginationProps, Segment } from 'semantic-ui-react';
import { IRaceObj } from '../../../Core/definitions';
import { sortObj } from '../../../Core/sort-functions';

interface IProps {
  yourRaces: {
    [key: string]: IRaceObj;
  };
  globalRaces: {
    [key: string]: IRaceObj;
  };
  starredRaces: {
    [key: string]: IRaceObj;
  };
  onClick: (key: string) => void;
}

interface IState {
  globalRacesPage: number;
  starredRacesPage: number;
  yourRacesPage: number;
}

const noOfRacesPerPage = 10;

class Races extends React.Component <IProps, IState> {
  constructor (props: IProps) {
    super(props);
    this.globalRaceElements = this.globalRaceElements.bind(this);
    this.raceClicked = this.raceClicked.bind(this);
    this.raceElements = this.raceElements.bind(this);
    this.returnScoreListItem = this.returnScoreListItem.bind(this);
    this.returnGlobalScoreListItem = this.returnGlobalScoreListItem.bind(this);
    this.starredRaceElements = this.starredRaceElements.bind(this);
    this.changeGlobalPages = this.changeGlobalPages.bind(this);
    this.changeStarredPages = this.changeStarredPages.bind(this);
    this.changeYourPages = this.changeYourPages.bind(this);
    this.state = {
      globalRacesPage: 1,
      starredRacesPage: 1,
      yourRacesPage: 1,
    };
  }
  public render() {
    const { yourRaces, starredRaces, globalRaces } = this.props;
    const { globalRacesPage, starredRacesPage, yourRacesPage } = this.state;
    const yourRacesLength = Object.keys(yourRaces).length;
    const starredRacesLength = Object.keys(starredRaces).length;
    const globalRacesLength = Object.keys(globalRaces).length;
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
            { yourRacesLength > noOfRacesPerPage &&
              <Pagination
                totalPages={Math.ceil(yourRacesLength / noOfRacesPerPage)}
                activePage={yourRacesPage}
                onPageChange={this.changeYourPages}
              />
            }
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered={true} columns={2}>
          <Grid.Column width="12">
            <Header as="h2" icon={true} textAlign="center">
              <Header.Content>Starred Races</Header.Content>
            </Header>
            <Segment.Group>
              {
                this.starredRaceElements()
              }
            </Segment.Group>
            { starredRacesLength > noOfRacesPerPage &&
              <Pagination
                totalPages={Math.ceil(starredRacesLength / noOfRacesPerPage)}
                activePage={starredRacesPage}
                onPageChange={this.changeStarredPages}
              />
            }
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
            { globalRacesLength > noOfRacesPerPage &&
              <Pagination
                totalPages={Math.ceil(globalRacesLength / noOfRacesPerPage)}
                activePage={globalRacesPage}
                onPageChange={this.changeGlobalPages}
              />
            }
          </Grid.Column>
        </Grid.Row>
      </React.Fragment>
    );
  }

  private changeGlobalPages(event: React.MouseEvent, data: PaginationProps) {
    if (data.activePage) {
      this.setState({ globalRacesPage: +data.activePage });
    }
  }

  private changeStarredPages(event: React.MouseEvent, data: PaginationProps) {
    if (data.activePage) {
      this.setState({ starredRacesPage: +data.activePage });
    }
  }

  private changeYourPages(event: React.MouseEvent, data: PaginationProps) {
    if (data.activePage) {
      this.setState({ yourRacesPage: +data.activePage });
    }
  }

  private raceElements(): JSX.Element[] {
    const { yourRaces } = this.props;
    const { yourRacesPage } = this.state;
    let raceElements: JSX.Element[] = [];
    for (const key of Object.keys(yourRaces)) {
      raceElements.push(this.returnScoreListItem(yourRaces[key]));
    }
    raceElements = raceElements.reverse();
    raceElements = raceElements.slice(noOfRacesPerPage * (yourRacesPage - 1), yourRacesPage * noOfRacesPerPage);
    return raceElements;
  }

  private globalRaceElements(): JSX.Element[] {
    const { globalRaces } = this.props;
    const { globalRacesPage } = this.state;
    const raceElements: JSX.Element[] = [];
    let sortedRaces: IRaceObj[] = Object.keys(globalRaces).map((key: string) => {
      return globalRaces[key];
    });
    sortedRaces.sort(sortObj('stars'));
    sortedRaces = sortedRaces.slice(noOfRacesPerPage * (globalRacesPage - 1), noOfRacesPerPage * globalRacesPage);
    for (const race of sortedRaces) {
      raceElements.push(this.returnGlobalScoreListItem(globalRaces[race.key]));
    }
    return raceElements;
  }

  private starredRaceElements(): JSX.Element[] {
    const { starredRaces } = this.props;
    const { starredRacesPage } = this.state;
    const raceElements: JSX.Element[] = [];
    let sortedRaces: IRaceObj[] = Object.keys(starredRaces).map((key: string) => {
      return starredRaces[key];
    });
    sortedRaces.sort(sortObj('stars'));
    sortedRaces = sortedRaces.slice(noOfRacesPerPage * (starredRacesPage - 1), noOfRacesPerPage * starredRacesPage);
    for (const race of sortedRaces) {
      raceElements.push(this.returnGlobalScoreListItem(starredRaces[race.key]));
    }
    return raceElements;
  }

  private returnScoreListItem(race: IRaceObj): JSX.Element {
    return(
      <Segment key={race.key} data-key={race.key} onClick={this.raceClicked}>
        {race.title}<br/>
        {race.stars} <Icon name="star" color="yellow"/>
      </Segment>
    );
  }

  private returnGlobalScoreListItem(race: IRaceObj): JSX.Element {
    return(
      <Segment key={race.key} data-key={race.key} onClick={this.raceClicked}>
        {race.title} <br/>
        by <b>{race.userName}</b><br/>
        {race.stars} <Icon name="star" color="yellow"/>
      </Segment>
    );
  }

  private raceClicked(e: {currentTarget: {dataset: {key: string}}}) {
    const { onClick } = this.props;
    onClick(e.currentTarget.dataset.key);
  }
}

export default Races;
