import React, { Component } from 'react';
import './DadJoke.css';

class DadJoke extends Component {
  constructor(props) {
    super(props);
  }

  handleChangeRating() {
    this.props.changeRating(this.props.id);
  }

  render() {
    return (
      <div className="Dad-joke">
        <div className="Dad-joke-rating">
          <button>⬆</button>
          <div>{this.props.handleChangeRating}</div>
          <button>⬇</button>
        </div>

        <div>{this.props.joke}</div>
        <img
          className="Dad-joke-emoji"
          src="https://www.citypng.com/public/uploads/preview/smiling-face-emoji-emoticon-eye-heart-red-love-11583591506qpben5gjej.png"
        />
      </div>
    );
  }
}

export default DadJoke;
