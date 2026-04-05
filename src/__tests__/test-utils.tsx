import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { NotificationProvider } from '../contexts/NotificationContext';

interface ProvidersProps {
  children: React.ReactNode;
  initialPath?: string;
}

function AllProviders({ children, initialPath = '/' }: ProvidersProps) {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <LanguageProvider>
        <ThemeProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ThemeProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialPath?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  { initialPath = '/', ...renderOptions }: CustomRenderOptions = {}
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders initialPath={initialPath}>{children}</AllProviders>
    ),
    ...renderOptions,
  });
}

export * from '@testing-library/react';
