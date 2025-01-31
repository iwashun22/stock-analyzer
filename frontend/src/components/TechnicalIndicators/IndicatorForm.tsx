import { useEffect } from 'react';
import MovingAverageForm from './MovingAverageForm';

function IndicatorForm({ indicator }: {
  indicator: Array<string>
}) {
  const [abbrev, fullName] = indicator;

  if (['SMA', 'EMA'].includes(abbrev)) return <MovingAverageForm maxRangesCount={3} indicatorName={fullName} abbrev={abbrev}/>

  return (
    <div>IndicatorForm</div>
  )
}

export default IndicatorForm