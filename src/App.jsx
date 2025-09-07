import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BoxShadowGenerator from './components/BoxShadowGenerator';
import TextShadowGenerator from './components/TextShadowGenerator';
import GradientGenerator from './components/GradientGenerator';
import BorderRadiusGenerator from './components/BorderRadiusGenerator';
import ColorConverter from './components/ColorConverter';
import TextPropertiesGenerator from './components/TextPropertiesGenerator';
import TransformGenerator from './components/TransformGenerator';
import LoadingSpinner from './components/LoadingSpinner';
import CssMinifier from './components/CssMinifier';
import JsMinifier from './components/JsMinifier';

export default function App() {
  const [activeTool, setActiveTool] = useState('box-shadow-generator');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (prefersDark ? 'dark' : 'light');
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const renderTool = () => {
    switch (activeTool) {
      case 'box-shadow-generator':
        return <BoxShadowGenerator />;
      case 'text-shadow-generator':
        return <TextShadowGenerator />;
      case 'gradient-generator':
        return <GradientGenerator />;
      case 'border-radius-generator':
        return <BorderRadiusGenerator />;
      case 'color-converter':
        return <ColorConverter />;
      case 'text-properties-generator':
        return <TextPropertiesGenerator />;
      case 'transform-generator':
        return <TransformGenerator />;
      case 'css-minifier':
        return <CssMinifier />;
      case 'js-minifier':
        return <JsMinifier />;
      default:
        return <BoxShadowGenerator />;
    }
  };

  if (isLoading) {
    return (
      <div className="fill-container d-flex justify-content-center align-items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="fill-container d-flex flex-column flex-md-row">
      {/* Hamburger (only mobile, hidden on desktop) */}

      <div className="content-titlebar d-md-none d-flex align-items-center gap-2">
        <button
          className="hamburger-btn"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
          title="Open sidebar"
        >
          <i class="bi bi-list"></i>
        </button>
        <div className="font-sora">
          Webdev Toolkit
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        theme={theme}
        toggleTheme={toggleTheme}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Overlay (mobile only, when sidebar is open) */}
      {isSidebarOpen && (
        <div className="sidebar-overlay d-md-none" onClick={toggleSidebar}></div>
      )}

      {/* Main Content */}
      <main className="content">{renderTool()}</main>
    </div>
  );
}
