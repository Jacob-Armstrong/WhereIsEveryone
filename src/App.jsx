import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { createClient } from '@supabase/supabase-js'

import './App.css'

const supabaseURL = import.meta.env.VITE_DATABASE_URL;
const supabaseKey = import.meta.env.VITE_DATABASE_KEY;
const supabase = createClient(supabaseURL, supabaseKey)

function App() {
  const [count, setCount] = useState(0)

  async function getLocations() {
    const { data } = await supabase.from("locations").select();
    console.log(data);
  }

  async function insertLocation() {
    const { error } = await supabase.from("locations").insert({checkin_data: {
      name: "Emma",
      city: "San Clemente, CA",
      longitude: 172.123901,
      latitude: -42.1239018
    }})

    if (error) {
      console.log(`Error: ${error.message}`)
    }
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={
          () => 
          setCount((count) => count + 1)
          }
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
