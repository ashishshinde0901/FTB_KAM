import React, { useState, useEffect } from "react";
import { createProject, updateUser } from "../api/airtable";

const PROJECT_STATUS_OPTIONS = [
  "Negotiation",
  "Need Analysis",
  "Closed Won",
  "Closed Lost",
];

export default function AccountCreationProjectModal({ open, onClose, defaultAccount, accounts }) {
  const [fields, setFields] = useState({
    "Project Name": "",
    "Project Status": PROJECT_STATUS_OPTIONS[0],
    "Start Date": "",
    "End Date": "",
    "Account": defaultAccount?.id || "",
    "Project Value": "",
    "Project Description": "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setFields(f => ({
      ...f,
      "Account": defaultAccount?.id || "",
    }));
  }, [defaultAccount]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const projectOwnerId = localStorage.getItem("userRecordId") || "";
      const project = await createProject({
        "Project Name": fields["Project Name"],
        "Project Status": fields["Project Status"],
        "Start Date": fields["Start Date"],
        "End Date": fields["End Date"],
        "Account": fields["Account"] ? [fields["Account"]] : [],
        "Project Value": fields["Project Value"] ? Number(fields["Project Value"]) : undefined,
        "Project Description": fields["Project Description"],
        "Project Owner": projectOwnerId ? [projectOwnerId] : [],
      });
      if (project && project.id && projectOwnerId) {
        const prevProjects = JSON.parse(localStorage.getItem("projectIds") || "[]");
        const updatedProjects = [...new Set([...prevProjects, project.id])];
        await updateUser(projectOwnerId, { "Projects": updatedProjects });
        localStorage.setItem("projectIds", JSON.stringify(updatedProjects));
      }
      setFields({
        "Project Name": "",
        "Project Status": PROJECT_STATUS_OPTIONS[0],
        "Start Date": "",
        "End Date": "",
        "Account": defaultAccount?.id || "",
        "Project Value": "",
        "Project Description": "",
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError("Failed to create project.");
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Quick Create Project</h2>
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-center font-medium mb-3">
            Project created successfully!
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            required
            className="border border-gray-200 rounded-lg px-4 py-2 text-base bg-white focus:outline-none focus:border-blue-400"
            placeholder="Project Name"
            value={fields["Project Name"]}
            onChange={e => setFields(f => ({ ...f, "Project Name": e.target.value }))}
          />
          <select
            required
            className="border border-gray-200 rounded-lg px-4 py-2 text-base bg-white focus:outline-none focus:border-blue-400"
            value={fields["Project Status"]}
            onChange={e => setFields(f => ({ ...f, "Project Status": e.target.value }))}
          >
            {PROJECT_STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <div className="flex gap-4">
            <input
              required
              type="date"
              className="border border-gray-200 rounded-lg px-4 py-2 text-base bg-white focus:outline-none focus:border-blue-400 flex-1"
              value={fields["Start Date"]}
              onChange={e => setFields(f => ({ ...f, "Start Date": e.target.value }))}
            />
            <input
              required
              type="date"
              className="border border-gray-200 rounded-lg px-4 py-2 text-base bg-white focus:outline-none focus:border-blue-400 flex-1"
              value={fields["End Date"]}
              onChange={e => setFields(f => ({ ...f, "End Date": e.target.value }))}
            />
          </div>
          <select
            required
            className="border border-gray-200 rounded-lg px-4 py-2 text-base bg-white focus:outline-none focus:border-blue-400"
            value={fields["Account"]}
            onChange={e => setFields(f => ({ ...f, "Account": e.target.value }))}
          >
            <option value="" disabled>Select account</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.fields["Account Name"]}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            placeholder="Project Value"
            className="border border-gray-200 rounded-lg px-4 py-2 text-base bg-white focus:outline-none focus:border-blue-400"
            value={fields["Project Value"]}
            onChange={e => setFields(f => ({ ...f, "Project Value": e.target.value }))}
          />
          <textarea
            placeholder="Project Description"
            className="border border-gray-200 rounded-lg px-4 py-2 text-base bg-white focus:outline-none focus:border-blue-400 min-h-[70px]"
            value={fields["Project Description"]}
            onChange={e => setFields(f => ({ ...f, "Project Description": e.target.value }))}
          />
          {error && <div className="text-red-600 text-center font-semibold">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className={`rounded-lg px-6 py-2 text-white font-semibold shadow-sm transition ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
