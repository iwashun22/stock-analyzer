import React, { useEffect, useCallback, useState } from 'react';
import { useDebounce } from '@/util/helper';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { updateValidity, updateSymbol } from '@/features/targetSlice';
import { useNavigate } from 'react-router';
import CustomNavbar from '@/components/CustomNavbar';
import AboutApp from '@/components/AboutApp';
import Footer from '@/components/Footer';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import './Home.scss';

const errMessage = {
  empty: "Must provide a symbol.",
  invalidSymbol: "Could not find the specified symbol.",
  other: "Something went wrong."
} as const;

function Home() {
  const [symbol, setSymbol] = useState<string>('');
  const debouncedInput = useDebounce(symbol, 1000);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [edited, setEdited] = useState<boolean>(false);
  const target = useSelector((state: RootState) => state.target);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load from saved target
  useEffect(() => {
    setSymbol(target.symbol);
    if (!target.symbol && !target.isValidSymbol) {
      setError(errMessage.empty);
    }
    else if (!target.isValidSymbol) {
      setError(errMessage.invalidSymbol);
    }
  }, []);

  const checkEmpty = useCallback(<T extends HTMLFormElement>(e: React.ChangeEvent<T>) => {
    e.preventDefault();
    setEdited(true);
    const form = e.currentTarget;
    if(error || form.checkValidity() === false || loading) {
      e.stopPropagation();
    }
    else {
      dispatch(updateSymbol(symbol));
      dispatch(updateValidity(true));
      navigate('/analyzer');
    }
  }, [symbol, error, loading]);

  let controller: AbortController = new AbortController();
  const handleInput = useCallback(async <T extends HTMLInputElement>(e: React.ChangeEvent<T>) => {
    e.preventDefault();
    setEdited(true);
    const uppercase = e.target.value.toUpperCase();
    setSymbol(uppercase);

    if (!uppercase) {
      setError(errMessage.empty);
      setLoading(false);
    }
    else {
      setError('');
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    if (debouncedInput) {
      const fetchSymbol = async () => {
        // Abort any ongoing request before starting a new one
        controller.abort();
        controller = new AbortController();
        try {
          const response = await fetch(`/api/info/${debouncedInput}`, { signal: controller.signal });
          if (!response.ok) {
            setError(errMessage.invalidSymbol);
          }
          setLoading(false);
        }
        catch (error) {
          if ((error as Error).name === "AbortError") return;
          else {
            setError(errMessage.other);
            setLoading(false);
          }
        }
      }

      fetchSymbol();
    }
  }, [debouncedInput])

  return (
    <>
    <CustomNavbar />
    <div className="main-wrapper">
      <div className="header">
        <h1 className="header-title">stock analyzer</h1>
      </div>
      <div className="input-field">
        <Form 
          onSubmit={checkEmpty}
          noValidate
        >
          <div className="form-wrapper">
            <Form.Group as={Col} className="symbol-input-wrapper">
              <Form.Control 
                type="text"
                className="symbol-input"
                placeholder="SYMBOL"
                required
                onChange={handleInput}
                value={symbol}
                isValid={!error && !loading}
                isInvalid={!!error && edited}
                />
              <Form.Control.Feedback type="invalid">
                { error }
              </Form.Control.Feedback>
              {
                loading ?
                <Spinner size="sm" animation="border" variant="light">
                  <span className="visually-hidden">Loading...</span>
                </Spinner> :
                <Form.Control.Feedback>
                  Valid symbol.
                </Form.Control.Feedback>
              }
            </Form.Group>
            <Form.Group as={Col} className="input-submit">
              <Button 
                type="submit"
                className="px-4 submit-btn"
              >
                LOOK UP
              </Button>
            </Form.Group>
          </div>
        </Form>
      </div>
    </div>
    <AboutApp/>
    <Footer />
    </>
  )
}

export default Home