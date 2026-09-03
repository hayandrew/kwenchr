import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Distance from './Distance'

describe('Distance Component', () => {
  it('renders with selected value label', () => {
    render(<Distance value="1" onChange={() => {}} />)

    // Button displays "1 mile"
    expect(screen.getByRole('button', { name: /1 mile/i })).toBeInTheDocument()
  })

  it('toggles dropdown on button click and lists options', () => {
    render(<Distance value="all" onChange={() => {}} />)

    const triggerBtn = screen.getByRole('button', { name: /Closest/i })
    
    // Dropdown content should not be active initially
    expect(screen.queryByText('1 mile')).not.toBeInTheDocument()

    // Click to open
    fireEvent.click(triggerBtn)
    expect(screen.getByText('0.5 miles')).toBeInTheDocument()
    expect(screen.getByText('1 mile')).toBeInTheDocument()
    expect(screen.getByText('2 miles')).toBeInTheDocument()
    expect(screen.getByText('5 miles')).toBeInTheDocument()
  })

  it('calls onChange with correct value and closes dropdown when an option is clicked', () => {
    const handleChange = vi.fn()
    render(<Distance value="all" onChange={handleChange} />)

    const triggerBtn = screen.getByRole('button', { name: /Closest/i })
    fireEvent.click(triggerBtn)

    const oneMileBtn = screen.getByRole('button', { name: '1 mile' })
    fireEvent.click(oneMileBtn)

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith('1')
    
    // Dropdown should close after selection
    expect(screen.queryByText('0.5 miles')).not.toBeInTheDocument()
  })
})
