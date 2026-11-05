"use client";
import { useState } from "react";
import { TOOL_CATEGORIES, TECH_STACK_GROUPS } from "@/data/tool-options";

export function SubmissionFields({ categories = TOOL_CATEGORIES, onProcessingChange }) {
  const [category, setCategory] = useState(TOOL_CATEGORIES[0]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [screenshot, setScreenshot] = useState("");
  const [imageError, setImageError] = useState("");
  const [processing, setProcessing] = useState(false);
  function toggle(value) {
    setSelected(old => old.includes(value) ? old.filter(s => s !== value) : old.length < 12 ? [...old, value] : old);
  }
  async function upload(event) {
    const file = event.target.files?.[0];
    setImageError("");
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setImageError("Choose a PNG, JPEG or WebP image smaller than 5 MB.");
      event.target.value = "";
      return;
    }
    setProcessing(true);
    onProcessingChange?.(true);
    const source = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = source;
      await image.decode();
      const ratio = Math.min(1, 1000 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * ratio));
      canvas.height = Math.max(1, Math.round(image.height * ratio));
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      let data = canvas.toDataURL("image/webp", .75);
      if (data.length > 240000) data = canvas.toDataURL("image/jpeg", .45);
      if (data.length > 240000) throw new Error("Image is too detailed. Choose a smaller screenshot.");
      setScreenshot(data);
    } catch (error) {
      setImageError(error.message || "Could not read the image.");
    } finally {
      URL.revokeObjectURL(source);
      setProcessing(false);
      onProcessingChange?.(false);
      event.target.value = "";
    }
  }
  const custom = query.trim().replace(/\s+/g, " ");
  return <>
    <label>Category<select name="category" required value={category} onChange={e => setCategory(e.target.value)}>{[...new Set([...TOOL_CATEGORIES, ...categories])].map(c => <option key={c}>{c}</option>)}<option value="__custom">＋ Add your own category</option></select></label>
    {category === "__custom" && <label>Your category<input name="customCategory" required minLength={2} maxLength={60} placeholder="e.g. Climate tech" /></label>}
    <fieldset className="vm-stack-picker"><legend>Tech stack & tools · {selected.length}/12</legend>
      <div className="vm-stack-search"><input aria-label="Search tech stacks and tools" value={query} maxLength={40} placeholder="Search or add a technology…" onChange={e => setQuery(e.target.value)} /><button type="button" disabled={!custom || selected.length >= 12 || selected.some(s => s.toLowerCase() === custom.toLowerCase())} onClick={() => { toggle(custom); setQuery(""); }}>＋ Add</button></div>
      <div className="vm-stack-selected">{selected.map(s => <span key={s}><input type="hidden" name="stack" value={s} /><button type="button" aria-label={`Remove ${s}`} onClick={() => toggle(s)}>{s} ×</button></span>)}</div>
      <details><summary>Choose from the technology catalog</summary><div className="vm-stack-options">{Object.entries(TECH_STACK_GROUPS).map(([group, options]) => {
        const matches = options.filter(s => s.toLowerCase().includes(query.toLowerCase()));
        return matches.length ? <div key={group} style={{display:"contents"}}><h4>{group}</h4>{matches.map(s => <label key={s}><input type="checkbox" checked={selected.includes(s)} disabled={!selected.includes(s) && selected.length >= 12} onChange={() => toggle(s)} />{s}</label>)}</div> : null;
      })}</div></details>
    </fieldset>
    <label>Project screenshot (optional)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} /><small>PNG, JPEG or WebP, up to 5 MB. Optimized before publishing.</small></label>
    <input type="hidden" name="screenshotUrl" value={screenshot} />
    {processing && <p role="status">Optimizing screenshot…</p>}
    {imageError && <p role="alert">{imageError}</p>}
    {screenshot && <div><img className="vm-shot-preview" src={screenshot} alt="Your project screenshot preview" /><button type="button" className="vm-shot-remove" onClick={() => setScreenshot("")}>Remove screenshot ×</button></div>}
  </>;
}
