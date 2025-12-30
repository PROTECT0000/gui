import http from '../../api/http'
import type { Weather, WeatherForecast, WeatherSeries } from './types'

export async function getWeather(params?: { lat?: number; lng?: number }): Promise<Weather> {
  const { data } = await http.get<Weather>('/weather', { params })
  return data
}

export async function getWeatherForecast(params?: { lat?: number; lng?: number; hours?: number }): Promise<WeatherForecast> {
  const { data } = await http.get<WeatherForecast>('/weather/forecast', { params })
  return data
}

export async function getWeatherSeries(params?: { from?: string; to?: string; bucket?: 'minute' | 'hour' }): Promise<WeatherSeries> {
  const { data } = await http.get<WeatherSeries>('/weather/series', { params })
  return data
}
