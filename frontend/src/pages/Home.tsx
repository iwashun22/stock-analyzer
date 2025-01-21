import React, { useEffect, useCallback, useState } from 'react';
import type { RootState } from '@/store';
import { useSelector, useDispatch } from 'react-redux';
import { updateValidity, updateSymbol } from '@/features/targetSlice';
import { useNavigate } from 'react-router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './Home.scss';

function Home() {
  const [symbol, setSymbol] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const target = useSelector((state: RootState) => state.target);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const localStorageTarget = localStorage.getItem(target.storageName) || "";
    // const json = JSON.parse(localStorageTarget);
    // TODO: use JSON
    dispatch(updateSymbol(localStorageTarget))
    axios.get(`/api/info/${localStorageTarget}`)
      .then(response => {
        dispatch(updateValidity(true));
        setSymbol(localStorageTarget);
        // navigate('/analyze');
        console.log(response.data);
      })
      .catch(error => {
        dispatch(updateValidity(false));
        console.log(error);
      })
  }, [])

  const checkEmpty = useCallback(<T extends HTMLFormElement>(e: React.ChangeEvent<T>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if(error || form.checkValidity() === false || loading) {
      e.stopPropagation();
      dispatch(updateValidity(false));
    }
    else {
      dispatch(updateSymbol(symbol));
      localStorage.setItem(target.storageName, symbol);
      dispatch(updateValidity(true));
      navigate('/analyzer');
    }
  }, [error, loading]);

  const handleInput = useCallback(async <T extends HTMLInputElement>(e: React.ChangeEvent<T>) => {
    e.preventDefault();
    const uppercase = e.target.value.toUpperCase();

    setSymbol(uppercase);
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/info/${uppercase}`);
      console.log(response.json())
      if (!response.ok) {
        setError('Could not find the specified symbol.');
      }
    }
    catch (error) {
      setError('Something went wrong.');
    }
    finally {
      setLoading(false);
    }
  }, [])

  return (
    <div className='main-background'>
      <Form 
        // style={{ display: 'flex', flexDirection: 'row' }}
        onSubmit={checkEmpty}
        noValidate
      >
        <Row>
          <Form.Group as={Col}>
            <Form.Control 
              type='text'
              placeholder='SYMBOL'
              required
              onChange={handleInput}
              value={symbol}
              isValid={!error && !loading}
              isInvalid={!!error}
            />
            <Form.Control.Feedback type='invalid'>
              { error || "Must provide a symbol."}
            </Form.Control.Feedback>
            <Form.Control.Feedback>
              Valid Symbol
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col}>
            <Button type='submit' variant='outline-light' className="px-4">
              LOOK UP
            </Button>
          </Form.Group>
        </Row>
      </Form>
    </div>
  )
}

export default Home