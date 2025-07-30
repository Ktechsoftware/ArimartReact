import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import AppLayout from './components/layout/AppLayout'

function App() {

  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  )
}

export default App
