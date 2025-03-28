import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteGraph } from '@/features/graphSlice';
import type { RootState } from '@/store';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { FaTrashAlt, FaEdit, FaInfoCircle } from 'react-icons/fa';
import { FaArrowRotateRight } from 'react-icons/fa6';
import Popup from '../Popup';
import IndicatorForm from './IndicatorForm';
import Docs from './Description';
import { BiError } from 'react-icons/bi';
import { delay } from '@/util/helper';
import './ShowGraph.scss';

function ShowGraph({ indicatorMap }: {
  indicatorMap: Map<string, string>
}) {
  const graphs = useSelector((state: RootState) => state.graph.list);
  const { symbol, period, interval } = useSelector((state: RootState) => state.target);
  const [images, setImages] = useState<Array<{ id: string, url: string | undefined }>>(graphs.map(v => { return { id: v.id, url: '' } }));
  const [graphAdded, setGraphAdded] = useState(true);
  const [reloadAll, setReloadAll] = useState(false);

  useEffect(() => {
    if (reloadAll) {
      // This means that the symbol or the period has changed.
      // It is required to reload all images.
      setImages(graphs.map(v => {
        return {
          id: v.id,
          url: '',
        }
      }));
    }

    const fetchImages = async () => {
      for (let i=0; i < graphs.length; i++) {
        // Skip unnecessary reload if one graph is added.
        if (images[i].url && graphAdded) continue;

        try {
          const obj = {
            indicator: graphs[i].indicator,
            period,
            symbol,
            interval,
            ...graphs[i].params
          }
          await delay(1000);
          const response = await axios.get(`/api/graph`, {
            params: obj,
            responseType: 'blob'
          });
          if (response.status !== 200) throw new Error()
          const imageUrl = URL.createObjectURL(response.data);

          setImages(state => {
            const copied = [...state];
            copied[i] = {
              id: graphs[i].id,
              url: imageUrl,
            }
            return copied;
          })
        }
        catch (err) {
          setImages(state => {
            const copied = [...state];
            copied[i].url = undefined;
            return copied;
          })
        }
      }
    }

    fetchImages()
      .then(() => {
        setGraphAdded(false);
        setReloadAll(false);
      });

    return () => {
      images.forEach(image => {
        if (image.url) {
          URL.revokeObjectURL(image.url);
        }
      });
    }
  }, [reloadAll, graphAdded]);

  useEffect(() => {
    setReloadAll(true);
  }, [symbol, period, interval]);

  useEffect(() => {
    if (graphs.length > images.length) {
      setImages(state =>
        [...state, { id: graphs[graphs.length - 1].id, url: '' }]
      );
      setGraphAdded(true);
    }
    else {
      setGraphAdded(false);
    }
  }, [graphs])

  return (
    <div className="graph-container">
      {
        graphs.map((v, i) => 
          <Graph
            indicator={v.indicator}
            fullname={indicatorMap.get(v.indicator) as string}
            id={v.id} key={i}
            imageUrl={images[i]?.url}
            deleteFromList={() => setImages(state => state.filter(x => x.id !== v.id))}
          />
        )
      }
    </div>
  )
}


function Graph({ indicator, fullname, id, imageUrl, deleteFromList }: {
  indicator: string,
  fullname: string,
  id: string,
  imageUrl: string | undefined,
  deleteFromList: () => unknown,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [requireReload, setRequireReload] = useState(false);
  const [dataUrl, setDataUrl] = useState(imageUrl);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const { symbol, period, interval } = useSelector((state: RootState) => state.target);
  const graphs = useSelector((state: RootState) => state.graph.list);
  const [params, setParams] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    // memo: if imageUrl (image.url) is undefined, an error has occurred.
    if (imageUrl === undefined) {
      setError(false);
      setLoaded(false);
    }
    // memo: if imageUrl is an empty string, it is in a loading state.
    else if (imageUrl === '') {
      setError(true);
      setLoaded(true);
    }
    else {
      setError(false);
      setLoaded(true);
      setDataUrl(imageUrl);
    }
  }, [imageUrl]);

  useEffect(() => {
    const newParams = graphs.filter(v => v.id === id)[0].params;
    setParams(newParams);
  }, [graphs])

  useEffect(() => {
    if (!requireReload) return;

    setLoaded(false);

    const fetchNewImage = async () => {
      try {
        const response = await axios.get('/api/graph', {
          params: {
            indicator,
            symbol,
            period,
            interval,
            ...params,
          },
          responseType: 'blob',
        });

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }

        const newUrl = URL.createObjectURL(response.data);
        if (typeof dataUrl === 'string') URL.revokeObjectURL(dataUrl);
        setDataUrl(newUrl);
        setError(false);
      }
      catch (err) {
        setError(true);
        if (axios.isAxiosError(err)) {
          const errorText = await (err.response?.data as Blob).text();
          console.log(errorText);
        }
        else {
          console.log('Unexpected Error:', err);
        }
      }
      finally {
        setLoaded(true);
        setRequireReload(false);
      }
    }

    fetchNewImage();
  }, [params]);

  useEffect(() => {
    if (imageUrl === '') {
      setError(false);
      setLoaded(false);
    }
    else {
      setError(imageUrl ? false : true);
      setDataUrl(imageUrl);
      setLoaded(true);
    }
  }, [imageUrl])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setLoaded(false);

    setTimeout(() => {
      dispatch(deleteGraph(id));
      setLoaded(true);
      deleteFromList();
    }, 300);
  }, [id]);

  if (!loaded) return (
    <div className="loader-container">
      <Spinner/>
    </div>
  )

  if (error) return (
    <>
      <Popup show={showDescription} onClose={() => setShowDescription(false)}>
        <Docs indicator={indicator} fullname={fullname}/>
      </Popup>
      <Popup show={showEditForm} onClose={() => setShowEditForm(false)}>
        <IndicatorForm 
          indicator={[indicator, fullname]}
          defaultParams={{ ...params }}
          modifyId={id}
          afterSubmit={() => { setShowEditForm(false); setRequireReload(true); }}
          closeForm={() => setShowEditForm(false)}
        />
      </Popup>
      <Template 
        indicator={indicator}
        deleteButtonOnClick={handleDelete}
        helpButtonOnClick={() => setShowDescription(true)}
        reloadButtonOnClick={() => {
          setRequireReload(true);
          setParams({ ...params });
        }}
        editButtonOnClick={() => setShowEditForm(true)}
      />
    </>
  )

  return (
    <>
      <Popup show={showEditForm} onClose={() => setShowEditForm(false)}>
        <IndicatorForm 
          indicator={[indicator, fullname]}
          defaultParams={{ ...params }}
          modifyId={id}
          afterSubmit={() => { setShowEditForm(false); setRequireReload(true); }}
          closeForm={() => setShowEditForm(false)}
        />
      </Popup>
      <Popup show={showDescription} onClose={() => setShowDescription(false)}>
        <Docs indicator={indicator} fullname={fullname}/>
      </Popup>
      <Template
        indicator={indicator}
        dataUrl={dataUrl}
        editButtonOnClick={() => setShowEditForm(true)}
        helpButtonOnClick={() => setShowDescription(true)}
        deleteButtonOnClick={handleDelete}
        reloadButtonOnClick={() => {
          setRequireReload(true);
          setParams({ ...params })
        }}
      />
    </>
  )
}

type TemplateProps = {
  indicator: string,
  dataUrl?: string,
  hideEdit?: boolean,
  helpButtonOnClick?: (e: React.MouseEvent) => unknown,
  editButtonOnClick?: (e: React.MouseEvent) => unknown,
  deleteButtonOnClick?: (e: React.MouseEvent) => unknown,
  reloadButtonOnClick?: ((e: React.MouseEvent) => unknown) | undefined,
};
function Template({ 
  indicator,
  dataUrl = '',
  hideEdit = false,
  helpButtonOnClick = () => {},
  editButtonOnClick = () => {},
  deleteButtonOnClick = () => {},
  reloadButtonOnClick = undefined
}: TemplateProps) {
  return (
    <div className="text-center mb-4">
      <div className="config-container">
        <button className="info-btn" onClick={helpButtonOnClick}>
          <FaInfoCircle className="icon"/>
        </button>
        <h5 className="text-light indicator-name mx-4">{indicator}</h5>
        <div>
          {
            !!reloadButtonOnClick &&
            <button className="reload-btn" onClick={reloadButtonOnClick}>
              <FaArrowRotateRight className="icon"/>
            </button>
          }
          {
            !hideEdit &&
            <button className="edit-btn" onClick={editButtonOnClick}>
              <FaEdit className="icon"/>
            </button>
          }
          <button className="delete-btn" onClick={deleteButtonOnClick}>
            <FaTrashAlt className="icon"/>
          </button>
        </div>
      </div>
      <span className="graph-image-wrapper">
        {
          !dataUrl ?
          <BiError className="error-img-icon"/>
          :
          <img src={dataUrl} alt={`Indicator graph (${indicator})`} />
        }
      </span>
    </div>
  )
}

export default ShowGraph;