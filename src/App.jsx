import { useEffect, useState } from 'react'
import './App.css'

import searchIcon from "./assets/search.png"
import clearIcon from "./assets/clear.png"
import nclearIcon from "./assets/clearnight.png"
import fewcloudIcon from "./assets/fewcloud.png"
import nfewcloudIcon from "./assets/fewcloudnight.png"
import scattercloudIcon from "./assets/sctteredcloud.png"
import mistIcon from "./assets/mist.png"
import thunderIcon from "./assets/thunder.png"
import rainIcon from "./assets/rain.png"
import snowIcon from "./assets/snow.png"
import windIcon from "./assets/wind2.png"
import humidityIcon from "./assets/humidity.svg"

const WeatherDetails = ({icon, temp, city, country,lat, log, humidity, wind})=> {
  return (<>
    <div className='image'>
      <img src={icon} alt="Image" />
    </div>
    <div className='temp'>{temp}°C</div>
    <div className='location'>{city}</div>
    <div className='country'>{country}</div>
    <div className='cord'>
      <div>
        <span className='lat'>latitude</span>
        <span>{lat}</span>
      </div>
      <div>
        <span className='lag'>longitude</span>
        <span>{log}</span>
      </div>
    </div>
    <div className='data-container'>
      <div className='element'>
        <img src={humidityIcon} alt="humidity"
        className='icon'/>
        <div className='data'>
         <div className='humidity-percent'>{humidity}%</div>  
         <div className='text'>Humidity</div> 
        </div>
      </div>
      <div className='element'>
        <img src={windIcon} alt="wind"
        className='icon'/>
        <div className='data'>
         <div className='wind-percent'>{wind} km/h</div>  
         <div className='text'>Wind Speed</div> 
        </div>
      </div>
    </div>


    </>)
}


function App() {
  let api_key  = "d1fe5680c0927478def6b2ce12bfcc55";
  const [text,setText] = useState("coimbatore")

  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const weatherIconMap = {
    "01d": clearIcon,
    "01n": nclearIcon,
    "02d": fewcloudIcon,
    "02n": nfewcloudIcon,
    "03d": scattercloudIcon,
    "03n": scattercloudIcon,
    "04d": scattercloudIcon,
    "04n": scattercloudIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "11d": thunderIcon,
    "11n": thunderIcon,
    "13d": snowIcon,
    "13n": snowIcon,
    "50d": mistIcon,
    "50n": mistIcon,
  };


  const search = async ()=> {
    setLoading(true);
    
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
      let res = await fetch(url);
      let data = await res.json();
      console.log(data);
      if(data.cod == "404"){
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);

    } catch(error){
      console.error("An error occurred:", error.message);
      setError("An error occurred while fetching weather data.");
    }finally{
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };
  const handleKeyDown = (e) => {
    if(e.key == "Enter"){
      search();
    }
  };


  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type="text" 
          className='cityInput'
          placeholder='Search city'
          onChange={handleCity}
          value={text} 
          onKeyDown={handleKeyDown} />

          <div className='search-icon' onClick={() => search()}>
            <img src={searchIcon}
            alt='Search' />
          </div>

        </div>
      

      {loading && <div className='loading-message'>Loading...</div>}
      {error && <div className='error-message'>{error}</div>}
      {cityNotFound && <div className='city-not-found'>City not found</div>}


      {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind} />}

        <p className='copyright'>Designed by <span>Vyshu</span></p>
      </div>
     
    </>
  )
}

export default App
