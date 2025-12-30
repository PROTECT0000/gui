import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react'
import { FiClock, FiAlertTriangle, FiMenu } from 'react-icons/fi'
import { triggerAlarm } from '../common/alarm'
import { ConfirmDialog } from '../common/Modal'
import moment from 'moment'

export default function AppLayout() {
  const [now, setNow] = useState<string>(moment().format('YYYY-MM-DD HH:mm:ss'))
  const [alarmLoading, setAlarmLoading] = useState(false)
  const [alarmMsg, setAlarmMsg] = useState<string | null>(null)
  const [alarmOpen, setAlarmOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const onAlarm = () => setAlarmOpen(true)
  const confirmAlarm = async () => {
    setAlarmLoading(true)
    try {
      await triggerAlarm()
      setAlarmMsg('Alarm triggered')
      setTimeout(() => setAlarmMsg(null), 4000)
      setAlarmOpen(false)
    } catch (e: any) {
      setAlarmMsg(e?.response?.data?.message || 'Failed to trigger alarm')
    } finally {
      setAlarmLoading(false)
    }
  }
  useEffect(() => {
    const id = setInterval(() => setNow(moment().format('YYYY-MM-DD HH:mm:ss')), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="min-h-screen h-full w-full bg-black text-white">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-[240px] min-h-screen flex flex-col">
        <header className="fixed top-0 left-0 md:left-[240px] right-0 h-12 border-b border-[#2A2A2A] flex items-center justify-between px-4 bg-black z-10">
          <div className="flex items-center gap-2">
            <button className="md:hidden text-[#B3B3B3] hover:text-white" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>
              <FiMenu />
            </button>
            <button
              onClick={onAlarm}
              disabled={alarmLoading}
              className="text-xs border rounded-[6px] px-3 py-1 inline-flex items-center gap-2"
              style={{ borderColor: '#3A3A3A', color: '#E74C3C', opacity: alarmLoading ? 0.6 : 1 }}
              title="Trigger site-wide alarm"
            >
              <FiAlertTriangle />
              <span>{alarmLoading ? 'Triggering…' : 'Alarm'}</span>
            </button>
            {alarmMsg && <span className="text-xs text-[#B3B3B3]">{alarmMsg}</span>}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#B3B3B3]"><FiClock />{now}</div>
        </header>
        <main className="flex-1 min-w-0 pt-12">
          <Outlet />
        </main>
        <ConfirmDialog
          open={alarmOpen}
          onClose={() => !alarmLoading && setAlarmOpen(false)}
          title={<span className="inline-flex items-center gap-2"><FiAlertTriangle /> Confirm alarm</span>}
          message={<span>This will trigger a site-wide alarm. Proceed?</span>}
          confirmLabel="Trigger"
          onConfirm={confirmAlarm}
          loading={alarmLoading}
        />
      </div>
    </div>
  )
}
