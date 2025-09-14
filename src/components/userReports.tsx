/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// components/UserReports.tsx
import { useState, useEffect } from "react";
import { getUserReports, ReportData } from "@/lib/firebase";

interface UserReportsProps {
  walletAddress: string;
}

const UserReports: React.FC<UserReportsProps> = ({ walletAddress }) => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const result = await getUserReports(walletAddress);

        if (result.success) {
          setReports(result.reports);
        } else {
          setError(result?.error?.message || "Failed to load reports");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching reports"
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchReports();
    }
  }, [walletAddress]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateHash = (hash: string, startChars = 6, endChars = 4) => {
    if (hash.length <= startChars + endChars) return hash;
    return `${hash.substring(0, startChars)}...${hash.substring(
      hash.length - endChars
    )}`;
  };

  const handleDownload = async (cid: string) => {
    try {
      // You can ask for a redirect URL (asUrl=true) OR stream the file directly.
      // Here we stream and trigger browser download.
      const res = await fetch(
        `/api/pinata/download?cid=${encodeURIComponent(cid)}`
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(`Failed to download: ${j?.error || res.statusText}`);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // If you stored a filename, use it; otherwise derive one from cid or hash
      a.download = `report-${cid}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(`Download error: ${e?.message || "unknown error"}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-400 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No reports yet
        </h3>
        <p className="text-gray-500">
          Upload and verify your first SEO analysis report to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          SEO Analysis Reports
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          All reports associated with wallet: {truncateHash(walletAddress)}
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {reports.map((report, index) => (
          <div key={index} className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between flex-wrap">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    Report #{reports.length - index}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Created on {formatDate(report.timestamp)}
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Verified
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Hash
                </h5>
                <p className="text-sm font-mono text-gray-900">
                  {truncateHash(report.hash)}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Hash
                </h5>
                <p className="text-sm font-mono text-gray-900">
                  {truncateHash(report.txHash || "N/A")}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Block Number
                </h5>
                <p className="text-sm text-gray-900">
                  {report.blockNumber || "N/A"}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Network
                </h5>
                <p className="text-sm text-gray-900">
                  {report.network?.name || "Unknown"} (Chain ID:{" "}
                  {report.network?.chainId || "N/A"})
                </p>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              {report.ipfsUrl && (
                <a
                  href={report.ipfsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View on IPFS
                </a>
              )}

              {report.txHash && (
                <a
                  href={`https://testnet.snowtrace.io/tx/${report.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  View Transaction
                </a>
              )}
              {report.cid && (
                <button
                  onClick={() => handleDownload(report.cid!)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                    />
                  </svg>
                  Download
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReports;
