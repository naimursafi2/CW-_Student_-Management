interface AlertProps {
  type: 'success' | 'error' | 'info';
  message: string;
}

export function Alert({ type, message }: AlertProps) {
  const variants = { success: 'bg-green-100 text-green-800', error: 'bg-red-100 text-red-800', info: 'bg-blue-100 text-blue-800' };
  return <div className={`rounded-lg px-4 py-3 text-[0.9375rem] ${variants[type]}`}>{message}</div>;
}
