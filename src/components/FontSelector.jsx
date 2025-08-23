import { useState, useEffect, useRef } from 'react';

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

const FontSelector = ({ onFontSelect, selectedFont }) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [fonts, setFonts] = useState([]);
  const [filteredFonts, setFilteredFonts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Simulate fetching fonts from Google Fonts API
    const fetchFonts = async () => {
      // In a real application, you would fetch from Google Fonts API here
      const response = await fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBJ83gfLLpwON3fJEK4v_VGTqlzuRC0bIw');
      const data = await response.json();
      setFonts(data.items);
      // setFonts(mockFonts);
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

  const maxItemsToShow = 30;

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
        <button className="btn btn-outline-secondary" title="Click to choose a font" type="button" onClick={() => setIsOpen(!isOpen)}>
          Choose
        </button>
      </div>

      {isOpen && (
        <div className={`font-dropdown-menu card ${isOpen ? 'show' : ''}`}>
          <div className="card-header">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search fonts..."
              value={internalSearchTerm}
              onChange={(e) => setInternalSearchTerm(e.target.value)}
            />
          </div>
          <ul className="font-dropdown-list list-group list-group-flush">
            {filteredFonts.slice(0, maxItemsToShow).map(font => (
              <li
                key={font.family}
                className="list-group-item list-group-item-action"
                onClick={() => handleSelect(font.family)}
                style={{ fontFamily: font.family, cursor: 'pointer' }}
              >
                {font.family}
              </li>
            ))}
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
