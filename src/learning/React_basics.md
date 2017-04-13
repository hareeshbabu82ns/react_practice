
## Hello World

```js
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

## JSX

* Plain JSX element
```js
const element = <h1>Hello, world!</h1>;
```
* with **Javascript Expression**
```js
const element = <h1>Hello, world {fromUser(user)}!</h1>;
```
* providing **element attributes**
```js
const element = <div tabIndex="0" className="cssClass"></div>;
const element = <img src={user.avatarUrl}></img>;
```
* generating from javascript
```js
const element = React.createElement(
                  'h1',
                  {className: 'greeting'},
                  'Hello, world!'
                );
```
* Spread Attributes
```js
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```
* REF of an element
```js
class CustomTextInput extends React.Component {
    constructor(props) {
        super(props);
        this.focus = this.focus.bind(this);
    }
    focus(){
        this.textinput.focus();
    }
    render(){
    // Use the `ref` callback to store a reference to the text input DOM
    // element in an instance field (for example, this.textInput).         
      return (
        <div>       
            <input type="text"
              ref={(input) => { this.textInput = input; }} />
            <input type="button"
              value="Focus the text input" onClick={this.focus} />              
        </div>
        )
    }
}
```

## Functional & Class Components
### Functional Component
```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```
### Class Component
```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```
### Rendering Custom Components
```js
const element = <Welcome name="Hareesh" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```
### Adding State to Component
```js
class Clock extends React.Component {
  constructor(props) {
    super(props);
    //create initial state in constructor
    this.state = {date: new Date(), name: 'something'};
  }

    tick() {
      //state changes will be merged
      //in this case only date property will be updated
      //name property of state will not be updated
      this.setState({
        date: new Date()
      });
    }
    
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```
### Lifecycle Methods of a Component
* ``componentDidMount()`` after component has been rendered
* ``componentWillUnmount()`` before component is destroyed
* ``componentWillUpdate()`` to check if update is required
* ``componentDidUpdate()`` after updation

### Changing State to work with Async
```js
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment
}));
```
### Handling Events
```js
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }
////OR////
  // This syntax ensures `this` is bound within handleClick.
  // Warning: this is *experimental* syntax.
  handleClick = () => {
    console.log('this is:', this);
  }
  
  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
////OR////
 render() {
    // This syntax ensures `this` is bound within handleClick
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
    );
  }  
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```
### Conditional Rendering
```js
class Toggle extends React.Component {
  render() {
   let button = null;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }
    return (
         <div>
            <Greeting isLoggedIn={isLoggedIn} />
            {button}
          </div>
        )
   }
}
```
### Inline Logical && operator
```js
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
```
* Return ``null`` from ``render()`` method to hide component

## Forms

### Controlled Components
```js
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        value: '',
        description: '',
        flavor: 'lime',
        isGoing: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    //transfer value of Text input to component's internal state
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Form was submitted: ' + this.state);
    event.preventDefault(); //prevent default Form Submit
  }

  //handler for multiple form elements
  handleInputChange(event) {
    const target = event.target; //fetch event target element
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name; //get name of element

    //merge the state with new value
    this.setState({
      [name]: value
    });
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <label>
          Description:
          <textarea name="description"
                value={this.state.description} onChange={this.handleInputChange} />
        </label>        
        <label>
          Pick your favorite La Croix flavor:
          <select name="flavor"
                value={this.state.flavor} onChange={this.handleInputChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label>  
        <label>
          Is going:
          <input
            name="isGoing" type="checkbox"
            checked={this.state.isGoing} onChange={this.handleInputChange} />
        </label>             
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

## Context

* Pass values to child components without passing props
* By adding childContextTypes and getChildContext to MessageList (the context provider), 
  React passes the information down automatically and any component in the subtree 
  (in this case, Button) can access it by defining contextTypes.
* If contextTypes is not defined, then context will be an empty object.
```js
const PropTypes = require('prop-types');

class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}

Button.contextTypes = {
  color: PropTypes.string
};

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  getChildContext() {
    return {color: "purple"};
  }

  render() {
    const children = this.props.messages.map((message) =>
      <Message text={message.text} />
    );
    return <div>{children}</div>;
  }
}

MessageList.childContextTypes = {
  color: PropTypes.string
};
```