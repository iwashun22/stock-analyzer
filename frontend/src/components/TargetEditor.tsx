import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updatePeriod, updateInterval } from '@/features/targetSlice';
import type { RootState } from '@/store';
import { useNavigate } from 'react-router';
import { UNITS, type SupportedUnit } from '@/util/helper';
import Popup from './Popup';
import Form from 'react-bootstrap/Form';
import FormActionButtons from './FormActionButtons';
import { FaEdit } from 'react-icons/fa';
import './TargetEditor.scss';

function TargetEditor() {
  const target = useSelector((state: RootState) => state.target);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [savedPeriod, setSavedPeriod] = useState<[number, string]>([0, ""]);
  const [showPeriodEditor, setShowPeriodEditor] = useState<boolean>(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/check/period/${target.period}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        else { 
          setError("Failed retrieving valid period of time.");
          throw new Error();
        }
      })
      .then(data => {
        setSavedPeriod([data.number, data.unit]);
      })
      .catch(err => {
        console.error(err);
        const defaultPeriod: typeof savedPeriod = [1, 'y'];
        setSavedPeriod(defaultPeriod);
        dispatch(updatePeriod(defaultPeriod.join('')));
      })

    fetch(`/api/check/interval/${target.interval}`)
      .catch(err => {
        console.error(err);
        dispatch(updateInterval('1d'));
      })
  }, [target]);

  const confirmClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const confirmed = confirm('Do you want to change the symbol?');
    if (confirmed) {
      navigate('/');
    }
  }, []);

  return (
    <>
      <Popup show={showPeriodEditor} onClose={() => setShowPeriodEditor(false)}>
          <PeriodConfigForm
            savedPeriod={savedPeriod}
            closePopup={() => setShowPeriodEditor(false)}
          />
      </Popup>
      <Popup variant='error' show={!!error} onClose={() => setError('')}>
        <h5 className="text-center">{error}</h5>
      </Popup>
      <div className="target-wrapper text-light">
        <div className="symbol-wrapper" onClick={confirmClick}>
          <span className="text-lowercase">symbol</span>
          <span className="text-uppercase">{target.symbol}</span>
        </div>
        <div className="period-wrapper">
          <span className="text-capitalize">past</span>
          <span className="number">
            {savedPeriod[0]}
          </span>
          <span className="text-capitalize">
            {UNITS[savedPeriod[1] as SupportedUnit]}
          </span>
          <span className="ms-3">
            <button className="edit-btn" onClick={() => setShowPeriodEditor(true)}>
              <FaEdit size={20} className="d-block"/>
            </button>
          </span>
        </div>
      </div>
    </>
  )
}


const toStr = (v: number | string) => v.toString();
function PeriodConfigForm({
  savedPeriod,
  closePopup,
  min = 1,
  max = 30
}: {
  savedPeriod: [number, string],
  closePopup: () => unknown,
  min?: number,
  max?: number
}) {
  const [period, setPeriod] = useState(savedPeriod.map(toStr));
  const [intervalList, setIntervalList] = useState<Array<string>>([]);
  const [isValidNumber, setIsValidNumber] = useState(true);
  const savedInterval = useSelector((state: RootState) => state.target.interval);
  const [selectedInterval, setSelectedInterval] = useState(savedInterval);
  const dispatch = useDispatch();

  useEffect(() => {
    setPeriod(savedPeriod.map(toStr));
  }, [savedPeriod]);

  useEffect(() => {
    fetch('/api/interval/supported')
      .then(response => response.json())
      .then(data => {
        setIntervalList(data);
      })
      .catch(err => {
        console.error(err);
      })
  }, []);

  const handleNumberOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.value) {
      const char = e.target.value.slice(-1);
      if (!char.match(/[0-9]/)) return;
      if (e.target.value.length > max.toString().length) return;

      const digit = Number(e.target.value);
      if (digit < min || max < digit) {
        setIsValidNumber(false)
      }
      else {
        if (!isValidNumber) setIsValidNumber(true);
      }
      setPeriod([digit.toString(), period[1]]);
    }
    else {
      setPeriod(['', period[1]]);
    }
  }, [period]);

  const handleSelectOnChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setPeriod([period[0], e.target.value]);
  }, [period]);

  const handleTargetPeriodSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!+period[0] || !isValidNumber) {
        setIsValidNumber(false);
        e.stopPropagation();
      } else {
        const checkPeriod = await fetch(`/api/check/period/${period.join('')}`);
        const checkInterval = await fetch(`/api/check/interval/${selectedInterval}`);
        if (checkPeriod.ok && checkInterval.ok) {
          dispatch(updatePeriod(period.join('')));
          dispatch(updateInterval(selectedInterval));
          closePopup();
        }
        else throw new Error("Invalid period.");
      }
    }
    catch (err: unknown) {
      console.error(err);
    }
  }, [period, selectedInterval]);

  const handleIntervalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // e.preventDefault();
    setSelectedInterval(e.target.value);
  }, []);

  return (
    <Form onSubmit={handleTargetPeriodSubmit} noValidate>
      <div>
        <h5 className="text-center mb-3">Period of time</h5>
      </div>
      <div className="w-100 d-inline-flex justify-content-center">
      <Form.Group className="number-input-container">
        <Form.Control
          value={period[0]}
          onChange={handleNumberOnChange}
          isInvalid={!isValidNumber}
          required
        />
        <Form.Control.Feedback type='invalid'>
          The number must be in range between {min} - {max}.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="select-input-container">
        <Form.Select value={period[1]} onChange={handleSelectOnChange}>
          {
            Object.entries(UNITS).map(([unit, fullUnitName]) => 
              <option 
            key={unit} 
            value={unit}
            >
                {fullUnitName}
              </option>
            )
          }
        </Form.Select>
      </Form.Group>
      </div>
      <div>
        <h5 className="text-center mb-3">Interval</h5>
      </div>
      <Form.Group className="px-3 d-flex justify-content-center align-items-center flex-wrap">
          {
            intervalList.map((option, i) => (
              <span className="interval-btn mx-1 mb-2" key={i}>
                <label
                  htmlFor={i.toString()}
                  className={selectedInterval === option ? "selected" : undefined}
                >
                  {option}
                </label>
                <input
                  id={i.toString()}
                  className="check-btn"
                  type="radio"
                  name="interval"
                  value={option}
                  onChange={handleIntervalChange}
                  checked={selectedInterval === option}
                />
              </span>
            ))
          }
      </Form.Group>
      <FormActionButtons closeForm={closePopup}/>
    </Form>
  )
}

export default TargetEditor