import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteGraph } from '@/features/graphSlice';
import type { RootState } from '@/store';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import Popup from '../Popup';
import IndicatorForm from './IndicatorForm';
import './ShowGraph.scss';

function ShowGraph({ indicatorMap }: {
  indicatorMap: Map<string, string>
}) {
  const graph = useSelector((state: RootState) => state.graph.list);
  const target = useSelector((state: RootState) => state.target);
  const [targetChanged, setTargetChanged] = useState(true);
  const [countLoaded, setCountLoaded] = useState(0);

  useEffect(() => {
    setTargetChanged(false);
    setCountLoaded(0);
  }, [graph]);

  useEffect(() => {
    setTargetChanged(true);
    setCountLoaded(0);
  }, [target]);

  return (
    <div className="graph-container">
      {
        graph.map((v, i) => 
          <Graph
            indicator={v.indicator}
            fullname={indicatorMap.get(v.indicator) as string}
            params={v.params}
            symbol={target.symbol}
            period={target.period}
            id={v.id} key={i}
            order={(i+1) - countLoaded}
            targetChanged={targetChanged}
          />
        )
      }
    </div>
  )
}

function Graph({ indicator, fullname, params, symbol, period, id, order, targetChanged }: {
  indicator: string,
  fullname: string,
  params: { [key: string]: any },
  symbol: string,
  period: string,
  id: string,
  order: number,
  targetChanged: boolean,
}) {
  const [loaded, setLoaded] = useState(false);
  const [reload, setReload] = useState(false);
  const [error, setError] = useState(false);
  const [dataUrl, setDataUrl] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const dispatch = useDispatch();
  const delay = useCallback((ms: number) =>
    ms <= 0 ? null : new Promise(resolve => setTimeout(resolve, ms)),
  []);

  useEffect(() => {
    if (!targetChanged && dataUrl && !reload) return;

    setLoaded(false);
    const obj = {
      indicator,
      symbol,
      period,
      ...params,
    }
    const queryString = new URLSearchParams(obj).toString();

    const fetchGraph = async () => {
      await delay(order * 1000);

      try  {
        const response = await axios.get(`/api/graph?${queryString}`);
        const dataUrl = response.data.imageUrl ?? '';

        if (!dataUrl) throw new Error();

        setDataUrl(dataUrl);
        setLoaded(true);
      }
      catch (err) {
        setLoaded(true);
        setError(true);
      }
    }

    fetchGraph();
  }, [order, targetChanged, reload]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(deleteGraph(id));
  }, [id]);

  if (!loaded) return (
    <div className="loader-container">
      <Spinner/>
    </div>
  )

  if (error) return (
    <div></div>
  )

  return (
    <>
      <Popup show={showEditForm} onClose={() => setShowEditForm(false)}>
        <IndicatorForm 
          indicator={[indicator, fullname]}
          defaultParams={{ ...params }}
          modifyId={id}
          afterSubmit={() => { setShowEditForm(false); setReload(true); }}
        />
      </Popup>
      <div className="text-center">
        <div className="config-container">
          <h5 className="text-light indicator-name">{indicator}</h5>
          <div>
            <button className="edit-btn" onClick={() => setShowEditForm(true)}>
              <FaEdit className="icon"/>
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              <FaTrashAlt className="icon"/>
            </button>
          </div>
        </div>
        <span className="graph-image-wrapper">
          <img src={dataUrl} alt={`Indicator graph (${indicator})`} />
        </span>
      </div>
    </>
  )
}

export default ShowGraph