export const records = {
  A: {value:'192.0.2.42', explanation:'An A record maps the name to an IPv4 address. This documentation address represents your lab web server.'},
  AAAA: {value:'2001:db8::42', explanation:'An AAAA record maps the name to an IPv6 address. IPv6 addresses are 128 bits; IPv4 addresses are 32 bits.'},
  CNAME: {value:'origin.example.com.', explanation:'A CNAME maps an alias to another name. It does not redirect HTTP or change the URL in the browser. An address lookup must resolve the target too.'},
  MX: {value:'10 mail.example.com.', explanation:'MX identifies a mail server by hostname. Lower preference numbers are tried first; the mail client then resolves that server’s addresses.'},
  TXT: {value:'"v=spf1 -all"', explanation:'TXT carries text. This SPF example declares that no hosts are authorized to send mail for this sample name. TXT records do not themselves encrypt or authenticate a connection.'},
};
export function simulate({name = 'www.example.com', type = 'A', scenario = 'cold', elapsed = 0}) {
  if (!records[type]) throw new Error('Unsupported record type');
  const ttl = 300;
  const cached = scenario === 'warm' && elapsed < ttl;
  const missing = scenario === 'missing';
  const broken = scenario === 'dnssec';
  const steps = [
    {actor:'Browser / OS', title:'Ask the recursive resolver', description:`The stub requests ${type} for ${name}. Local browser and OS caches are assumed empty. The RD flag requests recursion.`},
    ...(cached ? [{actor:'Resolver cache',title:'Reuse an unexpired answer',description:`The resolver already has this exact name/type answer. ${ttl-elapsed} seconds remain on its TTL, so this model makes no upstream query.`}] : [
      {actor:'Root (.)',title:'Find the .com delegation',description:'The recursive resolver follows a referral to the .com nameservers. A root server does not supply the host address. This cold-cache model assumes no delegation records are cached.'},
      {actor:'.com TLD',title:'Find the example.com delegation',description:'The TLD returns the authoritative nameservers for example.com. Glue address records may help the resolver reach those servers.'},
      {actor:'Authoritative server',title:missing ? 'Return a name error' : 'Return the requested record',description:missing ? 'The lab name does not exist. NXDOMAIN includes an SOA record to support negative caching. This differs from NOERROR with an empty answer (NODATA), where the name exists but this record type does not.' : `The zone returns ${type} data for ${name}. Authoritative answers set AA; the recursive response shown below does not.`},
      ...(broken ? [{actor:'Validating resolver',title:'Reject a bogus DNSSEC answer',description:'This scenario assumes a signed zone with a trusted delegation but an invalid signature. Validation fails, so the resolver returns SERVFAIL rather than the untrusted data. Unsigned does not automatically mean bogus.'}] : [])
    ]),
    {actor:'Client',title:broken ? 'Receive a resolution failure' : missing ? 'Receive NXDOMAIN' : 'Receive the DNS answer',description:broken ? 'SERVFAIL can have many causes. A real DNSSEC diagnosis also needs validation diagnostics; the status alone does not prove a signature problem.' : missing ? 'Negative results may be cached too. The negative cache lifetime is the smaller of the SOA TTL and SOA MINIMUM value.' : 'The resolver returns the answer. A/AAAA results can be used to open a connection. DNS succeeds before HTTP begins; an answer does not prove the website is reachable.'}
  ];
  const status = broken ? 'SERVFAIL' : missing ? 'NXDOMAIN' : 'NOERROR';
  const remaining = cached ? ttl-elapsed : ttl;
  const question = `${name}. IN ${type}`;
  const body = broken ? '; No answer: this lab resolver rejected bogus DNSSEC data.' : missing ? `;; AUTHORITY SECTION:\nexample.com. 300 IN SOA ns1.example.com. hostmaster.example.com. 1 3600 600 86400 300` : `;; ANSWER SECTION:\n${name}. ${remaining} IN ${type} ${records[type].value}`;
  return {steps,status,cached,remaining, question, response:`;; ->>HEADER<<- opcode: QUERY, status: ${status}, id: 4242\n;; flags: qr rd ra; QUERY: 1, ANSWER: ${broken || missing ? 0 : 1}\n\n;; QUESTION SECTION:\n;${question}\n\n${body}`, explanation:broken ? 'DNSSEC validates authenticity and integrity, not confidentiality. DoH/DoT encrypt the connection to the chosen resolver, but do not replace DNSSEC.' : missing ? 'NXDOMAIN means this name does not exist. It is a valid DNS response, not a network timeout.' : records[type].explanation};
}
