import { NavLink, useNavigate } from 'react-router'
import { setToken } from '../../api/http'
import { FiGrid, FiLogOut, FiUsers, FiAlertTriangle, FiList, FiVideo, FiX, FiMap } from 'react-icons/fi'

const nav: Array<{ to: string; label: string; icon: React.ComponentType<any> }> = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/map', label: 'Map', icon: FiMap },
  { to: '/miners', label: 'Miners', icon: FiUsers },
  { to: '/alerts', label: 'Alerts', icon: FiAlertTriangle },
  { to: '/logs', label: 'Logs', icon: FiList },
  { to: '/cctvs', label: 'CCTVs', icon: FiVideo },
]

export default function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const navigate = useNavigate()
  const onLogout = () => {
    setToken(null)
    navigate('/', { replace: true })
  }
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`md:hidden ${open ? 'fixed inset-0 z-40' : 'hidden'}`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />
        <aside className="absolute inset-y-0 left-0 w-[240px] border-r border-[#2A2A2A] bg-black text-white flex flex-col z-50">
          <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between">
            <div>
              <div className="font-semibold">Miner Monitoring</div>
              <div className="text-xs text-[#B3B3B3]">Safety System</div>
            </div>
            <button onClick={onClose} className="text-[#B3B3B3] hover:text-white"><FiX /></button>
          </div>
          <nav className="flex-1 p-2">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-[6px] border ${
                    isActive ? 'border-[#3A3A3A] text-white' : 'border-transparent text-[#B3B3B3] hover:text-white hover:border-[#2A2A2A]'
                  }`
                }
              >
                <item.icon className="text-[#B3B3B3]" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="p-2 border-t border-[#2A2A2A]">
            <button onClick={onLogout} className="w-full text-sm text-[#B3B3B3] hover:text-white border border-[#2A2A2A] rounded-[6px] px-3 py-2 flex items-center justify-center gap-2">
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-[240px] md:border-r md:border-[#2A2A2A] bg-black text-white flex-col">
        <div className="px-4 py-3 border-b border-[#2A2A2A]">
          <div className="font-semibold">Miner Monitoring</div>
          <div className="text-xs text-[#B3B3B3]">Safety System</div>
        </div>
        <nav className="flex-1 p-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-[6px] border ${
                  isActive ? 'border-[#3A3A3A] text-white' : 'border-transparent text-[#B3B3B3] hover:text-white hover:border-[#2A2A2A]'
                }`
              }
            >
              <item.icon className="text-[#B3B3B3]" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-2 border-t border-[#2A2A2A]">
          <button onClick={onLogout} className="w-full text-sm text-[#B3B3B3] hover:text-white border border-[#2A2A2A] rounded-[6px] px-3 py-2 flex items-center justify-center gap-2">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
