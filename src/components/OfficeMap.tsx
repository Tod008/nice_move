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
const NO_PAINT_TIMEOUT_MS = 6000;
const GMAPS_SCRIPT_ID = "gmaps-script";
const TOWER_PHOTO_SRC = "/office/tower-eco-international.jpg";

const OFFICE_CENTER: google.maps.LatLngLiteral = { lat: OFFICE.lat, lng: OFFICE.lng };

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function animateZoom(
  map: google.maps.Map,
  fromZoom: number,
  toZoom: number,
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
      zoom: fromZoom + (toZoom - fromZoom) * eased,
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

const CLICK_DRAG_THRESHOLD = 5;

type DragBounds = { minX: number; maxX: number; minY: number; maxY: number };

type DragOrigin = DragBounds & {
  pointerId: number;
  startX: number;
  startY: number;
  baseX: number;
  baseY: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function OfficeMap({ dict }: { dict: Dictionary["footer"]["office"] }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<MapStatus>("pending");
  const [photoOpen, setPhotoOpen] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const officePanelRef = useRef<HTMLDivElement>(null);
  const photoTriggerRef = useRef<HTMLButtonElement>(null);
  const photoCloseRef = useRef<HTMLButtonElement>(null);
  const photoPanelRef = useRef<HTMLDivElement>(null);
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const dragOriginRef = useRef<DragOrigin | null>(null);
  const dragMovedRef = useRef(false);

  // The background page is left scrollable on purpose: the overlay is
  // position:fixed, so it stays put on screen regardless of scroll position
  // behind it — no lock needed to keep it in place.
  const closeOverlay = useCallback(() => {
    if (!expanded) return;
    triggerRef.current?.focus();
    setExpanded(false);
    setPhotoOpen(false);
  }, [expanded]);

  const openOverlay = useCallback(() => {
    if (expanded) return;
    setPhotoOpen(false);
    setDragOffset({ x: 0, y: 0 });
    setStatus("pending");
    setExpanded(true);
  }, [expanded]);

  // Bounds (in drag-offset space) that keep the office panel inside the map panel.
  const getDragBounds = useCallback((): DragBounds | null => {
    const mapPanel = panelRef.current;
    const officePanel = officePanelRef.current;
    if (!mapPanel || !officePanel) return null;
    const mapRect = mapPanel.getBoundingClientRect();
    const officeRect = officePanel.getBoundingClientRect();
    return {
      minX: dragOffset.x - (officeRect.left - mapRect.left),
      maxX: dragOffset.x + (mapRect.right - officeRect.right),
      minY: dragOffset.y - (officeRect.top - mapRect.top),
      maxY: dragOffset.y + (mapRect.bottom - officeRect.bottom),
    };
  }, [dragOffset]);

  // The whole panel is a drag surface except the directions link, which is
  // exempted outright, and the photo button, whose click still needs to win
  // over a drag when there was no real movement (see handlePanelClickCapture).
  //
  // Pointer capture is deliberately NOT taken on pointerdown: once an element
  // has capture, the browser redirects the resulting click to that element
  // instead of whatever's visually underneath, so a plain tap on the photo
  // would never reach its button at all. Capture is only engaged once real
  // movement past the threshold confirms this gesture is actually a drag.
  const handlePanelPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      dragMovedRef.current = false;
      if ((e.target as HTMLElement).closest("a[href]")) return;
      const bounds = getDragBounds();
      if (!bounds) return;
      dragOriginRef.current = {
        ...bounds,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        baseX: dragOffset.x,
        baseY: dragOffset.y,
      };
    },
    [getDragBounds, dragOffset]
  );

  const handlePanelPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const origin = dragOriginRef.current;
    if (!origin || origin.pointerId !== e.pointerId) return;
    const dx = e.clientX - origin.startX;
    const dy = e.clientY - origin.startY;
    if (!dragMovedRef.current) {
      if (Math.hypot(dx, dy) < CLICK_DRAG_THRESHOLD) return;
      dragMovedRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    setDragOffset({
      x: clamp(origin.baseX + dx, origin.minX, origin.maxX),
      y: clamp(origin.baseY + dy, origin.minY, origin.maxY),
    });
  }, []);

  const handlePanelPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (dragOriginRef.current?.pointerId === e.pointerId) dragOriginRef.current = null;
  }, []);

  // A real drag (movement past the threshold) must not also fire the photo
  // button's click — swallow it here, in the capture phase, before it reaches
  // the button. A plain tap (no movement) passes through untouched.
  const handlePanelClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (dragMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
    dragMovedRef.current = false;
  }, []);

  const openPhoto = useCallback(() => {
    setPhotoOpen(true);
  }, []);

  const closePhoto = useCallback(() => {
    setPhotoOpen(false);
    photoTriggerRef.current?.focus();
  }, []);

  // Focus the right close control whenever a layer opens.
  useEffect(() => {
    if (!expanded) return;
    closeButtonRef.current?.focus();
  }, [expanded]);

  useEffect(() => {
    if (photoOpen) photoCloseRef.current?.focus();
  }, [photoOpen]);

  // Escape + Tab trap, scoped to whichever layer (photo or map) is on top.
  useEffect(() => {
    if (!expanded) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        if (photoOpen) closePhoto();
        else closeOverlay();
        return;
      }
      if (e.key !== "Tab") return;
      const container = photoOpen ? photoPanelRef.current : panelRef.current;
      if (!container) return;
      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
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
  }, [expanded, photoOpen, closeOverlay, closePhoto]);

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

      if (prefersReducedMotion()) {
        map.moveCamera({ center: OFFICE_CENTER, zoom: OFFICE_ZOOM });
      } else {
        animateZoom(map, START_ZOOM, OFFICE_ZOOM, rafRef, FLY_MS);
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
            className="fixed inset-x-0 top-0 z-[200] flex h-dvh items-center justify-center overflow-hidden bg-[#0c0524]/72 p-0 sm:p-6"
            onClick={closeOverlay}
          >
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={dict.heading}
              onClick={(e) => e.stopPropagation()}
              className="relative h-full w-full overflow-hidden bg-[#0c0524] shadow-2xl sm:h-[80dvh] sm:w-[80vw] sm:max-w-[1500px] sm:rounded-sm sm:border sm:border-paper/22"
            >
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

              {/* office panel — photo as full background, card reserves its bottom via margin-top,
                  above the pending/error panels. Kept small since the photo button already opens
                  a full, bigger view on click — no need for the resting panel to be large too.
                  Draggable from anywhere except the directions link; position resets to the
                  default corner on reopen. The photo button's own click is suppressed when the
                  gesture turned out to be a drag (see handlePanelClickCapture). */}
              <div
                ref={officePanelRef}
                style={{ transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}
                onPointerDown={handlePanelPointerDown}
                onPointerMove={handlePanelPointerMove}
                onPointerUp={handlePanelPointerUp}
                onPointerCancel={handlePanelPointerUp}
                onClickCapture={handlePanelClickCapture}
                className="absolute bottom-3 left-3 z-20 w-[clamp(160px,calc(50vw-12px),260px)] min-h-[clamp(220px,30dvh,280px)] touch-none select-none overflow-hidden rounded-xl cursor-grab active:cursor-grabbing sm:bottom-6 sm:left-6 sm:w-[clamp(240px,26vw,320px)] sm:min-h-[clamp(300px,38dvh,400px)]"
              >
                <button
                  ref={photoTriggerRef}
                  type="button"
                  onClick={openPhoto}
                  aria-label="View photo of Eco International Tower full size"
                  className="office-photo-trigger absolute inset-0 z-0 cursor-zoom-in overflow-hidden rounded-xl border border-paper/16"
                >
                  <Image
                    src={TOWER_PHOTO_SRC}
                    alt=""
                    fill
                    preload
                    sizes="(max-width: 639px) 260px, 320px"
                    className="object-cover"
                  />
                </button>

                <span className="office-view-chip pointer-events-none absolute right-2 top-2 z-10 rounded-sm bg-[#0c0524]/70 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.15em] text-paper/80 sm:text-[9px]">
                  View photo
                </span>

                <div className="relative z-10 mt-[48%] flex flex-col gap-2 border-t border-paper/12 bg-[#0c0524]/86 p-2.5 sm:mt-[56%] sm:gap-3 sm:p-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-orange sm:text-xs sm:tracking-[0.22em]">
                      {dict.heading}
                    </p>
                    <p className="mt-1.5 text-[14px] leading-snug text-paper sm:mt-2 sm:text-[19px]">
                      {OFFICE.lines.map((line, i) => (
                        <span key={line}>
                          {line}
                          {i < OFFICE.lines.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${OFFICE.lat},${OFFICE.lng}`}
                    target="_blank"
                    rel="noopener"
                    className="flex min-h-[44px] w-full cursor-pointer items-center justify-center bg-orange px-3 font-mono text-[11px] uppercase tracking-[0.15em] text-paper transition-colors hover:bg-orange/90 sm:min-h-[52px] sm:px-4 sm:text-[13px]"
                  >
                    {dict.directions}
                  </a>
                </div>
              </div>
            </div>

            {/* full-window photo — a sibling of the panel, not nested inside it, so
                inset-0 resolves against the fixed full-viewport backdrop above, not
                the panel's own 80vw/80vh box */}
            {photoOpen && (
              <div
                ref={photoPanelRef}
                className="absolute inset-0 z-[600] overflow-hidden bg-[rgba(6,2,18,0.96)]"
                onClick={(e) => {
                  e.stopPropagation();
                  closePhoto();
                }}
              >
                <Image
                  src={TOWER_PHOTO_SRC}
                  alt="Eco International Tower, Peace Avenue, Ulaanbaatar"
                  fill
                  preload
                  sizes="100vw"
                  className="object-contain"
                />
                <button
                  ref={photoCloseRef}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closePhoto();
                  }}
                  aria-label="Close photo"
                  className="absolute left-3 top-3 z-10 flex h-[52px] w-[52px] items-center justify-center rounded-sm border border-paper/25 bg-[#0c0524]/80 text-paper transition-colors hover:bg-[#0c0524]"
                >
                  ✕
                </button>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(6,2,18,0.9)] to-transparent p-6">
                  <p className="font-display text-[clamp(24px,4.4vw,52px)] uppercase leading-none text-paper">
                    Eco International Tower
                  </p>
                  <p className="mt-2 text-[clamp(15px,1.9vw,24px)] text-paper/70">
                    Peace Avenue, Ulaanbaatar · Nice Move Logistics, 10th floor
                  </p>
                </div>
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
