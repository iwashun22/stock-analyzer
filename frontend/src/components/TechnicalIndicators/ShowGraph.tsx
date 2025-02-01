import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import './ShowGraph.scss';

function ShowGraph() {
  const graph = useSelector((state: RootState) => state.graph.list);
  const target = useSelector((state: RootState) => state.target);

  return (
    <div className="graph-container">
      {
        graph.map((v, i) => 
          <Graph
            indicator={v.indicator}
            params={v.params}
            symbol={target.symbol}
            period={target.period}
            id={v.id} key={i} 
          />
        )
      }
    </div>
  )
}

function Graph({ indicator, params, symbol, period, id }: {
  indicator: string,
  params: object,
  symbol: string,
  period: string,
  id: string,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    setLoaded(false);
    const obj = {
      indicator,
      symbol,
      period,
      ...params,
    }
    const queryString = new URLSearchParams(obj).toString();
    console.log(queryString);
    axios.get(`/api/graph?${queryString}`)
      .then(response => {
        const responseUrl = response.data.imageUrl ?? '';

        if (!responseUrl) throw new Error();

        setDataUrl(responseUrl);
        setLoaded(true);
      })
      .catch(error => {
        setLoaded(true);
        setError(true);
      })
  }, [indicator, params, symbol, period])

  if (!loaded) return (
    <Spinner/>
  )

  if (error) return (
    <div></div>
  )

  return (
    <div className="text-center">
      <span className="graph-image-wrapper">
        <img src={dataUrl} alt={`Indicator graph (${indicator})`} />
      </span>
    </div>
  )
}

export default ShowGraph