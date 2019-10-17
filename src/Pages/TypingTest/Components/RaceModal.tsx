import * as React from 'react';
import { Button, Form, Input, Message, Modal } from 'semantic-ui-react';
import { IRaceObj } from '../../../Core/definitions';
import { createRace } from '../../../Core/firebase-functions';

interface IProps {
  closeModal: () => void;
  modalOpen: boolean;
  newScript: string;
  scriptChange: (script: string) => void;
}

interface IState {
  modalRace: IRaceObj;
  scriptError: string;
  titleError: string;
}

const emptyRace: IRaceObj = {
  createdOn: 0,
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
    this.closeModal = this.closeModal.bind(this);
    this.createRace = this.createRace.bind(this);
    this.titleChange = this.titleChange.bind(this);
    this.scriptChange = this.scriptChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    const modalRace  = Object.create(emptyRace);
    modalRace.script = props.newScript;
    this.state = {
      modalRace,
      scriptError: '',
      titleError: '',
    };
  }

  public render() {
    const { modalOpen, newScript } = this.props;
    const { titleError, modalRace, scriptError } = this.state;
    return(
      <Modal open={modalOpen}>
        <Modal.Header>
          Create New Race
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>
                Race title
              </label>
              {titleError !== '' && <Message negative={true}>
                {titleError}
              </Message>}
              <Input
                placeholder="Race Title"
                onChange={this.titleChange}
                value={modalRace.title}
              />
            </Form.Field>
            <Form.Field>
              <label>
                Race script
              </label>
              {scriptError !== '' && <Message negative={true}>
                {scriptError}
              </Message>}
              <Input
                placeholder="Race script"
                onChange={this.scriptChange}
                value={newScript}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.createRace}>
            Create Race
          </Button>
          <Button negative={true} onClick={this.closeModal}>
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
    this.validateForm();
  }

  private scriptChange(e: {target: {value: string}}) {
    const { scriptChange } = this.props;
    scriptChange(e.target.value);
    this.validateForm();
  }

  private createRace() {
    const { closeModal, newScript } = this.props;
    const { modalRace } = this.state;
    modalRace.script = newScript;
    if (this.validateForm) {
      createRace(modalRace);
      this.setState({ modalRace: Object.create(emptyRace) });
      closeModal();
    }
  }

  private closeModal() {
    const { closeModal } = this.props;
    this.setState({ modalRace: Object.create(emptyRace) });
    closeModal();
  }

  private validateForm(): boolean {
    const { modalRace } = this.state;
    const { newScript } = this.props;
    let { scriptError, titleError } = this.state;
    let error: boolean = false;
    if (modalRace.title.length > 0 && modalRace.title.length < 100) {
      titleError = '';
    } else {
      titleError = 'Title can\'t be empty and under 100 chars';
      error = false;
    }
    if (newScript.length > 20 && newScript.length < 1000) {
      scriptError = '';
    } else {
      scriptError = 'Script must be over 20 chars and be under 1000 chars';
      error = false;
    }
    this.setState({ scriptError, titleError });
    return error;
  }
}

export default RaceModal;
