import "dotenv/config"
import "./app/database/init.js"
import app from "./app/app.js"
import cluster from "cluster"
import os from "os"

// Get the number of CPU cores on the machine
const numCPUs = os.cpus().length

const PORT = process.env.PORT || 3000

if (cluster.isPrimary) {
  console.log(`Master process is running with PID: ${process.pid}`)

  // Fork worker processes based on the number of CPU cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork() // Create worker processes
  }

  // Listen for dying workers
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`)
    cluster.fork() // Restart a new worker if one dies
  })
} else {
  // Worker processes run the app
  app.listen(PORT, () => {
    console.log(`Worker process running on http://localhost:${PORT}, PID: ${process.pid}`)
  })
}
