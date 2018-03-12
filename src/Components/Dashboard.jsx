import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keys: false,
            keyInfo: null,
            keyShards: []
        }
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

export default Dashboard;


class NoKeysPanel extends Component {
    constructor(props) {
        super(props);
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
                        <Link to="">I want to save my seed words</Link>
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
