import React, { Component } from 'react';
import './DadJoke.css';

class DadJoke extends Component {
  handleChangeRating(incOrDecBy1) {
    this.props.changeRating(this.props.id, incOrDecBy1);
  }

  render() {
    const { joke, emojiLink, rating } = this.props;
    const circleRating = `Dad-joke-rating-circle ${
      rating >= 8 ? 'Dad-joke-great' : rating > 3 ? 'Dad-joke-okay' : ''
    }`;
    return (
      <div className="Dad-joke-container">
        <div className="Dad-joke-rating">
          <button onClick={() => this.handleChangeRating(+1)}>⬆</button>
          <div className={circleRating}>{rating}</div>
          <button onClick={() => this.handleChangeRating(-1)}>⬇</button>
        </div>
        <div>{joke}</div>
        <img className="Dad-joke-emoji" src={emojiLink} />
      </div>
    );
  }
}

export default DadJoke;
