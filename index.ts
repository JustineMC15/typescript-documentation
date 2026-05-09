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
    for (let i = 0; i < list.length; i++) {
    console.log(`${i} | ${list[i].taskTitle} | ${list[i].taskDescription} | ${list[i].taskDeadline}`)
    }
}
// Update Function

// Delete Function
async function deleteTask(list: task[]): Promise<void> {
    if (list.length === 0){
    console.log("No tasks added yet.")
    return
    }
    for (let i = 0; i < list.length; i++) {
    console.log(`${i} | ${list[i].taskTitle}`)
    }
    const deleteChoice = await ask("Select which task to remove via index")
    const index = parseInt(deleteChoice)
    if (index < 0 || index >= list.length) {
        console.log("Invalid index!")
    return;
    }
    list.splice(index, 1)
    saveToFile(list)
}
// Main Menu
async function main(): Promise<void> {
    const list = loadFromFile()
let choice = ' '
do {
    console.log("Tasklist")
    console.log("[C] Create")
    console.log("[R] Read")
    console.log("[U] Update")
    console.log("[D] Delete")
    console.log("[E] Exit")
    choice = (await ask("Enter choice")).toUpperCase()

    switch (choice) {
        case 'C': await createTask(list); break;
        case 'R': readTask(list); break;
        // case 'U': await updateTask(list); break; 
        case 'D': await deleteTask(list); break;
        case 'E': saveToFile(list); console.log("Exiting..."); rl.close();  break; 
        default: console.log("Invalid choice!")
    }
} while (choice !=='E'); 
}
main()