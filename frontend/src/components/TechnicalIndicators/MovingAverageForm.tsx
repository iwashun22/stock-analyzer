import React, { useState, useCallback, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { LuCircleMinus, LuCirclePlus } from 'react-icons/lu';
import './MovingAverageForm.scss';

function MovingAverageForm({ indicatorName, abbrev, maxRangesCount }: {
  indicatorName: string,
  abbrev: string,
  maxRangesCount: number
}) {
  const [countRanges, setCountRanges] = useState<Array<string>>(['12']);
  const [invalidIndex, setInvalidIndex] = useState(-1);
  const [invalidFeedback, setInvalidFeedback] = useState('');

  const handleOnChange = useCallback((index: number) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const value = e.target.value;
      const lastChar = value.slice(-1);

      if (index === invalidIndex) {
        setInvalidIndex(-1);
      }

      if (!value) {
        setCountRanges(state => state.map((v, i) => i === index ? '' : v));
        return;
      }

      if (!lastChar.match(/[0-9]/) || value.length > 2) return;

      setCountRanges(state => state.map((v, i) => i === index ? (+value).toString() : v));
    }
  }, [invalidIndex]);

  const addRange = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setCountRanges(state => [...state, '']);
  }, []);
  
  const deleteLastRange = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setCountRanges(state => state.slice(0, -1));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (countRanges.includes('')) {
      const errorIndex = countRanges.findIndex(v => v === '');
      setInvalidIndex(errorIndex);
      setInvalidFeedback('This field is empty.');
      return;
    }

    const uniqueMap = new Map<string, boolean>();
    countRanges.forEach((range, i) => {
      if (uniqueMap.get(range)) {
        setInvalidIndex(i);
        setInvalidFeedback('Having duplicate number.');
      }
      uniqueMap.set(range, true);
    })
  }, [countRanges]);

  return (
    <>
      <h5 className="text-center mb-4">{indicatorName}</h5>
      <form onSubmit={handleSubmit}>
        {
          countRanges.map((range, i) => (
              <InputGroup key={i} hasValidation className="params-wrapper mb-4">
                <InputGroup.Text>Range {i+1}</InputGroup.Text>
                <Form.Control
                  className="form-input"
                  type="text"
                  value={range}
                  onChange={handleOnChange(i)}
                  isInvalid={i === invalidIndex}
                />
                <Form.Control.Feedback type='invalid' tooltip>
                  {invalidFeedback}
                </Form.Control.Feedback>
              </InputGroup>
          ))
        }

        <div className="d-flex justify-content-end">
        {
          countRanges.length > 1 &&
          <button
            type="button"
            onClick={deleteLastRange}
            className="add-delete-btn"
          >
            <LuCircleMinus className="icon"/>
          </button>
        }
        {
          countRanges.length < maxRangesCount &&
          <button
            type="button"
            onClick={addRange}
            className="add-delete-btn"
          >
            <LuCirclePlus className="icon"/>
          </button>
        }
        </div>
        <input type="submit" value="ok" />
      </form>
    </>
  )
}

export default MovingAverageForm