import MovingAverageForm from './MovingAverageForm';
import MACDForm from './MACDForm';
import ADXForm from './ADXForm';

function IndicatorForm({ 
  indicator,
  defaultParams = {},
  modifyId = '',
  afterSubmit = () => {},
  closeForm = undefined
}: {
  indicator: Array<string>,
  defaultParams?: { [key: string]: any },
  modifyId?: string
  afterSubmit?: () => unknown,
  closeForm?: undefined | (() => unknown),
}) {
  const [abbrev, fullName] = indicator;

  if (['SMA', 'EMA'].includes(abbrev)) return <MovingAverageForm maxRangesCount={3} indicatorName={fullName} abbrev={abbrev} defaultParams={defaultParams} id={modifyId} afterSubmit={afterSubmit} closeForm={closeForm}/>

  if (['RSI', 'BBANDS', 'ATR'].includes(abbrev)) return <MovingAverageForm maxRangesCount={1} indicatorName={fullName} abbrev={abbrev} defaultParams={defaultParams} id={modifyId} afterSubmit={afterSubmit} closeForm={closeForm}/>

  if (abbrev === 'ADX') return <ADXForm indicatorName={fullName} defaultParams={defaultParams} id={modifyId} afterSubmit={afterSubmit} closeForm={closeForm}/>

  if (abbrev === 'MACD') return <MACDForm indicatorName={fullName} defaultParams={defaultParams} id={modifyId} afterSubmit={afterSubmit} closeForm={closeForm}/>

  return (
    <div>IndicatorForm</div>
  )
}

export default IndicatorForm