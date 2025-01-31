import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { updateValidity } from '@/features/targetSlice';
import type { RootState } from '@/store';
import TargetEditor from '@/components/TargetEditor';
import FinancialMetrics from '@/components/FinancialMetrics';
import TechnicalIndicators from '@/components/TechnicalIndicators';

function Analyzer() {
  const dispatch = useDispatch();
  const { symbol, isValidSymbol } = useSelector((state: RootState) => state.target);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isValidSymbol) {
      navigate('/');
    }

    fetch(`/api/info/${symbol}`)
    .then(response =>  {
      if (!response.ok) {
        dispatch(updateValidity(false));
        navigate('/');
      }
    })
    .catch(err => {})
  }, []);

  return (
    <>
      <TargetEditor/>
      <FinancialMetrics/>
      <TechnicalIndicators/>
    </>
  )
}

export default Analyzer