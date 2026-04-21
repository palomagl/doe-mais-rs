import { useEffect, useState } from "react";

interface GeoState {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = (autoRequest = true) => {
  const [state, setState] = useState<GeoState>({
    lat: null,
    lng: null,
    loading: autoRequest,
    error: null,
  });

  const request = () => {
    if (!("geolocation" in navigator)) {
      setState({ lat: null, lng: null, loading: false, error: "Geolocalização não suportada" });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (err) => {
        setState({
          lat: null,
          lng: null,
          loading: false,
          error: err.code === err.PERMISSION_DENIED
            ? "Permissão de localização negada"
            : "Não foi possível obter sua localização",
        });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  };

  useEffect(() => {
    if (autoRequest) request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...state, request };
};
