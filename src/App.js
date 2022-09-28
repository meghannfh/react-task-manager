import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'//with React Routes v6 update all Route elements must be wrapped in <Routes> parent and the only thing allowed within the <Routes> parent are <Route> children
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'
import TaskDetails from './components/TaskDetails'
import { useState, useEffect } from 'react' //the useState is a Hook
//use the Hook useEffect when you want to create sideeffects or when you want something to happen right when the page loads

function App() {
  const [showAddTask, setShowAddTask] = useState(false)

  const [tasks/*what we call this piece of state*/, setTasks/* and then a function name to update the tasks*/] = useState([])
//for a state you can't do something like tasks.push()
//because state is immutable. it's not something you can
//directly change. you must recreate it and send it down
//tldr; it's one-way data
//instead you would use the defined function of setTasks([...tasks, {}])

//usually we don't want states inside one singular component
//we want to make it a global state so that it can be used
//in other components
//we could put it in something like App.js and then pass it
//down into components as needed as props

useEffect(() => {
  const getTasks = async () => {
    const tasksFromServer = await fetchTasks()
    setTasks(tasksFromServer)
  }
  getTasks()
}, [])

//Fetch tasks
const fetchTasks = async () => {
  const res = await fetch('http://localhost:5000/tasks')
  const data = await res.json()

  return data
}

//Fetch task
const fetchTask = async (id) => {
  const res = await fetch(`http://localhost:5000/tasks/${id}`)
  const data = await res.json()

  return data
}

//Add task
const addTask = async (task) => {
  const res = await fetch('http://localhost:5000/tasks', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(task)
  })

  const data = await res.json()

  setTasks([...tasks, data])

  // const id = Math.floor(Math.random() * 10000) + 1
  // const newTask = { id, ...task }
  // setTasks([...tasks, newTask])
}

//Delete Task
const deleteTask = async (id) => {

  await fetch(`http://localhost:5000/tasks/${id}`, 
  {
    method: 'DELETE'
  })

  setTasks(tasks.filter((task) => task.id !== id))
}

//Toggle reminder
const toggleReminder = async (id) => {
  const taskToToggle = await fetchTask(id)
  const updateTask = {...taskToToggle, reminder: !taskToToggle.reminder}

  const res = await fetch(`http://localhost:5000/tasks/${id}`,
  {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(updateTask)
  })

  const data = await res.json()

  setTasks(
    tasks.map((task) => task.id === id ? {...task, reminder: data.reminder } : task
    )
  )
}

  return (
    <Router>
        <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
        <Routes>
          <Route path='/' element={
            <>
            {showAddTask && <AddTask onAdd={ addTask }/>}
            
            {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> : 'No Tasks To Show'}
            </>
          }
          />
          <Route path='/about' element={<About />} />
          <Route path='/task/:id' element={<TaskDetails />}/>
          </Routes>
          <Footer />
        </div>
    </Router>
  );
}


export default App;
