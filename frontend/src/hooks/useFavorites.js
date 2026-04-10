import { useCallback, useEffect, useRef, useState } from "react";

export function useFavorites(userId) {
  const [favorites, setFavorites] = useState(new Set());
  const API_URL = import.meta.env.VITE_API_URL;
  const favoritesRef = useRef(new Set());

  useEffect(() => {
    favoritesRef.current = favorites;
  }, [favorites]);

  useEffect(() => {
    let isActive = true;

    async function fetchFavorites() {
      if (!userId) {
        setFavorites(new Set());
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setFavorites(new Set());
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/users/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await res.json();

        if (isActive) {
          setFavorites(
            new Set((data || []).filter(Boolean).map((course) => String(course._id)))
          );
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
        if (isActive) {
          setFavorites(new Set());
        }
      }
    }

    fetchFavorites();

    return () => {
      isActive = false;
    };
  }, [API_URL, userId]);

  const toggleFavorite = useCallback(async (courseId) => {
    if (!userId || !courseId) {
      return false;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }

    const normalizedCourseId = String(courseId);
    const wasFavorite = favoritesRef.current.has(normalizedCourseId);

    setFavorites((prev) => {
      const next = new Set(prev);

      if (next.has(normalizedCourseId)) {
        next.delete(normalizedCourseId);
      } else {
        next.add(normalizedCourseId);
      }

      return next;
    });

    try {
      const res = await fetch(`${API_URL}/api/users/favorites/${normalizedCourseId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to update favorite");
      }

      const data = await res.json();
      setFavorites(
        new Set(
          (data.favorites || [])
            .filter(Boolean)
            .map((course) => String(course._id || course))
        )
      );

      return data.isFavorite;
    } catch (error) {
      console.error("Failed to update favorite:", error);
      setFavorites((prev) => {
        const next = new Set(prev);

        if (wasFavorite) {
          next.add(normalizedCourseId);
        } else {
          next.delete(normalizedCourseId);
        }

        return next;
      });

      return wasFavorite;
    }
  }, [API_URL, userId]);

  const isFavorite = useCallback(
    (courseId) => favorites.has(String(courseId)),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
