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

    interface MapOptions {
      center?: LatLngLiteral;
      zoom?: number;
      mapId?: string;
      mapTypeId?: string;
      disableDefaultUI?: boolean;
      zoomControl?: boolean;
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
