import React, { Component } from 'react';
import './ProgressBar.css';

class ProgressBar extends Component {
    render() {
        let beatTier = 0
        let finalTier = 0
        let i = 0
        for (let tier of this.props.tiers) {
            i += 1
            finalTier = tier
            if (this.props.steps >= tier) {
                beatTier = i
            }
        }
        let percent = (this.props.steps / finalTier) * 100;
        let style = {"width": `${percent}%`};
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
            case 3:
                style["backgroundColor"] = "#E838BF";
                break;
        }
        return (
            <div className="ProgressBar-Wrapper">
                {this.props.steps} steps
                <div className="ProgressBar-Container">
                    <div className="ProgressBar-FilledIn" style={style}> </div>
                </div>
            </div>
        );
    }
}

export default ProgressBar;