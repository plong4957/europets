// src/layouts/AdminLayout.jsx

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useState } from 'react';

const injectCSS = `
  .ep-nav-link:hover  { background: rgba(212,137,90,0.08) !important; color: #c4896a !important; }
  .ep-btn:hover       { background: rgba(255,255,255,0.06) !important; }
  .ep-logout:hover    { background: rgba(224,112,112,0.10) !important; }
`;

const NAV_ITEMS = [
  { to: '/admin/dashboard',  label: 'Dashboard'  },
  { to: '/admin/products',   label: 'Sản phẩm'   },
  { to: '/admin/categories', label: 'Danh mục'   },
  { to: '/admin/content',    label: 'Nội dung'   },
];

export default function AdminLayout() {
  const navigate   = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  const sidebarStyle = {
    width:         collapsed ? 68 : 240,
    flexShrink:    0,
    background:    '#1B1B1B',
    display:       'flex',
    flexDirection: 'column',
    position:      'sticky',
    top:           0,
    height:        '100vh',
    overflowX:     'hidden',
    transition:    'width 0.25s cubic-bezier(0.4,0,0.2,1)',
  };

  const dividerStyle = {
    height:     1,
    background: '#fff',
    margin:     '0 14px 8px',
  };

  const btnBase = {
    width:        '100%',
    display:      'flex',
    alignItems:   'center',
    gap:          10,
    padding:      '9px 12px',
    borderRadius: 8,
    border:       'none',
    background:   'transparent',
    fontSize:     14,
    cursor:       'pointer',
    whiteSpace:   'nowrap',
    overflow:     'hidden',
    textAlign:    'left',
  };

  return (
    <>
      <style>{injectCSS}</style>

      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* ── SIDEBAR ── */}
        <aside style={sidebarStyle}>

          {/* Logo */}
          <div style={{ padding: '20px 16px 14px', display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#00ff7f',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: 18,
            }}>
              🐾
            </div>
            {!collapsed && (
              <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <p style={{ margin: 0, color: '#f0ede8', fontWeight: 600, fontSize: 15 }}>EuroPets</p>
                <p style={{ margin: 0, color: '#6b7280', fontSize: 11 }}>Admin Panel</p>
              </div>
            )}
          </div>

          <div style={dividerStyle} />

          {/* Navigation */}
          <nav style={{ flex: 1, padding: '4px 8px' }}>
            {NAV_ITEMS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className="ep-nav-link"
                style={({ isActive }) => ({
                  display:        'flex',
                  alignItems:     'center',
                  gap:            10,
                  padding:        '10px 12px',
                  borderRadius:   8,
                  marginBottom:   2,
                  textDecoration: 'none',
                  color:          isActive ? '#3fff00' : '#faf0e6',
                  background:     isActive ? 'rgba(212,137,90,0.13)' : 'transparent',
                  fontWeight:     isActive ? 500 : 400,
                  fontSize:       14,
                  transition:     'all 0.15s',
                  whiteSpace:     'nowrap',
                  overflow:       'hidden',
                })}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Bottom actions */}
          <div style={{ padding: '8px 8px 14px' }}>
            <div style={{ ...dividerStyle, margin: '0 6px 8px' }} />

            <button
              className="ep-btn"
              onClick={() => setCollapsed(c => !c)}
              style={{ ...btnBase, color: '#6b7280', marginBottom: 2 }}
            >
              {collapsed ? '→' : 'Thu gọn'}
            </button>

            <button
              className="ep-logout"
              onClick={handleLogout}
              style={{ ...btnBase, color: '#e07070' }}
            >
              {collapsed ? '↩' : 'Đăng xuất'}
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex: 1, minWidth: 0, background: '#f5f3ef', minHeight: '100vh' }}>
          <Outlet />
        </main>

      </div>
    </>
  );
}