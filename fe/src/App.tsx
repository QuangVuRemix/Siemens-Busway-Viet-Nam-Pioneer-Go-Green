import { useEffect, useState } from 'react'
import './App.css'
import StravaReport from './StravaReport'
import { Report } from './interface'
import { SwitchThemeButton } from './SwitchThemeButton'


function App() { 
  const [data, setData] = useState<Report>();
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    fetch('/report.json').then(rs => rs.json()).then(x => setData(x as Report));
  }, [])
  return (
    <main className={`${theme} text-foreground bg-background`}>
      <SwitchThemeButton onChange={setTheme} /> 
      <div className=''>
        {
          data && <StravaReport data={data} />
        }
      </div>
    </main>
  )
}

export default App
