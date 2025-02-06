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
  const graphs = useSelector((state: RootState) => state.graph.list);

  return (
    <div className="graph-container">
      {
        graphs.map((v, i) => 
          <Graph
            indicator={v.indicator}
            fullname={indicatorMap.get(v.indicator) as string}
            params={v.params}
            id={v.id} key={i}
            order={i}
          />
        )
      }
    </div>
  )
}

const delay = (ms: number) =>
  ms <= 0 ? null : new Promise(resolve => setTimeout(resolve, ms));

function Graph({ indicator, fullname, params, id, order }: {
  indicator: string,
  fullname: string,
  params: { [key: string]: any },
  id: string,
  order: number
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [requireReload, setRequireReload] = useState(true);
  const [loadAllGraphs, setLoadAllGraphs] = useState(true);
  const [dataUrl, setDataUrl] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const { symbol, period } = useSelector((state: RootState) => state.target);
  const graphs = useSelector((state: RootState) => state.graph.list);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoadAllGraphs(false);
  }, []);

  useEffect(() => {
    setRequireReload(true);
    setLoadAllGraphs(true);
  }, [symbol, period]);

  useEffect(() => {
    setLoadAllGraphs(false);
  }, [graphs])

  useEffect(() => {
    if (dataUrl && !requireReload) return;

    setLoaded(false);
    const obj = {
      indicator,
      symbol,
      period,
      ...params,
    }
    const queryString = new URLSearchParams(obj).toString();

    const fetchGraph = async () => {
      // make each fetch delay in order if loading all graphs.
      if (loadAllGraphs) {
        await delay(order * 1000);
      }

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

      setRequireReload(false);
    }

    fetchGraph();
  }, [order, requireReload, loadAllGraphs]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setLoaded(false);

    setTimeout(() => {
      dispatch(deleteGraph(id));
      setLoaded(true);
    }, 400);
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
          afterSubmit={() => { setShowEditForm(false); setRequireReload(true); }}
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