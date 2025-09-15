"use client";
// pages/dashboard.tsx (or your dashboard page)
import { useState } from "react";
import UserReports from "@/components/userReports";
import { useWeb3 } from "@/context/web3Context"; // Web3 context provides `wallet`

const Page = () => {
  const { wallet } = useWeb3(); // `wallet` contains { address, balance, isConnected }
  const [activeTab, setActiveTab] = useState("reports");

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-6 my-20 sm:px-6 lg:px-8 bg-gray-50/60 backdrop-blur-2xl rounded-2xl p-4">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("reports")}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-bold text-lg ${
                  activeTab === "reports"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Reports
              </button>
              {/* <button
                onClick={() => setActiveTab("upload")}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "upload"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Upload New
              </button> */}
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === "reports" && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Your SEO Analysis Reports
                </h2>
                {wallet?.address ? (
                  <UserReports walletAddress={wallet.address} />
                ) : (
                  <div className=" border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Wallet not connected
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            Please connect your wallet to view your reports.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* {activeTab === "upload" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Upload New SEO Report
                </h2>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
