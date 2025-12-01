import { useEffect, useMemo, useState } from 'react'

const STUDENT_API = 'https://dvonb.xyz/api/2025-fall/itis-3135/students?full=1'

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '6px',
  padding: '12px',
  marginBottom: '12px',
  backgroundColor: '#ffffff',
  color: '#111',
  textAlign: 'left',
}

const Students = () => {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await fetch(STUDENT_API)
        if (!response.ok) {
          throw new Error('Failed to load students')
        }
        const data = await response.json()
        setStudents(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Something went wrong.')
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [])

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return students
    return students.filter((student) => student.name?.toLowerCase().includes(term))
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

  const renderCard = (student) => (
    <div key={student.id || student.email} style={cardStyle}>
      <h3>{student.name}</h3>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Major:</strong> {student.major}</p>
      <p><strong>Personal Statement:</strong> {student.personal_statement}</p>
      <p><strong>Background:</strong> {student.background}</p>
    </div>
  )

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  const hasStudents = filteredStudents.length > 0
  const currentStudent = hasStudents ? filteredStudents[currentIndex] : null

  return (
    <div style={{ color: '#111', textAlign: 'left' }}>
      <h2 style={{ color: '#111' }}>Students</h2>

      <div style={{ marginBottom: '12px' }}>
        <label htmlFor="student-search">
          Search by name:{' '}
          <input
            id="student-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search..."
            style={{ color: '#111', padding: '4px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <button
          onClick={toggleMode}
          style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #999', color: '#111' }}
        >
          {showAll ? 'Show One' : 'Show All'}
        </button>
      </div>

      {showAll ? (
        hasStudents ? (
          filteredStudents.map(renderCard)
        ) : (
          <p>No students match your search.</p>
        )
      ) : (
        <div>
          {currentStudent ? (
            renderCard(currentStudent)
          ) : (
            <p>No students match your search.</p>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={showPrevious}
              disabled={!hasStudents || currentIndex === 0}
              style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #999', color: '#111' }}
            >
              Previous
            </button>
            <button
              onClick={showNext}
              disabled={!hasStudents || currentIndex >= filteredStudents.length - 1}
              style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #999', color: '#111' }}
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
