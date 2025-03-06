import "dotenv/config"
import "./app/database/init.js"
import app from "./app/app.js"

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
