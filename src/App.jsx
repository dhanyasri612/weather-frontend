// src/App.js
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Table,
  Spinner,
} from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiStrongWind,
  WiSunrise,
  WiSunset,
  WiCloudy,
  WiHumidity,
} from "react-icons/wi";

import WeatherWidget from "./components/WeatherWidget";
import getWeatherMeta from "./utils/weatherCodeMap";
import "./assets/image copy.svg";

const AnimatedBackground = ({ gradient, animate }) => {
  const gradientStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    background: `linear-gradient(90deg, ${gradient.join(", ")})`,
    backgroundSize: "400% 400%",
    backgroundRepeat: "no-repeat",
    animation: animate ? "gradientFloat 15s ease infinite" : "none",
    transition: "background 0.5s ease",
  };

  return <div style={gradientStyle}></div>;
};

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
        //`http://127.0.0.1:8000/weatherapi/weather/?city=${trimmedCity}`
        `https://weather-backend-ugpk.onrender.com/weatherapi/weather/?city=${trimmedCity}`
      );
      setWeatherData(response.data);
    } catch (err) {
      if (err.response) {
        setError(`Server Error: ${err.response.status}`);
      } else if (err.request) {
        setError("Network Error: No response received");
      } else {
        setError(`Error: ${err.message}`);
      }
    }
    setLoading(false);
  };

  const weatherCode = weatherData?.current?.weathercode;
  const meta = getWeatherMeta(weatherCode) || {
    label: "Unknown",
    icon: WiCloud,
  };

  const MetaIcon = meta.icon || WiCloud;

  const getTheme = (temperature, hour, weatherFetched, weatherCode) => {
    if (!weatherFetched) {
      return {
        gradient: ["#000014", "#1a1a2e", "#000014"], // night fallback
        textColor: "#ffffff",
        widgetColor: "#ffffff",
      };
    }

    let theme = {
      gradient: ["#000014", "#1a1a2e", "#000014"], // default night
      textColor: "#ffffff",
      widgetColor: "#ffffff",
    };

    // Weather-code-based overrides with 3+ colors for animation
    if (weatherCode >= 0 && weatherCode <= 1) {
      // Sunny
      theme.gradient = ["#87CEEB", "#FFD700", "#FFAA00", "#87CEEB"];
      theme.widgetColor = "#000000";
    } else if (weatherCode >= 2 && weatherCode <= 3) {
      // Cloudy
      theme.gradient = ["#607D8B", "#78909C", "#546e7a", "#607D8B"];
      theme.widgetColor = "#ffffff";
    } else if (weatherCode >= 45 && weatherCode <= 65) {
      // Rain / Mist
      theme.gradient = ["#1f1f2e", "#3a4a6f", "#223355", "#1f1f2e"];
      theme.widgetColor = "#9ecfff";
    } else if (weatherCode >= 71 && weatherCode <= 86) {
      // Snow
      theme.gradient = ["#003366", "#6699cc", "#336699", "#003366"];
      theme.widgetColor = "#ffffff";
    } else if (weatherCode >= 95 && weatherCode <= 99) {
      // Thunderstorm
      theme.gradient = ["#2c3e50", "#34495e", "#1a2b3c", "#2c3e50"];
      theme.widgetColor = "#f1c40f";
    } else {
      // Fallback: time + temperature
      if (hour >= 6 && hour < 10) {
        // Morning
        if (temperature < 10)
          theme.gradient = ["#a0c4ff", "#89abe3", "#6ba3d4", "#a0c4ff"];
        else if (temperature <= 25)
          theme.gradient = ["#ffe29f", "#ff7e5f", "#ffd27f", "#ffe29f"];
        else theme.gradient = ["#ff9a8b", "#ff6a00", "#ff4500", "#ff9a8b"];
      } else if (hour >= 10 && hour < 17) {
        // Day
        if (temperature < 10)
          theme.gradient = ["#74b9ff", "#0984e3", "#55aaff", "#74b9ff"];
        else if (temperature <= 25)
          theme.gradient = ["#87CEEB", "#FFD700", "#FFC107", "#87CEEB"];
        else theme.gradient = ["#ff4500", "#ff8c00", "#ff6a00", "#ff4500"];
      } else if (hour >= 17 && hour < 20) {
        // Sunset
        theme.gradient = ["#ffb347", "#ffcc33", "#ff7e5f", "#ffb347"];
      } else {
        // Night
        theme.gradient = ["#000014", "#1a1a2e", "#000033", "#000014"];
      }
    }

    return theme;
  };

  const now = new Date();
  const hour = now.getHours(); // 0-23
  const temperature = weatherData?.current?.temperature_2m || 20;
  const theme = getTheme(temperature, hour, !!weatherData, weatherCode);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "1rem",
        textAlign: "center",
        
      }}
    >
      

      <div style={{ position: "relative", zIndex: 1 }}>
        <Container className={`mt-5 p-2`} style={{ background: "transparent" }}>
          {/* Header Section */}

          <h1 className="text-center mb-4">Weather Checker</h1>

          {/* Search Section */}

          <Row className="justify-content-center mb-4">
            <Col xs={8} md={6}>
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
            <Col xs="auto">
              <Button
                variant="primary"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </Col>
          </Row>

          {/* Info Message */}
          {!loading && !weatherData && !error && (
            <Row className="justify-content-center mb-4">
              <Col xs={10} md={8}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="alert alert-info text-center"
                >
                  Enter a city name above to see the weather.
                </motion.div>
              </Col>
            </Row>
          )}

          {/* Error Message */}
          {error && (
            <Row className="justify-content-center mb-4">
              <Col xs={10} md={8}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="alert alert-danger text-center"
                >
                  {error}
                </motion.div>
              </Col>
            </Row>
          )}

          {/* Loading Spinner */}
          {loading && (
            <Row className="justify-content-center mb-4">
              <Col xs={10} md={8}>
                <div className="text-center">
                  <p>Loading weather data...</p>
                  <Spinner animation="border" variant="success" />
                </div>
              </Col>
            </Row>
          )}

          {/* Current Weather */}
          {weatherData?.current && (
            <Row className="justify-content-center mb-4">
              <Col xs={10} md={8}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border rounded text-center bg-primary"
                >
                  <h3>Current Weather in {city}</h3>
                  <br />
                  <p>Temperature: {weatherData.current.temperature_2m} °C</p>
                  <p>Wind Speed: {weatherData.current.wind_speed_10m} km/h</p>
                  <p>
                    Wind Direction: {weatherData.current.wind_direction_10m} °
                  </p>
                  <p>Rain: {weatherData.current.rain} mm</p>
                  <p>Cloud Cover: {weatherData.current.cloud_cover} %</p>
                </motion.div>
              </Col>
            </Row>
          )}

          {/* Widgets */}
          {weatherData && (
            <Container>
              <Row className="justify-content-center mb-3">
                <Col xs={12} md={6} lg={6} className="mb-3 ">
                  <WeatherWidget
                    icon={<WiDaySunny size={100} color="#f39c12" />}
                    label="Temperature"
                    value={weatherData?.current?.temperature_2m || "--"}
                    unit="°C"
                  />
                </Col>
                <Col xs={12} md={6} lg={6} className="mb-3">
                  <WeatherWidget
                    icon={<WiStrongWind size={100} color="#0099ffff" />}
                    label="Wind Speed"
                    value={weatherData?.current?.wind_speed_10m || "--"}
                    unit="km/h"
                  />
                </Col>
              </Row>
              <Row className="justify-content-center mb-3">
                <Col xs={12} md={6} lg={6} className="mb-3">
                  <WeatherWidget
                    icon={<WiCloud size={100} color="#ffffffff" />}
                    label="Wind Direction"
                    value={weatherData?.current?.wind_direction_10m || "--"}
                    unit="°"
                  />
                </Col>
                <Col xs={12} md={6} lg={6} className="mb-3">
                  <WeatherWidget
                    icon={<WiRain size={100} color="#69c3ffff" />}
                    label="Rain"
                    value={weatherData?.current?.rain || "--"}
                    unit="mm"
                  />
                </Col>
              </Row>
              <Row className="justify-content-center mb-3">
                <Col xs={12} md={6} lg={6} className="mb-3">
                  <WeatherWidget
                    icon={<WiSunrise size={100} color="#f1c40f" />}
                    label="Sunrise"
                    value={
                      weatherData?.daily?.sunrise
                        ? weatherData.daily.sunrise[0].split("T")[1]
                        : "--"
                    }
                    unit=""
                  />
                </Col>
                <Col xs={12} md={6} lg={6} className="mb-3">
                  <WeatherWidget
                    icon={<WiSunset size={100} color="#e67e22" />}
                    label="Sunset"
                    value={
                      weatherData?.daily?.sunset
                        ? weatherData.daily.sunset[0].split("T")[1]
                        : "--"
                    }
                    unit=""
                  />
                </Col>
              </Row>
              <Row className="justify-content-center mb-3">
                <Col xs={12} md={6} lg={6} className="mb-3">
                  <WeatherWidget
                    icon={<MetaIcon size={100} color="#fff" />}
                    label="Condition"
                    value={meta.label}
                    unit=""
                  />
                </Col>
                <Col xs={12} md={6} lg={6} className="mb-3">
                  <WeatherWidget
                    icon={<WiCloudy size={100} color="#3498db" />}
                    label="Cloud Cover"
                    value={weatherData?.current?.cloud_cover || "--"}
                    unit="%"
                  />
                </Col>
              </Row>
            </Container>
          )}

          {/* Hourly Forecast */}
          {weatherData?.hourly && (
            <Row className="justify-content-center mb-4">
              <Col xs={12}>
                <Card className="p-3 mb-3">
                  <h4 className="mb-3">Hourly Forecast</h4>
                  <Table striped bordered hover responsive>
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
                          <td>{t}</td>
                          <td>{weatherData.hourly.temperature_2m[i]}</td>
                          <td>{weatherData.hourly.wind_speed_10m[i]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </Col>
            </Row>
          )}

          {/* Daily Forecast */}
          {weatherData?.daily && (
            <Row className="justify-content-center mb-4">
              <Col xs={12}>
                <Card className="p-3 mb-3">
                  <h4 className="mb-3">Daily Forecast</h4>
                  <Table striped bordered hover responsive>
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
                          <td>{weatherData.daily.sunrise[i]}</td>
                          <td>{weatherData.daily.sunset[i]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </Col>
            </Row>
          )}

          {/* Daily Max/Min Temperature Trend (Today + Previous Day Only) */}
          {weatherData?.daily && (
            <Row className="justify-content-center mb-4">
              <Col xs={12} md={10}>
                <Card className="p-3 mb-3">
                  <h4 className="mb-3">Daily Max Temperature Forecast</h4>

                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={weatherData.daily.time.map((time, index) => ({
                        time,
                        maxTemperature:
                          weatherData.daily.temperature_2m_max[index],
                        minTemperature:
                          weatherData.daily.temperature_2m_min[index],
                      }))}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid stroke="#f5f5f5" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />

                      <Line
                        type="monotoneX"
                        dataKey="minTemperature"
                        stroke="#1e90ffff"
                        yAxisId={0}
                      />
                      <Line
                        type="monotoneX"
                        dataKey="maxTemperature"
                        stroke="#ff4500ff"
                        yAxisId={0}
                      />

                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
        <footer
          style={{
            marginTop: "50vh",
            padding: "1.5rem 0",
            textAlign: "center",
            color: "#ffffff",
            opacity: 0.8,
            fontSize: "1rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p style={{ margin: 2 }} className="fs-7 fs-sm-4">
            Weather Checker © {new Date().getFullYear()}. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
