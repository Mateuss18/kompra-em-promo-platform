export interface AuthUser {
  id: string
  email: string
  role: 'ADMIN'
}

export interface AuthSession {
  accessToken: string
  user: AuthUser
}

export interface LoginCredentials {
  email: string
  password: string
}
