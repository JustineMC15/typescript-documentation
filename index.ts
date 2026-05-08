import * as fs from 'node:fs'
import * as readline from 'node:readline'
import { stdin as input, stdout as output } from 'node:process'
interface task {
    taskTitle: string,
    taskDescription: string,
    taskDeadline: string
}
function loadFromFile(): task[] {
    if (!fs.existsSync('tasklist.txt')) {
        console.log("No tasklist data found, starting fresh.")
        return []
    }
    const data = fs.readFileSync('tasklist.txt', 'utf-8')
    if (data.trim() === '') return [] 
    return JSON.parse(data)
}
const list = loadFromFile()
console.log(list)
function saveToFile(list: task[]): void {
    const data = JSON.stringify(list, null, 2)
    fs.writeFileSync('tasklist.txt', data)
    console.log("Data saved successfully.")
}