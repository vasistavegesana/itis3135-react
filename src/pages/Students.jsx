import { useEffect, useMemo, useState } from 'react'

const STUDENT_API = 'https://dvonb.xyz/api/2025-fall/itis-3135/students?full=1'

const Students = () => {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(STUDENT_API)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load students')
        return res.json()
      })
      .then((data) => setStudents(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || 'Something went wrong.'))
      .finally(() => setLoading(false))
  }, [])

  const formatName = (student) => {
    const name = student.name || {}
    if (name.preferred && name.preferred.trim()) return name.preferred.trim()
    const parts = [name.first, name.middleInitial, name.last].filter((part) => typeof part === 'string' && part.trim())
    return parts.join(' ') || 'Unnamed Student'
  }

  const valueOrNA = (value) => {
    if (value === null || value === undefined) return 'N/A'
    if (typeof value === 'string') return value.trim() || 'N/A'
    if (typeof value === 'number') return String(value)
    return 'N/A'
  }

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return students
    return students.filter((student) => formatName(student).toLowerCase().includes(term))
  }, [search, students])

  useEffect(() => {
    setCurrentIndex(0)
  }, [search, showAll, students.length])

  const toggleMode = () => {
    setShowAll((prev) => !prev)
    setCurrentIndex(0)
  }

  const showNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, filteredStudents.length - 1))
  }

  const showPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '18px',
    marginBottom: '16px',
    backgroundColor: '#fff',
    color: '#000',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  }

  const rowStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    flexWrap: 'wrap',
  }

  const imageStyle = {
    width: '250px',
    maxWidth: '100%',
    borderRadius: '8px',
    objectFit: 'cover',
    flex: '0 0 250px',
  }

  const textColumnStyle = {
    flex: '1 1 240px',
    color: '#000',
    fontSize: '0.98rem',
    lineHeight: 1.6,
  }

  const renderCard = (student, index) => {
    console.log(student)
    const nameText = formatName(student)
    const emailPrefix = student.prefix || 'N/A'
    const mascot = valueOrNA(student.mascot)
    const background = student.backgrounds || {}
    const personal = valueOrNA(background.personal)
    const professional = valueOrNA(background.professional)
    const academic = valueOrNA(background.academic)
    const imageSrc =
      student.picture ||
      student.photo ||
      (student.media?.hasImage && student.media?.src ? `https://dvonb.xyz${student.media.src}` : '')

    return (
      <div key={student.email || student.id || student.prefix || index} style={cardStyle}>
        <h2 style={{ margin: '0 0 10px', fontSize: '1.4rem', color: '#000' }}>{nameText}</h2>
        <p style={{ margin: '4px 0', color: '#000' }}><strong>Email Prefix:</strong> {emailPrefix}</p>
        <p style={{ margin: '4px 0 12px', color: '#000' }}><strong>Mascot:</strong> {mascot}</p>

        <div style={rowStyle}>
          {imageSrc ? (
            <img src={imageSrc} alt={nameText} style={imageStyle} />
          ) : (
            <div style={{ ...imageStyle, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
          )}
          <div style={textColumnStyle}>
            <h3 style={{ margin: '0 0 8px', color: '#000' }}>Background</h3>
            <p style={{ margin: '4px 0', color: '#000' }}><strong>Personal:</strong> {personal}</p>
            <p style={{ margin: '4px 0', color: '#000' }}><strong>Professional:</strong> {professional}</p>
            <p style={{ margin: '4px 0', color: '#000' }}><strong>Academic:</strong> {academic}</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) return <p style={{ color: '#000' }}>Loading...</p>
  if (error) return <p style={{ color: '#000' }}>{error}</p>

  const hasStudents = filteredStudents.length > 0
  const currentStudent = hasStudents ? filteredStudents[currentIndex] : null

  return (
    <div style={{ color: '#000', textAlign: 'left' }}>
      <h2 style={{ color: '#000', marginBottom: '12px' }}>Students</h2>

      <div style={{ marginBottom: '12px' }}>
        <label htmlFor="student-search">
          Search by name:{' '}
          <input
            id="student-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search..."
            style={{ color: '#000', padding: '6px 8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.95rem' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <button
          onClick={toggleMode}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #999', color: '#000', backgroundColor: '#f5f5f5' }}
        >
          {showAll ? 'Show One Student' : 'Show All Students'}
        </button>
      </div>

      {showAll ? (
        hasStudents ? (
          filteredStudents.map((student, index) => renderCard(student, index))
        ) : (
          <p style={{ color: '#000' }}>No students match your search.</p>
        )
      ) : (
        <div>
          {currentStudent ? (
            renderCard(currentStudent, currentIndex)
          ) : (
            <p style={{ color: '#000' }}>No students match your search.</p>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={showPrevious}
              disabled={!hasStudents || currentIndex === 0}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #999', color: '#000', backgroundColor: '#f5f5f5' }}
            >
              Previous
            </button>
            <button
              onClick={showNext}
              disabled={!hasStudents || currentIndex >= filteredStudents.length - 1}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #999', color: '#000', backgroundColor: '#f5f5f5' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Students
