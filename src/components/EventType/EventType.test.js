import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EventType from './EventType'

describe('EventType Component', () => {
  it('renders with default label when value list is empty', () => {
    render(<EventType value={[]} onChange={() => {}} />)
    expect(screen.getByText('Event Types')).toBeInTheDocument()
  })

  it('renders counter label based on selected values', () => {
    const { rerender } = render(<EventType value={['comedy']} onChange={() => {}} />)
    expect(screen.getByText('1 Type Selected')).toBeInTheDocument()

    rerender(<EventType value={['comedy', 'happy-hour']} onChange={() => {}} />)
    expect(screen.getByText('2 Types Selected')).toBeInTheDocument()
  })

  it('toggles dropdown and updates value list when checking options', () => {
    const handleChange = vi.fn()
    render(<EventType value={['comedy']} onChange={handleChange} />)

    const triggerBtn = screen.getByRole('button')
    fireEvent.click(triggerBtn)

    // Verify checked option is checked, and others are unchecked
    const comedyCheckbox = screen.getByLabelText('Comedy')
    const happyHourCheckbox = screen.getByLabelText('Happy Hour')

    expect(comedyCheckbox.checked).toBe(true)
    expect(happyHourCheckbox.checked).toBe(false)

    // Check happy-hour
    fireEvent.click(happyHourCheckbox)
    expect(handleChange).toHaveBeenCalledWith(['comedy', 'happy-hour'])

    // Uncheck comedy
    fireEvent.click(comedyCheckbox)
    expect(handleChange).toHaveBeenCalledWith([])
  })
})
