import { useState, useEffect } from 'react'

function App() {
  const [habits, setHabits] = useState([])
  const [newHabitName, setNewHabitName] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/habits')
      .then(response => response.json())
      .then(data => setHabits(data))
  }, [])

  const addHabit = (e) => {
    e.preventDefault()
    if (!newHabitName) return

    fetch('http://127.0.0.1:8000/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newHabitName }),
    })
      .then(response => response.json())
      .then(addedHabit => {
        setHabits([...habits, addedHabit])
        setNewHabitName('')
      })
  }

  // 🔄 Function to toggle a habit's status
  const toggleHabit = (id) => {
    fetch(`http://127.0.0.1:8000/habits/${id}`, {
      method: 'PUT',
    })
      .then(response => response.json())
      .then(updatedHabit => {
        // Update the specific habit in our React state
        setHabits(habits.map(habit => 
          habit.id === id ? updatedHabit : habit
        ))
      })
  }

  return (
    <div>
      <h1>My Habit Tracker 🎯</h1>
      
      <form onSubmit={addHabit}>
        <input 
          type="text" 
          value={newHabitName} 
          onChange={(e) => setNewHabitName(e.target.value)} 
          placeholder="Enter a new habit..." 
        />
        <button type="submit">Add Habit</button>
      </form>

      <ul>
        {habits.map(habit => (
          <li key={habit.id} style={{ marginBottom: '10px' }}>
            {habit.name} 
            {/* Make the button clickable to trigger the update */}
            <button 
              onClick={() => toggleHabit(habit.id)} 
              style={{ marginLeft: '10px', cursor: 'pointer' }}
            >
              {habit.completed ? '✅' : '❌'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App