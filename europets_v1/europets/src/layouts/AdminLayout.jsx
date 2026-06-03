import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useState } from 'react';

const NAV_ITEMS = [
  { to: '/admin/dashboard',  label: 'Dashboard',  icon: '📊' },
  { to: '/admin/products',   label: 'Sản phẩm',   icon: '📦' },
  { to: '/admin/categories', label: 'Danh mục',   icon: '🏷️' },
  { to: '/admin/content',    label: 'Nội dung',   icon: '📝' },
];

export default function AdminLayout() {
  const navigate    = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width:         collapsed ? 64 : 232,
        flexShrink:    0,
        background:    'var(--a-sidebar-bg)',
        display:       'flex',
        flexDirection: 'column',
        position:      'sticky',
        top:           0,
        height:        '100vh',
        overflowX:     'hidden',
        transition:    'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        boxShadow:     '2px 0 16px rgba(0,0,0,0.18)',
        zIndex:        50,
      }}>

        {/* Logo */}
        <div style={{
          padding:     '20px 16px 16px',
          display:     'flex',
          alignItems:  'center',
          gap:         10,
          overflow:    'hidden',
          borderBottom:'1px solid rgba(255,255,255,0.07)',
          marginBottom: 8,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #4caf82, #1a5c3f)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 18, boxShadow: '0 2px 8px rgba(76,175,130,0.35)',
          }}>🐾</div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <p style={{ margin: 0, color: '#e8f5ee', fontWeight: 700, fontSize: 14, letterSpacing: '0.5px' }}>EuroPets</p>
              <p style={{ margin: 0, color: 'var(--a-sidebar-muted)', fontSize: 11 }}>Admin Panel</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '4px 8px', overflow: 'hidden' }}>
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display:        'flex',
                alignItems:     'center',
                gap:            10,
                padding:        '10px 12px',
                borderRadius:   8,
                marginBottom:   2,
                textDecoration: 'none',
                color:          isActive ? 'var(--a-sidebar-active-text)' : 'var(--a-sidebar-text)',
                background:     isActive ? 'var(--a-sidebar-active-bg)' : 'transparent',
                fontWeight:     isActive ? 600 : 400,
                fontSize:       14,
                transition:     'all 0.15s',
                whiteSpace:     'nowrap',
                overflow:       'hidden',
                borderLeft:     isActive ? '3px solid var(--a-sidebar-active-text)' : '3px solid transparent',
              })}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: '8px 8px 16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8, border: 'none',
              background: 'transparent', fontSize: 14, cursor: 'pointer',
              color: 'var(--a-sidebar-muted)', fontFamily: 'inherit',
              transition: 'background 0.15s, color 0.15s', whiteSpace: 'nowrap',
              overflow: 'hidden', marginBottom: 4,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--a-sidebar-text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--a-sidebar-muted)'; }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>{collapsed ? '→' : '←'}</span>
            {!collapsed && 'Thu gọn'}
          </button>

          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8, border: 'none',
              background: 'transparent', fontSize: 14, cursor: 'pointer',
              color: '#f87171', fontFamily: 'inherit',
              transition: 'background 0.15s', whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>↩</span>
            {!collapsed && 'Đăng xuất'}
          </button>
        </div>

      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{
        flex:       1,
        minWidth:   0,
        background: 'var(--a-bg)',
        minHeight:  '100vh',
      }}>
        <Outlet />
      </main>

    </div>
  );
}
