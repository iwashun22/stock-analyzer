import { useState, useEffect, useCallback } from 'react';
import Popup from '../Popup';
import { FaRegPlusSquare } from 'react-icons/fa';
import { IoMdArrowBack } from 'react-icons/io';
import axios from 'axios';
import IndicatorForm from './IndicatorForm';
import './index.scss';

const separator = "::";
const split = (str: string) => str.split(separator);
const join = (...str: string[]) => str.join(separator);

function TechnicalIndicators() {
  const [showForm, setShowForm] = useState(false);
  const [indicators, setIndicators] = useState<{[key: string]: unknown}>({});
  const [error, setError] = useState<string>('');
  const [selectedIndicator, setSelectedIndicator] = useState('');

  useEffect(() => {
    axios.get('/api/indicators')
      .then(response => {
        setIndicators(response.data);
      })
      .catch(err => {
        setError(err.toString());
      })
  }, [])

  const handleCloseButton = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedIndicator) {
      setSelectedIndicator('');
    }
    else {
      setShowForm(false);
    }
  }, [selectedIndicator]);

  return (
    <>
      <Popup show={!!error} onClose={() => setError('')} variant='error'>
        <h5 className="text-center">{error}</h5>
      </Popup>
      <div className="d-flex justify-content-center mt-3">
        <button className="open-form-btn" onClick={() => setShowForm(true)}>
          <FaRegPlusSquare className="plus-icon"/>
        </button>
      </div>
      <Popup show={showForm} onClose={handleCloseButton} CustomButton={!selectedIndicator ? null : IoMdArrowBack}>
        {
          !selectedIndicator ?
            Object.entries(indicators).map(([indicatorType, obj], i) => (
              <div className="mb-3" key={i}>
                <h5 className="text-capitalize">
                  {indicatorType.replace('-', ' ')}
                </h5>
                {
                  Object.entries(obj as object).map(([abbrev, fullName], j) => (
                    <button 
                      key={j}
                      onClick={() => setSelectedIndicator(join(abbrev, fullName))}
                      className="indicator-btn"
                    >
                      {abbrev}
                    </button>
                  ))
                }
              </div>
            ))
          : <IndicatorForm indicator={split(selectedIndicator)}/>
        }
      </Popup> 
      <div className="graph-container">

      </div>
    </>
  )
}

export default TechnicalIndicators