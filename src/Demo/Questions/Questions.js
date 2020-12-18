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
import qs from 'query-string';
import moment from 'moment';

class Questions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
			isValid: {
                value: false,
                text: '',
                name: ''   
            },
            question: '',
            data: {},
            project: null,
            showModal: false,
			handleCloseModal: false,
        }
    }

    componentDidMount = async () => {
        if (this.props.location.search) {
            let parsed = qs.parse(this.props.location.search);
            if (parsed.project) {
                await this.setState({ project: parsed.project });
                this.getQuestions();
            }
        }
    }

    componentDidUpdate = async (prevProps) => { 

        if (this.props.location.search) {
            let parsed = qs.parse(this.props.location.search);
            if (parsed.project != this.state.project) {
                await this.setState({ project: parsed.project });
                this.getQuestions();
            }
        }
    }

    handleTextChange(e) {
        this.setState({ [e.name]: e.value });
    }
    
    askQuestion(e) {
        e.preventDefault();
		this.setState({ showModal: true });
    }
    
	closeDeleteModal() {
		this.setState({ showModal: false });
    }

    goToQuestion(e, elem) {
        e.preventDefault();
        this.props.history.push(`/project/question?project=${this.state.project}&question=${elem.id}`);
    }
    
    handleAskQuestion() {

        let { question, project } = this.state;

        if (!question && question.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid question', name: 'question' } });
            return;
        }

        if (question && question.trim()[question.trim().length-1] != '?') {
            this.setState({ isValid: { value: true, text: 'Please add question mark at the end of question (?)', name: 'question' } });
            return;
        }

        this.setState({ isLoading: true, showModal: false });
        axios.post(`${config.prod}/api/question/create`, { question: question.trim(), user_id: this.props.user.id, category_id: project })
            .then(res => {
                this.setState({ question: '', isValid: { value: false, text: '', name: '' }});
                this.createNotification('success', 'Question Created Successfully');
                this.getQuestions();
            })
            .catch(err => {
                console.log('Error: ', err);
                if (err.response && err.response.status && (err.response.status === 400 || err.response.status === 500)) {
                    this.setState({ isLoading: false, showModal: true, isValid: { value: true, text: err.response.data.msg, name: 'server_error_question' } });
                    this.createNotification('error', err.response.data.msg);
                } else {
                    this.setState({ isLoading: false, showModal: true, isValid: { value: true, text: 'Unknown Error', name: 'server_error_question' } });
                    this.createNotification('error', 'Unknown Error');
                }
            });
    }

    getQuestions() {
        this.setState({ isLoading: true });
        axios.get(`${config.prod}/api/category/find/${this.state.project}`)
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
                            <Modal.Title>Ask Question</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col>
                                    <Form>
                                        <Form.Row>
                                            <Col>
                                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                                    <Form.Label>Enter Your Question</Form.Label>
                                                    <Form.Control 
                                                        as="textarea" 
                                                        name='question'
                                                        rows={4}
                                                        value={this.state.question}
                                                        className={this.state.isValid.value && this.state.isValid.name === 'question' ? 'in-valid-input' : ''}
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
                            <Button variant="primary" onClick={() => this.handleAskQuestion()}>
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
                                                    <Row style={{ paddingBottom: 10 }}>
                                                        <Col>
                                                            <Button variant="primary" onClick={(e) => this.askQuestion(e)}>Ask Question</Button>
                                                        </Col>
                                                    </Row>
                                                    {
                                                        Object.keys(this.state.data).length && this.state.data.questions.map(elem => (
                                                            <Card key={elem.id}>
                                                                <Card.Body>
                                                                    <Row>
                                                                        <Col>
                                                                            <Row>
                                                                                <Col>{moment(elem.created_at).format('DD/MM/YYYY hh:mm A')}</Col>
                                                                                <Col><p><b>By: {elem.user.email}</b></p></Col>
                                                                                <Col><p>2: Answers</p></Col>
                                                                            </Row>
                                                                            <Row>
                                                                                <Col>
                                                                                    <a href={`/project/question?project=${this.state.project}&question=${elem.id}`} onClick={(e)=> this.goToQuestion(e, elem)}>
                                                                                        { elem.question }
                                                                                    </a>
                                                                                </Col>
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

export default connect(mapStateToProps, actions)(Questions);
