import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getETHaccount } from '../Actions';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keys: false,
            shards: false,
            keyInfo: [],
            keyShards: []
        }
    }

    componentWillMount = () => {
        if(window.web3 !== undefined) {
            this.props.ETHaccount().then( (response) => {
                if(response.account) {
                    if(!(localStorage.getItem(`${response.account}:password`)) && (this.props.location.pathname === "/dashboard")) {
                        this.props.history.push('/');
                    } else if(response.account === 'undefined' || typeof response.account === undefined) {
                        this.props.history.push('/web3');
                    }
                }
            });
        }
    }

    componentDidMount = () => {
        if(localStorage.getItem(`${localStorage.account}:pkeys`)) {
            this.setState({
                keys: true,
                keyInfo: JSON.parse(localStorage.getItem(`${localStorage.account}:pkeys`))
            });
        }

        if(localStorage.getItem(`${localStorage.account}:heldShards`)) {
            this.setState({
                shards: true,
                keyShards: JSON.parse(localStorage.getItem(`${localStorage.account}:heldShards`))
            });
        }
    }

    render() {
        let keysPanel = null;
        let shardsPanel = null;
        if(!this.state.keys) {
            keysPanel = <NoKeysPanel history={this.props.history} />
        } else {
            keysPanel = <KeysPanel keys={this.state.keyInfo} history={this.props.history} />
        }
        if(!this.state.shards) {
            shardsPanel = <NoShardsPanel history={this.props.history} />
        } else {
            shardsPanel = <ShardsPanel shards={this.state.keyShards} history={this.props.history} />
        }

        return (
            <div className="dashboard">
                <Tabs>
                    <TabList>
                        <Tab>My Keys</Tab>
                        <Tab>Key Ring</Tab>
                    </TabList>

                    <TabPanel>
                        {keysPanel}
                    </TabPanel>

                    <TabPanel>
                        {shardsPanel}
                    </TabPanel>
                </Tabs>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        account: state.web3Reducer.account
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        ETHaccount: bindActionCreators(getETHaccount, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

class NoKeysPanel extends Component {
    render() {
        return (
            <div>
                <div className="fl-row panel">
                    <div className="fl-30">
                        <img alt="" src={require("../Assets/images/dashboard/sad_logo.png")} />
                    </div>
                    <div className="fl-70">
                        <p className="mykeys-par">You have no seed words <br/>securely stored with KeySplit.</p>
                        <Link to="">Get started by adding a key below.</Link>
                    </div>
                </div>
                <center><button onClick={() => { this.props.history.push('/add-key/step1') }} className="create-account">ADD KEY</button></center>
            </div>
        )
    }
}

class KeysPanel extends Component {
    render() {
        const keyData = this.props.keys;
        return (
            <div>
                {keyData.map(function(k, index){
                    let key = JSON.parse(k);
                    return (
                        <div key={index}>
                            <Link to={`/wallet/${key.nickname}`} data={key.nickname} className="fl-row">
                                <div className="fl-100">
                                    <div className="fl-row key-row">
                                        <div className="fl-90">
                                            <span>{key.nickname}</span>
                                            <span className="status-ball active"></span>
                                        </div>
                                        <div className="fl-10">
                                            <img alt="" src={require("../Assets/images/dashboard/next.svg")} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                })}
                <center><button onClick={() => { this.props.history.push('/add-key/step1') }} className="create-account">ADD KEY</button></center>
            </div>
        )
    }
}

class NoShardsPanel extends Component {
    render() {
        return (
            <div>
                <div className="fl-row panel">
                    <div className="fl-30">
                        <img alt="" src={require("../Assets/images/dashboard/sad_logo.png")} />
                    </div>
                    <div className="fl-70">
                        <p className="mykeys-par">You aren't guarding <br/>anyone's key shards yet.</p>
                        <Link to="">Tell your friends they need <br/>to step up their security!</Link>
                    </div>
                </div>
            </div>
        )
    }
}

class ShardsPanel extends Component {
    render() {
        const shardData = this.props.shards;
        return (
            <div>
                {shardData.map(function(s, index){
                    return (
                        <div key={index} className="fl-row">
                            <div className="fl-100">
                                <div className="fl-row key-row shard-row">
                                    <div className="fl-90">
                                        <span>{s}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}
