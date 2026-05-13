import csv
import random

# Normal users
normal_ips = [f"192.168.1.{i}" for i in range(10, 30)]

# The Threat Actors
attacker_high = "104.21.44.11"      # Cloudflare routing IP (Simulated)
attacker_critical = "45.33.32.156"  # Known Botnet IP (Simulated)

with open('malicious_payload.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['ip', 'endpoint', 'status', 'user_agent'])
    
    # 1. Generate normal background traffic (Low counts per IP)
    for _ in range(200):
        writer.writerow([random.choice(normal_ips), '/home', '200', 'Mozilla/5.0'])
        
    # 2. Generate HIGH risk threat (Between 50 - 200 requests)
    for _ in range(85):
        writer.writerow([attacker_high, '/api/v1/auth', '401', 'Python-urllib/3.9'])
        
    # 3. Generate CRITICAL risk threat (Over 200 requests - brute force)
    for _ in range(260):
        writer.writerow([attacker_critical, '/wp-admin.php', '403', 'curl/7.68.0'])
        
print("[+] malicious_payload.csv generated successfully with 545 log entries.")