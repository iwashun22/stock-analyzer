import React, { useState, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useDispatch } from 'react-redux';
import { addGraph, modifyGraph } from '@/features/graphSlice';
import FormActionButtons from './FormActionButtons';
import './MovingAverageForm.scss';

function MACDForm({ indicatorName, defaultParams, id, afterSubmit, closeForm }: {
  indicatorName: string,
  defaultParams: { [key: string]: any },
  id: string,
  afterSubmit: () => unknown,
  closeForm: undefined | (() => unknown)
}) {
  const [fastperiod, setFastperiod] = useState(defaultParams["fastperiod"] || '12');
  const [slowperiod, setSlowperiod] = useState(defaultParams["slowperiod"] || '26');
  const [signalperiod, SetSignalperiod] = useState(defaultParams["signalperiod"] || '9');
  const [invalidParam, setInvalidParam] = useState<{ index: number, message: string }>({ index: -1, message: '' });
  const dispatch = useDispatch();

  const changeHandler = useCallback((setState: React.Dispatch<React.SetStateAction<string>>) => {
    const handler = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setInvalidParam({ index: -1, message: '' });

      const value = e.target.value;
      if (!value) {
        setState('');
        return;
      }

      const lastChar = value.slice(-1);
      if (!lastChar.match(/[0-9]/) || value.length > 2) return;

      setState((+value).toString());
    }
    return handler;
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    const arr = [fastperiod, slowperiod, signalperiod];
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i]) {
        setInvalidParam({ index: i, message: 'This field is empty.' });
        return;
      }
    }

    const [fast, slow, signal] = arr.map((v, i) => { return { period: Number(v), index: i } });

    if (fast.period >= slow.period) {
      setInvalidParam({ index: fast.index, message: 'The fast period must be smaller than the slow period.'});
      return;
    }

    if (id) {
      dispatch(modifyGraph({
        id,
        indicator: 'MACD',
        params: {
          fastperiod: fast.period,
          slowperiod: slow.period,
          signalperiod: signal.period
        }
      }));
    }
    else {
      dispatch(addGraph({
        indicator: 'MACD',
        params: {
          fastperiod: fast.period,
          slowperiod: slow.period,
          signalperiod: signal.period
        }
      }));
    }

    afterSubmit();
  }, [fastperiod, slowperiod, signalperiod]);

  return (
    <>
    <Form onSubmit={handleSubmit}>
      <h5 className="text-center mb-4">{indicatorName}</h5>
      {
        ([
          [fastperiod, setFastperiod, "Fast period"],
          [slowperiod, setSlowperiod, "Slow period"],
          [signalperiod, SetSignalperiod, "Signal period"]
        ] as const)
        .map(([value, setValue, labelName], i) => (
          <InputGroup key={i} hasValidation className="params-wrapper mb-4">
            <InputGroup.Text>{labelName}</InputGroup.Text>
            <Form.Control
              className="form-input"
              value={value}
              onChange={changeHandler(setValue)}
              isInvalid={i === invalidParam.index}
            />
            <Form.Control.Feedback type='invalid' tooltip>
              { invalidParam.message }
            </Form.Control.Feedback>
          </InputGroup>
        ))
      }
      <FormActionButtons closeForm={closeForm} />
    </Form>
    </>
  )
}

export default MACDForm