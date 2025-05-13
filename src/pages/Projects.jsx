import { useQuery } from "@tanstack/react-query";
import { fetchProjectsByIds } from "../api/airtable";
import { Link } from "react-router-dom";
import React from "react";

export default function Projects() {
  const projectIds = JSON.parse(localStorage.getItem("projectIds") || "[]");

  const { data, isLoading, error } = useQuery({
    queryKey: ["projects", projectIds],
    queryFn: () => fetchProjectsByIds(projectIds),
    enabled: projectIds.length > 0,
    onError: (err) => {
      console.error("[Projects] Error fetching projects:", err);
    },
  });

  if (isLoading) return <div className="text-center py-20 text-lg text-gray-400">Loading projects...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Error loading projects: {error.message}</div>;
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-300 mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3M3.75 21h16.5M3.75 3h16.5M3.75 3V1.5M20.25 3V1.5M3.75 14.25v3.75A2.25 2.25 0 0 0 6 20.25h12a2.25 2.25 0 0 0 2.25-2.25v-3.75M15 14.25H9" />
        </svg>
        <div className="text-xl mb-2 font-semibold text-gray-600">No projects found.</div>
        <p className="text-gray-400">Projects linked to your profile will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-primary font-merriweather">My Projects</h1>
      <div className="space-y-5">
        {data.map((record) => {
          // Account field: array of IDs
          const accountId = record.fields.Account && record.fields.Account[0];
          // Account Name (from Account): array of names (lookup field)
          const accountNameArr = record.fields["Account Name (from Account)"] || [];
          const accountName = accountNameArr[0] || accountId || "N/A";

          return (
            <Link
              to={`/projects/${record.id}`}
              key={record.id}
              className="bg-white p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 block border border-gray-100 group"
            >
              <div className="font-semibold text-lg sm:text-xl text-gray-800 group-hover:text-primary transition-colors duration-150">
                {record.fields["Project Name"] || "Unnamed Project"}
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <p className="text-gray-500">
                  Status: <span className="font-medium text-gray-700">{record.fields["Project Status"] || "N/A"}</span>
                </p>
                <p className="text-gray-500">
                  Account:{" "}
                  {accountId ? (
                    <Link
                      to={`/accounts/${accountId}`}
                      className="font-medium text-primary hover:underline"
                      onClick={e => e.stopPropagation()} // Prevents navigating to project detail when clicking account
                    >
                      {accountName}
                    </Link>
                  ) : (
                    <span className="italic">N/A</span>
                  )}
                </p>
              </div>
              {record.fields.Description && (
                <p className="mt-3 text-xs text-gray-400 italic">
                  {record.fields.Description.substring(0,150) + (record.fields.Description.length > 150 ? "..." : "")}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
