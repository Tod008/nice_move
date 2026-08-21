"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { OFFICE } from "@/lib/office";
import type { Dictionary } from "@/lib/i18n/types";

type MapStatus = "pending" | "ready" | "error";

const FLY_MS = 3200;
const START_ZOOM = 11.4;
const OFFICE_ZOOM = 18.6;
const AERIAL_TILT = 55;
const AERIAL_HEADING = 20;
const NO_PAINT_TIMEOUT_MS = 6000;
const GMAPS_SCRIPT_ID = "gmaps-script";

const OFFICE_CENTER: google.maps.LatLngLiteral = { lat: OFFICE.lat, lng: OFFICE.lng };

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type Camera = { zoom: number; tilt: number; heading: number };

function animateCamera(
  map: google.maps.Map,
  from: Camera,
  to: Camera,
  rafRef: React.MutableRefObject<number | null>,
  durationMs: number,
  onDone?: () => void
) {
  const t0 = performance.now();
  function tick(now: number) {
    const p = Math.min(1, (now - t0) / durationMs);
    const eased = 1 - Math.pow(1 - p, 3);
    map.moveCamera({
      center: OFFICE_CENTER,
      zoom: from.zoom + (to.zoom - from.zoom) * eased,
      tilt: from.tilt + (to.tilt - from.tilt) * eased,
      heading: from.heading + (to.heading - from.heading) * eased,
    });
    if (p < 1) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      rafRef.current = null;
      onDone?.();
    }
  }
  rafRef.current = requestAnimationFrame(tick);
}

function createPinElement(): HTMLDivElement {
  const wrap = document.createElement("div");
  wrap.className = "office-pin";

  const ring = document.createElement("span");
  ring.className = "office-pin__ring";

  const dot = document.createElement("span");
  dot.className = "office-pin__dot";

  const label = document.createElement("span");
  label.className = "office-pin__label";
  const strong = document.createElement("strong");
  strong.textContent = "Nice Move Logistics";
  const sub = document.createElement("span");
  sub.textContent = "Eco International Tower · 10th floor";
  label.append(strong, sub);

  wrap.append(ring, dot, label);
  return wrap;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function OfficeMap({ dict }: { dict: Dictionary["footer"]["office"] }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<MapStatus>("pending");
  const [aerial, setAerial] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const scrollYRef = useRef(0);

  const closeOverlay = useCallback(() => {
    if (!expanded) return;
    if (document.body.style.position === "fixed") {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollYRef.current);
    }
    triggerRef.current?.focus();
    setExpanded(false);
  }, [expanded]);

  const openOverlay = useCallback(() => {
    if (document.body.style.position === "fixed") return;
    scrollYRef.current = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    setAerial(false);
    setStatus("pending");
    setExpanded(true);
  }, []);

  // Safety net: if this ever unmounts while the lock is held, release it.
  useEffect(() => {
    return () => {
      if (document.body.style.position === "fixed") {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
      }
    };
  }, []);

  // Focus management + Tab trap while the overlay is open.
  useEffect(() => {
    if (!expanded) return;
    closeButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeOverlay();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expanded, closeOverlay]);

  // Load the Maps script (first click only) and drive the fly-in camera move.
  useEffect(() => {
    if (!expanded) return;
    let cancelled = false;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey) {
      setStatus("error");
      return () => {
        cancelled = true;
      };
    }

    window.gm_authFailure = () => {
      if (!cancelled) setStatus((s) => (s === "ready" ? s : "error"));
    };

    function paintedYet() {
      const el = mapElRef.current;
      const painted = !!el?.querySelector(".gm-style");
      if (painted && !cancelled) setStatus((s) => (s === "ready" ? s : "ready"));
      return painted;
    }

    const noPaintTimer = window.setTimeout(() => {
      if (cancelled) return;
      if (!paintedYet()) setStatus((s) => (s === "ready" ? s : "error"));
    }, NO_PAINT_TIMEOUT_MS);

    const pollId = window.setInterval(() => {
      if (paintedYet()) window.clearInterval(pollId);
    }, 200);

    function init() {
      if (cancelled) return;
      const el = mapElRef.current;
      if (!el || !window.google) return;

      const map = new google.maps.Map(el, {
        center: OFFICE_CENTER,
        zoom: START_ZOOM,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "DEMO_MAP_ID",
        mapTypeId: "roadmap",
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "greedy",
        isFractionalZoomEnabled: true,
      });
      mapRef.current = map;

      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: OFFICE_CENTER,
        content: createPinElement(),
      });

      const from: Camera = { zoom: START_ZOOM, tilt: 0, heading: 0 };
      const to: Camera = { zoom: OFFICE_ZOOM, tilt: 0, heading: 0 };
      if (prefersReducedMotion()) {
        map.moveCamera({ center: OFFICE_CENTER, ...to });
      } else {
        animateCamera(map, from, to, rafRef, FLY_MS);
      }
    }

    if (window.google?.maps) {
      init();
    } else {
      window.initMap = init;
      if (!document.getElementById(GMAPS_SCRIPT_ID)) {
        const script = document.createElement("script");
        script.id = GMAPS_SCRIPT_ID;
        script.async = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&v=weekly&loading=async&callback=initMap`;
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      window.clearTimeout(noPaintTimer);
      window.clearInterval(pollId);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      markerRef.current = null;
      mapRef.current = null;
      if (mapElRef.current) mapElRef.current.innerHTML = "";
    };
  }, [expanded]);

  const setAerialMode = useCallback(
    (next: boolean) => {
      if (aerial === next) return;
      const map = mapRef.current;
      if (map) {
        map.setMapTypeId(next ? "satellite" : "roadmap");
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const from: Camera = { zoom: OFFICE_ZOOM, tilt: next ? 0 : AERIAL_TILT, heading: next ? 0 : AERIAL_HEADING };
        const to: Camera = { zoom: OFFICE_ZOOM, tilt: next ? AERIAL_TILT : 0, heading: next ? AERIAL_HEADING : 0 };
        if (prefersReducedMotion()) {
          map.moveCamera({ center: OFFICE_CENTER, ...to });
        } else {
          animateCamera(map, from, to, rafRef, FLY_MS);
        }
      }
      setAerial(next);
    },
    [aerial]
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openOverlay}
        className="group relative block aspect-square w-full max-w-[260px] overflow-hidden rounded-sm border border-paper/20 bg-[#0c0524]"
      >
        <Image
          src="/office/map-thumb.jpg"
          alt="Map showing the Nice Move Logistics office on Peace Avenue, Ulaanbaatar"
          fill
          loading="lazy"
          sizes="260px"
          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-[#0c0524]/85 to-transparent px-3 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/90">
            {dict.expand}
          </span>
          <span className="font-mono text-orange">⤢</span>
        </span>
      </button>

      {expanded &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0c0524]/72 p-0 sm:p-6"
            onClick={closeOverlay}
          >
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={dict.heading}
              onClick={(e) => e.stopPropagation()}
              className="relative h-full w-full overflow-hidden bg-[#0c0524] shadow-2xl sm:h-[80vh] sm:w-[80vw] sm:max-w-[1500px] sm:rounded-sm sm:border sm:border-paper/22"
            >
              {/* map / aerial toggle */}
              <div className="absolute left-3 top-3 z-40 flex overflow-hidden rounded-sm border border-paper/25 bg-[#0c0524]/80">
                <button
                  type="button"
                  aria-pressed={!aerial}
                  onClick={() => setAerialMode(false)}
                  className={`min-h-[40px] px-4 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                    !aerial ? "bg-orange text-paper" : "text-paper/70 hover:text-paper"
                  }`}
                >
                  Map
                </button>
                <button
                  type="button"
                  aria-pressed={aerial}
                  onClick={() => setAerialMode(true)}
                  className={`min-h-[40px] px-4 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                    aerial ? "bg-orange text-paper" : "text-paper/70 hover:text-paper"
                  }`}
                >
                  Aerial 3D
                </button>
              </div>

              {/* top scrim + close */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-20 bg-gradient-to-b from-[#0c0524]/80 to-transparent" />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeOverlay}
                aria-label="Close map"
                className="absolute right-3 top-3 z-40 flex h-11 w-11 items-center justify-center rounded-sm border border-paper/25 bg-[#0c0524]/80 text-paper transition-colors hover:bg-[#0c0524]"
              >
                ✕
              </button>

              <div ref={mapElRef} className="absolute inset-0" />

              {status === "pending" && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0c0524]">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
                    Loading map…
                  </p>
                </div>
              )}

              {status === "error" && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0c0524] px-6">
                  <div className="max-w-sm text-center">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">
                      Map unavailable
                    </p>
                    <p className="mt-3 text-sm text-paper/70">
                      The map couldn&apos;t load — usually a rejected API key, billing not
                      enabled on the project, or the browser blocking WebGL. Use the
                      directions button below to reach the office.
                    </p>
                  </div>
                </div>
              )}

              {/* docked address + tower photo — above the pending/error panels */}
              <div className="absolute inset-x-0 bottom-0 z-20 flex items-end gap-3 p-3 sm:gap-[14px] sm:p-6">
                <div className="office-tower-photo flex shrink-0 flex-col gap-1.5">
                  <div className="relative h-[132px] w-[104px] overflow-hidden border border-paper/16 sm:h-[190px] sm:w-[150px]">
                    <Image
                      src="/office/tower-eco-international.jpg"
                      alt=""
                      fill
                      preload
                      sizes="150px"
                      className="object-cover"
                    />
                  </div>
                  <p className="hidden font-mono text-[10px] uppercase tracking-[0.15em] text-paper/55 sm:block">
                    Eco International Tower / Peace Avenue
                  </p>
                </div>

                <div className="office-address-card min-w-0 flex-1 border border-paper/16 bg-[#0c0524]/90 p-3 sm:max-w-xs sm:p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange">
                    {dict.heading}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-paper/85">
                    {OFFICE.lines.map((line, i) => (
                      <span key={line}>
                        {line}
                        {i < OFFICE.lines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${OFFICE.lat},${OFFICE.lng}`}
                    target="_blank"
                    rel="noopener"
                    className="mt-3 inline-flex min-h-[44px] items-center rounded-sm bg-orange px-4 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-orange/90"
                  >
                    {dict.directions}
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
