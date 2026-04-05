import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import Home from '../../pages/Home';
import { translations } from '../../translations';
import { PLANTS } from '../../constants';

describe('Home page', () => {
  const zh = translations.zh;

  it('renders the page title', () => {
    renderWithProviders(<Home />);
    // Heading uses home.title
    expect(screen.getAllByText(zh.home.title).length).toBeGreaterThan(0);
  });

  it('renders the search input with placeholder', () => {
    renderWithProviders(<Home />);
    expect(screen.getByPlaceholderText(zh.home.searchPlaceholder)).toBeInTheDocument();
  });

  it('renders an "Add Plant" CTA when search is empty', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(zh.home.expandJungle)).toBeInTheDocument();
  });

  it('renders the featured plant (first plant)', () => {
    renderWithProviders(<Home />);
    // The featured plant is PLANTS[0]; we use the zh translation for its name
    expect(screen.getByText(zh.plants.fiddleLeaf.name)).toBeInTheDocument();
  });

  it('renders Log Watering button on the featured plant card', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('button', { name: new RegExp(zh.home.logWatering) })).toBeInTheDocument();
  });

  it('shows all plants before searching', () => {
    renderWithProviders(<Home />);
    // All four plants should be visible
    expect(screen.getByText(zh.plants.fiddleLeaf.name)).toBeInTheDocument();
    expect(screen.getByText(zh.plants.monstera.name)).toBeInTheDocument();
    expect(screen.getByText(zh.plants.snakePlant.name)).toBeInTheDocument();
    expect(screen.getByText(zh.plants.goldenPothos.name)).toBeInTheDocument();
  });

  it('filters plants when a search query is entered', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Home />);
    const input = screen.getByPlaceholderText(zh.home.searchPlaceholder);
    // Search by Chinese name for Monstera (龟背竹)
    await user.type(input, zh.plants.monstera.name);
    // Monstera should be visible; snake plant should not
    expect(screen.getByText(zh.plants.monstera.name)).toBeInTheDocument();
    expect(screen.queryByText(zh.plants.snakePlant.name)).not.toBeInTheDocument();
  });

  it('shows no-results message when search matches nothing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Home />);
    const input = screen.getByPlaceholderText(zh.home.searchPlaceholder);
    await user.type(input, 'xyznonexistent999');
    expect(screen.getByText(zh.home.noResults)).toBeInTheDocument();
  });

  it('shows a clear (X) button when search query is non-empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Home />);
    const input = screen.getByPlaceholderText(zh.home.searchPlaceholder);
    await user.type(input, zh.plants.monstera.name);
    expect(input).toHaveValue(zh.plants.monstera.name);
    // The X clear button should be rendered when there is a query
    // It's the only button adjacent to the search input
    const searchContainer = input.closest('div')?.parentElement;
    expect(searchContainer).toBeDefined();
    const clearButton = searchContainer?.querySelector('button');
    expect(clearButton).toBeInTheDocument();
  });

  it('clears the search when the X button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Home />);
    const input = screen.getByPlaceholderText(zh.home.searchPlaceholder);
    await user.type(input, zh.plants.monstera.name);
    expect(input).toHaveValue(zh.plants.monstera.name);
    // The clear (X) button is inside the search container
    const searchContainer = input.closest('div')?.parentElement;
    const clearButton = searchContainer?.querySelector('button') as HTMLElement;
    expect(clearButton).toBeInTheDocument();
    await user.click(clearButton);
    expect(input).toHaveValue('');
  });

  it('hides the Add Plant CTA while searching', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Home />);
    const input = screen.getByPlaceholderText(zh.home.searchPlaceholder);
    await user.type(input, zh.plants.monstera.name);
    expect(screen.queryByText(zh.home.expandJungle)).not.toBeInTheDocument();
  });

  it('links other plant cards to their detail pages', () => {
    renderWithProviders(<Home />);
    // PLANTS[1] = Monstera (id=2), its link should be /plant/2
    const monsteraLink = screen.getByRole('link', { name: new RegExp(zh.plants.monstera.name, 'i') });
    expect(monsteraLink).toHaveAttribute('href', '/plant/2');
  });
});
