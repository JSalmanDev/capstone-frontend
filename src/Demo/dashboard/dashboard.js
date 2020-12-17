import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Aux from "../../hoc/_Aux";
import 'react-table/react-table.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../App/layout/Loader'

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
			isValid: {
                value: false,
                text: ''   
            },
            
        }
    }

    componentDidMount() {}
    
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
				<Row>
                    <NotificationContainer/>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Welcome User</Card.Title>
                            </Card.Header>
                            <Card.Body>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Aux>
        );
    }
}

export default Dashboard;
