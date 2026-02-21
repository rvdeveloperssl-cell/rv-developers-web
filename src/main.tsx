import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* මෙතැනදී ඔයාගේ Client ID එක භාවිතා කරලා App එක Wrap කරනවා */}
    <GoogleOAuthProvider clientId="966245396916-e104ocr1f6h277d59028h2n0hg644n8c.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
