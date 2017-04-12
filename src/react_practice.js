/**
 * Created by hareesh on 11-04-2017.
 */
import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';

/* Renderer as Function */
/*Usage: <Timer date={new Date()} />*/
function Timer(props) {
    return (
        <div>
            <h3> Local Time: {props.date.toLocaleTimeString()}</h3>
        </div>
    )
}


/* Render as Component Class */
/* Usage: <TimerComponent date={new Date()}/> */
class TimerComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        }
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        )
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    handleClick(e) {
        this.setState({
            textColor: 'rgb(99,33,99)'
        });
        console.log('Clicked @' + this.state.date);
    }

    render() {
        return (
            <div>
                <h3 onClick={this.handleClick.bind(this)}
                    style={{
                        color: this.state.textColor
                    }}>
                    Local Time: {this.state.date.toLocaleTimeString()}</h3>
            </div>
        )
    }
}
/*
 Numbers component to use PROPS to render list of items
 Usage:
 <Numbers from={15} to={20}/>
 */
class Numbers extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            from: props.from,
            to: props.to
        }
    }

    render() {

        let nums = [];
        for (let i = this.state.from; i <= this.state.to; i++) {
            nums.push(i);
        }
        let lis = nums.map((number) =>
            <li>{number}</li>
        );
        return (
            <div>
                <h3>Numbers Component {this.state.to}</h3>
                <select value={Math.round((this.state.to + this.state.from) / 2)}>
                    {
                        nums.map((number) => <option key={number} value={number}>{number}</option>)
                    }
                </select>
                <ul>
                    {lis}
                </ul>
            </div>
        );
    }
}

/*
 Calculator component to show Water boiling point <BoilerVerdict>
 with <TempInput> in C, F scales
 Usage:
 <Calculator value={300}/>
 */
const tempTypes = {
    c: 'Celsius',
    f: 'Fahrenheit'
};

function BoilerVerdict(props) {
    let temp = (props.scale === 'f') ? toFahrenheit(props.temp) : props.temp;
    if (props.temp >= 100)
        return <p>Boils Water @{temp} {tempTypes[props.scale]}</p>
    else
        return <p>Do not Boil Water @{temp} {tempTypes[props.scale]}</p>
}

class TempInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleTempChange = this.handleTempChange.bind(this);
    }

    handleTempChange(e) {
        this.props.onChange(e);
    }

    render() {
        return (
            <div>
                <p>Input Temp in {tempTypes[this.props.scale]}</p>
                <input value={this.props.value} onChange={this.handleTempChange}/>
            </div>
        )
    }
}

function toCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temp: this.props.value ? this.props.value : 0
        }
        this.handleTempCChange = this.handleTempCChange.bind(this);
        this.handleTempFChange = this.handleTempFChange.bind(this);
    }

    handleTempCChange(e) {
        this.setState({
            temp: parseFloat(e.target.value)
        })
    }

    handleTempFChange(e) {
        this.setState({
            temp: toCelsius(parseFloat(e.target.value))
        })
    }

    render() {
        return (
            <div>
                <TempInput value={this.state.temp} scale={'c'} onChange={this.handleTempCChange}/>
                <TempInput value={toFahrenheit(this.state.temp)} scale={'f'} onChange={this.handleTempFChange}/>
                <BoilerVerdict temp={this.state.temp} scale={'f'}/>
            </div>
        )
    }
}

/*
 FullTemplate component uses above components to show in L-Shape
 Top Menu - Left Side Bar - Content Area
 */

function FullTemplate(props) {
    return (
        <div className="container-fluid"
             style={{
                 backgroundColor: '#777'
             }}>
            <div className="row">
                <div className="col-sm-12 col-xs-12"
                     style={{
                         backgroundColor: '#999'
                     }}>
                    {props.topBar}
                </div>
            </div>
            <div className="row">
                <div className="col-md-3 col-lg-2"
                     style={{
                         backgroundColor: '#aaa'
                     }}>
                    {props.sideMenu}
                </div>
                <div className="col-md-9 col-lg-10"
                     style={{
                         backgroundColor: '#bbb'
                     }}>
                    {props.children}
                </div>
            </div>
        </div>

    )
}

class FullPageComponent extends React.Component {

    render() {
        return (
            <FullTemplate
                topBar={
                    <TimerComponent/>
                }
                sideMenu={
                    <Numbers from="10" to="20"/>
                }
            >
                <Calculator value="100"/>
            </FullTemplate>
        )
    }
}

export default FullPageComponent;