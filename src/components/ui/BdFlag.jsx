/**
 * Bangladesh flag as inline SVG (flag emojis render as "BD" text on Windows).
 * Safe for html-to-image poster export.
 */
export function BdFlag({ size = 20, className, rounded = 4 }) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 30 18"
      aria-label="বাংলাদেশের পতাকা"
      role="img"
      className={className}
      style={{ borderRadius: rounded, display: "inline-block", verticalAlign: "-2px" }}
    >
      <rect width="30" height="18" fill="#006a4e" />
      <circle cx="13.5" cy="9" r="6" fill="#f42a41" />
    </svg>
  );
}
