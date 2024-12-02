import { ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// Add custom render method that includes providers
function render(ui: ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent.setup(),
    ...rtlRender(ui, {
      wrapper: ({ children }) => (
        <BrowserRouter>{children}</BrowserRouter>
      ),
    }),
  };
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };
