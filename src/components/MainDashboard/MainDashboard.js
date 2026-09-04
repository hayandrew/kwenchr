"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import DatePick from "@/components/DatePick";
import Location from "@/components/Location";
import EventType from "@/components/EventType";
import Distance from "@/components/Distance";
import EventsList from "@/components/EventsList";
import Ad from "@/components/Ad";
import { mapDbEventToClient } from "@/components/utilities/mapEvent";
import { getDistanceKm } from "@/components/utilities/calculateDistance";
import dedupeFetch from "@/components/utilities/dedupeFetch";
import "./MainDashboard.css";

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

export default function MainDashboard({ children }) {
  const centerColRef = React.useRef(null);
  const leftWrapperRef = React.useRef(null);

  const [currentDate, setCurrentDate] = useState(
    () => cachedCurrentDate || moment(),
  );
  const [eventType, setEventType] = useState([]);
  const [maxDistance, setMaxDistance] = useState("all");
  const [allEvents, setAllEvents] = useState(() => cachedAllEvents || []);
  const [userCoords, setUserCoords] = useState(() => {
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
    return { lat: 40.7796, lng: -74.0238 };
  });
  const [page, setPage] = useState(() => cachedPage || 1);
  const [hasMore, setHasMore] = useState(() =>
    cachedHasMore !== null ? cachedHasMore : true,
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const userCoordsRef = React.useRef(userCoords);
  const requestIdRef = React.useRef(0);

  // Helper to calculate distance to venue
  const getDistanceToVenue = React.useCallback((event, coords) => {
    if (event.venue && event.venue.location) {
      const parts = event.venue.location.split(",");
      if (parts.length === 2) {
        const venueLat = parseFloat(parts[0]);
        const venueLng = parseFloat(parts[1]);
        if (!isNaN(venueLat) && !isNaN(venueLng)) {
          return getDistanceKm(coords.lat, coords.lng, venueLat, venueLng);
        }
      }
    }
    return Infinity;
  }, []);

  const sortBatchByDistance = React.useCallback(
    (batch, coords) => {
      return [...batch].sort((a, b) => {
        const distA = getDistanceToVenue(a, coords);
        const distB = getDistanceToVenue(b, coords);
        return distA - distB;
      });
    },
    [getDistanceToVenue],
  );

  // Filter events by date, category, and distance threshold without re-sorting across batches
  const sortedEvents = React.useMemo(() => {
    let filtered = [...allEvents];

    // 1. Filter by selected date
    if (currentDate) {
      filtered = filtered.filter((e) => {
        if (!e.occurrence?.start_time) return false;
        return moment(e.occurrence.start_time).isSame(currentDate, "day");
      });
      if (filtered.length === 0) {
        filtered = [...allEvents];
      }
    }

    // 2. Filter by category types
    if (eventType.length > 0) {
      filtered = filtered.filter((item) => {
        const itemTags = item.tags || [];
        return eventType.some((typeVal) => {
          const tagMatch = itemTags.includes(typeVal);
          const cleanSearch = typeVal.replace("-", " ");
          const nameMatch =
            item.title && item.title.toLowerCase().includes(cleanSearch);
          const descMatch =
            item.short_desc &&
            item.short_desc.toLowerCase().includes(cleanSearch);
          return tagMatch || nameMatch || descMatch;
        });
      });
    }

    // 3. Filter by distance threshold
    if (maxDistance !== "all") {
      const maxDistKm = parseFloat(maxDistance) * 1.60934;
      filtered = filtered.filter((event) => {
        const dist = getDistanceToVenue(event, userCoords);
        return dist <= maxDistKm;
      });
    }

    return filtered;
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
          const geoQuery =
            coords &&
            typeof coords.lat === "number" &&
            typeof coords.lng === "number"
              ? `&lat=${coords.lat}&lng=${coords.lng}`
              : "";
          const res = await dedupeFetch(
            `/api/events?page=1&limit=10${geoQuery}`,
          );
          if (res.ok && !isCancelled && reqId === requestIdRef.current) {
            const rawEvents = await res.json();
            const mapped = rawEvents.map(mapDbEventToClient);
            const sorted = sortBatchByDistance(mapped, userCoordsRef.current);
            cachedAllEvents = sorted;
            cachedPage = 1;
            const more = rawEvents.length === 10;
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
  const handleLocationChange = React.useCallback(
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
        const res = await dedupeFetch(
          `/api/events?page=1&limit=10&lat=${newCoords.lat}&lng=${newCoords.lng}`,
        );
        if (res.ok && reqId === requestIdRef.current) {
          const rawEvents = await res.json();
          const mapped = rawEvents.map(mapDbEventToClient);
          const sorted = sortBatchByDistance(mapped, newCoords);
          cachedAllEvents = sorted;
          cachedPage = 1;
          const more = rawEvents.length === 10;
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
  const loadMore = React.useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const reqId = requestIdRef.current;
    const nextPage = page + 1;
    try {
      const coords = userCoordsRef.current;
      const geoQuery =
        coords &&
        typeof coords.lat === "number" &&
        typeof coords.lng === "number"
          ? `&lat=${coords.lat}&lng=${coords.lng}`
          : "";
      const res = await dedupeFetch(
        `/api/events?page=${nextPage}&limit=10${geoQuery}`,
      );
      if (res.ok && reqId === requestIdRef.current) {
        const rawEvents = await res.json();
        const mapped = rawEvents.map(mapDbEventToClient);
        const sortedNext = sortBatchByDistance(mapped, userCoordsRef.current);
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
        const more = rawEvents.length === 10;
        setHasMore(more);
        cachedHasMore = more;
      }
    } catch (err) {
      console.error("Error loading more events:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, page, sortBatchByDistance]);

  // Track scroll position on the actual scrollable containers (.center-column on desktop, .main-content-left / window on mobile)
  useEffect(() => {
    const handleScroll = (e) => {
      if (!children && e.target && typeof e.target.scrollTop === "number") {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop > 0) {
          cachedScrollTop = scrollTop;
        }

        if (
          scrollHeight > clientHeight &&
          scrollHeight - scrollTop - clientHeight < 150
        ) {
          loadMore();
        }
      }
    };

    const handleWindowScroll = () => {
      if (!children && typeof window !== "undefined") {
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
          loadMore();
        }
      }
    };

    const centerEl = centerColRef.current;
    const leftEl = leftWrapperRef.current;

    if (centerEl)
      centerEl.addEventListener("scroll", handleScroll, { passive: true });
    if (leftEl)
      leftEl.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleWindowScroll, { passive: true });

    return () => {
      if (centerEl) centerEl.removeEventListener("scroll", handleScroll);
      if (leftEl) leftEl.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, [children, loadMore]);

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

  const updateDate = (date) => {
    cachedCurrentDate = date;
    setCurrentDate(date);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("kwenchr_current_date", date.format("YYYY-MM-DD"));
    }
  };

  const handleTypeChange = (selectedTypes) => {
    setEventType(selectedTypes);
  };

  const handleDistanceChange = (distance) => {
    setMaxDistance(distance);
  };

  return (
    <div className="wrapper">
      {/* Top Leaderboard Ad */}
      <div className="leaderboard-ad ad-wrapper">
        <Ad extClass="hidden-md-up" height="50" width="320" />
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
            <EventType value={eventType} onChange={handleTypeChange} />
            <Distance value={maxDistance} onChange={handleDistanceChange} />
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
