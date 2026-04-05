import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import BottomNav from '../../components/BottomNav';
import { translations } from '../../translations';

describe('BottomNav', () => {
  const zh = translations.zh.nav;

  it('renders all 5 navigation items', () => {
    renderWithProviders(<BottomNav />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(5);
  });

  it('renders the Garden nav item with correct label and link', () => {
    renderWithProviders(<BottomNav />);
    const link = screen.getByRole('link', { name: new RegExp(zh.garden) });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the Calendar nav item with correct label and link', () => {
    renderWithProviders(<BottomNav />);
    const link = screen.getByRole('link', { name: new RegExp(zh.calendar) });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/calendar');
  });

  it('renders the Add nav item with correct label and link', () => {
    renderWithProviders(<BottomNav />);
    const link = screen.getByRole('link', { name: new RegExp(zh.add) });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/add');
  });

  it('renders the Compare nav item with correct label and link', () => {
    renderWithProviders(<BottomNav />);
    const link = screen.getByRole('link', { name: new RegExp(zh.compare) });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/compare');
  });

  it('renders the Graveyard nav item with correct label and link', () => {
    renderWithProviders(<BottomNav />);
    const link = screen.getByRole('link', { name: new RegExp(zh.graveyard) });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/graveyard');
  });
});
