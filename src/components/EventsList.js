'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import calculateDistance from './utilities/calculateDistance'
import formatTime from './utilities/formatTime'

export default function EventsList({
  events = [],
  hasMore: propHasMore,
  isLoadingMore: propIsLoadingMore,
  onLoadMore
}) {
  const [internalLimit, setInternalLimit] = useState(10)
  const [internalLoading, setInternalLoading] = useState(false)
  const sentinelRef = useRef(null)

  const isControlled = typeof onLoadMore === 'function' || propHasMore !== undefined || propIsLoadingMore !== undefined
  const displayLimit = (typeof onLoadMore === 'function' || propHasMore !== undefined) ? events.length : internalLimit
  const hasMore = propHasMore !== undefined ? propHasMore : (events && events.length > internalLimit)
  const isLoadingMore = propIsLoadingMore !== undefined ? propIsLoadingMore : internalLoading

  const handleLoadMore = useCallback(() => {
    if (isControlled) {
      onLoadMore()
    } else {
      if (internalLoading || internalLimit >= (events ? events.length : 0)) return
      setInternalLoading(true)
      setTimeout(() => {
        setInternalLimit(prev => prev + 10)
        setInternalLoading(false)
      }, 400)
    }
  }, [isControlled, onLoadMore, internalLoading, internalLimit, events])

  useEffect(() => {
    if (!hasMore || isLoadingMore) return

    const sentinel = sentinelRef.current
    if (!sentinel) return

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          handleLoadMore()
        }
      }, {
        rootMargin: '100px'
      })

      observer.observe(sentinel)
      return () => observer.disconnect()
    }
  }, [hasMore, isLoadingMore, handleLoadMore])

  if (!events || events.length === 0) {
    return (
      <div className="events-empty-state">
        No specials found for this date.
      </div>
    )
  }

  const displayedEvents = isControlled ? events : events.slice(0, displayLimit)

  return (
    <div className="events-list-wrapper">
      <ul className="events-list">
        {displayedEvents.map((event) => (
          <Link key={event.mgid} href={`/event/${event.mgid}`} scroll={false} prefetch={false} className="event-item-link">
            <li className="columns event-item" itemScope itemType="http://schema.org/Event">
              
              {/* Event Image */}
              <div className="column event-image-column">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  className="event-image" 
                  src={event.image?.url || '/images/default_event.jpg'} 
                  alt="Drink special event" 
                />
                <div className="event-item-rating">
                  <i className="icon icon-heart"></i>
                  <span>{event.rating || 0}</span>
                </div>
              </div>

              {/* Event Meta */}
              <div className="column event-meta-column">
                <div className="meta-column">
                  <div className="event-meta-distance">{calculateDistance(event.venue?.location)}</div>
                  <h2 className="event-meta-title">{event.title}</h2>
                  <p className="event-meta-time">
                    <span itemProp="startDate" content={event.occurrence?.start_time}>
                      {formatTime(event.occurrence?.start_time)}
                    </span>
                    <span> - </span>
                    <span itemProp="endDate" content={event.occurrence?.end_time}>
                      {formatTime(event.occurrence?.end_time)}
                    </span>
                  </p>
                  <div itemProp="description" className="event-meta-short-desc">
                    {event.short_desc}
                  </div>
                </div>
              </div>

              <div className="event-meta-more">
                <i className="icon icon-chevron-right"></i>
              </div>
            </li>
          </Link>
        ))}
      </ul>

      {/* Sentinel for IntersectionObserver */}
      {hasMore && (
        <div ref={sentinelRef} className="infinite-scroll-sentinel" />
      )}

      {/* Infinite Scroll Loading Spinner */}
      {isLoadingMore && (
        <div className="events-loading-spinner" role="status" aria-live="polite">
          <i className="icon icon-spinner fa-spin" />
          <span>Loading more specials...</span>
        </div>
      )}
    </div>
  )
}
