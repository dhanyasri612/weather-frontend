// src/App.js
import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form, Card, Table, Spinner } from "react-bootstrap";
import { WiDaySunny, WiCloud, WiRain, WiStrongWind, WiSunrise, WiSunset, WiCloudy } from "react-icons/wi";
import WeatherWidget from "./components/WeatherWidget";
import getWeatherMeta from "./utils/weatherCodeMap";

const App = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) return;
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const response = await axios.get(
        `https://weather-backend-ugpk.onrender.com/weatherapi/weather/?city=${trimmedCity}`
      );
      setWeatherData(response.data);
    } catch (err) {
      if (err.response) setError(`Server Error: ${err.response.status}`);
      else if (err.request) setError("Network Error: No response received");
      else setError(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  const weatherCode = weatherData?.current?.weathercode;
  const meta = getWeatherMeta(weatherCode) || { label: "Unknown", icon: WiCloud };
  const MetaIcon = meta.icon || WiCloud;

  return (
    <div style={{ minHeight: "100vh", padding: "2rem 1rem", textAlign: "center", backgroundColor: "#f5f5f5", color: "#000" }}>
      <Container fluid className="p-0">
        <h1 className="mb-4">Weather Checker</h1>

        {/* Search Section */}
        <Row className="justify-content-center mb-4">
          <Col xs={10} sm={8} md={6} lg={4}>
            <Form.Control
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                if (e.target.value.trim() === "") {
                  setWeatherData(null);
                  setError(null);
                }
              }}
            />
          </Col>
          <Col xs="auto" className="mt-2 mt-sm-0">
            <Button variant="primary" onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </Col>
        </Row>

        {/* Info & Error Messages */}
        {!loading && !weatherData && !error && <p>Enter a city name above to see the weather.</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <Spinner animation="border" variant="primary" />}

        {/* Current Weather */}
        {weatherData?.current && (
          <Card className="mb-4 p-3">
            <h3>Current Weather in {city}</h3>
            <Row className="mt-2 text-center">
              <Col xs={6} sm={4} className="mb-2">
                <WiDaySunny size={40} color="#f39c12" />
                <p>{weatherData.current.temperature_2m} °C</p>
                <small>Temperature</small>
              </Col>
              <Col xs={6} sm={4} className="mb-2">
                <WiStrongWind size={40} color="#0099ff" />
                <p>{weatherData.current.wind_speed_10m} km/h</p>
                <small>Wind Speed</small>
              </Col>
              <Col xs={6} sm={4} className="mb-2">
                <WiCloud size={40} color="#777" />
                <p>{weatherData.current.cloud_cover} %</p>
                <small>Cloud Cover</small>
              </Col>
              <Col xs={6} sm={4} className="mb-2">
                <WiRain size={40} color="#00bfff" />
                <p>{weatherData.current.rain} mm</p>
                <small>Rain</small>
              </Col>
              <Col xs={6} sm={4} className="mb-2">
                <WiSunrise size={40} color="#f1c40f" />
                <p>{weatherData?.daily?.sunrise ? weatherData.daily.sunrise[0].split("T")[1] : "--"}</p>
                <small>Sunrise</small>
              </Col>
              <Col xs={6} sm={4} className="mb-2">
                <WiSunset size={40} color="#e67e22" />
                <p>{weatherData?.daily?.sunset ? weatherData.daily.sunset[0].split("T")[1] : "--"}</p>
                <small>Sunset</small>
              </Col>
              <Col xs={6} sm={4} className="mb-2">
                <MetaIcon size={40} color="#555" />
                <p>{meta.label}</p>
                <small>Condition</small>
              </Col>
            </Row>
          </Card>
        )}

        {/* Hourly Forecast */}
        {weatherData?.hourly && (
          <Card className="mb-4 p-3">
            <h4>Hourly Forecast</h4>
            <Table striped bordered hover responsive size="sm">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Temp (°C)</th>
                  <th>Wind (km/h)</th>
                </tr>
              </thead>
              <tbody>
                {weatherData.hourly.time.slice(0, 12).map((t, i) => (
                  <tr key={i}>
                    <td>{t.split("T")[1]}</td>
                    <td>{weatherData.hourly.temperature_2m[i]}</td>
                    <td>{weatherData.hourly.wind_speed_10m[i]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}

        {/* Daily Forecast */}
        {weatherData?.daily && (
          <Card className="mb-4 p-3">
            <h4>Daily Forecast</h4>
            <Table striped bordered hover responsive size="sm">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Min Temp (°C)</th>
                  <th>Max Temp (°C)</th>
                  <th>Sunrise</th>
                  <th>Sunset</th>
                </tr>
              </thead>
              <tbody>
                {weatherData.daily.time.map((d, i) => (
                  <tr key={i}>
                    <td>{d}</td>
                    <td>{weatherData.daily.temperature_2m_min[i]}</td>
                    <td>{weatherData.daily.temperature_2m_max[i]}</td>
                    <td>{weatherData.daily.sunrise[i].split("T")[1]}</td>
                    <td>{weatherData.daily.sunset[i].split("T")[1]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}

        <footer style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem", color: "#555" }}>
          <p>Weather Checker © {new Date().getFullYear()}. All rights reserved.</p>
        </footer>
      </Container>
    </div>
  );
};

export default App;
