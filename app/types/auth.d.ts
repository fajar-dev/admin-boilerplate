export interface User {
    id: number
    name: string
    email: string
    photo: string
    isActive: boolean
    hasPassword?: boolean
}

export interface AuthData {
    user: User
    accessToken: string
    refreshToken: string
}

export interface ApiResponse<T = any> {
    success: boolean
    statusCode: number
    message: string
    data: T
}

export type AuthResponse = ApiResponse<AuthData>