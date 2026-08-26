import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--hdr)" }} className="hidden md:block">
      <div className="ribbon" />
      <div className="max-w-6xl mx-auto px-5 py-10 grid sm:grid-cols-3 gap-8 text-sm" style={{ color: "rgba(255,255,255,.7)" }}>
        <div>
          <div className="serif font-bold text-white text-base mb-3">SGSITS, Indore</div>
          <p className="text-xs leading-relaxed">
            An Autonomous Institute established in 1952, run by the Govt. of Madhya Pradesh. Affiliated to RGPV, Bhopal. NAAC
            Grade A Accredited.
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--gold)" }}>
            आचारः प्रथमो धर्मः
          </p>
        </div>
        <div>
          <div className="serif font-semibold text-white mb-3">Quick Links</div>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/browse" className="hover:text-white">
                Find My Notes
              </Link>
            </li>
            <li>
              <Link href="/upload" className="hover:text-white">
                Upload Notes
              </Link>
            </li>
            <li>
              <a href="https://www.sgsits.ac.in" target="_blank" rel="noreferrer" className="hover:text-white">
                sgsits.ac.in ↗
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="serif font-semibold text-white mb-3">Contact</div>
          <ul className="space-y-1.5 mono text-xs">
            <li>23, Sir M. Visvesvaraya Marg</li>
            <li>Vallabh Nagar, Indore M.P. 452003</li>
            <li>+91-731-2544415</li>
            <li>director@sgsits.ac.in</li>
          </ul>
        </div>
      </div>
      <div
        className="border-t text-center py-3 mono text-xs"
        style={{ borderColor: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.4)" }}
      >
        Unofficial student resource · not an official SGSITS portal
      </div>
    </footer>
  );
}
