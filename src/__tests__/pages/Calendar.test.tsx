import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import Calendar from '../../pages/Calendar';
import { translations } from '../../translations';
import { format } from 'date-fns';

describe('Calendar page', () => {
  const zh = translations.zh;

  it('renders the current month and year in the header', () => {
    renderWithProviders(<Calendar />);
    const now = new Date();
    const monthYear = format(now, 'MMMM yyyy');
    expect(screen.getByText(monthYear)).toBeInTheDocument();
  });

  it('renders day-of-week headers', () => {
    renderWithProviders(<Calendar />);
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  it('navigates to the next month when the next button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Calendar />);
    const now = new Date();
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextMonthYear = format(nextMonthDate, 'MMMM yyyy');

    const [prevBtn, nextBtn] = screen.getAllByRole('button').filter(btn =>
      btn.querySelector('svg')
    );
    await user.click(nextBtn);
    expect(screen.getByText(nextMonthYear)).toBeInTheDocument();
  });

  it('navigates to the previous month when the prev button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Calendar />);
    const now = new Date();
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthYear = format(prevMonthDate, 'MMMM yyyy');

    const [prevBtn] = screen.getAllByRole('button').filter(btn =>
      btn.querySelector('svg')
    );
    await user.click(prevBtn);
    expect(screen.getByText(prevMonthYear)).toBeInTheDocument();
  });

  it('shows the Add Event (+) button', () => {
    renderWithProviders(<Calendar />);
    // The circular + button has bg-primary and rounded-full and w-10 classes
    const allButtons = screen.getAllByRole('button');
    const plusBtn = allButtons.find(btn =>
      btn.className.includes('bg-primary') && btn.className.includes('rounded-full') && btn.className.includes('w-10')
    );
    expect(plusBtn).toBeDefined();
  });

  it('opens the Add Event modal when + button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Calendar />);
    const allButtons = screen.getAllByRole('button');
    const plusBtn = allButtons.find(btn =>
      btn.className.includes('bg-primary') && btn.className.includes('rounded-full') && btn.className.includes('w-10')
    );
    if (plusBtn) {
      await user.click(plusBtn);
      expect(screen.getByText(zh.calendar.addEvent)).toBeInTheDocument();
    }
  });

  it('can add a custom event', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Calendar />);

    // Open modal using the + button (w-10 h-10 rounded-full bg-primary)
    const allButtons = screen.getAllByRole('button');
    const plusBtn = allButtons.find(btn =>
      btn.className.includes('bg-primary') && btn.className.includes('rounded-full') && btn.className.includes('w-10')
    );
    expect(plusBtn).toBeDefined();
    await user.click(plusBtn!);
    expect(screen.getByText(zh.calendar.addEvent)).toBeInTheDocument();

    // Fill in the title
    const titleInput = screen.getByPlaceholderText('e.g., Repotting');
    await user.type(titleInput, 'Test Event');

    // Submit
    const saveBtn = screen.getByRole('button', { name: zh.calendar.saveEvent });
    await user.click(saveBtn);

    // Modal closes and event appears
    expect(screen.queryByText(zh.calendar.addEvent)).not.toBeInTheDocument();
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('closes the modal when X is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Calendar />);

    const allButtons = screen.getAllByRole('button');
    const plusBtn = allButtons.find(btn =>
      btn.className.includes('bg-primary') && btn.className.includes('rounded-full') && btn.className.includes('w-10')
    );
    await user.click(plusBtn!);
    expect(screen.getByText(zh.calendar.addEvent)).toBeInTheDocument();

    // The X close button in the modal does NOT have 'text-on-surface' (unlike nav buttons)
    const modalButtons = screen.getAllByRole('button');
    const closeBtn = modalButtons.find(btn =>
      btn.className.includes('p-2') &&
      btn.className.includes('rounded-full') &&
      !btn.className.includes('bg-primary') &&
      !btn.className.includes('text-on-surface')
    );
    expect(closeBtn).toBeDefined();
    await user.click(closeBtn!);
    expect(screen.queryByText(zh.calendar.addEvent)).not.toBeInTheDocument();
  });
});
