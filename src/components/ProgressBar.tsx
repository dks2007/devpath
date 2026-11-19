export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: value + '%' }} />
    </div>
  )
}
