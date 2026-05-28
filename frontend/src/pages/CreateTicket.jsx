import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import API from "../services/api";

function CreateTicket() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
    priority: "Medium",
    assigned_to: "Unassigned",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await API.post(
      "/tickets",
      formData
    );

    const createdTicketId =
      response.data.ticket_id;

    toast.success(
      ({ closeToast }) => (
        <div>
          <p className="font-semibold">
            Ticket Created Successfully
          </p>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                closeToast();
                navigate("/");
              }}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Done
            </button>

            <button
              onClick={async () => {
                try {
                  await API.delete(
                    `/tickets/${createdTicketId}`
                  );

                  toast.info(
                    "Ticket creation undone"
                  );

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
  } catch (error) {
    console.log(error);

    toast.error("Error creating ticket");
  }
};

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">
          Create Support Ticket
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 font-medium">
              Customer Name
            </label>

            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Customer Email
            </label>

            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Subject
            </label>

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
            Priority
            </label>

            <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Assign Support Agent
            </label>

            <select
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
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
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Create Ticket
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTicket;