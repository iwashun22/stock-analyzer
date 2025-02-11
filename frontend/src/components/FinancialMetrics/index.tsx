import { useEffect, useState } from 'react';
import type { RootState } from '../../store';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ValuationMetrics from './ValuationMetrics';
import './index.scss';

function FinancialMetrics() {
  const symbol = useSelector((state: RootState) => state.target.symbol);
  const [info, setInfo] = useState<Record<string, any>>({});
  useEffect(() => {
    axios.get(`/api/info/${symbol}`)
      .then(response => {
        setInfo(response.data);
      })
      .catch(error => {
        console.error(error);
      })
  }, [])
  return (
    <div className="text-light mt-3">
      <h2 className="text-center">Financial Metrics</h2>
      <div className="table-container">
        <ValuationMetrics info={info}/>
      </div>
    </div>
  )
}

export default FinancialMetrics