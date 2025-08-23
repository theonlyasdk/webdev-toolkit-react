import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BoxShadowGenerator from './components/BoxShadowGenerator';
import TextShadowGenerator from './components/TextShadowGenerator';
import GradientGenerator from './components/GradientGenerator';
import BorderRadiusGenerator from './components/BorderRadiusGenerator';
import ColorConverter from './components/ColorConverter';
import TextPropertiesGenerator from './components/TextPropertiesGenerator';
import TransformGenerator from './components/TransformGenerator';

// Main App Component
export default function App() {
  const [activeTool, setActiveTool] = useState('box-shadow-generator');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
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
      default:
        return <BoxShadowGenerator />;
    }
  };

  return (
    <div className="fill-container">
      <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} theme={theme} toggleTheme={toggleTheme} />
      <main className="content">
          {renderTool()}
      </main>
    </div>
  );
}
