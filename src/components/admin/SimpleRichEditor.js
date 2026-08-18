"use client";
import { useRef, useEffect } from "react";
import { Bold, Heading2, List } from "lucide-react";

export default function SimpleRichEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== (value || "")) {
        editorRef.current.innerHTML = value || "";
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const exec = (command, val = null) => {
    document.execCommand(command, false, val);
    handleInput();
  };

  return (
    <div style={{ border: "1px solid var(--border-color)", borderRadius: "0.5rem", overflow: "hidden", marginTop: "0.5rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", padding: "0.5rem", background: "var(--bg-alt)", borderBottom: "1px solid var(--border-color)" }}>
        <button 
          type="button" 
          onClick={() => exec('bold')} 
          style={{ padding: "0.4rem 0.6rem", borderRadius: "0.25rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", background: "var(--bg-color)", border: "1px solid var(--border-color)", fontWeight: "bold", color: "var(--text-main)" }}
          title="Qalın (Bold)"
        >
          <Bold size={16} /> Bold
        </button>
        <button 
          type="button" 
          onClick={() => exec('formatBlock', '<h2>')} 
          style={{ padding: "0.4rem 0.6rem", borderRadius: "0.25rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", background: "var(--bg-color)", border: "1px solid var(--border-color)", fontWeight: "bold", color: "var(--text-main)" }}
          title="Başlıq (H2)"
        >
          <Heading2 size={16} /> H2 Başlıq
        </button>
        <button 
          type="button" 
          onClick={() => exec('insertUnorderedList')} 
          style={{ padding: "0.4rem 0.6rem", borderRadius: "0.25rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", background: "var(--bg-color)", border: "1px solid var(--border-color)", color: "var(--text-main)" }}
          title="Siyahı"
        >
          <List size={16} /> Siyahı
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        style={{ padding: "0.75rem", minHeight: "220px", outline: "none", color: "var(--text-main)", background: "var(--bg-color)", lineHeight: "1.6", textAlign: "justify" }}
        className="rich-editor-content"
      />
    </div>
  );
}
