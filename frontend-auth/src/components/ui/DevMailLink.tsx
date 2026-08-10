interface DevMailLinkProps {
  previewUrl?: string;
  fallbackUrl?: string;
  fallbackLabel?: string;
}

export function DevMailLink({
  previewUrl,
  fallbackUrl,
  fallbackLabel = 'Direct link',
}: DevMailLinkProps) {
  const containerClassName =
    'break-all rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-[0.8125rem]';

  if (previewUrl) {
    return (
      <div className={containerClassName}>
        <p className="m-0 text-slate-500">Dev mail sent — open the email preview:</p>
        <a href={previewUrl} target="_blank" rel="noreferrer">View email in browser</a>
      </div>
    );
  }

  if (fallbackUrl) {
    return (
      <div className={containerClassName}>
        <p className="m-0 text-slate-500">{fallbackLabel}:</p>
        <a href={fallbackUrl}>{fallbackUrl}</a>
      </div>
    );
  }

  return null;
}
