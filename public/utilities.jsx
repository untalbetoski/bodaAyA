// utilities.jsx — Custom hooks y utilidades reutilizables
const { useState, useCallback, useEffect } = React;

// useTweaks — Hook para manejar tweaks con localStorage
function useTweaks(defaults) {
  const STORAGE_KEY = "boda_tweaks_v1";

  // Cargar estado inicial
  const [tweaks, setTweaksState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaults;
  });

  // Guardar cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tweaks));
    } catch (e) {
      console.error("Failed to save tweaks:", e);
    }
  }, [tweaks]);

  // Setter funcional
  const setTweak = useCallback((key, value) => {
    setTweaksState(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  return [tweaks, setTweak];
}

// useLocalStorage — Hook genérico para localStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback(value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [storedValue]);

  return [storedValue, setValue];
}

// useDebounce — Debounce para valores
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// useAsync — Hook para peticiones asíncronas
function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setStatus("pending");
    setData(null);
    setError(null);
    try {
      const response = await asyncFunction();
      setData(response);
      setStatus("success");
      return response;
    } catch (error) {
      setError(error);
      setStatus("error");
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
}

// Exportar para usar en el navegador global
Object.assign(window, { useTweaks, useLocalStorage, useDebounce, useAsync });
