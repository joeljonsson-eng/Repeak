import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signOut as fbSignOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { SearchListing, SavedFavoriteItem } from './types';

const LOCAL_STORAGE_FAVORITES_KEY = 'repeak_guest_favorites';

interface FavoritesContextType {
  favorites: SavedFavoriteItem[];
  favoriteIds: Set<string>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: SearchListing) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  loading: boolean;
  user: User | null;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<SavedFavoriteItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        return [];
      }
    }
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Derive fast lookup set
  const favoriteIds = new Set(favorites.map(f => f.id));

  // 1. Manage Auth State without calling disabled signInAnonymously
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Seamlessly migrate any guest favorites stored in localStorage to Firestore
        try {
          const guestRaw = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
          if (guestRaw) {
            const guestItems: SavedFavoriteItem[] = JSON.parse(guestRaw);
            if (Array.isArray(guestItems) && guestItems.length > 0) {
              for (const item of guestItems) {
                const docRef = doc(db, 'users', currentUser.uid, 'favorites', item.id);
                await setDoc(docRef, { ...item, userId: currentUser.uid });
              }
              localStorage.removeItem(LOCAL_STORAGE_FAVORITES_KEY);
            }
          }
        } catch (migrationErr) {
          console.warn('Guest favorites migration notice:', migrationErr);
        }
      } else {
        setUser(null);
        // Load guest favorites from localStorage
        try {
          const guestRaw = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
          if (guestRaw) {
            const guestItems = JSON.parse(guestRaw);
            if (Array.isArray(guestItems)) {
              setFavorites(guestItems);
            }
          }
        } catch {
          // Keep existing state
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore synchronization when user is authenticated
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const favoritesRef = collection(db, 'users', user.uid, 'favorites');
    const q = query(favoritesRef, orderBy('savedAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: SavedFavoriteItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as SavedFavoriteItem);
        });
        setFavorites(items);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/favorites`);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 3. Helper to test if item is favorite
  const isFavorite = (id: string) => {
    return favoriteIds.has(id);
  };

  // 4. Toggle Favorite (works seamlessly offline/guest or online via Firestore)
  const toggleFavorite = async (item: SearchListing) => {
    if (isFavorite(item.id)) {
      await removeFavorite(item.id);
      return;
    }

    const favoriteData: SavedFavoriteItem = {
      id: item.id,
      title: item.title,
      brand: item.brand,
      price: item.price,
      originalPrice: item.originalPrice || 0,
      marketplace: item.marketplace,
      imageUrl: item.imageUrl,
      condition: item.condition,
      size: item.size,
      url: item.url,
      savedAt: new Date().toISOString(),
      userId: user ? user.uid : 'guest'
    };

    if (user) {
      const docPath = `users/${user.uid}/favorites/${item.id}`;
      const docRef = doc(db, 'users', user.uid, 'favorites', item.id);
      try {
        await setDoc(docRef, favoriteData);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, docPath);
      }
    } else {
      // Guest local storage mode
      setFavorites(prev => {
        const next = [favoriteData, ...prev.filter(f => f.id !== item.id)];
        try {
          localStorage.setItem(LOCAL_STORAGE_FAVORITES_KEY, JSON.stringify(next));
        } catch (e) {
          console.warn('Failed to save to localStorage:', e);
        }
        return next;
      });
    }
  };

  // 5. Remove Favorite directly
  const removeFavorite = async (id: string) => {
    if (user) {
      const docPath = `users/${user.uid}/favorites/${id}`;
      const docRef = doc(db, 'users', user.uid, 'favorites', id);
      try {
        await deleteDoc(docRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, docPath);
      }
    } else {
      // Guest local storage mode
      setFavorites(prev => {
        const next = prev.filter(f => f.id !== id);
        try {
          localStorage.setItem(LOCAL_STORAGE_FAVORITES_KEY, JSON.stringify(next));
        } catch (e) {
          console.warn('Failed to save to localStorage:', e);
        }
        return next;
      });
    }
  };

  // 6. Auth Actions
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setAuthModalOpen(false);
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const loginWithEmail = async (_email: string, _pass: string) => {
    // Google Sign-In is the provisioned auth provider
    return signInWithGoogle();
  };

  const registerWithEmail = async (_email: string, _pass: string) => {
    // Google Sign-In is the provisioned auth provider
    return signInWithGoogle();
  };

  const signOut = async () => {
    await fbSignOut(auth);
    setUser(null);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        loading,
        user,
        authModalOpen,
        setAuthModalOpen,
        signInWithGoogle,
        signOut,
        loginWithEmail,
        registerWithEmail
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

