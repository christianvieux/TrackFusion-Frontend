export const ROWS_PER_PAGE = 8;

export const DESKTOP_COLUMNS = [
    { key: 'name', label: 'NAME' },
    { key: 'creator', label: 'CREATOR' },
    { key: 'category', label: 'CATEGORY', className: 'hidden xl:table-cell' },
    { key: 'genre', label: 'GENRE', className: 'hidden 2xl:table-cell' },
    { key: 'mood', label: 'MOOD', className: 'hidden 2xl:table-cell' },
    { key: 'duration', label: 'DURATION' },
    { key: 'favorite', label: '' },
    { key: 'options', label: '' },
]

export const MOBILE_COLUMNS = [
    { key: 'name', label: 'NAME' },
    { key: 'play', label: '' },
    { key: 'favorite', label: '' },
    { key: 'options', label: '' },
]

export const initialFilters = {
  filtersList: {},
  includes: {},
  excludes: {},
  searchTerm: "",
};

export const FUSE_OPTIONS = {
  keys: ["name", "artist", "genre", "mood", "creator"],
  threshold: 0.3,
};