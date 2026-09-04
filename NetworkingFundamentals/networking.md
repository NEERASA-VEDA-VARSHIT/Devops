# 🌐 Windows Networking Homework

## Objective

The objective of this exercise is to practice basic Windows networking commands and understand network interfaces, routing, connectivity, DNS, network connections, HTTP requests, hostnames, IP addresses, and route tracing.

---

# 1. `ipconfig /all`

## Command

```powershell
ipconfig /all
```

## Output

```text
Windows IP Configuration

   Host Name . . . . . . . . . . . . : ZEROBOOK
   Primary Dns Suffix  . . . . . . . :
   Node Type . . . . . . . . . . . . : Hybrid
   IP Routing Enabled. . . . . . . . : No
   WINS Proxy Enabled . . . . . . . . : No

Ethernet adapter vEthernet (WSL (Hyper-V firewall)):

   Connection-specific DNS Suffix  . :
   Description . . . . . . . . . . . : Hyper-V Virtual Ethernet Adapter
   Physical Address. . . . . . . . . : 00-15-5D-21-8F-3B
   DHCP Enabled. . . . . . . . . . . : No
   Autoconfiguration Enabled . . . . : Yes
   Link-local IPv6 Address . . . . . : fe80::1426:616f:d957:661b%47(Preferred)
   IPv4 Address. . . . . . . . . . . : 172.18.32.1(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.240.0
   Default Gateway . . . . . . . . . :
   DHCPv6 IAID . . . . . . . . . . . : 788534621
   DHCPv6 Client DUID. . . . . . . . : 00-01-00-01-32-2A-EE-FD-44-E5-17-E1-F0-9B
   NetBIOS over Tcpip. . . . . . . . : Enabled

Wireless LAN adapter Local Area Connection* 15:

   Media State . . . . . . . . . . . : Media disconnected
   Connection-specific DNS Suffix  . :
   Description . . . . . . . . . . . : Microsoft Wi-Fi Direct Virtual Adapter #7
   Physical Address. . . . . . . . . : F4-CE-23-E6-F5-F6
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes

Wireless LAN adapter Local Area Connection* 16:

   Media State . . . . . . . . . . . : Media disconnected
   Connection-specific DNS Suffix  . :
   Description . . . . . . . . . . . : Microsoft Wi-Fi Direct Virtual Adapter #8
   Physical Address. . . . . . . . . : F6-CE-23-E6-F5-F5
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes

Wireless LAN adapter Wi-Fi 2:

   Connection-specific DNS Suffix  . :
   Description . . . . . . . . . . . : Intel(R) Wi-Fi 6E AX211 160MHz #2
   Physical Address. . . . . . . . . : F4-CE-23-E6-F5-F5
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes
   Link-local IPv6 Address . . . . . : fe80::e282:61cf:d5ac:5078%3(Preferred)
   IPv4 Address. . . . . . . . . . . : 100.129.161.80(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.240.0
   Lease Obtained . . . . . . . . . : Friday, September 4, 2026 7:36:58 PM
   Lease Expires . . . . . . . . . . : Saturday, September 5, 2026 8:45:51 PM
   Default Gateway . . . . . . . . . : 100.129.160.1
   DHCP Server . . . . . . . . . . . : 100.129.160.1
   DNS Servers . . . . . . . . . . . : 100.129.160.1
                                       8.8.8.8
   NetBIOS over Tcpip . . . . . . . . : Enabled
```

## What I understood

`ipconfig /all` displays detailed information about the network interfaces on a Windows computer.

My computer has a physical Wi-Fi adapter and a virtual Hyper-V adapter used by WSL. The active Wi-Fi interface has IPv4 address `100.129.161.80`, subnet mask `255.255.240.0`, and default gateway `100.129.160.1`.

The WSL virtual adapter has IPv4 address `172.18.32.1`.

The output also shows the DNS servers used by the computer.

---

# 2. `route print`

## Command

```powershell
route print
```

## Output

```text
===========================================================================
Interface List
 47...00 15 5d 21 8f 3b ......Hyper-V Virtual Ethernet Adapter
 14...f4 ce 23 e6 f5 f6 ......Microsoft Wi-Fi Direct Virtual Adapter #7
 20...f6 ce 23 e6 f5 f5 ......Microsoft Wi-Fi Direct Virtual Adapter #8
  3...f4 ce 23 e6 f5 f5 ......Intel(R) Wi-Fi 6E AX211 160MHz #2
  1...........................Software Loopback Interface 1
===========================================================================

IPv4 Route Table
===========================================================================
Active Routes:
Network Destination        Netmask          Gateway       Interface  Metric
        0.0.0.0            0.0.0.0    100.129.160.1   100.129.161.80     45
  100.129.160.0    255.255.240.0         On-link    100.129.161.80    301
  100.129.161.80  255.255.255.255         On-link    100.129.161.80    301
 100.129.175.255  255.255.255.255         On-link    100.129.161.80    301
        127.0.0.0        255.0.0.0         On-link         127.0.0.1    331
        127.0.0.1  255.255.255.255         On-link         127.0.0.1    331
      127.255.255.255  255.255.255.255     On-link         127.0.0.1    331
    172.18.32.0    255.255.240.0         On-link       172.18.32.1    271
    172.18.32.1    255.255.255.255       On-link       172.18.32.1    271
    172.18.47.255  255.255.255.255       On-link       172.18.32.1    271
        224.0.0.0        240.0.0.0       On-link         127.0.0.1    331
        224.0.0.0        240.0.0.0       On-link    100.129.161.80    301
        224.0.0.0        240.0.0.0       On-link       172.18.32.1    271
  255.255.255.255  255.255.255.255       On-link         127.0.0.1    331
  255.255.255.255  255.255.255.255       On-link    100.129.161.80    301
  255.255.255.255  255.255.255.255       On-link       172.18.32.1    271
===========================================================================
Persistent Routes:
  None

IPv6 Route Table
===========================================================================
Active Routes:
 If Metric Network Destination      Gateway
  1    331 ::1/128                  On-link
  3    301 fe80::/64                On-link
 47    271 fe80::/64                On-link
 47    271 fe80::1426:616f:d957:661b/128
                                    On-link
  3    301 fe80::e282:61cf:d5ac:5078/128
                                    On-link
  1    331 ff00::/8                 On-link
  3    301 ff00::/8                 On-link
 47    271 ff00::/8                 On-link
===========================================================================
Persistent Routes:
  None
```

## What I understood

`route print` displays the routing table used by Windows.

The important entry is:

```text
0.0.0.0    0.0.0.0    100.129.160.1
```

This is the default route. It means that when Windows does not have a more specific route for a destination, it sends the traffic through the default gateway `100.129.160.1`.

---

# 3. `ping 8.8.8.8`

## Command

```powershell
ping -n 4 8.8.8.8
```

## Output

```text
Pinging 8.8.8.8 with 32 bytes of data:
Reply from 8.8.8.8: bytes=32 time=106ms TTL=117
Reply from 8.8.8.8: bytes=32 time=187ms TTL=117
Reply from 8.8.8.8: bytes=32 time=27ms TTL=117
Reply from 8.8.8.8: bytes=32 time=12ms TTL=117

Ping statistics for 8.8.8.8:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 12ms, Maximum = 187ms, Average = 83ms
```

## What I understood

`ping` tests whether a destination is reachable over the network.

Here, all 4 packets were successfully received, so there was `0%` packet loss.

The average round-trip time was `83ms`.

Because I used an IP address directly, DNS resolution was not required to identify the destination.

---

# 4. `ping google.com`

## Command

```powershell
ping -n 4 google.com
```

## Output

```text
Pinging google.com [142.250.207.174] with 32 bytes of data:
Reply from 142.250.207.174: bytes=32 time=27ms TTL=117
Reply from 142.250.207.174: bytes=32 time=31ms TTL=117
Reply from 142.250.207.174: bytes=32 time=25ms TTL=117
Reply from 142.250.207.174: bytes=32 time=38ms TTL=117

Ping statistics for 142.250.207.174:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 25ms, Maximum = 38ms, Average = 30ms
```

## What I understood

When I pinged `google.com`, Windows first resolved the hostname to the IP address `142.250.207.174`.

The packets were successfully received with `0%` loss.

This demonstrates the relationship:

```text
google.com
    ↓
DNS resolution
    ↓
142.250.207.174
    ↓
Network communication
```

---

# 5. `netstat -ano`

## Command

```powershell
netstat -ano
```

## Output

The command produced a list of active TCP and UDP connections, including listening ports. Some examples from the actual output are:

```text
Active Connections

  Proto  Local Address          Foreign Address        State           PID
  TCP    0.0.0.0:80             0.0.0.0:0              LISTENING       12400
  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       1608
  TCP    0.0.0.0:445            0.0.0.0:0              LISTENING       4
  TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       12400
  TCP    0.0.0.0:3001           0.0.0.0:0              LISTENING       12400
  TCP    0.0.0.0:5000           0.0.0.0:0              LISTENING       12400
  TCP    0.0.0.0:8080           0.0.0.0:0              LISTENING       12400
  TCP    100.129.161.80:49425   172.211.123.250:443    ESTABLISHED     4652
  TCP    100.129.161.80:49666   13.107.5.93:443        ESTABLISHED     20952
  TCP    100.129.161.80:50060   185.199.108.133:443    ESTABLISHED     22140
  TCP    127.0.0.1:49685        127.0.0.1:49686        ESTABLISHED     1520
  UDP    0.0.0.0:53             *:*                                    7268
  UDP    0.0.0.0:5353           *:*                                    8756
```

## What I understood

`netstat` displays network connections and listening ports.

The important columns are:

- **Proto** — protocol such as TCP or UDP
- **Local Address** — local IP address and port
- **Foreign Address** — remote IP address and port
- **State** — connection state such as `LISTENING` or `ESTABLISHED`
- **PID** — Process ID associated with the connection

For example:

```text
TCP  0.0.0.0:3000  0.0.0.0:0  LISTENING  12400
```

means that a process with PID `12400` is listening for TCP connections on port `3000`.

---

# 6. `nslookup google.com`

## Command

```powershell
nslookup google.com
```

## Output

```text
Server:  wifi.height8tech.com
Address:  100.129.160.1

Non-authoritative answer:
Name:    google.com
Addresses:  2404:6800:4009:807::200e
           142.250.207.174
```

## What I understood

`nslookup` is used to query DNS.

My computer used the DNS server at `100.129.160.1` to resolve `google.com`.

The result contains both:

- an IPv6 address: `2404:6800:4009:807::200e`
- an IPv4 address: `142.250.207.174`

This shows that DNS can return multiple addresses for the same hostname.

---

# 7. `curl -I https://example.com`

## Command

```powershell
curl.exe -I https://example.com
```

## Output

```text
HTTP/1.1 200 OK
Date: Fri, 04 Sep 2026 16:24:38 GMT
Content-Type: text/html
Connection: keep-alive
Server: cloudflare
last-modified: Sun, 30 Aug 2026 04:11:49 GMT
allow: GET, HEAD
Accept-Ranges: bytes
Age: 202
cf-cache-status: HIT
CF-RAY: a35e5876db527f9b-MAA
```

## What I understood

`curl` can make HTTP requests from the command line.

The `-I` option requests the HTTP response headers instead of downloading the complete page body.

The response:

```text
HTTP/1.1 200 OK
```

means that the HTTP request was successful.

The headers also show information such as the content type, server, and caching information.

---

# 8. `hostname`

## Command

```powershell
hostname
```

## Output

```text
ZEROBOOK
```

## What I understood

`hostname` displays the hostname of the computer.

The hostname of my Windows computer is:

```text
ZEROBOOK
```

---

# 9. `Get-NetIPAddress`

## Command

```powershell
Get-NetIPAddress -AddressFamily IPv4
```

## Output

Important IPv4 addresses from the actual output were:

```text
IPAddress         : 169.254.19.254
InterfaceAlias    : Local Area Connection* 16
PrefixLength      : 16
AddressState      : Tentative

IPAddress         : 169.254.23.108
InterfaceAlias    : Local Area Connection* 15
PrefixLength      : 16
AddressState      : Tentative

IPAddress         : 172.18.32.1
InterfaceAlias    : vEthernet (WSL (Hyper-V firewall))
PrefixLength      : 20
AddressState      : Preferred

IPAddress         : 100.129.161.80
InterfaceAlias    : Wi-Fi 2
PrefixLength      : 20
AddressState      : Preferred

IPAddress         : 127.0.0.1
InterfaceAlias    : Loopback Pseudo-Interface 1
PrefixLength      : 8
AddressState      : Preferred
```

## What I understood

`Get-NetIPAddress` displays IP address information for the network interfaces on Windows.

The important addresses in my output include:

```text
100.129.161.80  → Wi-Fi interface
172.18.32.1     → WSL/Hyper-V virtual interface
127.0.0.1       → Loopback interface
```

The loopback address `127.0.0.1` refers to the local computer itself.

---

# 10. `tracert google.com`

## Command

```powershell
tracert google.com
```

## Output

```text
Tracing route to google.com [142.250.207.174]
over a maximum of 30 hops:

  1    15 ms     5 ms     3 ms  wifi.height8tech.com [100.129.160.1]
  2     6 ms     2 ms   164 ms  202.131.133.5.convergentindia.com [202.131.133.5]
  3    81 ms     5 ms   189 ms  115.117.125.189.static-mumbai.vsnl.net.in [115.117.125.189]
  4     *        *       15 ms  172.28.117.90
  5     8 ms     7 ms     8 ms  115.112.15.114.static-chennai.vsnl.net.in [115.112.15.114]
  6    18 ms    13 ms     9 ms  142.251.227.215
  7    30 ms    11 ms    61 ms  172.253.75.14
  8    52 ms    83 ms    25 ms  216.239.49.85
  9    77 ms   270 ms    27 ms  192.178.254.216
 10    87 ms    37 ms    29 ms  142.250.213.101
 11    35 ms    25 ms    33 ms  142.250.214.113
 12    38 ms    25 ms    27 ms  pnbomb-bl-in-f14.1e100.net [142.250.207.174]

Trace complete.
```

## What I understood

`tracert` shows the path taken by network packets from my computer to the destination.

The trace reached Google in 12 hops.

Each hop represents a network device/router along the path.

At hop 4, some probes did not receive a response, which is shown by:

```text
*  *  15 ms
```

This does not necessarily mean that the route is broken because later hops successfully responded and the trace eventually reached the destination.

---

# 🔎 Overall Understanding

Through these commands, I learned how the different parts of networking fit together.

```text
                    NETWORKING FLOW

                         Computer
                            |
                            |
                  Network Interface
                            |
                 +----------+----------+
                 |                     |
              IP Address           Default Gateway
                 |                     |
                 +----------+----------+
                            |
                         Routing
                            |
                         Internet
                            |
                    +-------+-------+
                    |               |
                   DNS             HTTP
                    |               |
             google.com        example.com
                    |               |
                IP address      Web server
```

The commands provide different views of the same networking system:

| Command | Purpose |
|---|---|
| `ipconfig /all` | Shows network interface configuration |
| `route print` | Shows the routing table |
| `ping` | Tests connectivity and latency |
| `netstat -ano` | Shows network connections and listening ports |
| `nslookup` | Performs DNS lookups |
| `curl` | Makes HTTP requests |
| `hostname` | Shows the computer hostname |
| `Get-NetIPAddress` | Shows IP address configuration |
| `tracert` | Shows the path to a destination |

## Key concepts I learned

1. **IP address** identifies a network interface on a network.
2. **Subnet mask/prefix length** defines the network and host portions of an IP address.
3. **Default gateway** is used when there is no more specific route to a destination.
4. **DNS** converts human-readable hostnames such as `google.com` into IP addresses.
5. **Ping** can test connectivity and measure round-trip latency.
6. **Ports** identify network services running on a computer.
7. **TCP and UDP** are different transport protocols.
8. **HTTP/HTTPS** are application-layer protocols used for web communication.
9. **Traceroute/tracert** helps visualize the routers/hops between a source and destination.
10. **Loopback (`127.0.0.1`)** allows a computer to communicate with itself.
11. **Virtual network adapters** can be created by technologies such as WSL and Hyper-V.


![alt text](<Screenshot 2026-09-04 215503.png>) ![alt text](<Screenshot 2026-09-04 215512.png>) ![alt text](<Screenshot 2026-09-04 215518.png>) ![alt text](<Screenshot 2026-09-04 215522.png>) ![alt text](<Screenshot 2026-09-04 215530.png>) ![alt text](<Screenshot 2026-09-04 215535.png>) ![alt text](<Screenshot 2026-09-04 215550.png>) ![alt text](<Screenshot 2026-09-04 215554.png>)