import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { NotificationProvider } from '../../contexts/NotificationContext';
import PlantDetail from '../../pages/PlantDetail';
import { translations } from '../../translations';
import { PLANTS } from '../../constants';

function renderPlantDetail(plantId: string) {
  return render(
    <MemoryRouter initialEntries={[`/plant/${plantId}`]}>
      <LanguageProvider>
        <ThemeProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/plant/:id" element={<PlantDetail />} />
            </Routes>
          </NotificationProvider>
        </ThemeProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('PlantDetail page', () => {
  const zh = translations.zh;

  it('renders the plant name for plant id=1', () => {
    renderPlantDetail('1');
    expect(screen.getByText(zh.plants.fiddleLeaf.scientificName)).toBeInTheDocument();
  });

  it('renders the Care Essence section heading', () => {
    renderPlantDetail('1');
    expect(screen.getByText(zh.detail.careEssence)).toBeInTheDocument();
  });

  it('renders the Next Water quick stat', () => {
    renderPlantDetail('1');
    expect(screen.getByText(zh.detail.nextWater)).toBeInTheDocument();
  });

  it('renders the Light quick stat', () => {
    renderPlantDetail('1');
    expect(screen.getAllByText(zh.detail.light).length).toBeGreaterThan(0);
  });

  it('renders the Humidity quick stat', () => {
    renderPlantDetail('1');
    expect(screen.getByText(zh.detail.humidity)).toBeInTheDocument();
  });

  it('renders the plant history when available', () => {
    renderPlantDetail('1');
    // PLANTS[0].history[0].event = 'Watered & Misted' (raw English from constants)
    // PlantDetail renders history.event directly from constants, not from translations
    expect(screen.getByText('Watered & Misted')).toBeInTheDocument();
  });

  it('renders the Add History button', () => {
    renderPlantDetail('1');
    const addBtn = screen.getAllByText(zh.detail.addHistory);
    expect(addBtn.length).toBeGreaterThan(0);
  });

  it('opens the Add History modal when the Add History button is clicked', async () => {
    const user = userEvent.setup();
    renderPlantDetail('1');
    // There are multiple elements with this text; find the button specifically
    const addButtons = screen.getAllByRole('button', { name: new RegExp(zh.detail.addHistory) });
    await user.click(addButtons[0]);
    // Modal opens - it shows the same heading plus form fields
    const inputs = screen.getAllByRole('textbox');
    // At least the event name input should appear in the modal
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('renders plant detail for plant id=2 (Monstera)', () => {
    renderPlantDetail('2');
    expect(screen.getByText(zh.plants.monstera.scientificName)).toBeInTheDocument();
  });

  it('falls back to first plant for unknown id', () => {
    renderPlantDetail('999');
    // Should render the first plant (Fiddle Leaf Fig) as fallback
    expect(screen.getByText(zh.plants.fiddleLeaf.scientificName)).toBeInTheDocument();
  });
});

