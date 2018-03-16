import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getETHaccount } from '../Actions';

class Wallet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: null,
            guardians: []
        }
    }

    componentWillMount = () => {
        if (window.web3 !== undefined) {
            this.props.ETHaccount().then( (response) => {
                if(response.account){
                    if(response.account === 'undefined' || typeof response.account === undefined){
                        this.props.history.push('/web3');
                    } else {
                        if(localStorage.pkey){
                            let keyInfo = JSON.parse(localStorage.pkey)
                            let guardians = keyInfo.guardians;
                            guardians.map(function(el, index) {
                                var o = Object.assign({}, el);
                                o.visible = false;
                                o.id = index+1;
                                return o;
                            })
                            this.setState({
                                name: keyInfo.nickname,
                                guardians: guardians
                            })
                        }
                    }
                }
            });
        }
    }

    toggleProtector = (index) => {
        let newProtectors = [...this.state.guardians];
        newProtectors[index].visible = !newProtectors[index].visible;
        this.setState({guardians: newProtectors})
    }

    render() {
        return (
            <div className="wallet">
                <h1>{this.state.name} Key</h1>
                <p>Protected by:</p>
                {this.state.guardians.map((protector, index) =>
                    <div className="fl-row" key={index} onClick={() => { this.toggleProtector(index)}}>
                        <div className="fl-100 key-row">
                            <div className="fl-row">
                                <div className="fl-90">
                                    <span>{protector.name}</span>
                                    <span className="status-ball active"></span>
                                </div>
                                <div className="fl-10">
                                    <img alt="" src={require("../Assets/images/dashboard/next.svg")} />
                                </div>
                            </div>
                            {
                                protector.visible &&
                                <div className="fl-row collapsed-content">
                                    <div className="fl-100">
                                        <p className="collapsed-contact">{protector.community}<br/>{protector.phone}</p>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                )}

                <center><button onClick={() => { this.props.history.push('/dashboard') }} className="create-account">ASK FOR KEY</button></center>
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

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
