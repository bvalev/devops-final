import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './reducers/store';
import App from './App';

test('renders the App div', () => {
  const { container } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(container.firstChild).toHaveClass('App');
});
