import React, { createContext, useState } from 'react'

const AppContext = createContext()

const Context = ({ children }) => {
  const [text, setText] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [savedFilePath, setSavedFilePath] = useState('')

  const defaultBackendUrl = import.meta.env.DEV
    ? '/api/convert'
    : 'https://dac-final-50043363970.development.catalystappsail.in/api/convert'

  const backendUrl = import.meta.env.VITE_API_URL || defaultBackendUrl

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
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
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
        console.log('DSA response payload:', payload)
        if (!payload.audioData) throw new Error('No audio data returned')
        audioObjectUrl = base64ToAudioUrl(payload.audioData)
        if (typeof payload.filePath === 'string') {
          setSavedFilePath(payload.filePath)
        }
      }

      setAudioUrl(audioObjectUrl)
    } catch (error) {
      console.error(error)
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
        convertTextToSpeech
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export { AppContext }
export default Context