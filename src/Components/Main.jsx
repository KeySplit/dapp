import React, { Component } from 'react';
import { withRouter } from 'react-router';

class Main extends Component {
    render() {
        return (
            <div className="landing">
                <h1>KeySplit</h1>
                <p>A simple, secure way to recover your secret keys and passwords</p>
                <a href="https://keysplit.io"><p className="learn-more">Learn More</p></a>
                <button onClick={(e) => {
                    this.props.history.push('terms')
                }} className="create-account">CREATE ACCOUNT</button>
            </div>
        )
    }
}

export default withRouter(Main);
