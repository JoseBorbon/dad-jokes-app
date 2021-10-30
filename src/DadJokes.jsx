import React, { Component } from 'react';
import axios from 'axios';
import DadJoke from './DadJoke';

const URL = 'https://icanhazdadjoke.com/search?limit=10'; //<- 10 dad jokes fetch

class DadJokes extends Component {
  constructor(props) {
    super(props);
    this.state = { rankings: [] };
  }

  async componentDidMount() {
    const jokes = await axios.get(URL, {
      headers: { Accept: 'application/json' },
    });
    this.setState((st) => {
      return {
        rankings: jokes.data.results.map(({ joke, id }) => {
          return { id, joke, rating: 0 };
        }),
      };
    });
  }

  render() {
    const dadJokes = this.state.rankings.map(({ joke, id, rating }) => {
      return <DadJoke key={id} id={id} joke={joke} rating={rating} />;
    });
    return <div>{dadJokes}</div>;
  }
}

export default DadJokes;
