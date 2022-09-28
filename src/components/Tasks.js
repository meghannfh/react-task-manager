import Task from './Task'

const Tasks = ({ tasks, onDelete, onToggle }) => {
    return (
        <>
        {tasks.map((task) => //when .map() is used and the output is JSX it is called a list
        (<Task key={task.id} task={task} onDelete={onDelete} onToggle={onToggle}/>))}
        </>// each parent in a list, in this case the h3 needs a "key" prop which should be something unique
        //defind the key prop in the JSX tag starting with key=""
    )
}

export default Tasks