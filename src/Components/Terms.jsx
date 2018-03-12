import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Terms extends Component {

    constructor(props) {
        super(props);
        console.log(props)
    }

    render() {
        return (
            <div className="terms">
                <h1>Privacy Polixy &<br/>Terms of Use</h1>
                <Link to="privacy">Privacy Policy</Link><br/>
                <Link to="terms">Terms of Use (missing link)</Link><br/>
                <p>By clicking “Accept”, you confirm that you have read, accepted, and agreed to our privacy policy and terms of use.</p>
                <center><button onClick={() => { this.props.history.push('/create') }} className="create-account">ACCEPT</button></center>
            </div>
        )
    }
}

export default Terms;
