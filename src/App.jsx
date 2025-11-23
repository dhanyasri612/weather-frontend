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
} from "react-icons/wi";

import WeatherWidget from "./components/WeatherWidget";
import getWeatherMeta from "./utils/weatherCodeMap";

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

  const now = new Date();
  const hour = now.getHours();
  const temperature = weatherData?.current?.temperature_2m || 20;

  const getTheme = (temperature, hour, weatherFetched, weatherCode) => {
    if (!weatherFetched) return { gradient: ["#000014", "#1a1a2e", "#000014"], textColor: "#ffffff", widgetColor: "#ffffff" };

    let theme = { gradient: ["#000014", "#1a1a2e", "#000014"], textColor: "#ffffff", widgetColor: "#ffffff" };

    if (weatherCode >= 0 && weatherCode <= 1) theme.gradient = ["#87CEEB", "#FFD700", "#FFAA00", "#87CEEB"];
    else if (weatherCode >= 2 && weatherCode <= 3) theme.gradient = ["#607D8B", "#78909C", "#546e7a", "#607D8B"];
    else if (weatherCode >= 45 && weatherCode <= 65) theme.gradient = ["#1f1f2e", "#3a4a6f", "#223355", "#1f1f2e"];
    else if (weatherCode >= 71 && weatherCode <= 86) theme.gradient = ["#003366", "#6699cc", "#336699", "#003366"];
    else if (weatherCode >= 95 && weatherCode <= 99) theme.gradient = ["#2c3e50", "#34495e", "#1a2b3c", "#2c3e50"];
    else {
      if (hour >= 6 && hour < 10) {
        if (temperature < 10) theme.gradient = ["#a0c4ff", "#89abe3", "#6ba3d4", "#a0c4ff"];
        else if (temperature <= 25) theme.gradient = ["#ffe29f", "#ff7e5f", "#ffd27f", "#ffe29f"];
        else theme.gradient = ["#ff9a8b", "#ff6a00", "#ff4500", "#ff9a8b"];
      } else if (hour >= 10 && hour < 17) {
        if (temperature < 10) theme.gradient = ["#74b9ff", "#0984e3", "#55aaff", "#74b9ff"];
        else if (temperature <= 25) theme.gradient = ["#87CEEB", "#FFD700", "#FFC107", "#87CEEB"];
        else theme.gradient = ["#ff4500", "#ff8c00", "#ff6a00", "#ff4500"];
      } else if (hour >= 17 && hour < 20) theme.gradient = ["#ffb347", "#ffcc33", "#ff7e5f", "#ffb347"];
      else theme.gradient = ["#000014", "#1a1a2e", "#000033", "#000014"];
    }

    return theme;
  };

  const theme = getTheme(temperature, hour, !!weatherData, weatherCode);

  return (
    <div style={{ position: "relative", minHeight: "100vh", padding: "2rem", textAlign: "center" }}>
      <style>
        {`
          @keyframes gradientFloat {
            0% { background-position: 0% 50%; }
            25% { background-position: 100% 50%; }
            50% { background-position: 100% 100%; }
            75% { background-position: 0% 100%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      <AnimatedBackground gradient={theme.gradient} animate={true} />

      <Container className="mt-5 p-2" style={{ background: "transparent" }}>
        <h1 className="text-center mb-4">Weather Checker</h1>

        {/* Search */}
        <Row className="justify-content-center mb-4">
          <Col xs={9} sm={7} md={6}>
            <Form.Control
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                if (!e.target.value.trim()) { setWeatherData(null); setError(null); }
              }}
            />
          </Col>
          <Col xs="auto" className="mt-2 mt-sm-0">
            <Button variant="primary" onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </Col>
        </Row>

        {/* Messages */}
        {!loading && !weatherData && !error && <p>Enter a city name above to see the weather.</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <Spinner animation="border" variant="success" />}

        {/* Current Weather */}
        {weatherData?.current && (
          <Row className="justify-content-center mb-4">
            <Col xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 border rounded text-center bg-primary"
              >
                <h3>Current Weather in {city}</h3>
                <p>Temperature: {weatherData.current.temperature_2m} °C</p>
                <p>Wind Speed: {weatherData.current.wind_speed_10m} km/h</p>
                <p>Wind Direction: {weatherData.current.wind_direction_10m} °</p>
                <p>Rain: {weatherData.current.rain} mm</p>
                <p>Cloud Cover: {weatherData.current.cloud_cover} %</p>
              </motion.div>
            </Col>
          </Row>
        )}

        {/* Widgets */}
        {weatherData && (
          <Row className="justify-content-center mb-4">
            {[
              { icon: <WiDaySunny size={80} color="#f39c12" />, label: "Temperature", value: weatherData.current.temperature_2m, unit: "°C" },
              { icon: <WiStrongWind size={80} color="#0099ff" />, label: "Wind Speed", value: weatherData.current.wind_speed_10m, unit: "km/h" },
              { icon: <WiCloud size={80} color="#ffffff" />, label: "Wind Direction", value: weatherData.current.wind_direction_10m, unit: "°" },
              { icon: <WiRain size={80} color="#69c3ff" />, label: "Rain", value: weatherData.current.rain, unit: "mm" },
              { icon: <WiSunrise size={80} color="#f1c40f" />, label: "Sunrise", value: weatherData.daily?.sunrise ? weatherData.daily.sunrise[0].split("T")[1] : "--" },
              { icon: <WiSunset size={80} color="#e67e22" />, label: "Sunset", value: weatherData.daily?.sunset ? weatherData.daily.sunset[0].split("T")[1] : "--" },
              { icon: <MetaIcon size={80} color="#fff" />, label: "Condition", value: meta.label },
              { icon: <WiCloudy size={80} color="#3498db" />, label: "Cloud Cover", value: weatherData.current.cloud_cover, unit: "%" },
            ].map((w, i) => (
              <Col xs={6} sm={6} md={3} key={i} className="mb-3">
                <WeatherWidget icon={w.icon} label={w.label} value={w.value} unit={w.unit || ""} />
              </Col>
            ))}
          </Row>
        )}

        {/* Hourly Forecast */}
        {weatherData?.hourly && (
          <Card className="mb-4 p-3">
            <h4>Hourly Forecast</h4>
            <Table striped bordered hover responsive size="sm">
              <thead>
                <tr><th>Time</th><th>Temp</th><th>Wind</th></tr>
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
                  <th>Date</th><th>Min Temp</th><th>Max Temp</th><th>Sunrise</th><th>Sunset</th>
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

        {/* Temperature Trend */}
        {weatherData?.daily && (
          <Card className="mb-4 p-3">
            <h4>Daily Max Temperature Forecast</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={weatherData.daily.time.map((time, i) => ({
                  time,
                  maxTemperature: weatherData.daily.temperature_2m_max[i],
                  minTemperature: weatherData.daily.temperature_2m_min[i],
                }))}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotoneX" dataKey="minTemperature" stroke="#1e90ffff" />
                <Line type="monotoneX" dataKey="maxTemperature" stroke="#ff4500ff" />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        <footer style={{ marginTop: "2rem", textAlign: "center", color: "#ffffff", opacity: 0.8 }}>
          Weather Checker © {new Date().getFullYear()}. All rights reserved.
        </footer>
      </Container>
    </div>
  );
};

export default App;
