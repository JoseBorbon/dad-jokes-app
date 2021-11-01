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
    this.state = {
      rankings: JSON.parse(localStorage.getItem('dad-joke-rankings')) || [],
      uniquePages: new Set([1]),
      isLoading: false,
    };
    this.getJokes = this.getJokes.bind(this);
    this.changeRating = this.changeRating.bind(this);
  }

  async componentDidMount() {
    if (this.state.rankings.length > 0) return;
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

    localStorage.setItem(
      'dad-joke-rankings',
      JSON.stringify(this.state.rankings)
    );
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
          isLoading: true,
        };
      });

      setTimeout(() => {
        this.setState({ isLoading: false });
      }, 3000);

      localStorage.setItem(
        'dad-joke-rankings',
        JSON.stringify(this.state.rankings)
      );

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
          : rating >= 9
          ? emojis[1] //grin squint face
          : rating >= 6
          ? emojis[2] //grin smile
          : rating >= 3
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
      <div
        className={`Dad-jokes-app-container ${
          this.state.isLoading ? 'hide' : ''
        }`}
      >
        <h1
          className={`Dad-jokes-loading ${
            this.state.isLoading ? '' : 'Dad-jokes-load-hide'
          }`}
        >
          Loading...
        </h1>
        <div className="Dad-jokes-scrolling">{dadJokes}</div>
        <div className="Dad-jokes-button-area">
          <div className="Dad-jokes-title">
            <h1>Dad</h1>
            <h1>JOKES</h1>
          </div>
          <div className="Dad-jokes-circle-border"></div>
          <img
            className="Dad-jokes-button-area-emoji"
            src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/face-with-tears-of-joy_1f602.png"
            alt="joy-emoji"
          />
          <button className="Dad-jokes-button" onClick={this.getJokes}>
            New
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Jokes!
          </button>
        </div>
      </div>
    );
  }
}

export default DadJokes;
