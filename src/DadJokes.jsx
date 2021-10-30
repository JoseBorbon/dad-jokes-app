import React, { Component } from 'react';
import axios from 'axios';
import DadJoke from './DadJoke';
import getRandPage from './utilities/getRandPage';
import './DadJokes.css';

const BASE_URL = 'https://icanhazdadjoke.com/search';

class DadJokes extends Component {
  constructor(props) {
    super(props);
    this.state = { rankings: [], uniquePages: new Set([1]) };
    this.getJokes = this.getJokes.bind(this);
  }

  async componentDidMount() {
    const jokes = await axios.get(BASE_URL + '?limit=10', {
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

  async getJokes() {
    const { uniquePages } = this.state;
    try {
      if (uniquePages.size === 64) {
        throw new Error('No more jokes available from API');
      }
      let randPage;
      do {
        randPage = getRandPage(65, 1);
      } while (uniquePages.has(randPage));

      const newJokes = await axios.get(
        BASE_URL + `?page=${randPage}&limit=10`,
        {
          headers: { Accept: 'application/json' },
        }
      );

      this.setState((st) => {
        return {
          rankings: [
            ...st.rankings.slice(),
            ...newJokes.data.results.map(({ joke, id }) => {
              return { id, joke, rating: 0 };
            }),
          ],
          uniquePages: st.uniquePages.add(randPage),
        };
      });
    } catch (err) {
      console.error(err);
    }
  }
  render() {
    const dadJokes = this.state.rankings.map(({ joke, id, rating }) => {
      return <DadJoke key={id} id={id} joke={joke} rating={rating} />;
    });
    return (
      <div>
        <div>{dadJokes}</div>
        <button class="Dad-jokes-button" onClick={this.getJokes}>
          New Jokes!
        </button>
      </div>
    );
  }
}

export default DadJokes;
