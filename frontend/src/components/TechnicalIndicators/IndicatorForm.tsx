import MovingAverageForm from './MovingAverageForm';
import MACDForm from './MACDForm';

function IndicatorForm({ 
  indicator,
  defaultParams = {},
  modifyId = '',
  afterSubmit = () => {}
}: {
  indicator: Array<string>,
  defaultParams?: { [key: string]: any },
  modifyId?: string
  afterSubmit?: () => unknown
}) {
  const [abbrev, fullName] = indicator;

  if (['SMA', 'EMA'].includes(abbrev)) return <MovingAverageForm maxRangesCount={3} indicatorName={fullName} abbrev={abbrev} defaultParams={defaultParams} id={modifyId} afterSubmit={afterSubmit}/>

  if (['RSI', 'ADX', 'BBANDS', 'ATR'].includes(abbrev)) return <MovingAverageForm maxRangesCount={1} indicatorName={fullName} abbrev={abbrev} defaultParams={defaultParams} id={modifyId} afterSubmit={afterSubmit}/>

  if (abbrev === 'MACD') return <MACDForm indicatorName={fullName} defaultParams={defaultParams} id={modifyId} afterSubmit={afterSubmit}/>

  return (
    <div>IndicatorForm</div>
  )
}

export default IndicatorForm