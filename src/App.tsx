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

      if (newset.has(id)) newset.delete(id)
      else newset.add(id)

      return newset
    })
  }

  const selectallcurrentpage = () => {
    const allselected = artworks.every(a => selectedids.has(a.id))

    setselectedids(prev => {
      const newset = new Set(prev)

      artworks.forEach(a => {
        if (allselected) newset.delete(a.id)
        else newset.add(a.id)
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

  // 🔹 FULL WHITE LOADING SCREEN
if (loading) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#4a4e69",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          background: "#22223b",
          padding: "50px 80px",
          borderRadius: "16px",
          color: "#f2f2f2",
          fontSize: "32px",
          fontWeight: 700,
          textAlign: "center",
          boxShadow: "0 15px 40px rgba(0,0,0,0.4)"
        }}
      >
        Fetching data...
      </div>
    </div>
  )
}



  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#4a4e69",   // ✅ greyish background
        minHeight: "100vh"
      }}
    >
      <div
        style={{
          background: "#22223b",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 6px 25px rgba(0,0,0,0.06)"
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>Grow Me Organic Assignment</h2>

        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ fontWeight: 600 }}>
            Selected: {selectedids.size}
          </div>

          <button
            onClick={() => setshowoverlay(true)}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#9a8c98",
              color: "#284b63",
              cursor: "pointer",
              fontWeight:"bolder"
            }}
          >
            Custom Select
          </button>
        </div>

        <table
          width="100%"
          cellPadding={12}
          style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}
        >
          <thead>
            <tr style={{ textAlign: "left", fontSize: "20px", color: "#d9d9d9" }}>
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
              <th>Title</th>
              <th>Place</th>
              <th>Artist</th>
              <th>Inscriptions</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>

          <tbody>
            {artworks.map(a => (
              <tr
                key={a.id}
                style={{
                  background: "#2f2f4f",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  borderRadius: "8px"
                }}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedids.has(a.id)}
                    onChange={() => togglerow(a.id)}
                  />
                </td>
                <td>{a.title}</td>
                <td>{a.place_of_origin ?? "-"}</td>
                <td>{a.artist_display ?? "-"}</td>
                <td>{a.inscriptions ?? "-"}</td>
                <td>{a.date_start ?? "-"}</td>
                <td>{a.date_end ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            marginTop: "25px",
            display: "flex",
            justifyContent: "center",
            gap: "10px"
          }}
        >
          <button
            disabled={currentpage === 1}
            onClick={() => changepage(currentpage - 1)}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              background: "#9a8c98",
              cursor: "pointer",
              color:"#284b63",
              fontWeight:"bolder"

            }}
          >
            Prev
          </button>

          <span>
            Page {currentpage} of {totalpages}
          </span>

          <button
            disabled={currentpage === totalpages}
            onClick={() => changepage(currentpage + 1)}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              background: "#9a8c98",
              cursor: "pointer",
              color:"#284b63",
              fontWeight:"bolder"
            }}
          >
            Next
          </button>
        </div>
      </div>

      {showoverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              background: "black",
              padding: "30px",
              borderRadius: "12px",
              width: "300px"
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>Select rows</h3>

            <input
              type="number"
              value={selectcount}
              onChange={e => setselectcount(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd"
              }}
            />

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px"
              }}
            >
              <button onClick={() => setshowoverlay(false)}>
                Cancel
              </button>
              <button
                onClick={customselect}
                style={{
                  borderRadius: "6px",
                  background: "#9a8c98",
                  cursor: "pointer",
                  color:"#284b63",
                  fontWeight:"bolder"
                }}
              >
                Select
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
