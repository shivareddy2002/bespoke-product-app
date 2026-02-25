import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

export function useRequireAuth() {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const requireAuth = useCallback((action: () => void) => {
    if (user) {
      action();
    } else {
      setPendingAction(() => action);
      setShowLogin(true);
    }
  }, [user]);

  const onLoginSuccess = useCallback(() => {
    pendingAction?.();
    setPendingAction(null);
  }, [pendingAction]);

  const onLoginClose = useCallback(() => {
    setShowLogin(false);
    setPendingAction(null);
  }, []);

  return { showLogin, requireAuth, onLoginSuccess, onLoginClose };
}
