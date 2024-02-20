import axios from "axios"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import React, { useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://ssw.inf.br/2/transportadora"]
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = `
    .plasmo-csui-container{
      justify-content: center; position: relative !important;
    }
    
    input{
      width: 90%;
      margin: 1rem;
    }

    .table{
      border: 1px solid;
      border-radius: 3px;
      padding: 0.3rem;
      width: 40rem;
    }

    .tableHead{
      background: rgb(164,166,155);
      color: #fff;
      display:flex;
      align-items: center;
      font-weight: bold;
      padding-left: 10px;
      border-radius: 3px;
      font-size: 9pt;
      width: 98%;
      height: 23px;
     
    }

    .UF{
      color: blue;
      font-size: 9pt;
      font-weight: bold;
    }

    .tableValues{
      font-size: 8pt;
      color: #3F3F3F;
    }

    `

  return style
}

interface Company {
  url: string
  name: string
  city: string
}

interface ShippingCompany {
  uf: string
  companies: Company[]
}

const Content = () => {
  const [shippingCompanies, setShippingCompanies] = useState<ShippingCompany[]>(
    []
  )
  const [filteredCompanies, setFilteredCompanies] = useState<ShippingCompany[]>(
    []
  )

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3000/shipping-company")
      setShippingCompanies(response.data)
      setFilteredCompanies(response.data)
    }

    fetchData()
  }, [])

  const handleFilterChange = (value: string) => {
    setFilteredCompanies(
      shippingCompanies.filter((company) =>
        company.uf.toUpperCase().includes(value.toUpperCase())
      )
    )
  }

  document.querySelector("div").style.display = "none"
  // document.querySelector("td").style.cssText = "border: 1px solid"

  return (
    <div style={{ fontFamily: " Verdana,Arial,Helvetica,sans-serif" }}>
      <div>
        <input
          placeholder="Digite a UF para filtrar"
          onChange={(event) => handleFilterChange(event.target.value)}
        />
      </div>

      <div className="table">
        <div className="tableHead">Transportadoras por UF </div>
        <table>
          <tbody>
            {filteredCompanies.map((shippingCompany) => (
              <>
                <tr>
                  <td className="UF">{shippingCompany.uf}</td>
                </tr>
                {shippingCompany.companies.map((company) => (
                  <>
                    <tr className="tableValues">
                      <td>
                        <a
                          href={company.url}
                          target="_blank"
                          key={company.name}
                          style={{ color: "#3F3F3F" }}>
                          {company.name}
                        </a>
                      </td>

                      <td>{company.city}</td>
                    </tr>
                  </>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Content
