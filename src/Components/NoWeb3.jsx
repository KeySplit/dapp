import React, { Component } from 'react';
import { withRouter } from 'react-router';

class NoWeb3 extends Component {
    render() {
        return (
            <div className="landing">
                <h1>KeySplit</h1>
                <h2>Web3 is not detected!</h2> 
                <p>In order to use KeySplit, <br/>please use Toshi or MetaMask.</p>
                <p><a href="https://itunes.apple.com/us/app/toshi-ethereum/id1278383455?ls=1&mt=8"><button className="download-toshi"><i className="fa fa-apple"></i><span className="small">Get Toshi on the</span> <span className="big">App Store</span></button></a></p>
                <p><a href="https://metamask.io"><button className="download-metamask">Download MetaMask Now</button></a></p>
            </div>
        )
    }
}

export default withRouter(NoWeb3);
