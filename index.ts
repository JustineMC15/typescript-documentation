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
interface Task {
    id: string,
    taskTitle: string,
    taskDescription: string,
    taskDeadline: string,
    taskCompletion: boolean
}
// Input Validation
function validateString(input: string): boolean {
    if (input.trim() === '' || input.length <= 50) {
        return false;
    }
    return true;
}
// Data persistence
function loadFromFile(): { [id: string]: Task }{
    if (!fs.existsSync('tasklist.txt')) {
        console.log("No tasklist data found, starting fresh.")
        return {}
    }
    const data = fs.readFileSync('tasklist.txt', 'utf-8')
    if (data.trim() === '') return {} 
    return JSON.parse(data)
}

function saveToFile(store: { [id: string]: Task }): void {
    const data = JSON.stringify(store, null, 2)
    fs.writeFileSync('tasklist.txt', data)
    console.log("Data saved successfully.") 
}

// CRUD
// Create Function
async function createTask(store: { [id: string]: Task }): Promise<void> {
    let taskTitle = ''
    let taskDescription = ''
    let taskDeadline = ''
    while (true) {
    taskTitle = await ask("Enter Task name: ")
    if (validateString(taskTitle)) break
    console.log("Invalid! Must not be empty or exceed 50 characters.")
    }
    while (true) {
    taskDescription = await ask("Enter Task description: ")
    if (validateString(taskDescription)) break
    console.log("Invalid! Must not be empty or exceed 50 characters.")
    }
    while (true) {
    taskDeadline = await ask("Enter Task deadline: ")
    if (validateString(taskDeadline)) break
    console.log("Invalid! Must not be empty or exceed 50 characters.")
    }
    const newTask: Task = {
        id: Date.now().toString(),
        taskTitle,
        taskDescription,
        taskDeadline,
        taskCompletion: false
    }
    store[newTask.id] = newTask
    saveToFile(store)
    console.log("Task created successfully.")
}
// Read Function
function readTask (store: { [id: string]: Task }): void {
    if (Object.keys(store).length === 0){
    console.log("No tasks added yet.")
    return
    }
    console.log("ID | Title | Description | Deadline | Completion")
    for (const id of Object.keys(store)) {
    console.log(`${id} | ${store[id].taskTitle} | ${store[id].taskDescription} | ${store[id].taskDeadline} | ${store[id].taskCompletion}`)
    }
}
// Update Function
async function updateTask(store: { [id: string]: Task }): Promise<void> {
    if (Object.keys(store).length === 0){
    console.log("No tasks added yet.")
    return
    }
    readTask(store);
    const id = await ask("Select which Task to update via id: ")
    if (!store[id]) {
    console.log("Task not found!")
    return}
    let taskTitle = ''
    let taskDescription = ''
    let taskDeadline = ''
    while (true) {
    taskTitle = await ask("Enter Task name: ")
    if (validateString(taskTitle)) break
    console.log("Invalid! Must not be empty or exceed 50 characters.")
    }
    while (true) {
    taskDescription = await ask("Enter Task description: ")
    if (validateString(taskDescription)) break
    console.log("Invalid! Must not be empty or exceed 50 characters.")
    }
    while (true) {
    taskDeadline = await ask("Enter Task deadline: ")
    if (validateString(taskDeadline)) break
    console.log("Invalid! Must not be empty or exceed 50 characters.")
    }
    const newTask: Task = {
        id,
        taskTitle,
        taskDescription,
        taskDeadline,
        taskCompletion: store[id].taskCompletion
    }
    store[id] = newTask
    saveToFile(store)
    console.log("Task updated successfully.")
}
// Delete Function
async function deleteTask(store: { [id: string]: Task }): Promise<void> {
    if (Object.keys(store).length === 0){
    console.log("No tasks added yet.")
    return
    }
    readTask(store);
    const id = await ask("Select which Task to remove via id: ")
    if (!store[id]) {
    console.log("Task not found!")
    return}
    delete store[id]
    saveToFile(store)
    console.log("Task deleted successfully.")
}
// Complete Task Function

async function completeTask(store: { [id: string]: Task }): Promise<void> {
    if (Object.keys(store).length === 0){
    console.log("No tasks added yet.")
    return
    }
    readTask(store);
    const id = await ask("Select which Task to complete via id: ")
    if (!store[id]) {
    console.log("Task not found!")
    return}
    store[id].taskCompletion = true;
    saveToFile(store)
    console.log("Task completed successfully.")
}
// Search Function
async function searchTask(store: { [id: string]: Task }): Promise<void> {
    if (Object.keys(store).length === 0){
    console.log("No tasks added yet.")
    return
    }
    const searchId = await ask ("Please enter ID of task you want to search")
    if (!store[searchId]) {
        console.log ("No matches found")
    return
    }
    const t = store[searchId]
    console.log(`${t.id} | ${t.taskTitle} | ${t.taskDescription} | ${t.taskDeadline} | ${t.taskCompletion}`)
}
// Main Menu
async function main(): Promise<void> {
    const store = loadFromFile()
let choice = ' '
do {
    console.log("Tasklist")
    console.log("[C] Create")
    console.log("[R] Read")
    console.log("[U] Update")
    console.log("[D] Delete")
    console.log("[T] Task Complete")
    console.log("[S] Search by ID")
    console.log("[E] Exit")
    choice = (await ask("Enter choice: ")).toUpperCase()

    switch (choice) {
        case 'C': await createTask(store); break;
        case 'R': readTask(store); break;
        case 'U': await updateTask(store); break; 
        case 'D': await deleteTask(store); break;
        case 'T': await completeTask(store); break;
        case 'S': await searchTask(store); break;
        case 'E': saveToFile(store); console.log("Exiting..."); rl.close();  break; 
        default: console.log("Invalid choice!")
    }
} while (choice !=='E'); 
}
main()