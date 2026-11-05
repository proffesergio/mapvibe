import Link from "next/link";
import { FEATURE_TABS } from "@/data/tiers";
export function Header() {
  return <header className="vm-header"><Link href="/" className="vm-brand"><span className="vm-mark">v.</span>vibe<span>map</span><small>BD</small></Link><nav aria-label="Main navigation"><Link href="/">Discover</Link><Link href="/#directory">The directory</Link><details className="vm-fun-menu"><summary>Explore for fun ▾</summary><div><p>A little Bangladesh, a lot of fun.</p>{FEATURE_TABS.map(tab=><Link key={tab.id} href={tab.path}><span aria-hidden="true">{tab.emoji}</span><span>{tab.label}<small>{tab.desc}</small></span></Link>)}</div></details></nav><a className="vm-submit" href="/#submit">＋ Submit a project</a></header>;
}
