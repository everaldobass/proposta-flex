export const TOKEN_KEY = 'pf_token'
export const USER_KEY = 'pf_user'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getUser(): any {
  if (typeof window === 'undefined') return null
  const u = localStorage.getItem(USER_KEY)
  return u ? JSON.parse(u) : null
}

export function setUser(user: any): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}
