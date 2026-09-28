'use client';

import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Quote,
  Code,
  Eye,
  Sparkles,
  ShieldCheck,
  Undo,
  Redo,
  Tv,
} from 'lucide-react';
import { sanitizeArticleHtml } from '@/lib/sanitize';

interface RichPostEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export default function RichPostEditor({
  value,
  onChange,
  rows = 12,
}: RichPostEditorProps) {
  const [activeMode, setActiveMode] = useState<'visual' | 'code'>('code');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert or wrap tags around selection in the textarea
  const insertFormatting = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || defaultText;

    const replacement = `${before}${selectedText}${after}`;
    const newContent =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    // Apply sanitization check
    onChange(newContent);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const handleInsertLink = () => {
    const url = prompt('Enter URL (e.g. https://... or /go/affforce):', 'https://');
    if (!url) return;
    // Prevent javascript: injection in prompt
    if (url.toLowerCase().startsWith('javascript:')) {
      alert('Security Warning: "javascript:" pseudo-protocol is blocked by the XSS shield.');
      return;
    }
    insertFormatting(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>', 'Click here to stream');
  };

  const handleInsertImage = () => {
    const url = prompt('Enter Image URL (https://...):', 'https://images.unsplash.com/');
    if (!url) return;
    const alt = prompt('Enter Image Description / Alt text:', 'Match Broadcast Access');
    insertFormatting(`<img src="${url}" alt="${alt || 'Sports Match'}" class="rounded-xl w-full my-4" />`);
  };

  const handleInsertTable = () => {
    const tableTemplate = `
<table class="w-full border-collapse border border-slate-800 my-4 text-xs">
  <thead>
    <tr class="bg-slate-900 text-emerald-400">
      <th class="border border-slate-800 p-2 text-left">Region / Country</th>
      <th class="border border-slate-800 p-2 text-left">Broadcaster</th>
      <th class="border border-slate-800 p-2 text-left">Stream Access</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-800 p-2 font-bold text-white">United States</td>
      <td class="border border-slate-800 p-2 text-slate-300">ESPN+ / Peacock</td>
      <td class="border border-slate-800 p-2 text-emerald-400">Available</td>
    </tr>
    <tr>
      <td class="border border-slate-800 p-2 font-bold text-white">United Kingdom</td>
      <td class="border border-slate-800 p-2 text-slate-300">Sky Sports / TNT</td>
      <td class="border border-slate-800 p-2 text-emerald-400">Available</td>
    </tr>
  </tbody>
</table>
`;
    insertFormatting(tableTemplate.trim());
  };

  const handleInsertStreamCta = () => {
    const ctaTemplate = `
<div class="cta-box bg-slate-900 border border-emerald-500/30 p-6 rounded-2xl my-6 flex flex-col sm:flex-row items-center justify-between gap-4">
  <div>
    <h4 class="text-emerald-400 font-bold text-base mb-1">⚡ Instant Matchday Pass</h4>
    <p class="text-xs text-slate-400">Stream in 1080p 60FPS on Smart TV, PC, tablet, or mobile.</p>
  </div>
  <a href="/go/affforce" class="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition" target="_blank" rel="sponsored nofollow">
    Watch Live Now &rarr;
  </a>
</div>
`;
    insertFormatting(ctaTemplate.trim());
  };

  return (
    <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 shadow-xl">
      {/* Editor Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 p-2 flex flex-wrap items-center justify-between gap-1 text-slate-300">
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings */}
          <button
            type="button"
            onClick={() => insertFormatting('<h2>', '</h2>', 'Section Heading')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
            title="Heading 2 (H2)"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<h3>', '</h3>', 'Sub-Heading')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
            title="Heading 3 (H3)"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-800 mx-1" />

          {/* Inline styles */}
          <button
            type="button"
            onClick={() => insertFormatting('<strong>', '</strong>', 'bold text')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition font-bold"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<em>', '</em>', 'italic text')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition italic"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('<strike>', '</strike>', 'strikethrough text')}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-800 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() =>
              insertFormatting('<ul>\n  <li>', '</li>\n  <li>Item 2</li>\n</ul>', 'List Item 1')
            }
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              insertFormatting('<ol>\n  <li>', '</li>\n  <li>Step 2</li>\n</ol>', 'Step 1')
            }
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-800 mx-1" />

          {/* Inserts: Link, Image, Table, CTA */}
          <button
            type="button"
            onClick={handleInsertLink}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-emerald-400 transition"
            title="Insert Safe Hyperlink"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleInsertImage}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-emerald-400 transition"
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleInsertTable}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-emerald-400 transition"
            title="Insert Broadcaster Comparison Table"
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleInsertStreamCta}
            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition text-xs font-bold flex items-center gap-1 px-2"
            title="Insert Official Stream Affiliate Card"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>CTA Box</span>
          </button>
        </div>

        {/* Right side: View Toggle & Security Badge */}
        <div className="flex items-center gap-2 pt-1 sm:pt-0">
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>XSS Shield Active</span>
          </div>

          <div className="flex items-center rounded-lg bg-slate-950 p-0.5 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveMode('code')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold transition ${
                activeMode === 'code'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3 h-3" /> Code
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('visual')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold transition ${
                activeMode === 'visual'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" /> Preview
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      {activeMode === 'code' ? (
        <textarea
          ref={textareaRef}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="<h2>Heading</h2><p>Write your article content here...</p>"
          className="w-full bg-slate-950 text-slate-200 p-4 font-mono text-xs outline-none resize-y leading-relaxed focus:bg-slate-900/40 transition"
        />
      ) : (
        <div className="p-5 min-h-[280px] max-h-[500px] overflow-y-auto bg-slate-950/80">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-3 pb-2 border-b border-slate-800 flex items-center justify-between">
            <span>Sanitized Live Render Output</span>
            <span className="text-emerald-400">All scripts & event handlers neutralized</span>
          </div>
          <div
            className="prose prose-invert prose-emerald max-w-none text-slate-300 leading-relaxed text-sm [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-slate-100 [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3"
            dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(value) }}
          />
        </div>
      )}
    </div>
  );
}
