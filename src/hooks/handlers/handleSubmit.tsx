const storeReportHash = async (hash: string) => {
  try {
    const response = await fetch("/api/storeReport", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reportHash: hash }),
    });

    const result = await response.json();

    if (result.success) {
      console.log("Report hash stored on blockchain:", result.txHash);
      return result.txHash;
    } else {
      console.error("Failed to store report hash:", result.error);
      return null;
    }
  } catch (error) {
    console.error("Error storing report hash:", error);
    return null;
  }
};

const verifyReport = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/verifyReport", {
      method: "POST",
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error("Error verifying report:", error);
    return { valid: false, error: "Verification failed" };
  }
};

// Update your handleSubmit function to store the hash after analysis
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!resumeFile || !githubUsername.trim()) {
    setError("Please upload a resume and enter your GitHub username.");
    return;
  }
  setLoading(true);
  setError("");
  try {
    const fd = new FormData();
    fd.append("resume", resumeFile);
    fd.append("username", githubUsername.trim());
    const res = await fetch("/api/analyze", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Analysis failed");

    // Generate hash of the resume file
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const hash =
      "0x" + crypto.createHash("sha256").update(buffer).digest("hex");

    // Store hash on blockchain
    const txHash = await storeReportHash(hash);

    if (txHash) {
      setAnalysisResult({
        ...data,
        blockchain: {
          hash,
          txHash,
          stored: true,
        },
      });
    } else {
      setAnalysisResult(data);
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

// Add a function to handle PDF verification
const handleVerifyPDF = async (file: File) => {
  setLoading(true);
  try {
    const result = await verifyReport(file);
    if (result.valid) {
      alert(
        `PDF verified! Stored on blockchain at timestamp: ${new Date(
          result.timestamp * 1000
        ).toLocaleString()}`
      );
    } else {
      alert("PDF not found on blockchain.");
    }
  } catch (error) {
    setError("Verification failed");
  } finally {
    setLoading(false);
  }
};
