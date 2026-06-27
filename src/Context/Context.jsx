import React, { createContext, useState } from 'react'

const AppContext = createContext()

const Context = ({ children }) => {
  const [text, setText] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [savedFilePath, setSavedFilePath] = useState('')
  const [speechMode, setSpeechMode] = useState('backend')
  const [statusMessage, setStatusMessage] = useState('Ready to fetch audio from the backend')

  const backendUrl = 'https://dac-50043482128.catalystappsail.in/api/convert'

  const base64ToAudioUrl = (base64String) => {
    const cleanString = base64String.startsWith('data:')
      ? base64String.split(',')[1]
      : base64String

    const binary = atob(cleanString)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    return URL.createObjectURL(new Blob([bytes], { type: 'audio/wav' }))
  }

  const convertTextToSpeech = async () => {
    if (!text.trim()) {
      alert('Please enter text first')
      return
    }

    try {
      if (!backendUrl) {
        throw new Error('No speech backend is configured for this environment')
      }

      setStatusMessage(`Sending request to DAC backend: ${backendUrl}`)
      console.log('Fetching DAC backend at:', backendUrl)
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      console.log('DAC response status:', response.status)
      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        console.error('DAC backend error body:', errorText)
        throw new Error(`Server error ${response.status}: ${errorText}`)
      }

      const contentType = response.headers.get('content-type') || ''
      let audioObjectUrl = ''

      if (contentType.includes('audio')) {
        const blob = await response.blob()
        if (!blob || blob.size === 0) throw new Error('No audio returned')
        audioObjectUrl = URL.createObjectURL(blob)
      } else {
        const payload = await response.json()
        console.log('DAC response payload:', payload)
        setStatusMessage('DAC response received. Decoding audio...')
        if (!payload.audioData) throw new Error('No audio data returned')
        audioObjectUrl = base64ToAudioUrl(payload.audioData)
        if (typeof payload.filePath === 'string') {
          setSavedFilePath(payload.filePath)
        }
      }

      setSpeechMode('backend')
      setAudioUrl(audioObjectUrl)
    } catch (error) {
      console.error(error)
      setStatusMessage(error.message || 'Failed to get audio from the server')
      alert(error.message || 'Failed to get audio from the server')
    }
  }

  return (
    <AppContext.Provider
      value={{
        text,
        setText,
        audioUrl,
        savedFilePath,
        speechMode,
        statusMessage,
        convertTextToSpeech
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export { AppContext }
export default Context
