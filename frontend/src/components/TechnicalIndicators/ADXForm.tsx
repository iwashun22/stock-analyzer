import React, { useState, useCallback, useEffect } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import MovingAverageForm from './MovingAverageForm';

interface Props {
  indicatorName: string,
  defaultParams: { [key: string]: any },
  id: string,
  afterSubmit: () => unknown,
  closeForm: undefined | (() => unknown)
}
function ADXForm({
  indicatorName,
  defaultParams,
  id,
  afterSubmit,
  closeForm,
}: Props) {
  const [showDI, setShowDI] = useState<boolean>(defaultParams?.["show-di"] as boolean || true);
  const [showSignal, setShowSignal] = useState(defaultParams?.["show-signal"] as boolean || false);
  const [params, setParams] = useState({});

  const handleChange = useCallback((setState: React.Dispatch<React.SetStateAction<boolean>>) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setState(e.target.checked);
    }
  },[]);

  useEffect(() => {
    if (!showDI) {
      setShowSignal(false);
    }
    const showDIParam = showDI ? { "show-di": true } : {};
    const showSignalParam = showSignal ? { "show-signal": true } : {};

    const newParams = { ...showDIParam, ...showSignalParam };
    setParams(newParams);
  }, [showDI, showSignal])

  return (
    <MovingAverageForm 
      maxRangesCount={1}
      indicatorName={indicatorName}
      abbrev={"ADX"}
      defaultParams={defaultParams}
      id={id}
      afterSubmit={afterSubmit}
      closeForm={closeForm}
      customParams={params}
    >
      <InputGroup className="params-wrapper mb-4">
        <InputGroup.Text>Directional Indicator</InputGroup.Text>
        <InputGroup.Checkbox checked={showDI} onChange={handleChange(setShowDI)}/>
      </InputGroup>
      <InputGroup className="params-wrapper mb-4">
        <InputGroup.Text>Show Signal</InputGroup.Text>
        <InputGroup.Checkbox 
          checked={showSignal} onChange={handleChange(setShowSignal)}
          disabled={!showDI}
        />
      </InputGroup>
    </MovingAverageForm>
  )
}

export default ADXForm;