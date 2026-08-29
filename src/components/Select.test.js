import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Select from './Select'

describe('Select Component', () => {
  const options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ]

  it('renders dropdown options correctly', () => {
    render(<Select options={options} className="custom-select" value="b" onChange={() => {}} />)

    const selectEl = screen.getByRole('combobox')
    expect(selectEl).toBeInTheDocument()
    expect(selectEl).toHaveClass('custom-select')
    expect(selectEl.value).toBe('b')

    const optionEls = screen.getAllByRole('option')
    expect(optionEls).toHaveLength(3)
    expect(optionEls[0]).toHaveTextContent('Option A')
    expect(optionEls[0].value).toBe('a')
  })

  it('calls onChange handler when option is selected', () => {
    const handleChange = vi.fn()
    render(<Select options={options} value="a" onChange={handleChange} />)

    const selectEl = screen.getByRole('combobox')
    fireEvent.change(selectEl, { target: { value: 'c' } })

    expect(handleChange).toHaveBeenCalledTimes(1)
  })
})
