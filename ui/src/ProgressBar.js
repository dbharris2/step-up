import React, { Component } from 'react';
import './ProgressBar.css';
import * as ReactDOM from "react-dom";

import * as anime from "animejs";

class ProgressBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentProgressValue: 0
        };
    }

    componentDidMount() {
        this.initAnimation();
    }

    initAnimation() {
        let percent = (this.props.steps / this.props.tiers[this.props.tiers.length - 1]) * 100;
        anime({
            targets: this.markerRef,
            width: `${percent}%`,
            duration: 550,
            delay: 750,
            easing: 'linear'
        });
    }

    handleMarkerRef(ref) {
        this.markerRef = ReactDOM.findDOMNode(ref);
    };

    render() {
        let beatTier = 0
        let i = 0
        for (let tier of this.props.tiers) {
            i += 1
            if (this.props.steps >= tier) {
                beatTier = i
            }
        }
        //let style = {"width": `${percent}%`};
        let style = {"width": `0%`}

        switch (beatTier) {
            case 0:
                style["backgroundColor"] = "#EB3B49";
                break;
            case 1:
                style["backgroundColor"] = "#FCA53A";
                break;
            case 2:
                style["backgroundColor"] = "#01D59A";
                break;
            default:
                style["backgroundColor"] = "#7E1DFF";
                break;
        }
        return (
            <div className="ProgressBar-Wrapper">
                {this.props.steps} steps
                <div className="ProgressBar-Container">
                    <div className="ProgressBar-FilledIn" style={style} ref={(ref) => this.handleMarkerRef(ref)}> </div>
                </div>
            </div>
        );
    }
}

export default ProgressBar;