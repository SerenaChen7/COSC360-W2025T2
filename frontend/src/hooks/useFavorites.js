import { useState, useCallback, useEffect } from "react";

function getStorageKey(userId) {
  return userId ? `favoriteCourseIds_${userId}` : "favoriteCourseIds_guest";
}

function loadFavorites(userId) {
  try {
    const stored = localStorage.getItem(getStorageKey(userId));
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

export function useFavorites(userId) {
  const [favorites, setFavorites] = useState(() => loadFavorites(userId));

  // Reload from localStorage whenever the logged-in user changes
  useEffect(() => {
    setFavorites(loadFavorites(userId));
  }, [userId]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem(getStorageKey(userId), JSON.stringify([...next]));
      return next;
    });
  }, [userId]);

  const isFavorite = useCallback((id) => favorites.has(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
