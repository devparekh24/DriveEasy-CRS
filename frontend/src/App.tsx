import './App.css'
import AppRouting from './AppRouting'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import { useAppSelector } from './hooks/hooks'

function App() {
  const isAdmin = useAppSelector(state => state.auth.isAdmin)

  return (
    <>
      {
        isAdmin ? <AppRouting /> :
          (<>
            <Navbar />
            <AppRouting />
            <Footer />
          </>)
      }
    </>
  )
}

export default App
