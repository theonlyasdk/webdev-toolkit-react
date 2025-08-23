import { useState, useEffect, useRef } from 'react';
import styles from './FontSelector.module.css';

const googleFontsApiKey = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;

const mockFonts = [
  { family: 'Roboto', files: { regular: '' } },
  { family: 'Open Sans', files: { regular: '' } },
  { family: 'Lato', files: { regular: '' } },
  { family: 'Montserrat', files: { regular: '' } },
  { family: 'Oswald', files: { regular: '' } },
  { family: 'Playfair Display', files: { regular: '' } },
  { family: 'Merriweather', files: { regular: '' } },
  { family: 'Dancing Script', files: { regular: '' } },
  { family: 'Pacifico', files: { regular: '' } },
  { family: 'Indie Flower', files: { regular: '' } },
];

const FontSelector = ({ onFontSelect, selectedFont, showChooseButton }) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [fonts, setFonts] = useState([]);
  const [filteredFonts, setFilteredFonts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const fetchFonts = async () => {
      const cachedFonts = localStorage.getItem('google-fonts');
      const cachedTimestamp = localStorage.getItem('google-fonts-timestamp');
      const now = new Date().getTime();

      if (cachedFonts && cachedTimestamp && (now - cachedTimestamp < 24 * 60 * 60 * 1000)) {
        setFonts(JSON.parse(cachedFonts));
      } else {
        const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${googleFontsApiKey}`);
        const data = await response.json();
        
        if (data) {
          setFonts(data.items);
          
          localStorage.setItem('google-fonts', JSON.stringify(data.items));
          localStorage.setItem('google-fonts-timestamp', now);
        } else {
          setFonts(mockFonts);
        }
      }
    };
    fetchFonts();
  }, []);

  useEffect(() => {
    if (!fonts) return;
    const lowercasedSearchTerm = internalSearchTerm.toLowerCase();
    const newFilteredFonts = fonts.filter(font =>
      font.family.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredFonts(newFilteredFonts);
  }, [internalSearchTerm, fonts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setInternalSearchTerm(''); // Clear search when closing
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (fontFamily) => {
    onFontSelect(fontFamily);
    setIsOpen(false);
    setInternalSearchTerm(''); // Clear search after selection
  };

  const handleKeyDown = (e) => {
    const maxIndex = Math.min(filteredFonts.length, maxItemsToShow) - 1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prevIndex => {
        const newIndex = prevIndex < maxIndex ? prevIndex + 1 : 0;
        if (listRef.current && listRef.current.children[newIndex]) {
          listRef.current.children[newIndex].scrollIntoView({ block: 'nearest' });
        }
        return newIndex;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prevIndex => {
        const newIndex = prevIndex > 0 ? prevIndex - 1 : maxIndex;
        if (listRef.current && listRef.current.children[newIndex]) {
          listRef.current.children[newIndex].scrollIntoView({ block: 'nearest' });
        }
        return newIndex;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex !== -1) {
        handleSelect(filteredFonts[focusedIndex].family);
      }
    }
  };

  const maxItemsToShow = 30;

  const loadFont = (fontFamily) => {
    const fontId = `font-${fontFamily.replace(/ /g, '-')}`;
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  };

  return (
    <div className="font-selector" ref={dropdownRef}>
      <label htmlFor="font-display" className="form-label">Font Family</label>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          id="font-display"
          value={selectedFont}
          onChange={(e) => onFontSelect(e.target.value)}
        />
        {showChooseButton && <button className="btn btn-outline-secondary" title="Click to choose a font" type="button" onClick={() => setIsOpen(!isOpen)}>
          Choose
        </button>}
      </div>

      {isOpen && (
        <div className="font-dropdown-menu card show">
          <div className="font-dropdown-menu-header">
            <div className="input-group border-0">
              <span className="input-group-text font-dropdown-menu-search-icon" style={{ paddingRight: '0.5rem' }}>
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 font-dropdown-menu-search-box"
                placeholder="Search fonts..."
                value={internalSearchTerm}
                onChange={(e) => setInternalSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ paddingLeft: '0.5rem' }}
              />
            </div>
          </div>
          <ul className="font-dropdown-list list-group list-group-flush" ref={listRef}>
            {filteredFonts.length === 0 ? (
              <li className="list-group-item disabled text-center">
                <i className="bi bi-exclamation-triangle me-2"></i>
                No fonts found
              </li>
            ) : (
              filteredFonts.slice(0, maxItemsToShow).map((font, index) => {
                loadFont(font.family);
                return (
                  <li
                    key={font.family}
                    className={`list-group-item list-group-item-action ${index === focusedIndex ? styles.focused : ''}`}
                    onClick={() => handleSelect(font.family)}
                    style={{ fontFamily: font.family, cursor: 'pointer' }}
                  >
                    {font.family}
                  </li>
                );
              })
            )}
            {filteredFonts.length > maxItemsToShow && (
              <li className="list-group-item disabled">
                ... {filteredFonts.length - maxItemsToShow} more results
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FontSelector;
