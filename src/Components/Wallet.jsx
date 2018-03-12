import React, { Component } from 'react';

class Wallet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: null,
            guardians: []
        }
    }

    componentWillMount = () => {
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

export default Wallet;

// <p className="collapsed-message">Nick has not checked in for over 2 months. We recommend connecting with your guardian so they can check in at least once a week. <Link to="">Learn More</Link></p>
