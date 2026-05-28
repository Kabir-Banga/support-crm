import { Link } from "react-router-dom";

function TicketTable({
  tickets,
  handleDelete,
}) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow mt-6">
      <table className="min-w-full">
        
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-3 text-left">
              Ticket ID
            </th>

            <th className="px-4 py-3 text-left">
              Customer
            </th>

            <th className="px-4 py-3 text-left">
              Subject
            </th>

            <th className="px-4 py-3 text-left">
              Status
            </th>

            <th className="px-4 py-3 text-left">
            Priority
            </th>

            <th className="px-4 py-3 text-left">
              Assigned To
            </th>

            <th className="px-4 py-3 text-left">
              Created
            </th>

            <th className="px-4 py-3 text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="text-center py-10 text-gray-500"
              >
                No tickets found
              </td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <tr
                key={ticket.ticket_id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-blue-600 font-medium">
                  <Link to={`/ticket/${ticket.ticket_id}`}>
                    {ticket.ticket_id}
                  </Link>
                </td>

                <td className="px-4 py-3">
                  {ticket.customer_name}
                </td>

                <td className="px-4 py-3">
                  {ticket.subject}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      ticket.status === "Open"
                        ? "bg-green-100 text-green-700"
                        : ticket.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      ticket.priority === "Low"
                        ? "bg-gray-200 text-gray-700"
                        : ticket.priority === "Medium"
                        ? "bg-blue-100 text-blue-700"
                        : ticket.priority === "High"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                      {(ticket.assigned_to || "U").charAt(0)}
                    </div>

                    <span>
                      {ticket.assigned_to || "Unassigned"}
                    </span>

                  </div>
                </td>

                <td className="px-4 py-3">
                  {new Date(
                    ticket.created_at
                  ).toLocaleDateString(  "en-IN",
                  {
                    timeZone: "Asia/Kolkata",
                  })}
                </td>

                <td className="px-4 py-3 flex gap-2">
  
                  <Link
                    to={`/ticket/${ticket.ticket_id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
                  >
                    View
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(ticket.ticket_id)
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}

export default TicketTable;