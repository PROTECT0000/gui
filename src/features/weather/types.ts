export interface WeatherCondition {
  code: string
  label: string
}

export interface WeatherLocation {
  lat: number
  lng: number
  name?: string | null
}

export interface Weather {
  location: WeatherLocation
  updatedAt: string
  temperatureC: number
  humidityPct: number
  windKph: number
  heatIndexC?: number | null
  condition: WeatherCondition
}

export interface WeatherForecastItem {
  timestamp: string
  temperatureC: number
  humidityPct: number
  windKph: number
  probabilityOfRainPct: number
  condition: WeatherCondition
}

export interface WeatherForecast {
  location: WeatherLocation
  items: WeatherForecastItem[]
}

export interface WeatherSeriesPoint {
  timestamp: string
  temperatureC: number
}

export interface WeatherSeries {
  items: WeatherSeriesPoint[]
}
