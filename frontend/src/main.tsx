import { createRoot } from 'react-dom/client';
import { store } from './store.ts';
import { Provider } from 'react-redux';
import './index.css';
import App from './App.tsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
