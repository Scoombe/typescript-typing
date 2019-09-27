import * as React from 'react';
import { Button, Form, Input, Message, Modal } from 'semantic-ui-react';
import { IRaceObj } from '../../../Core/definitions';

interface IProps {
  closeModal: () => void;
  modalOpen: boolean;
}

interface IState {
  modalRace: IRaceObj;
  titleError: string;
  wordsError: string;
}

const emptyRace: IRaceObj = {
  key: '',
  scores: {},
  script: '',
  stars: {},
  title: '',
  userId: '',
};

class RaceModal extends React.Component <IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      modalRace: Object.create(emptyRace),
      titleError: '',
      wordsError: '',
    };
  }
  public render() {
    const { closeModal, modalOpen } = this.props;
    const { titleError, modalRace } = this.state;
    return(
      <Modal open={modalOpen}>
        <Modal.Header>
          Create New Race
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              {titleError !== '' && <Message negative={true}>
                {titleError}
              </Message>}
              <label>
                Race title
              </label>
              <Input
                placeholder="Race Title"
                onChange={this.titleChange}
                value={modalRace.title}
              />
            </Form.Field>
            <Form.Field>
              {titleError !== '' && <Message negative={true}>
                {titleError}
              </Message>}
              <label>
                Race script
              </label>
              <Input
                placeholder="Race script"
                onChange={this.wordsChange}
                value={modalRace.script}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.createRace}>
            Create Race
          </Button>
          <Button negative={true} onClick={closeModal}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default RaceModal;
