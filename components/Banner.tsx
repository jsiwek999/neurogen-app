'use client';

type Props = {
  kind?: 'success' | 'error' | 'info';
  children: React.ReactNode;
};

export default function Banner({ kind = 'info', children }: Props) {
  const styles =
    kind === 'success'
      ? 'bg-green-50 text-green-800 border-green-200'
      : kind === 'error'
      ? 'bg-red-50 text-red-800 border-red-200'
      : 'bg-blue-50 text-blue-800 border-blue-200';

  return (
    <div className={`w-full border rounded-xl px-4 py-3 ${styles}`}>
      <div className="text-sm">{children}</div>
    </div>
  );
}
