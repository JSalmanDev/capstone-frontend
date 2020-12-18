import React from 'react';
import { Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import Aux from "../../hoc/_Aux";
import 'react-table/react-table.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../App/layout/Loader';
import axios from 'axios';
import config from '../../config';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/userActions';
import qs, { parse } from 'query-string';
import moment from 'moment';

class Answers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
			isValid: {
                value: false,
                text: '',
                name: ''   
            },
            answer: '',
            data: {},
            project: null,
            question: null,
            showModal: false,
			handleCloseModal: false,
        }
    }

    componentDidMount = async () => {
        if (this.props.location.search) {
            let parsed = qs.parse(this.props.location.search);
            if (parsed.project && parsed.question) {
                await this.setState({ project: parsed.project, question: parsed.question });
                this.getQuestionAnswers();
            }
        }
    }

    componentDidUpdate = async (prevProps) => { 

        if (this.props.location.search) {
            let parsed = qs.parse(this.props.location.search);
            if (parsed.project != this.state.project && parsed.question != this.state.question) {
                await this.setState({ project: parsed.project, question: parsed.question });
                this.getQuestionAnswers();
            }
        }
    }

    handleTextChange(e) {
        this.setState({ [e.name]: e.value });
    }
    
    answerQuestion(e) {
        e.preventDefault();
		this.setState({ showModal: true });
    }
    
	closeDeleteModal() {
		this.setState({ showModal: false });
    }

    handleAnswer() {

        let { answer, question } = this.state;

        if (!answer && answer.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid answer', name: 'answer' } });
            return;
        }

        this.setState({ isLoading: true, showModal: false });
        axios.post(`${config.prod}/api/answer/create`, { answer: answer.trim(), user_id: this.props.user.id, question_id: question })
            .then(res => {
                this.setState({ answer: '', isValid: { value: false, text: '', name: '' }});
                this.createNotification('success', 'Answer Created Successfully');
                this.getQuestionAnswers();
            })
            .catch(err => {
                console.log('Error: ', err);
                if (err.response && err.response.status && (err.response.status === 400 || err.response.status === 500)) {
                    this.setState({ isLoading: false, showModal: true, isValid: { value: true, text: err.response.data.msg, name: 'server_error_answer' } });
                    this.createNotification('error', err.response.data.msg);
                } else {
                    this.setState({ isLoading: false, showModal: true, isValid: { value: true, text: 'Unknown Error', name: 'server_error_answer' } });
                    this.createNotification('error', 'Unknown Error');
                }
            });
    }

    getQuestionAnswers() {
        this.setState({ isLoading: true });
        axios.get(`${config.prod}/api/category/${this.state.project}/question/find/${this.state.question}`)
            .then(res => {
                this.setState({ data: res.data.data, isLoading: false, isValid: { value: false, text: '', name: '' }});
            })
            .catch(err => {
                console.log('Error: ', err);
                this.setState({ isLoading: false, isValid: { value: true, text: 'Internal Server Error. Try again by Reload.', name: 'server_error' } });
                this.createNotification('error', 'Internal Server Error');
            });
    }

    createNotification = (type, value) => {
        switch (type) {
            case 'info':
                NotificationManager.info(value,'', 5000);
                break;
            case 'success':
                NotificationManager.success(value, '', 5000);
                break;
            case 'warning':
                NotificationManager.warning(value, '', 5000);
                break;
            case 'error':
                NotificationManager.error(value, '', 5000);
                break;
            default: break;
        }
    };

    render() {
        return (
            <Aux>
                { this.state.isLoading && <Loader /> }
                {this.state.showModal && 
					<Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                        <Modal.Header closeButton>
                            <Modal.Title>Answer Question</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col>
                                    <Form>
                                        <Form.Row>
                                            <Col>
                                                <Form.Text>
                                                    { Object.keys(this.state.data).length && this.state.data.question }
                                                </Form.Text>
                                            </Col>
                                        </Form.Row>
                                        <Form.Row>
                                            <Col>
                                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                                    <Form.Label>Enter Your Answer</Form.Label>
                                                    <Form.Control 
                                                        as="textarea" 
                                                        name='answer'
                                                        rows={4}
                                                        value={this.state.answer}
                                                        className={this.state.isValid.value && this.state.isValid.name === 'answer' ? 'in-valid-input' : ''}
                                                        onFocus={() => this.setState({ isValid: { value: false, text: ''}})}
                                                        onChange={(e) => this.handleTextChange(e.target) }
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                        <Form.Row>
                                            {
                                                this.state.isValid.value ?
                                                <Form.Text style={{ color: 'red' }}>
                                                    { this.state.isValid.text }
                                                </Form.Text> : ''
                                            }
                                        </Form.Row>
                                    </Form>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => this.handleAnswer()}>
                                Submit
                            </Button>
                            <Button variant="secondary" onClick={() => this.closeDeleteModal()}>
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>
				}
				<Row>
                    <NotificationContainer/>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        { !this.state.isLoading && this.state.isValid.value && this.state.isValid.name == 'server_error' ? 
                                            <h5 className="text-center" style={{ color: 'red' }}>{this.state.isValid.text}</h5>
                                            :
                                            <>
                                                <fieldset disabled={this.state.isLoading} className={this.state.isLoading ? 'opacity-5' : ''}>
                                                    {   Object.keys(this.state.data).length ?
                                                            <>
                                                                <Row style={{ paddingBottom: 10 }}>
                                                                    <Col xs={10}>
                                                                        <Row>
                                                                            <Col> { this.state.data.question } </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col><p><b>Submitted By:</b> {this.state.data.user.email}</p></Col>
                                                                            <Col>{moment(this.state.data.created_at).format('DD/MM/YYYY hh:mm A')}</Col>                                                                               
                                                                        </Row>
                                                                    </Col>
                                                                    <Col xs={2}>
                                                                        <Button variant="primary" onClick={(e) => this.answerQuestion(e)}>Answer</Button>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col xs={12}>
                                                                        <h4><b>Answers</b></h4>
                                                                    </Col>
                                                                </Row>
                                                            </>
                                                        : null
                                                    }
                                                    {
                                                        Object.keys(this.state.data).length && this.state.data.answers.map(elem => (
                                                            <Card key={elem.id}>
                                                                <Card.Body>
                                                                    <Row>
                                                                        <Col xs={12}>
                                                                            <Row>
                                                                                <Col xs={12}><p><b>By: {elem.user.email} </b> ({moment(elem.created_at).format('DD/MM/YYYY hh:mm A')})</p></Col>
                                                                                <Col xs={12}> { elem.answer } </Col>
                                                                            </Row>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Body>
                                                            </Card>
                                                        ))
                                                    }
                                                </fieldset>
                                            </>
                                        }
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.userDetails.user
    }
}

export default connect(mapStateToProps, actions)(Answers);
