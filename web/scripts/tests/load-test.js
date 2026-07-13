const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const endpoints = [
  "/api/patient/nutrition",
  "/api/patient/dashboard",
  "/api/patient/doctors",
  "/api/patient/cases",
  "/api/admin/plans",
  "/api/admin/dashboard/stats",
  "/api/patient/wallet",
];

async function fetchEndpoint(endpoint) {
  const url = `${BASE_URL}${endpoint}`;
  const start = Date.now();
  try {
    const res = await fetch(url, { method: "GET" });
    const elapsed = Date.now() - start;
    const status = res.status;
    const data = await res.json().catch(() => ({}));
    return { endpoint, status, elapsed, success: res.ok };
  } catch (err) {
    return { endpoint, status: 0, elapsed: Date.now() - start, success: false, error: err.message };
  }
}

async function runLoadTest(concurrentRequests = 10) {
  console.log(`\n=== Load Test: ${concurrentRequests} concurrent requests ===\n`);

  const results = [];
  for (const endpoint of endpoints) {
    const promises = Array.from({ length: concurrentRequests }, () => fetchEndpoint(endpoint));
    const batch = await Promise.all(promises);
    results.push(...batch);
  }

  results.forEach((r) => {
    const status = r.success ? "✓" : "✗";
    console.log(`${status} ${r.endpoint} - ${r.status} (${r.elapsed}ms)${r.error ? ` - ${r.error}` : ""}`);
  });

  const total = results.length;
  const successful = results.filter((r) => r.success).length;
  const avgTime = (results.reduce((sum, r) => sum + r.elapsed, 0) / total).toFixed(2);

  console.log(`\n=== Summary ===`);
  console.log(`Total requests: ${total}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${total - successful}`);
  console.log(`Avg response time: ${avgTime}ms\n`);
}

runLoadTest(10);