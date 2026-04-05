import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Header from '../../components/Header';
import { translations } from '../../translations';

describe('Header', () => {
  it('renders the app title from the current language', () => {
    renderWithProviders(<Header />);
    // Default language is 'zh'
    expect(screen.getByText(translations.zh.home.title)).toBeInTheDocument();
  });

  it('title is a link to the home page', () => {
    renderWithProviders(<Header />);
    const titleLink = screen.getByText(translations.zh.home.title).closest('a');
    expect(titleLink).toHaveAttribute('href', '/');
  });

  it('renders a link to the settings page', () => {
    renderWithProviders(<Header />);
    const settingsLinks = screen.getAllByRole('link');
    const settingsLink = settingsLinks.find(
      (el) => el.getAttribute('href') === '/settings'
    );
    expect(settingsLink).toBeInTheDocument();
  });

  it('renders the menu button', () => {
    renderWithProviders(<Header />);
    // The Menu icon is inside a button
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the user profile image', () => {
    renderWithProviders(<Header />);
    const profileImg = screen.getByAltText('User Profile');
    expect(profileImg).toBeInTheDocument();
  });
});
