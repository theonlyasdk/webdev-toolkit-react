import React from 'react';

const Sidebar = ({ activeTool, setActiveTool, theme, toggleTheme, isOpen, toggleSidebar }) => {
  const tools = [
    { id: 'box-shadow-generator', name: 'Box Shadow', icon: 'bi-box' },
    { id: 'text-shadow-generator', name: 'Text Shadow', icon: 'bi-fonts' },
    { id: 'gradient-generator', name: 'Gradient', icon: 'bi-palette-fill' },
    { id: 'border-radius-generator', name: 'Border Radius', icon: 'bi-aspect-ratio' },
    { id: 'color-converter', name: 'Color Converter', icon: 'bi-eyedropper' },
    { id: 'text-properties-generator', name: 'Text Properties', icon: 'bi-textarea-t' },
    { id: 'transform-generator', name: 'Transform', icon: 'bi-arrows-move' },
  ];

  return (
    <>
      {/* Overlay for mobile (click to close) */}
      {isOpen && <div className="sidebar-overlay d-md-none" onClick={toggleSidebar}></div>}

      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Close button (mobile only) */}
        <button className="close-btn d-md-none" onClick={toggleSidebar}>
          ✖
        </button>

        <div>
          <div className="sidebar-header">Webdev Toolkit</div>
          <ul className="nav flex-column">
            {tools.map(tool => (
              <li className="nav-item" key={tool.id}>
                <a
                  className={`nav-link ${activeTool === tool.id ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTool(tool.id);
                    toggleSidebar(); // close after selecting in mobile
                  }}
                >
                  <i className={`bi ${tool.icon} me-2`}></i>{tool.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-footer">
          <button
            className="btn btn-link theme-toggle-btn"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            <i className={`bi ${theme === 'dark' ? 'bi-moon-fill' : 'bi-sun-fill'}`}></i>
          </button>
          <a
            className="btn btn-link theme-toggle-btn"
            href="https://github.com/theonlyasdk/webdev-toolkit-react"
            title="View on GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-github"></i>
          </a>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
