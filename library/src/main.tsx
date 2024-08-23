import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import LoginAuth from './loginAuth.tsx'
import RegisterAuth from './registerUser.tsx'
import App1 from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App1 />
  </StrictMode>,
)

