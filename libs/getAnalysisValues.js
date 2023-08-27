export const getAnalysisValues = (price, shipping, priceHistory) => {

  const historicTotal = priceHistory.reduce((total, n) => total + n, 0);
  const historicAVG = historicTotal / priceHistory.length;

  priceHistory.sort((a, b) => a - b);
  const indexQ1 = Math.floor(priceHistory.length * 0.25);
  const indexQ3 = Math.floor(priceHistory.length * 0.75);

  const q1 = priceHistory[indexQ1];
  const q3 = priceHistory[indexQ3];

  let decision = ''
  if (price+shipping < q1) {
    decision = 'You should totally buy it!'
  } else if (price+shipping >= q1 && price+shipping < historicAVG) {
    decision = 'Its a little below the average price! You can consider buying it'
  } else if (price+shipping >= historicAVG && price+shipping<= q3) {
    decision = 'Its a little above the average price! Maybe wait for a better price?'
  } else if (price+shipping > q3) {
    decision = 'Its waaay to expensive, hard pass!'
  }
  //console.log(decision);

  return { historicAVG, q1, q3, decision };
};

// useEffect(() => {
//     const setPriceArray = async () => {
//       const priceHistory = history.map((h) => {
//         return Number(h.price);
//       });

//       console.log(ph);
//       await setPriceHistory(
//         history.map((h) => {
//           return Number(h.price);
//         })
//       );
//       console.log(priceHistory);
//     };

//     setPriceArray();

//     const { decision: result } = getAnalysisValues(
//       price,
//       shipping,
//       priceHistory
//     );

//     setDecision(result);
//   }, [history]);
