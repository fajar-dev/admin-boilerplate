import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { Contact, ContactPayload, ApiResponse } from "../types/contact"

export class ContactService {

    private get authHeaders() {
        return { headers: { Authorization: `Bearer ${useAuth().state.token}` } }
    }

    async getAll(page = 1, perPage = 10): Promise<ApiResponse<Contact[]>> {
        try {
            const response = await apiService.client.get<ApiResponse<Contact[]>>(
                `/contacts?page=${page}&perPage=${perPage}`,
                this.authHeaders
            )
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getById(id: number): Promise<ApiResponse<Contact>> {
        try {
            const response = await apiService.client.get<ApiResponse<Contact>>(
                `/contacts/${id}`,
                this.authHeaders
            )
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async create(payload: ContactPayload): Promise<ApiResponse<Contact>> {
        try {
            const response = await apiService.client.post<ApiResponse<Contact>>(
                `/contacts`,
                payload,
                this.authHeaders
            )
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async update(id: number, payload: ContactPayload): Promise<ApiResponse<Contact>> {
        try {
            const response = await apiService.client.put<ApiResponse<Contact>>(
                `/contacts/${id}`,
                payload,
                this.authHeaders
            )
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async delete(id: number): Promise<ApiResponse<null>> {
        try {
            const response = await apiService.client.delete<ApiResponse<null>>(
                `/contacts/${id}`,
                this.authHeaders
            )
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }
}

export const contactService = new ContactService()
