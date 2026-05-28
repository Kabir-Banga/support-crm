import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

function TicketDetails() {
  const { ticket_id } = useParams();

  const [ticket, setTicket] = useState(null);

  const [status, setStatus] = useState("");

  const [notes, setNotes] = useState("");

  const [assignedTo, setAssignedTo] =
    useState("");

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      const response = await API.get(
        `/tickets/${ticket_id}`
      );

      setTicket(response.data);

      setStatus(response.data.status);

      setNotes(response.data.notes || "");

      setAssignedTo(
        response.data.assigned_to
      );

    } catch (error) {
      console.log(error);
    }
  };

  const updateTicket = async () => {
    try {
      const previousStatus = ticket.status;

      const previousNotes = ticket.notes;

      await API.put(
        `/tickets/${ticket_id}`,
        {
          status,
          notes,
          assigned_to: assignedTo,
        }
      );

      toast.success(
        ({ closeToast }) => (
          <div>
            <p className="font-semibold">
              Ticket Updated Successfully
            </p>

            <div className="flex gap-2 mt-2">

              <button
                onClick={() => {
                  closeToast();
                }}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Done
              </button>

              <button
                onClick={async () => {
                  try {
                    await API.put(
                      `/tickets/${ticket_id}`,
                      {
                        status:
                          previousStatus,
                        notes:
                          previousNotes,
                      }
                    );

                    toast.info(
                      "Changes reverted successfully"
                    );

                    fetchTicket();

                    closeToast();

                  } catch (error) {
                    console.log(error);
                  }
                }}
                className="bg-gray-500 text-white px-3 py-1 rounded"
              >
                Undo
              </button>

            </div>
          </div>
        ),
        {
          autoClose: false,
        }
      );

      fetchTicket();

    } catch (error) {
      console.log(error);
    }
  };

  if (!ticket) {
    return (
      <div className="p-6 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">

      <div className="bg-white rounded-xl shadow p-6">

        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          {ticket.ticket_id}
        </h1>

        <div className="space-y-6">

          <div>
            <h2 className="font-semibold text-gray-500">
              Customer
            </h2>

            <p className="text-lg">
              {ticket.customer_name}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-500">
              Email
            </h2>

            <p>
              {ticket.customer_email}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-500">
              Subject
            </h2>

            <p>
              {ticket.subject}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-500">
              Description
            </h2>

            <p>
              {ticket.description}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-500">
              Created At
            </h2>

            <p>
              {new Date(
                ticket.created_at
              ).toLocaleString(  "en-IN",
              {
                timeZone: "Asia/Kolkata",
              })}
            </p>
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Assigned Agent
            </label>

            <select
              value={assignedTo}
              onChange={(e) =>
                setAssignedTo(
                  e.target.value
                )
              }
              className="border px-4 py-3 rounded-lg"
            >
              <option value="Unassigned">
                Unassigned
              </option>

              <option value="Kabir">
                Kabir
              </option>

              <option value="Sarah">
                Sarah
              </option>

              <option value="Mike">
                Mike
              </option>

            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              className="border px-4 py-3 rounded-lg"
            >
              <option value="Open">
                Open
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Closed">
                Closed
              </option>

            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Notes
            </label>

            <textarea
              rows="4"
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* Activity Timeline */}

          <div className="bg-gray-50 p-6 rounded-xl">

            <h2 className="text-xl font-bold mb-4">
              Activity Timeline
            </h2>

            <div className="space-y-4">

              <div className="border-l-4 border-blue-600 pl-4">
                <p className="font-semibold">
                  Ticket Created
                </p>

                <p className="text-gray-500 text-sm">
                  {new Date(
                    ticket.created_at
                  ).toLocaleString(  "en-IN",
                  {
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <p className="font-semibold">
                  Assigned to{" "}
                  {ticket.assigned_to}
                </p>

                <p className="text-gray-500 text-sm">
                  Support agent assigned
                </p>
              </div>

              <div className="border-l-4 border-green-600 pl-4">
                <p className="font-semibold">
                  Status: {ticket.status}
                </p>

                <p className="text-gray-500 text-sm">
                  Last updated:{" "}
                  {new Date(
                    ticket.updated_at
                  ).toLocaleString(  "en-IN",
                  {
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
              </div>

            </div>

          </div>

          <button
            onClick={updateTicket}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Update Ticket
          </button>

        </div>

      </div>

    </div>
  );
}

export default TicketDetails;