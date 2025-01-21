import { useEffect, useState } from 'react';
import type { RootState } from '../../store';
import { updateValidity } from '../../features/targetSlice';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

function FinancialMetrics() {
  const target = useSelector((state: RootState) => state.target);
  const dispatch = useDispatch();
  const [info, setInfo] = useState<Record<string, any>>({});
  useEffect(() => {
    axios.get(`/api/info/${target.symbol}`)
      .then(response => {
        setInfo(response.data);
        dispatch(updateValidity(true));
      })
      .catch(error => {
        console.error(error);
        dispatch(updateValidity(false));
      })
  }, [])
  return (
    <>
      <div>FinancialMetrics</div>
      {
        Array.from(Object.keys(info))
          .filter(v => !(info[v] instanceof Object))
          .map((v, i) => <p key={i}>{info[v]}</p>)
      }
    </>
  )
}

export default FinancialMetrics