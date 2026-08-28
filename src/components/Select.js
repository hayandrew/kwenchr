import React from 'react'

export default function Select({ options, className, onChange, value }) {
  return (
    <div className="select-wrapper">
      <select className={className} onChange={onChange} value={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
