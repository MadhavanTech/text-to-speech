import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const port = process.env.PORT || 3001

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json({ limit: '5mb' }))

const sampleAudioPath = path.join(__dirname, 'current_output.wav')

if (!fs.existsSync(sampleAudioPath)) {
  throw new Error('Sample audio file not found at current_output.wav')
}

app.post('/api/convert', (req, res) => {
  const { text } = req.body || {}

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Text is required' })
  }

  const safeText = text.trim().replace(/\s+/g, ' ')
  const audioDir = path.join(__dirname, 'public', 'audio')
  const outputPath = path.join(audioDir, `voice-${Date.now()}.wav`)

  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true })
  }

  const sourceBuffer = fs.readFileSync(sampleAudioPath)
  fs.writeFileSync(outputPath, sourceBuffer)

  return res.json({
    message: 'Audio generated locally',
    audioData: sourceBuffer.toString('base64'),
    filePath: outputPath,
    text: safeText,
  })
})

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`)
})
