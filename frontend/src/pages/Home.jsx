import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import API from "../services/api";
import TicketTable from "../components/TicketTable";
import SearchBar from "../components/SearchBar";
import StatusFilter from "../components/StatusFilter";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";
import SkeletonLoader from "../components/SkeletonLoader";

function Home() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500);

  return () => clearTimeout(timer);
    }, [search]);
  useEffect(() => {
  setLoading(true);
  fetchTickets();
  }, [debouncedSearch, status]);

  const fetchTickets = async () => {
    try {
      const response = await API.get(
        `/tickets?search=${debouncedSearch}&status=${status}`
      );

      setTickets(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (ticketId) => {
    setSelectedTicket(ticketId);
    setIsModalOpen(true);
  };
  const confirmDelete = async () => {
  try {
    await API.delete(
      `/tickets/${selectedTicket}`
    );

    toast.success(
      "Ticket deleted successfully"
    );

    fetchTickets();

    setIsModalOpen(false);

  } catch (error) {
    console.log(error);

    toast.error("Error deleting ticket");
  }
  };
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(
    (t) => t.status === "Open"
  ).length;

  const progressTickets = tickets.filter(
    (t) => t.status === "In Progress"
  ).length;

  const closedTickets = tickets.filter(
    (t) => t.status === "Closed"
  ).length;
    if (loading) {
      return (
        <div className="max-w-7xl mx-auto p-6">
          <SkeletonLoader />
        </div>
      );
    }
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-blue-600">
          Ticket Dashboard
        </h1>

        <CSVLink
          data={tickets}
          filename={"support_tickets.csv"}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Export CSV
        </CSVLink>

      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Total Tickets</h2>
          <p className="text-3xl font-bold mt-2">
            {totalTickets}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Open</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {openTickets}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">In Progress</h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {progressTickets}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Closed</h2>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {closedTickets}
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <StatusFilter
          status={status}
          setStatus={setStatus}
        />
      </div>
        <h2 className="text-2xl font-semibold mt-8 mb-4">
        Recent Support Tickets
        </h2>
      {/* Ticket Table */}
      <TicketTable
        tickets={tickets}
        handleDelete={handleDelete}
      />
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Ticket"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
      />
    </div>
  );

}

export default Home;