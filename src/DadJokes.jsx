import React, { Component } from 'react';
import axios from 'axios';
import DadJoke from './DadJoke';
import getRandPage from './utilities/getRandPage';
import sortList from './utilities/sortList';
import emojis from './data/emojis';
import './DadJokes.css';

const BASE_URL = 'https://icanhazdadjoke.com/search';

class DadJokes extends Component {
  constructor(props) {
    super(props);
    this.state = { rankings: [], uniquePages: new Set([1]) };
    this.getJokes = this.getJokes.bind(this);
    this.changeRating = this.changeRating.bind(this);
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

      this.setState(sortList);
    } catch (err) {
      console.error(err);
    }
  }

  changeRating(id, incOrDecBy1) {
    this.state.rankings.map((joke, idx) => {
      if (joke.id === id) {
        this.setState((st) => {
          return {
            rankings: [
              ...st.rankings.slice(0, idx),
              { ...joke, rating: joke.rating + incOrDecBy1 },
              ...st.rankings.slice(idx + 1),
            ],
          };
        });
        this.setState(sortList);
      }
    });
  }

  render() {
    const dadJokes = this.state.rankings.map(({ joke, id, rating }) => {
      const emojiLink =
        rating >= 12
          ? emojis[0] //rofl
          : rating >= 10
          ? emojis[1] //grin squint face
          : rating >= 8
          ? emojis[2] //grin smile
          : rating >= 4
          ? emojis[3] //slight smile
          : rating >= 0
          ? emojis[4] //confused
          : emojis[5]; //pouting
      return (
        <DadJoke
          key={id}
          id={id}
          rating={rating}
          joke={joke}
          emojiLink={emojiLink}
          changeRating={this.changeRating}
        />
      );
    });

    return (
      <div>
        <div className="Dad-jokes-scrolling">{dadJokes}</div>
        <button className="Dad-jokes-button" onClick={this.getJokes}>
          New Jokes!
        </button>
      </div>
    );
  }
}

export default DadJokes;
