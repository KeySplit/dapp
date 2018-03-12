import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <div className="header">
                <div className="logo">
                    <img alt="" src={require("../Assets/images/header/logo.png")} />
                    <span>KeySplit</span>
                </div>
                <div className="menu">
                    <img alt="" src={require("../Assets/images/header/menu.svg")} />
                </div>

            </div>
        )
    }
}

export default Header;
