export type Response<T> = {
    data: T | null,
    message: string,
    status: number,
    success: boolean
}