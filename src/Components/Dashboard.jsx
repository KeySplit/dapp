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
            keyInfo: null,
            keyShards: []
        }
    }

    componentWillMount = () => {
        this.props.ETHaccount().then( (response) => {
            if(response.account){
                if(response.account === undefined || response.account === 'undefined'){
                    this.props.history.push('/web3');
                }
            }
        });
    }

    componentDidMount = () => {
        if(localStorage.pkey){
            this.setState({
                keys: true,
                keyInfo: JSON.parse(localStorage.pkey)
            });
        }
        else{
            console.log("No keys detected")
        }


        if(localStorage.getItem(`${localStorage.account}:heldShards`)){
            this.setState({
                keyShards: JSON.parse(localStorage.getItem(`${localStorage.account}:heldShards`))
            },() => { console.log(this.state.keyShards); })
        }

    }

    render() {
        let panel = null;
        if(!this.state.keys) {
            panel = <NoKeysPanel history={this.props.history} />
        }
        else{
            panel = <KeysPanel keys={this.state.keyInfo} history={this.props.history} />
        }
        return (
            <div className="dashboard">
                <Tabs>
                    <TabList>
                        <Tab>My Keys</Tab>
                        <Tab>Key Ring</Tab>
                    </TabList>

                    <TabPanel>
                        {panel}
                    </TabPanel>

                    <TabPanel>
                        { this.state.keyShards.map( (shard, index) =>
                            <div key={index} className="fl-row">
                                <div className="fl-100">
                                    <div className="fl-row key-row shard-row">
                                        <div className="fl-90">
                                            <span>{shard}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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

    constructor(props) {
        super(props);
    }

    componentWillMount = () => {
        this.props.ETHaccount().then( (response) => {
            if(response.account){
                if(response.account === undefined || response.account === 'undefined'){
                    this.props.history.push('/web3');
                }
            }
        });
    }

    render() {
        return (
            <div>
                <div className="fl-row panel">
                    <div className="fl-30">
                        <img alt="" src={require("../Assets/images/dashboard/sad_logo.png")} />
                    </div>
                    <div className="fl-70">
                        <p className="mykeys-par">You have no seed words securely stored with KeySplit.</p>
                        <Link to="">Get started by adding a key below.</Link>
                    </div>
                </div>
                <center><button onClick={() => { this.props.history.push('/add-key/step1') }} className="create-account">ADD KEY</button></center>
            </div>
        )
    }
}

class KeysPanel extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount = () => {
        this.props.ETHaccount().then( (response) => {
            if(response.account){
                if(response.account === undefined || response.account === 'undefined'){
                    this.props.history.push('/web3');
                }
            }
        });
    }

    render() {
        return (
            <div>
                <Link to={`/wallet/${this.props.keys.nickname}`} className="fl-row">
                    <div className="fl-100">
                        <div className="fl-row key-row">
                            <div className="fl-90">
                                <span>{this.props.keys.nickname}</span>
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
    }
}

// <center><button onClick={() => { this.props.history.push('/add-key') }} className="create-account">ADD KEY</button></center>
