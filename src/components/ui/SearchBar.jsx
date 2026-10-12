import { useState } from "react";
import PropTypes from "prop-types";
import { FiSearch, FiMapPin, FiX } from "react-icons/fi";

// One consistent search card used across every listing screen: a keyword
// field and an optional region/town/location field, side by side on
// desktop and stacked on mobile, with a single clear button when either has
// a value. Screens keep their own filtering logic — this only renders it.
//
// `suggestions` is opt-in: pass an already-filtered array of strings (the
// caller decides what matches, this just renders the dropdown) and it
// shows while the keyword field is focused and non-empty. Picking one
// calls `onSuggestionSelect` if given, otherwise falls back to
// `onKeywordChange`. Omit it and nothing changes from before.
const SearchBar = ({
  keyword,
  onKeywordChange,
  keywordPlaceholder = "Search by name...",
  suggestions,
  onSuggestionSelect,
  region,
  onRegionChange,
  regionPlaceholder = "Region, town or location",
  onClear,
  className = "",
}) => {
  const hasValue = Boolean(keyword || region);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const visibleSuggestions =
    showSuggestions && keyword && suggestions && suggestions.length > 0 ? suggestions : [];

  const handleSuggestionPick = (value) => {
    setShowSuggestions(false);
    if (onSuggestionSelect) {
      onSuggestionSelect(value);
    } else {
      onKeywordChange(value);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-soft border border-ink-100 p-2 sm:p-2.5 flex flex-col sm:flex-row gap-2 ${className}`}
    >
      <div className="relative flex-1">
        <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          value={keyword}
          onChange={(e) => {
            onKeywordChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setShowSuggestions(false)}
          placeholder={keywordPlaceholder}
          aria-label={keywordPlaceholder}
          autoComplete="off"
          className="w-full h-11 pl-10 pr-3 rounded-xl bg-ink-50 border border-transparent focus:bg-white focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 text-sm text-ink-800 placeholder:text-ink-400"
        />

        {visibleSuggestions.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-20 mt-1.5 max-h-56 overflow-auto rounded-xl border border-ink-100 bg-white py-1 shadow-card-hover">
            {visibleSuggestions.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSuggestionPick(item)}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink-700 hover:bg-ink-50"
                >
                  <FiMapPin className="shrink-0 text-ink-400" size={13} />
                  <span className="truncate">{item}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {onRegionChange && (
        <div className="relative flex-1">
          <FiMapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={region}
            onChange={(e) => onRegionChange(e.target.value)}
            placeholder={regionPlaceholder}
            aria-label={regionPlaceholder}
            className="w-full h-11 pl-10 pr-3 rounded-xl bg-ink-50 border border-transparent focus:bg-white focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 text-sm text-ink-800 placeholder:text-ink-400"
          />
        </div>
      )}

      {hasValue && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="h-11 w-11 shrink-0 self-center rounded-xl flex items-center justify-center text-ink-500 hover:bg-ink-50 hover:text-ink-800 transition-colors"
        >
          <FiX className="text-lg" />
        </button>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  keyword: PropTypes.string.isRequired,
  onKeywordChange: PropTypes.func.isRequired,
  keywordPlaceholder: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.string),
  onSuggestionSelect: PropTypes.func,
  region: PropTypes.string,
  onRegionChange: PropTypes.func,
  regionPlaceholder: PropTypes.string,
  onClear: PropTypes.func,
  className: PropTypes.string,
};

export default SearchBar;
