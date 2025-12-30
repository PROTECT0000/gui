import { NavLink, useNavigate } from 'react-router'
import { setToken } from '../../api/http'
import { FiGrid, FiLogOut, FiUsers, FiAlertTriangle, FiList, FiVideo } from 'react-icons/fi'

const nav: Array<{ to: string; label: string; icon: React.ComponentType<any> }> = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/miners', label: 'Miners', icon: FiUsers },
  { to: '/alerts', label: 'Alerts', icon: FiAlertTriangle },
  { to: '/logs', label: 'Logs', icon: FiList },
  { to: '/cctvs', label: 'CCTVs', icon: FiVideo },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const onLogout = () => {
    setToken(null)
    navigate('/', { replace: true })
  }
  return (
    <aside className="fixed inset-y-0 left-0 w-[240px] border-r border-[#2A2A2A] bg-black text-white flex flex-col">
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
  )
}
