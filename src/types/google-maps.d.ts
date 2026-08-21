export {};

// Minimal ambient surface for the small slice of the Maps JavaScript API this
// project uses (google.maps.Map, moveCamera, and AdvancedMarkerElement).
// Not a substitute for @types/google.maps — extend if more of the API is needed.
declare global {
  namespace google.maps {
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    enum ControlPosition {
      TOP_LEFT = 1,
      TOP_CENTER = 2,
      TOP_RIGHT = 3,
      LEFT_TOP = 5,
      RIGHT_TOP = 7,
      LEFT_BOTTOM = 9,
      BOTTOM_LEFT = 10,
      BOTTOM_CENTER = 11,
      BOTTOM_RIGHT = 12,
      RIGHT_BOTTOM = 13,
    }

    interface MapOptions {
      center?: LatLngLiteral;
      zoom?: number;
      mapId?: string;
      mapTypeId?: string;
      disableDefaultUI?: boolean;
      zoomControl?: boolean;
      zoomControlOptions?: { position: ControlPosition };
      gestureHandling?: string;
      isFractionalZoomEnabled?: boolean;
      tilt?: number;
      heading?: number;
    }

    interface CameraOptions {
      center?: LatLngLiteral;
      zoom?: number;
      tilt?: number;
      heading?: number;
    }

    class Map {
      constructor(el: HTMLElement, opts: MapOptions);
      moveCamera(opts: CameraOptions): void;
      setMapTypeId(mapTypeId: string): void;
    }

    namespace marker {
      interface AdvancedMarkerElementOptions {
        map?: Map;
        position?: LatLngLiteral;
        content?: Node;
      }

      class AdvancedMarkerElement {
        constructor(opts: AdvancedMarkerElementOptions);
        map: Map | null;
      }
    }
  }

  interface Window {
    google?: { maps: typeof google.maps };
    gm_authFailure?: () => void;
    initMap?: () => void;
  }
}
