import React, { useState, useEffect } from "react";
import { requestAPI } from '../services/index';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import NavBar from "../navbar/index";
import { Container } from './styled';
import NumberFormat from 'react-number-format';
import './home.css'

function Home() {
  
  const [search, setSearch] = useState([]);
  const [packages, setPackages] = useState([]);
  const [input, setInput] = useState("");
  const [allPackages, setAllPackages] = useState([]);

  const filterPackages = (val) => {
    if (typeof val !== 'undefined' && val == "") {
      setPackages(allPackages);
    }
    else {
      setInput(val)

      let pckg = allPackages;
      
        const filterLower = input.toLowerCase();
     
        const filtered = pckg.filter((value, index) => {
          if (value.id) {
            if (
              value.city.toLowerCase().includes(filterLower) ||
              value.arrivalAirport.toLowerCase().includes(filterLower) ||
              value.departureAirport.toLowerCase().includes(filterLower) ||
              value.hotel.toLowerCase().includes(filterLower)
            ) {
              return value;
             
            }
          }
          return false;
        });
        
        setPackages(filtered);
       
  }
}

const searchPackcages = async () => {
  // Atualiza o titulo do documento usando a API do browser
  let flights = await requestAPI().get('flights');



  let hotels = await requestAPI().get('hotels');




  let iataCodes = await requestAPI().get('iataCodes');
 


  const citys = iataCodes.data.map((option) => (option.city))
  const IATASCODES = iataCodes.data.map((option) => (option.id))
  var search = citys.concat(IATASCODES)
  setSearch(search)
  //this.setState({ search: search })

  // Assumindo que todos os pacotes terão Belo Horizonte como origem.
  flights = flights.data.filter(f => f.departureAirport === "CNF");
  console.log("Primeiro filtro",flights)//Primeiro filtro

  // Somando o preço dos hotéis de destino com o preço do voo para montar os pacotes.
  let packages_ = flights.filter(f => {
    let hotel = hotels.data.find(h => h.iata === f.arrivalAirport);
    f.hotel = hotel.name;
    return (f.price += hotel.pricePerNight);
  });
 console.log("segundo filtro",packages_)
 
  // Separando os pacotes por destino nos respectivos arrays.
  let groupByIataCode = iataCodes.data.map(i => {
    let p = packages_.filter(p => p.arrivalAirport === i.id);
    // Incluindo o nome da cidade e a imgUrl dela.
    console.log("terceiro filtro",packages_)
    p.filter(p => {
      p.imageUrl = i.imageUrl;
      return (p.city = i.city);
    });
    return p;
    
  });
  console.log("linha 93",groupByIataCode)

  // Filtrando os pacotes para que apareça apenas um card para cada destino, com o menor preço possível.
  packages_ = groupByIataCode.map(test => {
    let min = test.map(tt => tt.price);
    return test.length ? test.find(t => t.price === Math.min(...min)) : "";
  });
  console.log("linha 100",packages_)
 
  setPackages(packages_)
  setAllPackages(packages_)
  //this.setState({ packages: packages });

}

// Similar ao componentDidMount e componentDidUpdate:
useEffect(() => {
  searchPackcages();
}, [packages]);

return (
  <div>
    <NavBar />
    <div className="search" >
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={search}
        onBlur={(e) => {
          filterPackages(e.target.value);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Destino ou IATA"
            margin="normal"
            variant="outlined"
            onInput={(e) => {
              filterPackages(e.target.value);
            }}
            
          />
        )}
      />
    </div>
    <Container>

      {packages.map(p => {
        return p.id ? (
          <div className="card" key={p.id} data-testid="enterprise-card">
            <div className="logo">
              <img src={p.imageUrl} alt="images" />
            </div>
            <div className="description">
              <h1 style={{ gridArea: "city" }}>{p.city}</h1>
              <NumberFormat
                value={p.price}
                displayType={"text"}
                thousandSeparator={"."}
                decimalSeparator={","}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={"R$"}
                renderText={value => <span>{value}</span>}
              />
              <p style={{ gridArea: "inboundDate", justifySelf: "end" }}>
                Ida {new Date(p.inboundDate).toLocaleDateString()}
              </p>
              <p style={{ gridArea: "outboundDate" }}>
                Volta {new Date(p.outboundDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
            ""
          );
      })}
    </Container>
  </div>
);
}
export default Home;