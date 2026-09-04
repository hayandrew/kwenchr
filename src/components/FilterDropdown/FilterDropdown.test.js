import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FilterDropdown from './FilterDropdown'

describe('FilterDropdown Component', () => {
  it('renders with filter icon and down caret, without text label', () => {
    render(
      <FilterDropdown
        eventType={[]}
        onTypeChange={() => {}}
        distance="all"
        onDistanceChange={() => {}}
      />
    )

    const triggerBtn = screen.getByRole('button', { name: /Filters/i })
    expect(triggerBtn).toBeInTheDocument()

    // Ensure no text labels like "Event Types" or "Closest" in the trigger button
    expect(triggerBtn.textContent).toBe('')
    expect(triggerBtn.querySelector('.icon-filter')).toBeInTheDocument()
    expect(triggerBtn.querySelector('.icon-chevron-down')).toBeInTheDocument()
  })

  it('toggles dropdown on click and displays Event Types, Distance, and Done button', () => {
    render(
      <FilterDropdown
        eventType={['comedy']}
        onTypeChange={() => {}}
        distance="1"
        onDistanceChange={() => {}}
      />
    )

    const triggerBtn = screen.getByRole('button', { name: /Filters/i })

    // Initially menu is closed
    expect(screen.queryByTestId('filter-dropdown-menu')).not.toBeInTheDocument()

    // Click to open
    fireEvent.click(triggerBtn)
    expect(screen.getByTestId('filter-dropdown-menu')).toBeInTheDocument()

    // Check sections
    expect(screen.getByText('Event Types')).toBeInTheDocument()
    expect(screen.getByText('Distance')).toBeInTheDocument()

    // Check options
    expect(screen.getByLabelText('Happy Hour')).toBeInTheDocument()
    expect(screen.getByLabelText('Comedy')).toBeInTheDocument()
    expect(screen.getByLabelText('Closest')).toBeInTheDocument()
    expect(screen.getByLabelText('1 mile')).toBeInTheDocument()

    // Check Done button
    const doneBtn = screen.getByRole('button', { name: /Done/i })
    expect(doneBtn).toBeInTheDocument()
  })

  it('handles checkbox changes for event types', () => {
    const handleTypeChange = vi.fn()
    render(
      <FilterDropdown
        eventType={['comedy']}
        onTypeChange={handleTypeChange}
        distance="all"
        onDistanceChange={() => {}}
      />
    )

    const triggerBtn = screen.getByRole('button', { name: /Filters/i })
    fireEvent.click(triggerBtn)

    const comedyCheckbox = screen.getByLabelText('Comedy')
    const happyHourCheckbox = screen.getByLabelText('Happy Hour')

    expect(comedyCheckbox.checked).toBe(true)
    expect(happyHourCheckbox.checked).toBe(false)

    // Check Happy Hour
    fireEvent.click(happyHourCheckbox)
    expect(handleTypeChange).toHaveBeenCalledWith(['comedy', 'happy-hour'])

    // Uncheck Comedy
    fireEvent.click(comedyCheckbox)
    expect(handleTypeChange).toHaveBeenCalledWith([])
  })

  it('handles radio selection for distance', () => {
    const handleDistanceChange = vi.fn()
    render(
      <FilterDropdown
        eventType={[]}
        onTypeChange={() => {}}
        distance="all"
        onDistanceChange={handleDistanceChange}
      />
    )

    const triggerBtn = screen.getByRole('button', { name: /Filters/i })
    fireEvent.click(triggerBtn)

    const twoMilesRadio = screen.getByLabelText('2 miles')
    fireEvent.click(twoMilesRadio)

    expect(handleDistanceChange).toHaveBeenCalledWith('2')
  })

  it('closes dropdown when clicking the Done button', () => {
    render(
      <FilterDropdown
        eventType={[]}
        onTypeChange={() => {}}
        distance="all"
        onDistanceChange={() => {}}
      />
    )

    const triggerBtn = screen.getByRole('button', { name: /Filters/i })
    fireEvent.click(triggerBtn)
    expect(screen.getByTestId('filter-dropdown-menu')).toBeInTheDocument()

    const doneBtn = screen.getByRole('button', { name: /Done/i })
    fireEvent.click(doneBtn)

    expect(screen.queryByTestId('filter-dropdown-menu')).not.toBeInTheDocument()
  })
})
