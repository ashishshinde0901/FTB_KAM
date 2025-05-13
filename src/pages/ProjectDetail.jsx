import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectById, fetchUpdatesByIds } from "../api/airtable";
import React from "react";

export default function ProjectDetail() {
  const { id } = useParams();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProjectById(id),
    enabled: !!id,
    onError: (err) => {
      console.error("[ProjectDetail] Error fetching project:", err);
    }
  });

  const updateIds = project?.fields?.Updates || [];
  const { data: updates, isLoading: updatesLoading, error: updatesError } = useQuery({
    queryKey: ["projectUpdates", updateIds],
    queryFn: () => fetchUpdatesByIds(updateIds),
    enabled: updateIds.length > 0,
  });

  if (isLoading) return <div className="text-center py-20 text-lg text-gray-400">Loading project details...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Error loading project: {error.message}</div>;
  if (!project || !project.fields) return <div className="text-center py-10 text-gray-500">No project data found.</div>;

  const name = project.fields["Project Name"] || "Unnamed Project";
  const status = project.fields["Project Status"] || "N/A";
  const description = project.fields["Project Description"] || <span className="italic">No description.</span>;
  const startDate = project.fields["Start Date"] || "?";
  const endDate = project.fields["End Date"] || "?";
  const accountNameArr = project.fields["Account Name (from Account)"] || [];
  const accountName = accountNameArr[0] || "N/A";
  const projectValue = project.fields["Project Value"] || "N/A";

  return (
    <div>
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/projects" className="hover:text-primary hover:underline">Projects</Link>
            <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
          </li>
          <li className="flex items-center">
            <span className="font-semibold text-gray-700">{name}</span>
          </li>
        </ol>
      </nav>

      <div className="bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 rounded-xl shadow-lg mb-8 border border-gray-100">
        <h1 className="text-xl sm:text-2xl font-bold text-primary mb-2">{name}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
          <p><strong>Status:</strong> <span className="text-gray-700">{status}</span></p>
          <p><strong>Account:</strong> <span className="text-gray-700">{accountName}</span></p>
          <p><strong>Project Value:</strong> <span className="text-gray-700">{projectValue}</span></p>
          <p><strong>Start Date:</strong> <span className="text-gray-700">{startDate}</span></p>
          <p><strong>End Date:</strong> <span className="text-gray-700">{endDate}</span></p>
        </div>
        {description && <div className="mt-2 text-gray-700 prose max-w-none">{description}</div>}
      </div>

      <h2 className="text-xl font-semibold mb-4 text-primary">Updates for this Project</h2>
      <div className="space-y-4">
        {updatesLoading ? (
          <div className="text-center py-8 text-gray-400">Loading updates...</div>
        ) : updatesError ? (
          <div className="text-red-500 bg-red-50 p-4 rounded-md">Error loading updates: {updatesError.message}</div>
        ) : updates && updates.length > 0 ? (
          updates.map((update) => (
            <Link
              to={`/updates/${update.id}`}
              key={update.id}
              className="block bg-white p-4 sm:p-5 rounded-lg shadow border border-gray-100 hover:shadow-md transition-shadow duration-150 group"
            >
              <div className="flex flex-wrap gap-4 text-sm text-gray-800 mb-2">
                {update.fields["Start Date"] && (
                  <span>
                    <strong>Start Date:</strong> {update.fields["Start Date"]}
                  </span>
                )}
                {update.fields["End Date"] && (
                  <span>
                    <strong>End Date:</strong> {update.fields["End Date"]}
                  </span>
                )}
                {update.fields["Update Value"] && (
                  <span>
                    <strong>Value:</strong> {update.fields["Update Value"]}
                  </span>
                )}
              </div>
              <div>
                
                <p className="text-gray-600 whitespace-pre-wrap">
                  {update.fields.Notes || <span className="italic">No notes provided.</span>}
                </p>
              </div>
              {update.fields.Date && (
                <div className="text-xs text-gray-500 mt-2">
                  <strong>Date:</strong> {new Date(update.fields.Date).toLocaleDateString()}
                </div>
              )}
              {/* Add more fields if you want! */}
            </Link>
          ))
        ) : (
          <div className="text-gray-500 bg-gray-50 p-6 rounded-md text-center italic">No updates found for this project.</div>
        )}
      </div>
    </div>
  );
}
