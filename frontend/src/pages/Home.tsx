import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { updateValidity, updateSymbol } from '@/features/targetSlice';
import { useNavigate } from 'react-router';
import CustomNavbar from '@/components/CustomNavbar';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
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
      console.log(symbol);
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
    // Abort any ongoing request before starting a new one
    controller.abort();
    controller = new AbortController();
    setSymbol(uppercase);

    if (!uppercase) {
      setError(errMessage.empty);
      setLoading(false);
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/info/${uppercase}`, { signal: controller.signal });
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
  }, []);

  return (
    <>
    <CustomNavbar />
    <div className="main-wrapper">
      <div className="header">
        <h1 className="header-title">stock analyzer</h1>
      </div>
      <div className="input-field">
        <Form 
          // style={{ display: 'flex', flexDirection: 'row' }}
          onSubmit={checkEmpty}
          noValidate
          >
          <Row>
            <Form.Group as={Col}>
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
            <Form.Group as={Col}>
              <Button type="submit" variant="outline-light" className="px-4">
                LOOK UP
              </Button>
            </Form.Group>
          </Row>
        </Form>
      </div>
    </div>
    </>
  )
}

export default Home