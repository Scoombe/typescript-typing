import * as React from 'react';
import { Button, Form, Input, Message, Modal } from 'semantic-ui-react';
import { IRaceObj } from '../../../Core/definitions';
import { createRace } from '../../../Core/firebase-functions';

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
    this.createRace = this.createRace.bind(this);
    this.titleChange = this.titleChange.bind(this);
    this.scriptChange = this.scriptChange.bind(this);
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
                onChange={this.scriptChange}
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
  private titleChange(e: {target: {value: string}}) {
    const { modalRace } = this.state;
    modalRace.title = e.target.value;
    this.setState({ modalRace });
  }

  private scriptChange(e: {target: {value: string}}) {
    const { modalRace } = this.state;
    modalRace.script = e.target.value;
    this.setState({ modalRace });
    this.validateForm();
  }

  private createRace() {
    const { closeModal } = this.props;
    const { modalRace } = this.state;
    if (this.validateForm) {
      createRace(modalRace);
      this.setState({ modalRace: Object.create(emptyRace) });
      closeModal();
    }
  }

  private validateForm(): boolean {
    return false;
  }
}

export default RaceModal;
