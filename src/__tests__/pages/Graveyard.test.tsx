import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Graveyard from '../../pages/Graveyard';
import { translations } from '../../translations';
import { DEAD_PLANTS } from '../../constants';

describe('Graveyard page', () => {
  const zh = translations.zh;

  it('renders the page title', () => {
    renderWithProviders(<Graveyard />);
    expect(screen.getByText(zh.graveyard.title)).toBeInTheDocument();
  });

  it('renders the page subtitle', () => {
    renderWithProviders(<Graveyard />);
    expect(screen.getByText(zh.graveyard.subtitle)).toBeInTheDocument();
  });

  it('renders all 3 dead plants', () => {
    renderWithProviders(<Graveyard />);
    expect(screen.getByText(zh.plants.barnaby.name)).toBeInTheDocument();
    expect(screen.getByText(zh.plants.unnamedSucculent.name)).toBeInTheDocument();
    expect(screen.getByText(zh.plants.delilah.name)).toBeInTheDocument();
  });

  it('renders the period for each dead plant', () => {
    renderWithProviders(<Graveyard />);
    DEAD_PLANTS.forEach((plant) => {
      expect(screen.getByText(plant.period)).toBeInTheDocument();
    });
  });

  it('shows the Mourning Stats section', () => {
    renderWithProviders(<Graveyard />);
    expect(screen.getByText(zh.graveyard.stats)).toBeInTheDocument();
  });

  it('shows the total losses stat (14)', () => {
    renderWithProviders(<Graveyard />);
    expect(screen.getByText('14')).toBeInTheDocument();
  });

  it('shows the survival rate stat (62%)', () => {
    renderWithProviders(<Graveyard />);
    expect(screen.getByText('62%')).toBeInTheDocument();
  });

  it('shows the deadliest season as winter', () => {
    renderWithProviders(<Graveyard />);
    expect(screen.getByText(zh.graveyard.winter)).toBeInTheDocument();
  });

  it('shows the "Try Again?" CTA', () => {
    renderWithProviders(<Graveyard />);
    expect(screen.getByText(zh.graveyard.tryAgain)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: zh.graveyard.addNew })).toBeInTheDocument();
  });
});
