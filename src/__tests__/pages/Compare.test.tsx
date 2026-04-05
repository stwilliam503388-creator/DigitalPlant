import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import Compare from '../../pages/Compare';
import { translations } from '../../translations';
import { PLANTS } from '../../constants';

describe('Compare page', () => {
  const zh = translations.zh;

  it('renders the page title', () => {
    renderWithProviders(<Compare />);
    expect(screen.getByText(zh.compare.title)).toBeInTheDocument();
  });

  it('renders all 4 plants in the selection grid', () => {
    renderWithProviders(<Compare />);
    expect(screen.getByText(zh.plants.fiddleLeaf.name)).toBeInTheDocument();
    expect(screen.getByText(zh.plants.monstera.name)).toBeInTheDocument();
    expect(screen.getByText(zh.plants.snakePlant.name)).toBeInTheDocument();
    expect(screen.getByText(zh.plants.goldenPothos.name)).toBeInTheDocument();
  });

  it('shows empty state prompt when no plants are selected', () => {
    renderWithProviders(<Compare />);
    // The "Select plants to compare" text appears in both the header area and empty state
    const messages = screen.getAllByText(zh.compare.selectPlants);
    expect(messages.length).toBeGreaterThan(0);
  });

  it('does not show the comparison table when no plants are selected', () => {
    renderWithProviders(<Compare />);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows comparison table after selecting a plant', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Compare />);
    // Select the first plant button (Fiddle Leaf Fig)
    const plantButtons = screen.getAllByRole('button');
    // The plant selection buttons contain the plant name text
    const fiddleBtn = plantButtons.find(btn =>
      btn.textContent?.includes(zh.plants.fiddleLeaf.name)
    );
    expect(fiddleBtn).toBeDefined();
    await user.click(fiddleBtn!);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('shows Clear Selection button when plants are selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Compare />);
    const plantButtons = screen.getAllByRole('button');
    const fiddleBtn = plantButtons.find(btn =>
      btn.textContent?.includes(zh.plants.fiddleLeaf.name)
    );
    await user.click(fiddleBtn!);
    expect(screen.getByRole('button', { name: zh.compare.clear })).toBeInTheDocument();
  });

  it('clears selection when Clear button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Compare />);
    const plantButtons = screen.getAllByRole('button');
    const fiddleBtn = plantButtons.find(btn =>
      btn.textContent?.includes(zh.plants.fiddleLeaf.name)
    );
    await user.click(fiddleBtn!);
    expect(screen.getByRole('table')).toBeInTheDocument();

    const clearBtn = screen.getByRole('button', { name: zh.compare.clear });
    await user.click(clearBtn);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows selected plant name in the comparison table header', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Compare />);
    const plantButtons = screen.getAllByRole('button');
    const monsteraBtn = plantButtons.find(btn =>
      btn.textContent?.includes(zh.plants.monstera.name)
    );
    await user.click(monsteraBtn!);
    // Plant name appears in table header
    const table = screen.getByRole('table');
    expect(within(table).getAllByText(zh.plants.monstera.name).length).toBeGreaterThan(0);
  });

  it('shows comparison table with both plants when two are selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Compare />);
    const plantButtons = screen.getAllByRole('button');
    const fiddleBtn = plantButtons.find(btn =>
      btn.textContent?.includes(zh.plants.fiddleLeaf.name)
    );
    const monsteraBtn = plantButtons.find(btn =>
      btn.textContent?.includes(zh.plants.monstera.name)
    );
    await user.click(fiddleBtn!);
    await user.click(monsteraBtn!);
    const table = screen.getByRole('table');
    expect(within(table).getAllByText(zh.plants.fiddleLeaf.name).length).toBeGreaterThan(0);
    expect(within(table).getAllByText(zh.plants.monstera.name).length).toBeGreaterThan(0);
  });

  it('deselects a plant when clicked again', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Compare />);
    const plantButtons = screen.getAllByRole('button');
    const fiddleBtn = plantButtons.find(btn =>
      btn.textContent?.includes(zh.plants.fiddleLeaf.name)
    );
    // Select
    await user.click(fiddleBtn!);
    expect(screen.getByRole('table')).toBeInTheDocument();
    // Deselect
    await user.click(fiddleBtn!);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
