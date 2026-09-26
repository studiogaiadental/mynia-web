import type { ReactNode } from 'react'
import SiteLayout from '../SiteLayout/SiteLayout'
import './LegalPage.css'

type LegalPageProps = {
  /** Raw markdown text (see parseBlocks for the small subset that's supported). */
  source: string
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5

type Block =
  | { type: 'heading'; level: HeadingLevel; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'paragraph'; lines: string[] }

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g

/**
 * Tiny markdown subset for legal documents: blocks are separated by a blank line.
 * `#`–`#####` is a heading; a block whose every line starts with "- " is a list;
 * anything else is a paragraph, with line breaks inside it preserved as <br>.
 */
function parseBlocks(source: string): Block[] {
  const rawBlocks = source
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)

  return rawBlocks.map((block): Block => {
    const headingMatch = block.match(/^(#{1,5})\s+(.*)$/)
    if (headingMatch) {
      return {
        type: 'heading',
        level: headingMatch[1].length as HeadingLevel,
        text: headingMatch[2].trim(),
      }
    }

    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    if (lines.length > 0 && lines.every((line) => line.startsWith('- '))) {
      return { type: 'list', items: lines.map((line) => line.slice(2).trim()) }
    }

    return { type: 'paragraph', lines }
  })
}

/** Renders plain text, turning any email address it contains into a mailto: link. */
function renderTextWithLinks(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let emailIndex = 0
  const re = new RegExp(EMAIL_RE)
  let match: RegExpExecArray | null

  while ((match = re.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    nodes.push(
      <a key={`${keyPrefix}-email-${emailIndex++}`} href={`mailto:${match[0]}`}>
        {match[0]}
      </a>,
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

function Heading({ level, children }: { level: HeadingLevel; children: ReactNode }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>
    case 2:
      return <h2>{children}</h2>
    case 3:
      return <h3>{children}</h3>
    case 4:
      return <h4>{children}</h4>
    case 5:
      return <h5>{children}</h5>
  }
}

export default function LegalPage({ source }: LegalPageProps) {
  const blocks = parseBlocks(source)

  return (
    <SiteLayout>
      <div className="legal-page">
        <div className="legal-page__inner">
          <a className="legal-page__back" href="/">
            <span aria-hidden="true">←</span> Back to MyNia
          </a>
          <article className="legal-doc">
            {blocks.map((block, index) => {
              if (block.type === 'heading') {
                return (
                  <Heading level={block.level} key={index}>
                    {block.text}
                  </Heading>
                )
              }

              if (block.type === 'list') {
                return (
                  <ul key={index}>
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{renderTextWithLinks(item, `${index}-${itemIndex}`)}</li>
                    ))}
                  </ul>
                )
              }

              const isUpdated = block.lines[0]?.startsWith('Last Updated')
              return (
                <p key={index} className={isUpdated ? 'legal-doc__updated' : undefined}>
                  {block.lines.map((line, lineIndex) => (
                    <span key={lineIndex}>
                      {lineIndex > 0 && <br />}
                      {renderTextWithLinks(line, `${index}-${lineIndex}`)}
                    </span>
                  ))}
                </p>
              )
            })}
          </article>
        </div>
      </div>
    </SiteLayout>
  )
}
