import React, { useContext } from 'react'
import { AppContext } from '../Context/Context'

const Text = () => {
  const { setText } = useContext(AppContext)

  const handleTextChange = (event) => {
    setText(event.target.value)
  }

  return (
    <div className='w-full min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4'>
      <style>{`
        @keyframes borderSpin {
          0% {
            border-color: rgba(135, 206, 250, 1);
            box-shadow: 0 0 20px rgba(135, 206, 250, 1);
          }
          25% {
            border-color: rgba(0, 150, 255, 1);
            box-shadow: 0 0 30px rgba(0, 150, 255, 1);
          }
          50% {
            border-color: rgba(100, 200, 255, 1);
            box-shadow: 0 0 30px rgba(100, 200, 255, 1);
          }
          75% {
            border-color: rgba(50, 150, 255, 1);
            box-shadow: 0 0 30px rgba(50, 150, 255, 1);
          }
          100% {
            border-color: rgba(135, 206, 250, 1);
            box-shadow: 0 0 20px rgba(135, 206, 250, 1);
          }
        }

        .animated-sky-border {
          animation: borderSpin 3s linear infinite;
        }

        .animated-input-border {
          animation: borderSpin 3s linear infinite;
        }
      `}</style>

      <div className='animated-sky-border w-11/12 md:w-1/2 lg:w-1/3 border-4 rounded-2xl p-8 bg-slate-900'>
        <label className='block text-sky-300 font-semibold mb-4 text-lg'>Enter Your Text</label>
        <input
          type='text'
          placeholder='Enter your text here...'
          className='animated-input-border w-full px-5 py-4 border-2 rounded-xl bg-slate-800 text-white placeholder-sky-400 placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300'
          onChange={handleTextChange}
        />
      </div>
    </div>
  )
}

export default Text
