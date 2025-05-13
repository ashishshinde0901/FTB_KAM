import { useQuery } from "@tanstack/react-query";
import { fetchAccountsByIds } from "../api/airtable"; // Assuming this path is correct
import { Link } from "react-router-dom";
import React from "react";

export default function Accounts() {
  const accountIds = JSON.parse(localStorage.getItem("accountIds") || "[]");

  const { data, isLoading, error } = useQuery({
    queryKey: ["accounts", accountIds],
    queryFn: () => fetchAccountsByIds(accountIds),
    enabled: accountIds.length > 0,
    onError: (err) => {
      console.error("[Accounts] Error fetching accounts:", err);
    },
  });

  if (isLoading) {
    return <div className="text-center py-20 text-lg text-gray-400">Loading accounts...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-center py-10">Error loading accounts: {error.message}</div>;
  }
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-300 mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m12.75 0v-3.75C16.5 6.375 16.5 6 16.5 6s-.074.002-.19.007M9.75 14.25v2.25m-2.25-2.25v2.25m4.5 0v2.25m2.25-2.25v2.25M5.25 12v2.25m13.5-2.25v2.25M7.5 15v2.25M12 15v2.25m4.5 0v2.25m-7.5-3.75h3M7.5 16.5h3" />
        </svg>
        <div className="text-xl mb-2 font-semibold text-gray-600">No accounts found.</div>
        <p className="text-gray-400">Click the '+' icon in the header to create a new record.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-primary font-merriweather">My Managed Accounts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((record) => (
          <Link
            to={`/accounts/${record.id}`}
            key={record.id}
            className="bg-gradient-to-br from-gray-50 to-white shadow-lg rounded-xl p-5 sm:p-6 hover:shadow-xl transition-shadow duration-200 group border border-gray-100 flex flex-col"
          >
            <div className="font-bold text-lg sm:text-xl text-gray-800 group-hover:text-primary transition-colors duration-150">
              {record.fields["Account Name"] || "Unnamed Account"}
            </div>
            <div className="text-xs bg-green-100 text-green-700 font-medium inline-block px-2 py-1 rounded mt-2 self-start">
              {record.fields["Account Type"] ? record.fields["Account Type"] : "No Type"}
            </div>
            <div className="mt-3 text-sm text-gray-500 flex-grow">
              {record.fields["Account Description"] ? (record.fields["Account Description"].substring(0,100) + (record.fields["Account Description"].length > 100 ? "..." : "")) : <span className="italic">No description.</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}