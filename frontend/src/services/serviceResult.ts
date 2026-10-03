export type ServiceResult<T> =
  | { status: 'success'; data: T; error: null }
  | { status: 'not_connected'; data: null; error: string }
  | { status: 'error'; data: null; error: string };

export function notConnected<T>(serviceName: string): ServiceResult<T> {
  return {
    status: 'not_connected',
    data: null,
    error: `${serviceName} service is not connected.`,
  };
}