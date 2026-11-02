# Security Specifications & Rules Audit

## Data Invariants
1. **Public Reads, Secure Writes**: Anyone can read the fashion trends to explore they are hot right now.
2. **System & Admin Controlled Writes**: Trend records are authored by special system engines. Traditional clients cannot write arbitrary trend structures.
3. **Strict Validation**: All writes on `/trends/{trendId}` must fit the defined schema attributes (e.g. `trend_name`, `trend_score` are within valid sizes).
4. **ID Hardening**: No malicious characters or overly long IDs to prevent wallet drains.

## The Dirty Dozen Payloads (Security Penetration Targets)
1. **Unsigned-In Write**: Trying to create a Trend as a guest. (Must result in permission denied)
2. **Standard User Write Bypass**: Trying to update `trend_score` as a normal verified user. (Must result in permission denied)
3. **Invalid Email Form Spoof**: Spoofing an Administrator write with unverified email token. (Must result in permission denied)
4. **Negative Trend Score Injection**: Writing a trend document with `trend_score` < 0 (value poisoning).
5. **Ultra-size ID Poisoning**: Trying to submit a document ID with 500 characters of junk to exhaust search queries.
6. **No Title Shadow-write**: Creating a Trend without the required `trend_name` attribute.
7. **Invalid Field Type Write**: Putting `trend_score` as a string instead of integer.
8. **Immutability Breach**: Tampering with the immutable `created_at` timestamp.
9. **Spam Subcollection Creation**: Writing to random unmapped collections.
10. **Spoofing Metadata Timestamp**: Supplying a client-side falsified `updated_at` parameter instead of `request.time`.
11. **Malicious Empty Image URL Payload**: An image URL exceeding size constraints or with negative parameters.
12. **Orphaned Trend History Write**: Creating high-frequency historical coordinates without securing context matching.

## The Fortress Rules Setup Model
All client writes require verified Admin identity (`joel.jonsson@student.ksgyf.se` with verified email). Standard users can listen to changes securely.
