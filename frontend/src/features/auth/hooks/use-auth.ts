"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getCurrentUser,
  login,
  logout,
  register,
  type AuthUser,
} from "@/lib/api/auth";

export const currentUserQueryKey = ["auth", "current-user"] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
  });
}

function useSetAuthenticatedUser() {
  const queryClient = useQueryClient();

  return (user: AuthUser | null) => {
    queryClient.setQueryData(currentUserQueryKey, user);
  };
}

export function useLogin() {
  const setAuthenticatedUser = useSetAuthenticatedUser();

  return useMutation({
    mutationFn: login,
    onSuccess: setAuthenticatedUser,
  });
}

export function useRegister() {
  const setAuthenticatedUser = useSetAuthenticatedUser();

  return useMutation({
    mutationFn: register,
    onSuccess: setAuthenticatedUser,
  });
}

export function useLogout() {
  const setAuthenticatedUser = useSetAuthenticatedUser();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => setAuthenticatedUser(null),
  });
}
