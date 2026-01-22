export default function ErrorBanner({ title, message, onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-rose-700">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-xl bg-rose-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-800"
        >Retry
        </button>
      )}
    </div>
  );
}
