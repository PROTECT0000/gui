import { useMemo, useState } from 'react'
import { listMiners } from '../miners/api'
import type { Miner } from '../miners/types'
import { listAlerts, acknowledgeAlert } from '../alerts/api'
import type { Alert } from '../alerts/types'
import { useCursorPager } from '../common/useCursorPager'
// No local header or logout; handled by AppLayout sidebar and top bar
import { getStats, getOnlineSeries, getAvgBodyTemp } from '../stats/api'
import type { StatsOverview, OnlinePoint, AvgBodyTemp } from '../stats/types'
import { getWeather, getWeatherForecast, getWeatherSeries } from '../weather/api'
import type { Weather, WeatherForecastItem, WeatherSeriesPoint } from '../weather/types'
import { Tooltip as RTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, Cell } from 'recharts'
import { FiBarChart2, FiUsers, FiMap, FiAlertTriangle, FiUser, FiCpu, FiMapPin, FiClock, FiActivity, FiCloud, FiWind, FiDroplet, FiSun, FiThermometer, FiBattery, FiGrid, FiWifi, FiTrendingUp } from 'react-icons/fi'
import { Link } from 'react-router'
import moment from 'moment'

import DummyMap from '../map/DummyMap'
import { StatusPill, ZonePill } from '../common/Pills'
import Section from '../common/Section'
import TableHeaderCell from '../common/TableHeaderCell'

function formatDate(s?: string | null) {
  if (!s) return '—'
  const m = moment(s)
  return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : '—'
}

export default function DashboardPage() {
  const [minerStatus, setMinerStatus] = useState<'all' | 'online' | 'offline'>('all')

  const minersPager = useCursorPager<Miner>(async (cursor) => {
    return await listMiners({ cursor, pageSize: 20, status: minerStatus === 'all' ? undefined : minerStatus })
  })

  const alertsPager = useCursorPager<Alert>(async (cursor) => {
    return await listAlerts({ cursor, pageSize: 20, status: 'open' })
  })

  const [stats, setStats] = useState<StatsOverview | null>(null)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [statsLoading, setStatsLoading] = useState<boolean>(false)
  const [series, setSeries] = useState<OnlinePoint[] | null>(null)
  const [seriesError, setSeriesError] = useState<string | null>(null)
  const [seriesLoading, setSeriesLoading] = useState<boolean>(false)
  const [weather, setWeather] = useState<Weather | null>(null)
  const [weatherError, setWeatherError] = useState<string | null>(null)
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false)
  const [forecast, setForecast] = useState<WeatherForecastItem[] | null>(null)
  const [forecastError, setForecastError] = useState<string | null>(null)
  const [forecastLoading, setForecastLoading] = useState<boolean>(false)
  const [tempSeries, setTempSeries] = useState<WeatherSeriesPoint[] | null>(null)
  const [tempSeriesError, setTempSeriesError] = useState<string | null>(null)
  const [tempSeriesLoading, setTempSeriesLoading] = useState<boolean>(false)
  const [avgTemp, setAvgTemp] = useState<AvgBodyTemp | null>(null)
  const [avgTempError, setAvgTempError] = useState<string | null>(null)
  const [avgTempLoading, setAvgTempLoading] = useState<boolean>(false)

  // Fetch overview stats
  useMemo(() => {
    let mounted = true
    setStatsLoading(true)
    setStatsError(null)
    getStats()
      .then((d) => { if (mounted) setStats(d) })
      .catch((e) => { if (mounted) setStatsError(e?.response?.data?.message || 'Failed to load stats') })
      .finally(() => { if (mounted) setStatsLoading(false) })
    return () => { mounted = false }
  }, [])

  // Fetch average body temperature for online miners
  useMemo(() => {
    let mounted = true
    setAvgTempLoading(true)
    setAvgTempError(null)
    getAvgBodyTemp({ status: 'online' })
      .then((d) => { if (mounted) setAvgTemp(d) })
      .catch((e) => { if (mounted) setAvgTempError(e?.response?.data?.message || 'Failed to load average temperature') })
      .finally(() => { if (mounted) setAvgTempLoading(false) })
    return () => { mounted = false }
  }, [])

  // Fetch online miners series (last 12 hours, hourly buckets)
  useMemo(() => {
    let mounted = true
    const to = new Date()
    const from = new Date(Date.now() - 12 * 60 * 60 * 1000)
    setSeriesLoading(true)
    setSeriesError(null)
    getOnlineSeries({ from: from.toISOString(), to: to.toISOString(), bucket: 'hour' })
      .then((d) => { if (mounted) setSeries(d.items) })
      .catch((e) => { if (mounted) setSeriesError(e?.response?.data?.message || 'Failed to load series') })
      .finally(() => { if (mounted) setSeriesLoading(false) })
    return () => { mounted = false }
  }, [])

  // Fetch temperature series (last 6 hours, hourly)
  useMemo(() => {
    let mounted = true
    const to = new Date()
    const from = new Date(Date.now() - 6 * 60 * 60 * 1000)
    setTempSeriesLoading(true)
    setTempSeriesError(null)
    getWeatherSeries({ from: from.toISOString(), to: to.toISOString(), bucket: 'hour' })
      .then((d) => { if (mounted) setTempSeries(d.items) })
      .catch((e) => { if (mounted) setTempSeriesError(e?.response?.data?.message || 'Failed to load temperature series') })
      .finally(() => { if (mounted) setTempSeriesLoading(false) })
    return () => { mounted = false }
  }, [])

  // Fetch weather (site default)
  useMemo(() => {
    let mounted = true
    setWeatherLoading(true)
    setWeatherError(null)
    getWeather()
      .then((d) => { if (mounted) setWeather(d) })
      .catch((e) => { if (mounted) setWeatherError(e?.response?.data?.message || 'Failed to load weather') })
      .finally(() => { if (mounted) setWeatherLoading(false) })
    return () => { mounted = false }
  }, [])

  // Fetch weather forecast (next 6 hours)
  useMemo(() => {
    let mounted = true
    setForecastLoading(true)
    setForecastError(null)
    getWeatherForecast({ hours: 6 })
      .then((d) => { if (mounted) setForecast(d.items) })
      .catch((e) => { if (mounted) setForecastError(e?.response?.data?.message || 'Failed to load forecast') })
      .finally(() => { if (mounted) setForecastLoading(false) })
    return () => { mounted = false }
  }, [])

  const totals = useMemo(() => {
    const online = minersPager.items.filter(m => m.deviceStatus === 'online').length
    const offline = minersPager.items.filter(m => m.deviceStatus === 'offline').length
    return { online, offline }
  }, [minersPager.items])

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="p-4 grid grid-cols-1 gap-4 xl:grid-cols-3 items-stretch">




        <div className="h-116">
        <Section title={<><FiCloud className="text-[#B3B3B3]"/> Weather</>} fill>
            {weatherLoading && <span className="text-xs text-[#B3B3B3]">Loading…</span>}
            {weatherError && <div className="text-sm text-red-400">{weatherError}</div>}
            {weather && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="border border-[#2A2A2A] rounded-[8px] p-3">
                  <div className="text-xs text-[#B3B3B3] flex items-center gap-1"><FiSun/> Temperature</div>
                  <div className="text-lg">{weather.temperatureC.toFixed(1)}°C</div>
                </div>
                <div className="border border-[#2A2A2A] rounded-[8px] p-3">
                  <div className="text-xs text-[#B3B3B3] flex items-center gap-1"><FiDroplet/> Humidity</div>
                  <div className="text-lg">{weather.humidityPct}%</div>
                </div>
                <div className="border border-[#2A2A2A] rounded-[8px] p-3">
                  <div className="text-xs text-[#B3B3B3] flex items-center gap-1"><FiWind/> Wind</div>
                  <div className="text-lg">{weather.windKph.toFixed(1)} km/h</div>
                </div>
                <div className="border border-[#2A2A2A] rounded-[8px] p-3">
                  <div className="text-xs text-[#B3B3B3]">Condition</div>
                  <div className="text-lg">{weather.condition.label}</div>
                </div>
                {weather.heatIndexC != null && (
                  <div className="border border-[#2A2A2A] rounded-[8px] p-3">
                    <div className="text-xs text-[#B3B3B3]">Heat Index</div>
                    <div className="text-lg">{weather.heatIndexC.toFixed(1)}°C</div>
                  </div>
                )}
                <div className="border border-[#2A2A2A] rounded-[8px] p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-[#B3B3B3]">Avg body temp (online)</div>
                    {avgTempLoading && <span className="text-[11px] text-[#B3B3B3]">Loading…</span>}
                  </div>
                  {avgTempError && <div className="text-xs text-red-400 mt-1">{avgTempError}</div>}
                  <div className="text-lg mt-1">{avgTemp?.averageBodyTempC != null ? `${avgTemp.averageBodyTempC.toFixed(1)}°C` : '—'}</div>
                </div>
                <div className="text-xs text-[#B3B3B3] col-span-2">Updated: {formatDate(weather.updatedAt)}</div>
              </div>
            )}
            <div className="mt-3 border-t border-[#2A2A2A] pt-3">
              <div className="text-xs text-[#B3B3B3] mb-2">Forecast (next 6 hours)</div>
              {forecastLoading && <span className="text-xs text-[#B3B3B3]">Loading…</span>}
              {forecastError && <div className="text-sm text-red-400">{forecastError}</div>}
              {forecast && (
                <div className="flex gap-2 overflow-x-auto pr-1 text-sm">
                  {forecast.map((f) => (
                    <div key={f.timestamp} className="border border-[#2A2A2A] rounded-[8px] p-2 min-w-[110px]">
                      <div className="text-xs text-[#B3B3B3]">{moment(f.timestamp).format('HH:mm')}</div>
                      <div className="text-sm">{f.temperatureC.toFixed(1)}°C</div>
                      <div className="text-xs text-[#B3B3B3]">Rain {f.probabilityOfRainPct}%</div>
                      <div className="text-xs text-[#B3B3B3]">{f.condition.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>
        </div>
        <div className="h-116">
        <Section title={<><FiMap className="text-[#B3B3B3]"/> Map</>} fill>
            <DummyMap
              points={minersPager.items
                .filter(m => !!m.lastKnownLocation)
                .map(m => ({
                  id: m.minerId,
                  name: m.name,
                  status: m.deviceStatus,
                  lat: m.lastKnownLocation!.lat,
                  lng: m.lastKnownLocation!.lng,
                }))}
              height="100%"
            />
           </Section>
        </div>
        <div className="h-116">
          <Section title={<><FiAlertTriangle className="text-[#B3B3B3]"/> Open Alerts</>} fill>
            <div className="h-full flex flex-col min-h-0">
              <ul className="divide-y divide-[#2A2A2A] flex-1 min-h-0 overflow-y-auto pr-1">
                {alertsPager.items.map((a) => (
                  <li key={a.id} className="py-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm">{a.type.replaceAll('_', ' ')}</div>
                        <div className="text-xs text-[#B3B3B3]">{a.message}</div>
                        <div className="text-xs text-[#B3B3B3]">{formatDate(a.createdAt)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-400 border border-[#3A3A3A] rounded-[6px] px-2 py-0.5">{a.severity}</span>
                        <button
                          onClick={async () => { await acknowledgeAlert(a.id); alertsPager.reset(); }}
                          className="text-xs text-[#B3B3B3] hover:text-white border border-[#2A2A2A] rounded-[6px] px-2 py-0.5"
                        >
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center gap-3">
                {alertsPager.error && <div className="text-red-400 text-sm">{alertsPager.error}</div>}
                <button
                  disabled={!alertsPager.hasMore || alertsPager.loading}
                  onClick={() => alertsPager.loadMore()}
                  className="border border-[#2A2A2A] rounded-[6px] px-3 py-1 text-sm text-[#B3B3B3] hover:text-white disabled:opacity-60"
                >
                  {alertsPager.loading ? 'Loading…' : alertsPager.hasMore ? 'Load more' : 'No more'}
                </button>
              </div>
            </div>
          </Section>
        </div>
        <div className="xl:col-span-3">
          <Section title={<><FiUsers className="text-[#B3B3B3]"/> Miners</>}
            action={
              <div className="flex items-center gap-2">
                <select
                  value={minerStatus}
                  onChange={(e) => { setMinerStatus(e.target.value as any); minersPager.reset() }}
                  className="bg-black text-[#B3B3B3] border border-[#2A2A2A] rounded-[6px] px-2 py-1 text-sm"
                >
                  <option value="all">All</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead className="text-[#B3B3B3]">
                  <tr className="border-b border-[#2A2A2A]">
                    <TableHeaderCell icon={<FiUser />}>Miner</TableHeaderCell>
                    <TableHeaderCell icon={<FiCpu />}>Device</TableHeaderCell>
                    <TableHeaderCell icon={<FiUsers />}>Team</TableHeaderCell>
                    <TableHeaderCell icon={<FiSun />}>Heat Index</TableHeaderCell>
                    <TableHeaderCell icon={<FiThermometer />}>Temp</TableHeaderCell>
                    <TableHeaderCell icon={<FiBattery />}>Battery</TableHeaderCell>
                    <TableHeaderCell icon={<FiWifi />}>RSSI</TableHeaderCell>
                    <TableHeaderCell icon={<FiMapPin />}>Position</TableHeaderCell>
                    <TableHeaderCell icon={<FiTrendingUp />}>Altitude</TableHeaderCell>
                    <TableHeaderCell icon={<FiGrid />}>Zone</TableHeaderCell>
                    <TableHeaderCell icon={<FiActivity />}>Status</TableHeaderCell>
                    <TableHeaderCell icon={<FiClock />}>Last seen</TableHeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {minersPager.items.map((m) => (
                    <tr key={m.minerId} className="border-b border-[#2A2A2A]">
                      <td className="py-2 whitespace-nowrap"><Link to={`/miners/${encodeURIComponent(m.minerId)}`} className="hover:underline text-white">{m.name}</Link></td>
                      <td className="py-2 text-[#B3B3B3] whitespace-nowrap">{m.deviceSerial}</td>
                      <td className="py-2 text-[#B3B3B3] whitespace-nowrap">{m.team || '—'}</td>
                      <td className="py-2 text-[#B3B3B3] whitespace-nowrap">{m.lastHeatIndexC != null ? `${m.lastHeatIndexC.toFixed(1)}°C` : '—'}</td>
                      <td className="py-2 text-[#B3B3B3] whitespace-nowrap">{m.lastBodyTemp != null ? `${m.lastBodyTemp.toFixed(1)}°C` : '—'}</td>
                      <td className="py-2 text-[#B3B3B3] whitespace-nowrap">{m.lastBatteryPct != null ? `${m.lastBatteryPct}%` : '—'}</td>
                      <td className="py-2 text-[#B3B3B3] whitespace-nowrap">{m.lastSignalRssi != null ? `${m.lastSignalRssi} dBm` : '—'}</td>
                      <td className="py-2 text-[#B3B3B3] whitespace-nowrap">{m.lastKnownLocation ? `${m.lastKnownLocation.lat.toFixed(3)}, ${m.lastKnownLocation.lng.toFixed(3)}` : '—'}</td>
                      <td className="py-2 text-[#B3B3B3] whitespace-nowrap">{m.lastKnownLocation?.altitudeM != null ? `${m.lastKnownLocation.altitudeM} m` : '—'}</td>
                      <td className="py-2 whitespace-nowrap"><ZonePill zone={m.zone ?? null} /></td>
                      <td className="py-2 whitespace-nowrap"><StatusPill status={m.deviceStatus} /></td>
                      <td className="py-2 text-[#B3B3B3] whitespace-nowrap">{formatDate(m.lastSeen)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex items-center gap-3">
              {minersPager.error && <div className="text-red-400 text-sm">{minersPager.error}</div>}
              <button
                disabled={!minersPager.hasMore || minersPager.loading}
                onClick={() => minersPager.loadMore()}
                className="border border-[#2A2A2A] rounded-[6px] px-3 py-1 text-sm text-[#B3B3B3] hover:text-white disabled:opacity-60"
              >
                {minersPager.loading ? 'Loading…' : minersPager.hasMore ? 'Load more' : 'No more'}
              </button>
              <div className="text-xs text-[#B3B3B3]">Online: {totals.online} • Offline: {totals.offline}</div>
            </div>
          </Section>
        </div>

        <div className="xl:col-span-3">
          <Section title={<><FiBarChart2 className="text-[#B3B3B3]"/> Overview</>} action={statsLoading ? <span className="text-xs text-[#B3B3B3]">Loading…</span> : null}>
            {statsError && <div className="text-sm text-red-400">{statsError}</div>}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-[#2A2A2A] rounded-[8px] p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-[#B3B3B3]">Temperature (last 6 hours)</div>
                    {tempSeriesLoading && <span className="text-xs text-[#B3B3B3]">Loading…</span>}
                  </div>
                  {tempSeriesError && <div className="text-sm text-red-400">{tempSeriesError}</div>}
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={(tempSeries || []).map(p => ({ t: moment(p.timestamp).format('HH:mm'), temp: p.temperatureC }))}>
                        <CartesianGrid stroke="#0a0a0a" strokeDasharray="3 3" />
                        <XAxis dataKey="t" tick={{ fill: '#B3B3B3', fontSize: 12 }} axisLine={{ stroke: '#2A2A2A' }} tickLine={{ stroke: '#2A2A2A' }} />
                        <YAxis allowDecimals tick={{ fill: '#B3B3B3', fontSize: 12 }} axisLine={{ stroke: '#2A2A2A' }} tickLine={{ stroke: '#2A2A2A' }} />
                        <RTooltip contentStyle={{ background: '#000', border: '1px solid #2A2A2A', color: '#fff', borderRadius: 6 }} labelStyle={{ color: '#B3B3B3' }} itemStyle={{ color: '#FFFFFF' }} formatter={(value: any) => [`${value}°C`, 'Temp']} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
                        <Area type="monotone" dataKey="temp" stroke="#E67E22" fill="rgba(230,126,34,0.15)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="border border-[#2A2A2A] rounded-[8px] p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-[#B3B3B3]">Online miners (last 12 hours)</div>
                    {seriesLoading && <span className="text-xs text-[#B3B3B3]">Loading…</span>}
                  </div>
                  {seriesError && <div className="text-sm text-red-400">{seriesError}</div>}
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={(series || []).map(p => ({
                        t: moment(p.timestamp).format('HH:mm'),
                        online: p.online,
                        total: p.total
                      }))}>
                        <CartesianGrid stroke="#0a0a0a" strokeDasharray="3 3" />
                        <XAxis dataKey="t" tick={{ fill: '#B3B3B3', fontSize: 12 }} axisLine={{ stroke: '#2A2A2A' }} tickLine={{ stroke: '#2A2A2A' }} />
                        <YAxis allowDecimals={false} tick={{ fill: '#B3B3B3', fontSize: 12 }} axisLine={{ stroke: '#2A2A2A' }} tickLine={{ stroke: '#2A2A2A' }} />
                        <RTooltip
                          contentStyle={{ background: '#000', border: '1px solid #2A2A2A', color: '#fff', borderRadius: 6 }}
                          labelStyle={{ color: '#B3B3B3' }}
                          itemStyle={{ color: '#FFFFFF' }}
                          formatter={(value: any, name: any) => [value, name]}
                          cursor={{ stroke: 'rgba(255,255,255,0.15)' }}
                        />
                        <Area type="monotone" dataKey="online" stroke="#1DB954" fill="rgba(29,185,84,0.15)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="border border-[#2A2A2A] rounded-[8px] p-3">
                  <div className="text-sm text-[#B3B3B3] mb-2">Open alerts by severity</div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { severity: 'critical', count: stats.alerts.bySeverity.critical },
                        { severity: 'warning', count: stats.alerts.bySeverity.warning },
                        { severity: 'info', count: stats.alerts.bySeverity.info },
                      ]}>
                        <CartesianGrid stroke="#0a0a0a" strokeDasharray="3 3" />
                        <XAxis dataKey="severity" tick={{ fill: '#B3B3B3', fontSize: 12 }} axisLine={{ stroke: '#2A2A2A' }} tickLine={{ stroke: '#2A2A2A' }} />
                        <YAxis allowDecimals={false} tick={{ fill: '#B3B3B3', fontSize: 12 }} axisLine={{ stroke: '#2A2A2A' }} tickLine={{ stroke: '#2A2A2A' }} />
                        <RTooltip contentStyle={{ background: '#000', border: '1px solid #2A2A2A', color: '#fff', borderRadius: 6 }} labelStyle={{ color: '#B3B3B3' }} itemStyle={{ color: '#FFFFFF' }} formatter={(value: any, name: any) => [value, name]} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                        <Bar dataKey="count" radius={[6,6,0,0]}>
                          <Cell fill="#E74C3C" />
                          <Cell fill="#F1C40F" />
                          <Cell fill="#7F8C8D" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </Section>
        </div>
      </main>
    </div>
  )
}
