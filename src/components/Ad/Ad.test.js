import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Ad from './Ad'

describe('Ad Component', () => {
  it('renders correctly with given dimensions and class name', () => {
    const { container } = render(<Ad extClass="custom-ad-class" width={300} height={250} />)

    // Check container element
    const containerDiv = container.firstChild
    expect(containerDiv).toHaveClass('custom-ad-class')
    expect(containerDiv).toHaveClass('ad-container')

    // Check inner text
    expect(screen.getByText('300 x 250')).toBeInTheDocument()

    // Check custom styling applied
    const holderDiv = container.querySelector('.ad-holder')
    expect(holderDiv).toHaveStyle({
      width: '300px',
      height: '250px',
    })
  })

  it('renders fine when no custom class name is provided', () => {
    const { container } = render(<Ad width={728} height={90} />)
    const containerDiv = container.firstChild
    expect(containerDiv).toHaveClass('ad-container')
    expect(containerDiv.className.trim()).toBe('ad-container')
  })

  it('renders responsive ad banner with 100% width when responsive prop is provided', () => {
    const { container } = render(<Ad height={50} responsive />)
    const containerDiv = container.firstChild
    expect(containerDiv).toHaveClass('ad-responsive')
    expect(screen.getByText('Responsive Ad')).toBeInTheDocument()

    const holderDiv = container.querySelector('.ad-holder')
    expect(holderDiv).toHaveStyle({
      width: '100%',
      height: '50px',
    })
  })
})
