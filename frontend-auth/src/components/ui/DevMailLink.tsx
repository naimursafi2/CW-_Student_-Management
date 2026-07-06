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
  if (previewUrl) {
    return (
      <div className="dev-link">
        <p className="muted">Dev mail sent — open the email preview:</p>
        <a href={previewUrl} target="_blank" rel="noreferrer">
          View email in browser
        </a>
      </div>
    );
  }

  if (fallbackUrl) {
    return (
      <div className="dev-link">
        <p className="muted">{fallbackLabel}:</p>
        <a href={fallbackUrl}>{fallbackUrl}</a>
      </div>
    );
  }

  return null;
}
