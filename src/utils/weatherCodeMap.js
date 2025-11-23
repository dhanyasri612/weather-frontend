import {
  WiDaySunny,
  WiCloud,
  WiCloudy,
  WiRain,
  WiDayFog,
  WiSnow,
  WiThunderstorm
} from "react-icons/wi";

const codeMap = {
  0: { label: "Clear sky", icon: WiDaySunny },
  1: { label: "Mainly clear", icon: WiDaySunny },
  2: { label: "Partly cloudy", icon: WiCloud },
  3: { label: "Overcast", icon: WiCloudy },

  45: { label: "Fog", icon: WiDayFog },
  48: { label: "Rime Fog", icon: WiDayFog },

  51: { label: "Light Drizzle", icon: WiRain },
  53: { label: "Moderate Drizzle", icon: WiRain },
  55: { label: "Dense Drizzle", icon: WiRain },

  61: { label: "Slight Rain", icon: WiRain },
  63: { label: "Moderate Rain", icon: WiRain },
  65: { label: "Heavy Rain", icon: WiRain },

  71: { label: "Slight Snow", icon: WiSnow },
  73: { label: "Moderate Snow", icon: WiSnow },
  75: { label: "Heavy Snow", icon: WiSnow },

  80: { label: "Rain showers", icon: WiRain },
  81: { label: "Moderate showers", icon: WiRain },
  82: { label: "Violent showers", icon: WiRain },

  95: { label: "Thunderstorm", icon: WiThunderstorm },
  96: { label: "Thunderstorm (Slight Hail)", icon: WiThunderstorm },
  99: { label: "Thunderstorm (Heavy Hail)", icon: WiThunderstorm },
};

export default function getWeatherMeta(code){
    return codeMap[code] || { label: "Unknown", icon: WiCloud };
}