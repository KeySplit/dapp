import React, { Component } from 'react';

class Header extends Component {
    render() {
        let backButton = null;
        if ((this.props.location.pathname === "/privacy") || (this.props.location.pathname === "/recover") || (this.props.location.pathname === "/terms") || (this.props.location.pathname === "/create") || (this.props.location.pathname.indexOf("/add-key/") === 0) || (this.props.location.pathname.indexOf("/wallet/") === 0)) {
            backButton = <p className="back" onClick={this.props.history.goBack}><i className="arrow left"></i></p>
        }
        return (
            <div className="header">
                <div className="logo">
                    {backButton}
                    <a href="/dashboard">
                    <img alt="" src={require("../Assets/images/header/logo.png")} />
                    <span>KeySplit</span>
                    </a>
                </div>
            </div>
        )
    }
}

export default Header;
