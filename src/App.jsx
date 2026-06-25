import React from 'react'
import Context from './Context/Context'
import Home from './pages/Home'

const App = () => {
  return (

    <Context >
      <Home />
    </Context>

  )
}

export default App