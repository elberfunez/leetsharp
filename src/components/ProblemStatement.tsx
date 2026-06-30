import { type ReactNode, Fragment } from "react";
import { X } from "lucide-react";
import type { Problem } from "../domain/types";

interface Props {
  problem: Problem;
  onClose: () => void;
}

/** Inline formatting: `code` spans and **bold** spans. */
function renderInline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((tok, i) => {
    if (tok.startsWith("`") && tok.endsWith("`"))
      return <code key={i}>{tok.slice(1, -1)}</code>;
    if (tok.startsWith("**") && tok.endsWith("**"))
      return <strong key={i}>{tok.slice(2, -2)}</strong>;
    return <Fragment key={i}>{tok}</Fragment>;
  });
}

/** A fenced block (LeetCode examples). Tints Input/Output/Explanation labels and
 *  their values with our own palette rather than a syntax theme. */
function renderCodeBlock(code: string, key: number): ReactNode {
  return (
    <pre key={key} className="md-pre">
      {code.split("\n").map((line, idx) => {
        const m = /^(\s*)(Input|Output|Explanation):(.*)$/.exec(line);
        if (m) {
          const valueClass = m[2] === "Explanation" ? "md-ex-note" : "md-ex-value";
          return (
            <div key={idx} className="md-ex-line">
              {m[1]}
              <span className="md-ex-label">{m[2]}:</span>
              <span className={valueClass}>{m[3]}</span>
            </div>
          );
        }
        return (
          <div key={idx} className="md-ex-line">
            {line || " "}
          </div>
        );
      })}
    </pre>
  );
}

/** Minimal block-level Markdown renderer for LeetCode-style statements:
 *  headings, fenced code blocks, horizontal rules, bullet lists, and paragraphs.
 *  Deliberately small — these statements are regular, so no parser dependency. */
function renderMarkdown(markdown: string): ReactNode[] {
  const lines = markdown.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block — accumulate verbatim until the closing fence.
    if (line.trimStart().startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push(renderCodeBlock(code.join("\n"), blocks.length));
      continue;
    }

    // Horizontal rule.
    if (line.trim() === "---") {
      blocks.push(<hr key={blocks.length} className="md-hr" />);
      i++;
      continue;
    }

    // Heading.
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const Tag = `h${Math.min(level + 1, 6)}` as "h2";
      blocks.push(
        <Tag key={blocks.length} className="md-heading">
          {renderInline(heading[2])}
        </Tag>
      );
      i++;
      continue;
    }

    // Bullet list — group consecutive "- " lines.
    if (/^\s*-\s+/.test(line)) {
      const items: ReactNode[] = [];
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        items.push(
          <li key={items.length}>{renderInline(lines[i].replace(/^\s*-\s+/, ""))}</li>
        );
        i++;
      }
      blocks.push(
        <ul key={blocks.length} className="md-list">
          {items}
        </ul>
      );
      continue;
    }

    // Blank line — skip.
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph — gather consecutive non-blank, non-special lines.
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      lines[i].trim() !== "---" &&
      !lines[i].trimStart().startsWith("```") &&
      !/^#{1,6}\s+/.test(lines[i]) &&
      !/^\s*-\s+/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={blocks.length} className="md-paragraph">
        {para.map((l, idx) => (
          <Fragment key={idx}>
            {idx > 0 && <br />}
            {renderInline(l)}
          </Fragment>
        ))}
      </p>
    );
  }

  return blocks;
}

/** Slide-over panel showing the original problem statement. The title and the
 *  chip row are built from structured Problem fields; the rest (Description,
 *  Examples, Constraints) is rendered from the Markdown body. */
export function ProblemStatement({ problem, onClose }: Props) {
  // Drop the markdown's own title/difficulty preamble — the header below
  // renders it from structured data. Body starts at the first "## " heading.
  const md = problem.description ?? "";
  const lines = md.split("\n");
  const start = lines.findIndex((l) => /^##\s/.test(l));
  const body = start >= 0 ? lines.slice(start).join("\n") : md;

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div
        className="problem-statement-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Problem statement"
      >
        <button className="panel-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <header className="md-header">
          <h1 className="md-title">{problem.title}</h1>
          <div className="md-chips">
            <span className={`difficulty difficulty-${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>
          </div>
        </header>

        <div className="md-body">{renderMarkdown(body)}</div>
      </div>
    </div>
  );
}
