#!/usr/bin/env python3
"""
TaskBoard HPA Load Testing Generator
Simulates concurrent user requests against TaskBoard API to trigger Horizontal Pod Autoscaler (HPA).
"""
import argparse
import concurrent.futures
import sys
import time
import urllib.request
import urllib.error

def send_request(url: str) -> tuple[int, float]:
    start = time.perf_counter()
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "TaskBoard-LoadTester/1.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            elapsed = time.perf_counter() - start
            return resp.status, elapsed
    except urllib.error.HTTPError as e:
        elapsed = time.perf_counter() - start
        return e.code, elapsed
    except Exception:
        elapsed = time.perf_counter() - start
        return 0, elapsed

def main():
    parser = argparse.ArgumentParser(description="TaskBoard HPA Load Generator")
    parser.add_argument("--url", default="http://taskboard.local/api/tasks", help="Target API endpoint")
    parser.add_argument("--requests", type=int, default=1000, help="Total number of requests")
    parser.add_argument("--concurrency", type=int, default=10, help="Concurrent client threads")
    args = parser.parse_args()

    print("=" * 70)
    print("TASKBOARD HPA LOAD TESTING GENERATOR")
    print(f"Target URL:    {args.url}")
    print(f"Total Requests:{args.requests}")
    print(f"Concurrency:   {args.concurrency}")
    print("=" * 70)

    success_count = 0
    failure_count = 0
    latencies = []

    start_time = time.perf_counter()
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.concurrency) as executor:
        futures = [executor.submit(send_request, args.url) for _ in range(args.requests)]
        for i, future in enumerate(concurrent.futures.as_completed(futures), 1):
            status, duration = future.result()
            latencies.append(duration)
            if 200 <= status < 400:
                success_count += 1
            else:
                failure_count += 1
            if i % 100 == 0 or i == args.requests:
                print(f"Progress: {i}/{args.requests} requests completed ({(i/args.requests)*100:.1f}%)")

    total_time = time.perf_counter() - start_time
    avg_latency = (sum(latencies) / len(latencies)) * 1000 if latencies else 0
    p95_latency = sorted(latencies)[int(len(latencies) * 0.95)] * 1000 if latencies else 0
    rps = args.requests / total_time if total_time > 0 else 0

    print("=" * 70)
    print("LOAD TEST SUMMARY")
    print(f"Total Wall Time:   {total_time:.2f} seconds")
    print(f"Throughput:        {rps:.2f} req/sec")
    print(f"Successful (2xx):  {success_count}")
    print(f"Failed (non-2xx):  {failure_count}")
    print(f"Avg Latency:       {avg_latency:.2f} ms")
    print(f"P95 Latency:       {p95_latency:.2f} ms")
    print("=" * 70)

if __name__ == "__main__":
    main()
