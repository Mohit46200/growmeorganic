import { useEffect, useState } from "react"

function App() {

  type artwork = {
    id: number
    title: string
    place_of_origin: string | null
    artist_display: string | null
    inscriptions: string | null
    date_start: number | null
    date_end: number | null
  }

  type apiresponse = {
    data: artwork[]
    pagination: {
      current_page: number
      total_pages: number
    }
  }

  const [artworks, setartworks] = useState<artwork[]>([])
  const [currentpage, setcurrentpage] = useState(1)
  const [totalpages, settotalpages] = useState(1)
  const [loading, setloading] = useState(false)
  const [selectedids, setselectedids] = useState<Set<number>>(new Set())

  const [showoverlay, setshowoverlay] = useState(false)
  const [selectcount, setselectcount] = useState("")

  const fetchdata = async (page: number) => {
    setloading(true)

    const res = await fetch(
      `https://api.artic.edu/api/v1/artworks?page=${page}`
    )

    const data: apiresponse = await res.json()

    setartworks(data.data)
    setcurrentpage(data.pagination.current_page)
    settotalpages(data.pagination.total_pages)

    setloading(false)
  }

  useEffect(() => {
    fetchdata(1)
  }, [])

  const changepage = (page: number) => {
    fetchdata(page)
  }

  const togglerow = (id: number) => {
    setselectedids(prev => {
      const newset = new Set(prev)

      if (newset.has(id)) {
        newset.delete(id)
      } else {
        newset.add(id)
      }

      return newset
    })
  }

  const selectallcurrentpage = () => {
    const allselected = artworks.every(a => selectedids.has(a.id))

    setselectedids(prev => {
      const newset = new Set(prev)

      artworks.forEach(a => {
        if (allselected) {
          newset.delete(a.id)
        } else {
          newset.add(a.id)
        }
      })

      return newset
    })
  }

  const customselect = () => {
    const count = parseInt(selectcount)

    setselectedids(prev => {
      const newset = new Set(prev)

      artworks.slice(0, count).forEach(a => {
        newset.add(a.id)
      })

      return newset
    })

    setshowoverlay(false)
    setselectcount("")
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>artworks table</h2>

      <div style={{ marginBottom: "15px", fontWeight: "bold" }}>
        total selected ids: {selectedids.size}
      </div>

      <button onClick={() => setshowoverlay(true)}>
        custom select rows
      </button>

      {loading ? (
        <p>loading...</p>
      ) : (
        <table border={1} cellPadding={8} width="100%">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    artworks.length > 0 &&
                    artworks.every(a => selectedids.has(a.id))
                  }
                  onChange={selectallcurrentpage}
                />
              </th>
              <th>title</th>
              <th>place</th>
              <th>artist</th>
              <th>inscriptions</th>
              <th>start</th>
              <th>end</th>
            </tr>
          </thead>
          <tbody>
            {artworks.map(a => (
              <tr key={a.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedids.has(a.id)}
                    onChange={() => togglerow(a.id)}
                  />
                </td>
                <td>{a.title}</td>
                <td>{a.place_of_origin ?? "n/a"}</td>
                <td>{a.artist_display ?? "n/a"}</td>
                <td>{a.inscriptions ?? "n/a"}</td>
                <td>{a.date_start ?? "n/a"}</td>
                <td>{a.date_end ?? "n/a"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: "20px" }}>
        <button
          disabled={currentpage === 1}
          onClick={() => changepage(currentpage - 1)}
        >
          prev
        </button>

        <span style={{ margin: "0 10px" }}>
          page {currentpage} of {totalpages}
        </span>

        <button
          disabled={currentpage === totalpages}
          onClick={() => changepage(currentpage + 1)}
        >
          next
        </button>
      </div>

      {showoverlay && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "white", padding: "20px" }}>
            <h3>select number of rows</h3>

            <input
              type="number"
              value={selectcount}
              onChange={e => setselectcount(e.target.value)}
            />

            <div style={{ marginTop: "10px" }}>
              <button onClick={customselect}>select</button>
              <button onClick={() => setshowoverlay(false)}>
                cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
