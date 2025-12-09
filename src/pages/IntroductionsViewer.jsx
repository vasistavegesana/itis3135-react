import { useEffect, useMemo, useState } from 'react'

const DATA_URL = 'https://dvonb.xyz/api/2025-fall/itis-3135/students?full=1'

const defaultChecks = {
  name: true,
  mascot: true,
  image: true,
  personal: true,
  backgrounds: true,
  classes: true,
  extra: true,
  funfact: true,
  quote: true,
  links: true,
}

const friendlyLabel = (key) => key.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

const getFullName = (student) => {
  const first = student.first_name || student.name?.first || ''
  const last = student.last_name || student.name?.last || ''
  const preferred = student.name?.preferred?.trim()
  const base = `${first} ${last}`.trim()
  if (base) return base
  if (preferred) return preferred
  if (student.prefix) return student.prefix
  return 'Unnamed Student'
}

const resolveImageSrc = (student) => {
  if (student.image) return student.image
  if (student.picture) return student.picture
  if (student.media?.hasImage && student.media?.src) return `https://dvonb.xyz${student.media.src}`
  return ''
}

const buildClassesList = (student) => {
  if (Array.isArray(student.classes)) return student.classes
  if (Array.isArray(student.courses)) {
    return student.courses.map((course) => course.name || course.code || [course.dept, course.num].filter(Boolean).join(' ')).filter(Boolean)
  }
  return []
}

const gatherLinks = (student) => {
  const linkSource = student.links || {}
  const candidateKeys = [
    'clt_website',
    'charlotte',
    'charlotte_edu',
    'github',
    'githubio',
    'itis3135',
    'personal',
    'portfolio',
    'website',
    'freecodecamp',
    'codecademy',
    'linkedin',
  ]
  const collected = []

  candidateKeys.forEach((key) => {
    const href = linkSource[key] || student[key]
    if (href) collected.push({ key, href })
  })

  Object.entries(linkSource).forEach(([key, href]) => {
    const already = collected.some((item) => item.href === href)
    if (href && !already) collected.push({ key, href })
  })

  return collected
}

const IntroductionsViewer = () => {
  const [students, setStudents] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [checks, setChecks] = useState(defaultChecks)
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(DATA_URL)
        if (!response.ok) throw new Error('Unable to load students right now.')
        const data = await response.json()
        const list = Array.isArray(data) ? data : []
        setStudents(list)
        setFiltered(list)
        setIndex(0)
      } catch (err) {
        setError(err.message || 'Failed to fetch students.')
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  useEffect(() => {
    const term = search.trim().toLowerCase()
    const nextFiltered = term
      ? students.filter((student) =>
          `${student.first_name || student.name?.first || ''} ${student.last_name || student.name?.last || ''}`
            .toLowerCase()
            .includes(term),
        )
      : students

    setFiltered(nextFiltered)
    setIndex(0)
  }, [search, students])

  useEffect(() => {
    if (filtered.length === 0) {
      setIndex(0)
      return
    }
    if (index >= filtered.length) setIndex(0)
  }, [filtered.length, index])

  const currentStudent = useMemo(() => {
    if (!filtered.length) return null
    return filtered[index]
  }, [filtered, index])

  const toggleCheck = (key) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const goNext = () => {
    if (!filtered.length) return
    setIndex((prev) => (prev + 1) % filtered.length)
  }

  const goPrevious = () => {
    if (!filtered.length) return
    setIndex((prev) => (prev - 1 + filtered.length) % filtered.length)
  }

  const pageStyle = {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '28px 18px 48px',
    color: '#0f172a',
    fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
  }

  const cardStyle = {
    margin: '0 auto',
    background: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
    border: '1px solid #e2e8f0',
    maxWidth: '820px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  }

  const fieldStyle = {
    margin: '0',
    textAlign: 'left',
    color: '#0f172a',
    lineHeight: 1.6,
  }

  const labelStyle = {
    fontWeight: 700,
    color: '#1f2937',
  }

  const checkboxGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '10px 14px',
    alignItems: 'center',
  }

  const buttonStyle = {
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    background: '#0ea5e9',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'transform 120ms ease, box-shadow 120ms ease, background 120ms ease',
  }

  const subduedButtonStyle = {
    ...buttonStyle,
    background: '#f8fafc',
    color: '#0f172a',
  }

  const imageStyle = {
    maxWidth: '200px',
    width: '100%',
    height: 'auto',
    alignSelf: 'center',
    borderRadius: '12px',
    objectFit: 'cover',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.14)',
  }

  const linkListStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '6px',
  }

  const renderBackgrounds = (student) => {
    const backgrounds = student.background || student.backgrounds
    if (!backgrounds) return null

    if (typeof backgrounds === 'string') {
      return (
        <p style={fieldStyle}>
          <span style={labelStyle}>Backgrounds: </span>
          {backgrounds}
        </p>
      )
    }

    const entries = [
      { label: 'Personal', value: backgrounds.personal },
      { label: 'Professional', value: backgrounds.professional },
      { label: 'Academic', value: backgrounds.academic },
      { label: 'Subject', value: backgrounds.subject },
    ].filter((entry) => entry.value)

    if (!entries.length) return null

    return (
      <div>
        <p style={{ ...fieldStyle, marginBottom: '6px' }}><span style={labelStyle}>Backgrounds:</span></p>
        <div style={{ display: 'grid', gap: '6px', paddingLeft: '10px' }}>
          {entries.map((entry) => (
            <p key={entry.label} style={fieldStyle}>
              <span style={labelStyle}>{entry.label}:</span> {entry.value}
            </p>
          ))}
        </div>
      </div>
    )
  }

  const renderLinks = (student) => {
    const links = gatherLinks(student)
    if (!links.length) return <p style={fieldStyle}>No links provided.</p>

    return (
      <div style={linkListStyle}>
        {links.map((link) => (
          <a
            key={`${link.key}-${link.href}`}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '8px 12px',
              background: '#e0f2fe',
              borderRadius: '10px',
              color: '#0f172a',
              border: '1px solid #bae6fd',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            {friendlyLabel(link.key)}
          </a>
        ))}
      </div>
    )
  }

  if (loading) return <p style={{ ...fieldStyle, textAlign: 'center' }}>Loading students...</p>
  if (error) return <p style={{ ...fieldStyle, textAlign: 'center' }}>{error}</p>

  const fields = [
    { key: 'name', label: 'Name' },
    { key: 'mascot', label: 'Mascot' },
    { key: 'image', label: 'Image' },
    { key: 'personal', label: 'Personal Statement' },
    { key: 'backgrounds', label: 'Backgrounds' },
    { key: 'classes', label: 'Classes' },
    { key: 'extra', label: 'Extra Information' },
    { key: 'funfact', label: 'Fun Fact / Computer' },
    { key: 'quote', label: 'Quote' },
    { key: 'links', label: 'Links' },
  ]

  const imageSrc = currentStudent ? resolveImageSrc(currentStudent) : ''
  const personalStatement = currentStudent?.personal_statement || currentStudent?.personalStatement
  const extraInfo = currentStudent?.extra_info || currentStudent?.additional || currentStudent?.extra
  const funFact = currentStudent?.fun_fact || currentStudent?.funFact || currentStudent?.computer
  const quote = currentStudent?.quote
  const classesList = currentStudent ? buildClassesList(currentStudent) : []

  return (
    <section style={pageStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a' }}>Introductions Viewer</h1>
        <div style={{ fontWeight: 700, color: '#0ea5e9' }}>Matches: {filtered.length}</div>
      </div>

      <div style={{ display: 'grid', gap: '12px', marginBottom: '18px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontWeight: 600, color: '#0f172a' }}>
          Search by first or last name
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Start typing a name..."
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '1rem',
              color: '#0f172a',
              background: '#fff',
            }}
          />
        </label>

        <div>
          <p style={{ ...fieldStyle, fontWeight: 700, marginBottom: '6px' }}>Toggle fields</p>
          <div style={checkboxGrid}>
            {fields.map((field) => (
              <label key={field.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: '#0f172a' }}>
                <input
                  type="checkbox"
                  checked={checks[field.key]}
                  onChange={() => toggleCheck(field.key)}
                  style={{ width: '16px', height: '16px' }}
                />
                {field.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', margin: '10px 0 18px' }}>
        <button type="button" onClick={goPrevious} disabled={!filtered.length} style={subduedButtonStyle}>
          Previous
        </button>
        <button type="button" onClick={goNext} disabled={!filtered.length} style={buttonStyle}>
          Next
        </button>
      </div>

      {currentStudent ? (
        <article style={cardStyle}>
          {checks.name && (
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{getFullName(currentStudent)}</h2>
          )}

          {checks.mascot && (
            <p style={fieldStyle}>
              <span style={labelStyle}>Mascot:</span> {currentStudent.mascot || 'N/A'}
            </p>
          )}

          {checks.image && (
            imageSrc ? (
              <img src={imageSrc} alt={getFullName(currentStudent)} style={imageStyle} />
            ) : (
              <div style={{ ...imageStyle, background: '#e2e8f0', display: 'grid', placeItems: 'center', color: '#475569', boxShadow: 'none' }}>
                No image available
              </div>
            )
          )}

          {checks.personal && personalStatement && (
            <p style={fieldStyle}>
              <span style={labelStyle}>Personal Statement:</span> {personalStatement}
            </p>
          )}

          {checks.backgrounds && renderBackgrounds(currentStudent)}

          {checks.classes && classesList.length > 0 && (
            <p style={fieldStyle}>
              <span style={labelStyle}>Classes:</span> {classesList.join(', ')}
            </p>
          )}

          {checks.extra && extraInfo && (
            <p style={fieldStyle}>
              <span style={labelStyle}>Extra Information:</span> {extraInfo}
            </p>
          )}

          {checks.funfact && funFact && (
            <p style={fieldStyle}>
              <span style={labelStyle}>Fun Fact / Computer:</span> {funFact}
            </p>
          )}

          {checks.quote && quote && (
            <p style={fieldStyle}>
              <span style={labelStyle}>Quote:</span>{' '}
              {typeof quote === 'string' ? quote : `${quote.text || ''}${quote.author ? ` — ${quote.author}` : ''}`}
            </p>
          )}

          {checks.links && (
            <div style={{ textAlign: 'left' }}>
              <p style={{ ...fieldStyle, marginBottom: '6px' }}>
                <span style={labelStyle}>Links:</span>
              </p>
              {renderLinks(currentStudent)}
            </div>
          )}
        </article>
      ) : (
        <p style={{ ...fieldStyle, textAlign: 'center' }}>No students match your search.</p>
      )}
    </section>
  )
}

export default IntroductionsViewer
