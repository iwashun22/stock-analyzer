import { useEffect, useState } from 'react';
import type { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { updateValidity } from '@/features/targetSlice';
import ValuationMetrics from './ValuationMetrics';
import './index.scss';
import { useNavigate } from 'react-router';

function FinancialMetrics() {
  const symbol = useSelector((state: RootState) => state.target.symbol);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [info, setInfo] = useState<Record<string, any>>({});
  useEffect(() => {
    fetch(`/api/info/${symbol}`)
      .then(response =>  {
        if (!response.ok) {
          dispatch(updateValidity(false));
          // navigate('/');
          return;
        }
        return response.json()
      })
      .then(json => {
        setInfo(json);
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