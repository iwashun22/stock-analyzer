import React, { useState, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import { LuCircleMinus, LuCirclePlus } from 'react-icons/lu';
import './MovingAverageForm.scss';

function MovingAverageForm({ indicatorName, abbrev, maxRangesCount }: {
  indicatorName: string,
  abbrev: string,
  maxRangesCount: number
}) {
  const [countRanges, setCountRanges] = useState<Array<string>>(['12']);

  const handleOnChange = useCallback((index: number) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const value = e.target.value;
      const lastChar = value.slice(-1);

      if (!value) {
        setCountRanges(state => {
          const mapped = state.map((v, i) => i === index ? '' : v);
          return mapped;
        })
        return;
      }

      if (!lastChar.match(/[0-9]/)) return;
      if (value.length > 2) return;

      setCountRanges(state => {
        const mapped = state.map((v, i) => i === index ? (+value).toString() : v)
        return mapped;
      });
    }
  }, [countRanges]);

  const addRange = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setCountRanges(state => [...state, '']);
  }, [countRanges]);
  
  const deleteLastRange = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const deleted = countRanges.filter((v, i) => i !== (countRanges.length - 1));
    setCountRanges(deleted);
  }, [countRanges]);

  return (
    <>
      <h5 className="text-center mb-4">{indicatorName}</h5>
      <Form>
        {
          countRanges.map((range, i) => (
            <Form.Group key={i} className="params-wrapper mb-4">
              <Form.Label>Range {i+1}</Form.Label>
              <Form.Control className="form-input" type="text" value={range} onChange={handleOnChange(i)}/>
            </Form.Group>
          ))
        }

        <div className="d-flex justify-content-end">
        {
          countRanges.length > 1 &&
          <button onClick={deleteLastRange} className="add-delete-btn">
            <LuCircleMinus className="icon"/>
          </button>
        }
        {
          countRanges.length < maxRangesCount &&
          <button onClick={addRange} className="add-delete-btn">
            <LuCirclePlus className="icon"/>
          </button>
        }
        </div>
      </Form>
    </>
  )
}

export default MovingAverageForm