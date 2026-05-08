import * as fs from 'node:fs'
import * as readline from 'node:readline'
const rl = readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout 
})

function ask(question: string): Promise<string> {
    return new Promise(resolve => rl.question(question, resolve))
}
// Interface structure
interface task {
    taskTitle: string,
    taskDescription: string,
    taskDeadline: string,
    taskCompletion: boolean
}

// Data persistence
function loadFromFile(): task[] {
    if (!fs.existsSync('tasklist.txt')) {
        console.log("No tasklist data found, starting fresh.")
        return []
    }
    const data = fs.readFileSync('tasklist.txt', 'utf-8')
    if (data.trim() === '') return [] 
    return JSON.parse(data)
}

function saveToFile(list: task[]): void {
    const data = JSON.stringify(list, null, 2)
    fs.writeFileSync('tasklist.txt', data)
    console.log("Data saved successfully.")
}

// CRUD
// Create Function
async function createTask(list: task[]): Promise<void> {
    const taskTitle = await ask("Enter task name: ")
    const taskDescription = await ask("Enter task description: ")
    const taskDeadline = await ask("Enter task deadline: ")

    const newTask: task = {
        taskTitle,
        taskDescription,
        taskDeadline,
        taskCompletion: false
    }

    list.push(newTask)
    saveToFile(list)
    console.log("Task created successfully.")
}
// Read Function
function readTask (list: task[]): void {
    if (list.length === 0){
    console.log("No tasks added yet.")
    return
    }
    console.log(list)
}
// Update Function
// Delete Function
// Main Menu