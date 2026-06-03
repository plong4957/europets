import { useRef, useEffect, useCallback, useState } from "react";
import "./RichEditor.css";

const TOOLS = [
  { cmd: "bold",          icon: "B",  title: "In đậm (Ctrl+B)",     style: { fontWeight: 900 } },
  { cmd: "italic",        icon: "I",  title: "In nghiêng (Ctrl+I)", style: { fontStyle: "italic" } },
  { cmd: "underline",     icon: "U̲",  title: "Gạch dưới (Ctrl+U)", style: { textDecoration: "underline" } },
  { cmd: "separator" },
  { cmd: "insertUnorderedList", icon: "≡", title: "Danh sách chấm" },
  { cmd: "insertOrderedList",   icon: "①", title: "Danh sách số" },
  { cmd: "separator" },
  { cmd: "justifyLeft",   icon: "⬛︎", title: "Căn trái" },
  { cmd: "justifyCenter", icon: "▬",  title: "Căn giữa" },
  { cmd: "separator" },
  { cmd: "removeFormat",  icon: "✕",  title: "Xóa định dạng" },
];

const STATEFUL_CMDS = ["bold", "italic", "underline", "insertUnorderedList", "insertOrderedList", "justifyLeft", "justifyCenter"];

export default function RichEditor({ value, onChange, placeholder = "Nhập nội dung...", minHeight = 120 }) {
  const editorRef = useRef(null);
  const savedRange = useRef(null);
  const isExternalUpdate = useRef(false);
  const [activeStates, setActiveStates] = useState({});

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      isExternalUpdate.current = true;
      el.innerHTML = value || "";
      isExternalUpdate.current = false;
    }
  }, [value]);

  // Cập nhật trạng thái active của các nút dựa theo vị trí con trỏ
  const updateActiveStates = useCallback(() => {
    const states = {};
    STATEFUL_CMDS.forEach((cmd) => {
      try { states[cmd] = document.queryCommandState(cmd); } catch { states[cmd] = false; }
    });
    setActiveStates(states);
  }, []);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0);
    }
    updateActiveStates();
  }, [updateActiveStates]);

  const execCmd = useCallback((cmd) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    if (savedRange.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
    document.execCommand(cmd, false, null);
    onChange?.(el.innerHTML ?? "");
    updateActiveStates();
  }, [onChange, updateActiveStates]);

  const handleInput = useCallback(() => {
    if (isExternalUpdate.current) return;
    onChange?.(editorRef.current?.innerHTML ?? "");
  }, [onChange]);

  const insertTable = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    if (savedRange.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
    const rows = 3, cols = 2;
    let html = `<table class="re-table"><thead><tr>`;
    for (let c = 0; c < cols; c++) html += `<th>Cột ${c + 1}</th>`;
    html += `</tr></thead><tbody>`;
    for (let r = 0; r < rows - 1; r++) {
      html += `<tr>`;
      for (let c = 0; c < cols; c++) html += `<td>&nbsp;</td>`;
      html += `</tr>`;
    }
    html += `</tbody></table><p><br></p>`;
    document.execCommand("insertHTML", false, html);
    onChange?.(el.innerHTML ?? "");
  }, [onChange]);

  return (
    <div className="re-wrap">
      <div className="re-toolbar">
        {TOOLS.map((t, i) =>
          t.cmd === "separator"
            ? <span key={i} className="re-sep" />
            : (
              <button
                key={t.cmd}
                type="button"
                title={t.title}
                className={`re-btn${activeStates[t.cmd] ? " re-btn--active" : ""}`}
                style={t.style}
                onMouseDown={(e) => {
                  e.preventDefault();
                  execCmd(t.cmd);
                }}
              >
                {t.icon}
              </button>
            )
        )}
        <span className="re-sep" />
        <button
          type="button"
          title="Chèn bảng"
          className="re-btn re-btn--table"
          onMouseDown={(e) => { e.preventDefault(); insertTable(); }}
        >
          ⊞ Bảng
        </button>
      </div>

      <div
        ref={editorRef}
        className="re-body"
        contentEditable
        suppressContentEditableWarning
        style={{ minHeight }}
        onInput={handleInput}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onSelect={saveSelection}
        data-placeholder={placeholder}
      />
    </div>
  );
}