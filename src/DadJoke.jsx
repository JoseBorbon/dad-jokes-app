import React, { Component } from 'react';
import './DadJoke.css';

class DadJoke extends Component {
  //default props for all the images we'll use and store in array and based off rating can assign index pos
  handleChangeRating(incOrDecBy1) {
    this.props.changeRating(this.props.id, incOrDecBy1);
  }

  render() {
    return (
      <div className="Dad-joke">
        <div className="Dad-joke-rating">
          <button onClick={() => this.handleChangeRating(+1)}>⬆</button>
          <div>{this.props.rating}</div>
          <button onClick={() => this.handleChangeRating(-1)}>⬇</button>
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
