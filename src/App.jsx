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

  const now = new Date();
  const hour = now.getHours();
  const temperature = weatherData?.current?.temperature_2m || 20;

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "2rem",
        textAlign: "center",
        backgroundColor: "#1a1a2e", // static background
        color: "#ffffff",
      }}
    >
      <Container className={`mt-5 p-2`} style={{ background: "transparent" }}>
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

        {/* Info / Error / Loading */}
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
                <p>Wind Direction: {weatherData.current.wind_direction_10m} °</p>
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
              <Col xs={12} md={6} lg={6} className="mb-3">
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
        <p style={{ margin: 0 }}>
          Weather Checker © {new Date().getFullYear()}. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;
