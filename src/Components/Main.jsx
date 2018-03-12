import React, { Component } from 'react';
import { withRouter } from 'react-router';

class Main extends Component {
    render() {
        return (
            <div className="landing">
                <h1>KeySplit</h1>
                <p>Simple & Secure way to <br/>store your seed words</p>
                <p className="learn-more">Learn More</p>
                <button onClick={(e) => {
                    this.props.history.push('terms')
                }} className="create-account">CREATE ACCOUNT</button>
            </div>
        )
    }
}

export default withRouter(Main);
