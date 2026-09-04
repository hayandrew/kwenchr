"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import moment from "moment";
import DatePick from "@/components/DatePick";
import Location from "@/components/Location";
import FilterDropdown from "@/components/FilterDropdown";
import EventsList from "@/components/EventsList";
import Ad from "@/components/Ad";
import { mapDbEventToClient } from "@/components/utilities/mapEvent";
import { getDistanceKm } from "@/components/utilities/calculateDistance";
import dedupeFetch from "@/components/utilities/dedupeFetch";
import "./MainDashboard.css";

const DEFAULT_COORDS = { lat: 40.7796, lng: -74.0238 };
const PAGE_SIZE = 10;

let cachedAllEvents = null;
let cachedScrollTop = 0;
let cachedCurrentDate = null;
let cachedPage = 1;
let cachedHasMore = true;

export function clearDashboardCache() {
  cachedAllEvents = null;
  cachedScrollTop = 0;
  cachedCurrentDate = null;
  cachedPage = 1;
  cachedHasMore = true;
}

const getInitialUserCoords = () => {
  if (typeof window !== "undefined") {
    try {
      const cachedStr = sessionStorage.getItem("kwenchr_location");
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        if (
          cached.coords &&
          typeof cached.coords.latitude === "number" &&
          typeof cached.coords.longitude === "number"
        ) {
          return {
            lat: cached.coords.latitude,
            lng: cached.coords.longitude,
          };
        }
      }
    } catch (e) {}
  }
  return DEFAULT_COORDS;
};

const getInitialCurrentDate = () => {
  if (cachedCurrentDate) return cachedCurrentDate;
  if (typeof window !== "undefined") {
    try {
      const saved = sessionStorage.getItem("kwenchr_current_date");
      if (saved && moment(saved, "YYYY-MM-DD", true).isValid()) {
        const m = moment(saved);
        cachedCurrentDate = m;
        return m;
      }
    } catch (e) {}
  }
  return moment();
};

const buildEventsQuery = (pageNumber, coords) => {
  const geoQuery =
    coords &&
    typeof coords.lat === "number" &&
    typeof coords.lng === "number"
      ? `&lat=${coords.lat}&lng=${coords.lng}`
      : "";
  return `/api/events?page=${pageNumber}&limit=${PAGE_SIZE}${geoQuery}`;
};

export default function MainDashboard({ children }) {
  const centerColRef = useRef(null);
  const leftWrapperRef = useRef(null);

  const [currentDate, setCurrentDate] = useState(getInitialCurrentDate);
  const [eventType, setEventType] = useState([]);
  const [maxDistance, setMaxDistance] = useState("all");
  const [allEvents, setAllEvents] = useState(() => cachedAllEvents || []);
  const [userCoords, setUserCoords] = useState(getInitialUserCoords);
  const [page, setPage] = useState(() => cachedPage || 1);
  const [hasMore, setHasMore] = useState(() =>
    cachedHasMore !== null ? cachedHasMore : true,
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const userCoordsRef = useRef(userCoords);
  useEffect(() => {
    userCoordsRef.current = userCoords;
  }, [userCoords]);

  const requestIdRef = useRef(0);

  // Helper to calculate distance to venue with optimized string parsing
  const getDistanceToVenue = useCallback((event, coords) => {
    if (
      !coords ||
      typeof coords.lat !== "number" ||
      typeof coords.lng !== "number"
    ) {
      return Infinity;
    }
    const loc = event?.venue?.location;
    if (!loc) return Infinity;

    const commaIdx = loc.indexOf(",");
    if (commaIdx === -1) return Infinity;

    const venueLat = parseFloat(loc.slice(0, commaIdx));
    const venueLng = parseFloat(loc.slice(commaIdx + 1));
    if (!isNaN(venueLat) && !isNaN(venueLng)) {
      return getDistanceKm(coords.lat, coords.lng, venueLat, venueLng);
    }
    return Infinity;
  }, []);

  // Sort batch by distance using Schwartzian transform (computes distance once per event)
  const sortBatchByDistance = useCallback(
    (batch, coords) => {
      if (!Array.isArray(batch) || batch.length <= 1) return batch || [];
      const withDistance = batch.map((event) => ({
        event,
        dist: getDistanceToVenue(event, coords),
      }));
      withDistance.sort((a, b) => a.dist - b.dist);
      return withDistance.map((item) => item.event);
    },
    [getDistanceToVenue],
  );

  // Filter events by date, category, and distance threshold in an optimized single/double pass
  const sortedEvents = useMemo(() => {
    if (!allEvents || allEvents.length === 0) return [];

    // 1. Filter by selected date
    let filtered = allEvents;
    if (currentDate) {
      filtered = allEvents.filter((e) => {
        if (!e.occurrence?.start_time) return false;
        return moment(e.occurrence.start_time).isSame(currentDate, "day");
      });
      // Fallback: if date filter results in 0 events, show all events
      if (filtered.length === 0) {
        filtered = allEvents;
      }
    }

    const hasTypeFilter = eventType && eventType.length > 0;
    const hasDistFilter = maxDistance !== "all";

    if (!hasTypeFilter && !hasDistFilter) {
      return filtered;
    }

    // Pre-normalize filter terms once instead of per-event per-term
    const preparedTypes = hasTypeFilter
      ? eventType.map((typeVal) => ({
          tag: typeVal,
          cleanSearch: typeVal.replace(/-/g, " ").toLowerCase(),
        }))
      : null;

    const maxDistKm = hasDistFilter
      ? parseFloat(maxDistance) * 1.60934
      : null;

    return filtered.filter((event) => {
      // 2. Category / event type filter
      if (hasTypeFilter) {
        const itemTags = event.tags || [];
        const title = event.title ? event.title.toLowerCase() : "";
        const desc = event.short_desc ? event.short_desc.toLowerCase() : "";

        const matchesType = preparedTypes.some(
          ({ tag, cleanSearch }) =>
            itemTags.includes(tag) ||
            (title && title.includes(cleanSearch)) ||
            (desc && desc.includes(cleanSearch)),
        );

        if (!matchesType) return false;
      }

      // 3. Distance threshold filter
      if (hasDistFilter && maxDistKm !== null) {
        const dist = getDistanceToVenue(event, userCoords);
        if (dist > maxDistKm) return false;
      }

      return true;
    });
  }, [
    allEvents,
    currentDate,
    eventType,
    maxDistance,
    userCoords,
    getDistanceToVenue,
  ]);

  // Fetch initial 10 events from API
  useEffect(() => {
    let isCancelled = false;
    if (!cachedAllEvents) {
      const loadInitialEvents = async () => {
        const reqId = ++requestIdRef.current;
        try {
          const coords = userCoordsRef.current;
          const query = buildEventsQuery(1, coords);
          const res = await dedupeFetch(query);
          if (res.ok && !isCancelled && reqId === requestIdRef.current) {
            const rawEvents = await res.json();
            const mapped = rawEvents.map(mapDbEventToClient);
            const sorted = sortBatchByDistance(mapped, coords);
            cachedAllEvents = sorted;
            cachedPage = 1;
            const more = rawEvents.length === PAGE_SIZE;
            cachedHasMore = more;
            setAllEvents(sorted);
            setPage(1);
            setHasMore(more);
          } else if (!res.ok) {
            console.error("Failed to load events from database API");
          }
        } catch (e) {
          console.error("Error fetching events:", e);
        }
      };

      loadInitialEvents();
    }

    return () => {
      isCancelled = true;
    };
  }, [sortBatchByDistance]);

  // Handle location change: fetch events for new coordinates and replace existing events
  const handleLocationChange = useCallback(
    async (newCoords) => {
      if (
        !newCoords ||
        typeof newCoords.lat !== "number" ||
        typeof newCoords.lng !== "number"
      ) {
        return;
      }

      const prev = userCoordsRef.current;
      const isChanged =
        !prev || prev.lat !== newCoords.lat || prev.lng !== newCoords.lng;

      if (!isChanged) {
        return;
      }

      userCoordsRef.current = newCoords;
      setUserCoords(newCoords);

      if (typeof window !== "undefined") {
        try {
          const cachedStr = sessionStorage.getItem("kwenchr_location");
          let cached = cachedStr ? JSON.parse(cachedStr) : {};
          cached.coords = {
            latitude: newCoords.lat,
            longitude: newCoords.lng,
            accuracy: 1,
          };
          cached.timestamp = Date.now();
          sessionStorage.setItem("kwenchr_location", JSON.stringify(cached));
        } catch (e) {}
      }

      const reqId = ++requestIdRef.current;
      try {
        const query = buildEventsQuery(1, newCoords);
        const res = await dedupeFetch(query);
        if (res.ok && reqId === requestIdRef.current) {
          const rawEvents = await res.json();
          const mapped = rawEvents.map(mapDbEventToClient);
          const sorted = sortBatchByDistance(mapped, newCoords);
          cachedAllEvents = sorted;
          cachedPage = 1;
          const more = rawEvents.length === PAGE_SIZE;
          cachedHasMore = more;
          setAllEvents(sorted);
          setPage(1);
          setHasMore(more);
          cachedScrollTop = 0;
          if (centerColRef.current) {
            centerColRef.current.scrollTop = 0;
          }
          if (leftWrapperRef.current) {
            leftWrapperRef.current.scrollTop = 0;
          }
          if (typeof window !== "undefined") {
            window.scrollTo(0, 0);
          }
        } else if (!res.ok) {
          console.error("Failed to load events from database API");
        }
      } catch (e) {
        console.error("Error fetching events on location change:", e);
      }
    },
    [sortBatchByDistance],
  );

  // Listen for storage or locationChange window events
  useEffect(() => {
    const handleWindowLocationChange = () => {
      if (typeof window === "undefined") return;
      try {
        const cachedStr = sessionStorage.getItem("kwenchr_location");
        if (cachedStr) {
          const cached = JSON.parse(cachedStr);
          if (
            cached.coords &&
            typeof cached.coords.latitude === "number" &&
            typeof cached.coords.longitude === "number"
          ) {
            handleLocationChange({
              lat: cached.coords.latitude,
              lng: cached.coords.longitude,
            });
          }
        }
      } catch (e) {}
    };

    window.addEventListener("locationChange", handleWindowLocationChange);
    return () => {
      window.removeEventListener("locationChange", handleWindowLocationChange);
    };
  }, [handleLocationChange]);

  // Fetch next 10 events from API on infinite scroll and append below
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const reqId = requestIdRef.current;
    const nextPage = page + 1;
    try {
      const coords = userCoordsRef.current;
      const query = buildEventsQuery(nextPage, coords);
      const res = await dedupeFetch(query);
      if (res.ok && reqId === requestIdRef.current) {
        const rawEvents = await res.json();
        const mapped = rawEvents.map(mapDbEventToClient);
        const sortedNext = sortBatchByDistance(mapped, coords);
        setAllEvents((prev) => {
          const existingIds = new Set(prev.map((e) => e.mgid || e._id || e.id));
          const uniqueNext = sortedNext.filter(
            (e) => !existingIds.has(e.mgid || e._id || e.id),
          );
          const next = [...prev, ...uniqueNext];
          cachedAllEvents = next;
          return next;
        });
        setPage(nextPage);
        cachedPage = nextPage;
        const more = rawEvents.length === PAGE_SIZE;
        setHasMore(more);
        cachedHasMore = more;
      }
    } catch (err) {
      console.error("Error loading more events:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, page, sortBatchByDistance]);

  // Keep loadMore ref updated so scroll event listeners never tear down during pagination
  const loadMoreRef = useRef(loadMore);
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  // Track scroll position on the actual scrollable containers (.center-column on desktop, window on mobile)
  useEffect(() => {
    if (children) return;

    let windowScrollRafId = null;

    const handleScroll = (e) => {
      if (e.target && typeof e.target.scrollTop === "number") {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop > 0) {
          cachedScrollTop = scrollTop;
        }

        if (
          scrollHeight > clientHeight &&
          scrollHeight - scrollTop - clientHeight < 150
        ) {
          loadMoreRef.current();
        }
      }
    };

    const handleWindowScroll = () => {
      if (typeof window === "undefined") return;
      if (windowScrollRafId) return;

      windowScrollRafId = requestAnimationFrame(() => {
        windowScrollRafId = null;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop > 0) {
          cachedScrollTop = scrollTop;
        }

        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        if (
          scrollHeight > clientHeight &&
          scrollHeight - scrollTop - clientHeight < 250
        ) {
          loadMoreRef.current();
        }
      });
    };

    const centerEl = centerColRef.current;
    const leftEl = leftWrapperRef.current;

    if (centerEl) {
      centerEl.addEventListener("scroll", handleScroll, { passive: true });
    }
    if (leftEl) {
      leftEl.addEventListener("scroll", handleScroll, { passive: true });
    }
    window.addEventListener("scroll", handleWindowScroll, { passive: true });

    return () => {
      if (centerEl) centerEl.removeEventListener("scroll", handleScroll);
      if (leftEl) leftEl.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleWindowScroll);
      if (windowScrollRafId) {
        cancelAnimationFrame(windowScrollRafId);
      }
    };
  }, [children]);

  // Restore scroll position on the container only on initial mount if returning from an event page
  useEffect(() => {
    if (cachedScrollTop > 0) {
      const restore = () => {
        if (
          centerColRef.current &&
          centerColRef.current.scrollTop !== cachedScrollTop
        ) {
          centerColRef.current.scrollTop = cachedScrollTop;
        }
        if (
          leftWrapperRef.current &&
          leftWrapperRef.current.scrollTop !== cachedScrollTop
        ) {
          leftWrapperRef.current.scrollTop = cachedScrollTop;
        }
        if (
          typeof window !== "undefined" &&
          window.scrollY !== cachedScrollTop &&
          window.innerWidth < 768
        ) {
          window.scrollTo(0, cachedScrollTop);
        }
      };
      restore();
      const raf = requestAnimationFrame(restore);
      return () => cancelAnimationFrame(raf);
    }
  }, []);

  const updateDate = useCallback((date) => {
    cachedCurrentDate = date;
    setCurrentDate(date);
    if (typeof window !== "undefined" && date && typeof date.format === "function") {
      sessionStorage.setItem("kwenchr_current_date", date.format("YYYY-MM-DD"));
    }
  }, []);

  const handleTypeChange = useCallback((selectedTypes) => {
    setEventType(selectedTypes);
  }, []);

  const handleDistanceChange = useCallback((distance) => {
    setMaxDistance(distance);
  }, []);

  return (
    <div className="wrapper">
      {/* Top Leaderboard Ad */}
      <div className="leaderboard-ad ad-wrapper">
        <Ad extClass="hidden-md-up" height="50" responsive />
        <Ad extClass="hidden-sm-down" height="90" width="728" />
      </div>

      <div className="main-content-wrapper">
        <div className="main-content-left" ref={leftWrapperRef}>
          {/* Modal Overlay Render Layer */}
          {children}
          {/* Left Sidebar Column */}
          {currentDate && (
            <DatePick currentDate={currentDate} updateDate={updateDate} />
          )}
          <div className="ad-wrapper hidden-sm-down">
            <Ad
              extClass="hidden-xl-up hidden-sm-down"
              height="250"
              width="300"
            />
            <Ad extClass="hidden-lg-down" height="280" width="336" />
          </div>
        </div>
        <div className="center-column" ref={centerColRef}>
          <div className="filters">
            <Location onLocationChange={handleLocationChange} />
            <FilterDropdown
              eventType={eventType}
              onTypeChange={handleTypeChange}
              distance={maxDistance}
              onDistanceChange={handleDistanceChange}
            />
          </div>
          <EventsList
            events={sortedEvents}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMore}
          />
        </div>
        <div className="main-content-right">
          <Ad
            extClass="hidden-xl-up hidden-md-down skyscraper-ad"
            height="600"
            width="160"
          />
          <Ad
            extClass="hidden-lg-down hidden-sm-down skyscraper-ad"
            height="600"
            width="300"
          />
        </div>
      </div>
    </div>
  );
}

