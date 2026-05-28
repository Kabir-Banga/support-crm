import { Link } from "react-router-dom";
import { FaHeadset } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <FaHeadset className="text-blue-600 text-2xl" />

          <h1 className="text-2xl font-bold text-blue-600">
            Support CRM
          </h1>
        </Link>

        <Link
          to="/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          + New Ticket
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;