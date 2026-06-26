import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../Context/Context'

const Speeker = () => {
  const { text, audioUrl, savedFilePath, speechMode, statusMessage, convertTextToSpeech } = useContext(AppContext)
  const audioRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [volume, setVolume] = useState(0.7)

  const handleVolumeChange = (event) => {
    const newVolume = Number(event.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handleSpeak = async () => {
    if (!text.trim()) {
      alert('Please enter text first')
      return
    }

    setLoading(true)
    try {
      await convertTextToSpeech()
    } catch (error) {
      console.error(error)
      alert('Could not convert text to speech')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!audioUrl || !audioRef.current) return

    audioRef.current.src = audioUrl
    audioRef.current.currentTime = 0
    audioRef.current.volume = volume
    audioRef.current.play().catch(() => {})
  }, [audioUrl, volume])

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-gray-900 to-gray-800 p-4'>
      <h1 className='text-3xl font-bold text-sky-300'>
        {text.trim() === '' ? 'Text to Speech' : text}
      </h1>

      <button
        className='bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-sky-500/50 shadow-2xl transition duration-300 transform hover:scale-105 disabled:opacity-50'
        onClick={handleSpeak}
        disabled={loading}
      >
        {loading ? '⏳ Converting...' : '🔊 Speak'}
      </button>

      <div className='w-full max-w-md flex flex-col gap-4'>
        <audio ref={audioRef} controls className='w-full' preload='auto' />
        <div className='flex items-center gap-4 px-4'>
          <label className='text-sky-300 font-semibold whitespace-nowrap'>Volume:</label>
          <input
            type='range'
            min='0'
            max='1'
            step='0.1'
            value={volume}
            onChange={handleVolumeChange}
            className='w-full cursor-pointer accent-sky-500'
          />
          <span className='text-sky-300 text-sm font-semibold whitespace-nowrap'>{Math.round(volume * 100)}%</span>
        </div>
      </div>

      <p className='text-sky-200 text-center max-w-md'>
        {speechMode === 'browser'
          ? 'Your browser voice is being used for playback, so this works on GitHub Pages without CORS errors.'
          : 'Click the button to convert your text to speech'}
      </p>

      <div className='w-full max-w-md rounded-lg border border-sky-700 bg-sky-950/50 px-4 py-3 text-sm text-sky-100'>
        <p className='font-semibold text-sky-300'>Status</p>
        <p className='mt-1 break-words'>{statusMessage}</p>
      </div>

      {savedFilePath && (
        <div className='w-full max-w-md text-left text-sky-200 bg-sky-900/40 p-4 rounded-lg border border-sky-700'>
          <p className='font-semibold text-sky-100 mb-2'>Saved audio file:</p>
          <p className='break-words text-sm'>{savedFilePath}</p>
        </div>
      )}

      <div className='text-sky-300 text-sm text-center max-w-md bg-sky-900/30 p-3 rounded-lg border border-sky-700'>
        <p className='font-semibold mb-2'>💡 Tip:</p>
        <p>Use the Volume slider to adjust playback. If your browser does not support speech playback, the app will fall back to the configured backend.</p>
      </div>
    </div>
  )
}

export default Speeker
