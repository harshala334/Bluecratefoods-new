import http from 'k6/http';
import { sleep, check } from 'k6';

// Stress Test Configuration
// 1. Ramp up from 0 to 10 VUs in 30s
// 2. Stay at 50 VUs for 1 minute (Stress)
// 3. Ramp up to 100 VUs for 30s (Breaking Point)
// 4. Ramp down to 0 VUs in 30s

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must be under 500ms
    http_req_failed: ['rate<0.01'],    // Error rate must be less than 1%
  },
};

export default function () {
  const url = 'http://localhost:8004/stores'; // Target: Store Service
  const res = http.get(url);

  // Verification
  check(res, {
    'status is 200': (r) => r.status === 200,
    'latency is low': (r) => r.timings.duration < 500,
  });

  sleep(1); // Think time (1 second between requests per user)
}
