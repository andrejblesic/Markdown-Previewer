import React from 'react';
import './App.css';
import { Provider } from "react-redux";
import { connect } from "react-redux";
import { createStore } from "redux";
import marked from "marked";

//Redux
const ADD = "ADD";

var adder = (text) => {
  return {
    type: ADD,
    text: text
  }
}

var defaultState = [""];

const myReducer = (state=defaultState, action) => {
  var newState = [...state];
  switch(action.type) {
    case ADD:
      newState = [action.text];
      return newState;
    default:
      return state;
  }
}

var store = createStore(myReducer);

//React
class Presentational extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ""
    }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({
      input: event.target.value
    });
    this.props.adder(event.target.value);
  }
  render() {
    return(
      <div className="wrap">
        <div className="editordiv">
          <textarea id="editor" placeholder="Enter your text here" value={store.getState()} onChange={this.handleChange} name="text-area"></textarea><br/>
        </div>
        <div className="strelica">
        </div>
        <div className="triangle"></div>
        <ParagraphNode />
      </div>
    );
  }
}

function ParagraphNode(props) {
  var parsedParagraph = marked(store.getState()[0]);
  return(
    <div dangerouslySetInnerHTML={{__html: parsedParagraph}} id="preview" className="paragraph">
    </div>
  );
}

//React-Redux
const mapStateToProps = (state) => {
  return {
    state: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    adder: (text) => dispatch(adder(text))
  }
}

const Container = connect(mapStateToProps, mapDispatchToProps) (Presentational)

class Wrapper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Container />
      </Provider>
    );
  }
}

var defaultText;

function logger() {
  defaultText = this.responseText;
  store.dispatch(adder(defaultText));
}

let tekstic = new XMLHttpRequest();
tekstic.addEventListener("load", logger);
tekstic.open("GET", "file.txt");
tekstic.send();

export default Wrapper;
