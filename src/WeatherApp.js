import React, { useState } from "react";
import axios from "axios";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [cityImage, setCityImage] = useState("");
  const [error, setError] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);

  const fetchCityImage = async (cityName) => {
    try {
      const unsplashAccessKey = "S34fXCk3kF4x2wGTpEixKLVkVZWwtEcsh4lojX3Ubko";
      const response = await axios.get(
        `https://api.unsplash.com/search/photos`,
        {
          params: {
            query: `${cityName} skyline`,
            client_id: unsplashAccessKey,
            per_page: 1,
            orientation: "landscape",
          },
        }
      );
      setCityImage(response.data.results[0]?.urls.regular || "");
    } catch (err) {
      setCityImage("");
      console.error("Error fetching city image:", err);
    }
  };

  const fetchWeather = async () => {
    try {
      setError("");
      setWeather(null);
      setCityImage("");
      const apiKey = "79b5cdad33a13f8b96ec23e71c4b0930";
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: city,
            appid: apiKey,
            units: "metric",
          },
        }
      );
      setWeather(response.data);
      fetchCityImage(city);
    } catch (err) {
      setError("City not found. Please try again.");
      console.error("Error fetching weather data:", err);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getBackgroundColor = (condition) => {
    const colors = {
      Clear: "#87CEEB",
      Clouds: "#B0C4DE",
      Rain: "#708090",
      Drizzle: "#4682B4",
      Thunderstorm: "#2F4F4F",
      Snow: "#F0F8FF",
      Mist: "#778899",
      Haze: "#696969",
    };
    return colors[condition] || "#f4f4f4";
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        backgroundColor: weather
          ? getBackgroundColor(weather.weather[0].main)
          : "#f4f4f4",
        padding: "20px",
        transition: "background-color 0.3s",
      }}
    >
      {/* Navigation Bar */}
      <nav
        style={{
          backgroundImage: "url('./Weather.jpg')", // 替换为背景图片
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          height: "150px", // 调整高度
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 50px", // 调整左右间距
          borderRadius: "5px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)", // 增加阴影效果
        }}
      >
        <h1 style={{ fontSize: "2rem", margin: "0" }}>Weather App</h1>
        <div>
          <a
            href="#home"
            style={{
              color: "white",
              textDecoration: "none",
              marginRight: "15px",
            }}
          >
            Home
          </a>
          <a
            href="#about"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            About
          </a>
        </div>
      </nav>

      {/* Search Section */}
      <div
        style={{
          margin: "20px auto",
          textAlign: "center",
          padding: "30px",
          borderRadius: "10px",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          maxWidth: "600px",
        }}
      >
        <h2>Check Weather</h2>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
            border: "none",
            borderRadius: "5px",
            width: "200px",
          }}
        />
        <button
          onClick={fetchWeather}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Get Weather
        </button>
      </div>

      {/* Weather Information */}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {weather && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            margin: "20px auto",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            maxWidth: "900px",
          }}
        >
          <div style={{ flex: "1", marginRight: "20px" }}>
            <h2>Weather in {weather.name}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              style={{
                width: "100px",
                height: "100px",
                display: "block",
                margin: "0 auto",
              }}
            />
            <p>
              <strong>Temperature:</strong>{" "}
              {isCelsius
                ? `${weather.main.temp}°C`
                : `${((weather.main.temp * 9) / 5 + 32).toFixed(1)}°F`}
            </p>
            <p>
              <strong>Humidity:</strong> {weather.main.humidity}%
            </p>
            <p>
              <strong>Wind Speed:</strong> {weather.wind.speed} m/s
            </p>
            <p>
              <strong>Description:</strong> {weather.weather[0].description}
            </p>
            <p>
              <strong>Sunrise:</strong> {formatTime(weather.sys.sunrise)}
            </p>
            <p>
              <strong>Sunset:</strong> {formatTime(weather.sys.sunset)}
            </p>
          </div>
          <div style={{ flex: "1" }}>
            <img
              src={cityImage}
              alt={`View of ${city}`}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "10px",
              }}
            />
          </div>
        </div>
      )}

      {/* Celsius/Fahrenheit Switch */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={() => setIsCelsius(!isCelsius)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Switch to {isCelsius ? "Fahrenheit" : "Celsius"}
        </button>
      </div>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          marginTop: "40px",
          color: "#777",
        }}
      >
        <p>&copy; 2024 Weather App. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default WeatherApp;
