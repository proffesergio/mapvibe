import Link from "next/link";
export function Header() {
  return <header className="vm-header"><Link href="/" className="vm-brand"><span className="vm-mark">v.</span>vibe<span>map</span><small>BD</small></Link><nav aria-label="Main navigation"><Link href="/">Discover</Link><Link href="/#directory">The directory</Link><Link href="/explorer">Explore Bangladesh ↗</Link></nav><a className="vm-submit" href="/#submit">＋ Submit a project</a></header>;
}
