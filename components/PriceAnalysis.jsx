import Plot from 'react-plotly.js';

const PriceAnalysis = ({ price, shipping, currency, history }) => {
  const priceHistory = history.map((h) => {
    return Number(h.price);
  });

  const historicTotal = priceHistory.reduce((total, n) => total + n, 0);
  const historicAVG = historicTotal / priceHistory.length;

  priceHistory.sort((a, b) => a - b);
  const indexQ1 = Math.floor(priceHistory.length * 0.25);
  const indexQ3 = Math.floor(priceHistory.length * 0.75);

  const q1 = priceHistory[indexQ1];
  const q3 = priceHistory[indexQ3];

  let decision = '';
  if (price + shipping < q1) {
    decision = 'You should totally buy it!';
  } else if (price + shipping >= q1 && price + shipping < historicAVG) {
    decision =
      'Its a little below the average price! You can consider buying it';
  } else if (price + shipping >= historicAVG && price + shipping <= q3) {
    decision =
      'Its a little above the average price! Maybe wait for a better price?';
  } else if (price + shipping > q3) {
    decision = 'Its expensive, hard pass!';
  }

  const boxData = [
    {
      x: priceHistory,
      boxpoints: 'all',
      jitter: 1,
      pointpos: -2,
      type: 'box',
      name: 'Historic Price',
      boxmean: true,
      marker: {
        color: 'rgb(88,81,156)',
        outliercolor: 'rgba(219, 64, 82, 0.6)',
        line: {
          outliercolor: 'rgba(219, 64, 82, 1.0)',
          outlierwidth: 2,
        },
      },
    },
    {
      x: [price],
      mode: 'markers',
      name: 'Your price',
      marker: {
        color: 'rgb(219, 64, 82)',
        size: 12,
      },
    },
    {
      x: [price + shipping],
      mode: 'markers',
      name: 'Your Price + shipping',
      marker: {
        color: 'rgb(219, 64, 82)',
        size: 12,
      },
    },
  ];

  const layout = {
    xaxis: {
      title: 'Historic price',
      zeroline: false,
    },
    width: 650,
    height: 300,
  };

  return (
    <div className='flex flex-col justify-center items-center gap-10'>
      <p className='text-2xl leading-tight xl:text-3xl font-bold text-gray-900'>
        {decision}
      </p>
      <Plot data={boxData} layout={layout} />
    </div>
  );
};

// {
//   width: 600,
//   height: 300,
//   title: 'A Fancy Plot',
//   showgrid: false
// }
// [
//   {
//     x: [1, 2, 8],
//     y: [2, 6, 3],
//     type: 'scatter',
//     mode: 'lines+markers',
//     marker: { color: 'red' },
//   },
//   { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
// ]

export default PriceAnalysis;
