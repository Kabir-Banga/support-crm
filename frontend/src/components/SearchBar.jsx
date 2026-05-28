function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search tickets..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full md:w-80 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export default SearchBar;