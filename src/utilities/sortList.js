const sortList = (st) => {
  return {
    rankings: st.rankings.sort(({ rating: a }, { rating: b }) => b - a),
  };
};

export default sortList;
