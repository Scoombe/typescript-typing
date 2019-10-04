import * as React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { IRaceObj } from '../../../Core/definitions';

interface IProps {
  races: {
    [key: string]: IRaceObj;
  };
  onClick: (key: string) => void;
}

class Races extends React.Component <IProps> {
  constructor (props: IProps) {
    super(props);
    this.raceClicked = this.raceClicked.bind(this);
    this.raceElements = this.raceElements.bind(this);
    this.returnScoreListItem = this.returnScoreListItem.bind(this);
  }
  public render() {
    return(
      <Grid.Row centered={true} columns={2}>
        <Grid.Column width="12">
          <Header as="h2" icon={true} textAlign="center">
            <Header.Content>Races</Header.Content>
          </Header>
          <Segment.Group>
            {
              this.raceElements()
            }
          </Segment.Group>
        </Grid.Column>
      </Grid.Row>
    );
  }

  private raceElements(): JSX.Element[] {
    const { races } = this.props;
    const raceElements: JSX.Element[] = [];
    for (const key of Object.keys(races)) {
      raceElements.push(this.returnScoreListItem(races[key]));
    }
    return raceElements;
  }

  private returnScoreListItem(race: IRaceObj): JSX.Element {
    return(
      <Segment key={race.key} data-key={race.key} onClick={this.raceClicked}>
        {race.title}>
      </Segment>
    );
  }

  private raceClicked(e: {currentTarget: {dataset: {key: string}}}) {
    const { onClick } = this.props;
    onClick(e.currentTarget.dataset.key);
  }
}

export default Races;
