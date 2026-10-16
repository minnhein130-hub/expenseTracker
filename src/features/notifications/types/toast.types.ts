export type ToastType = 'success' | 'error'

export type Toast = {
  id: number
  type: ToastType
  message: string
}
