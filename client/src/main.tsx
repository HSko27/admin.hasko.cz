import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './style.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>} />
      <Route path='/dashboard' element={<Dashboard/>} />
    </Routes>
</BrowserRouter>
   
)
