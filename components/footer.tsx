import Link from "next/link";
export function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Link className="footer-brand" href="/">
            D’ EMBASSY
          </Link>
          <p>Bridging borders. Building possibilities.</p>
        </div>
        <div>
          <span className="eyebrow">Explore</span>
          <Link href="/about/">About us</Link>
          <Link href="/services/">Our services</Link>
          <Link href="/careers/">Careers</Link>
        </div>
        <div>
          <span className="eyebrow">Let’s connect</span>
          <a href="mailto:admin@dembassy.ky">admin@dembassy.ky ↗</a>
          <a href="tel:+13459458006">+1 (345) 945-8006</a>
          <Link href="/contact/">Visit our office ↗</Link>
        </div>
        <div>
          <span className="eyebrow">Find us</span>
          <p>
            Unit 3C, Grand Cayman, 80 Shedden Road, 
            <br />
            Elizabethan Square, Amerigo House, 
            <br />
            KY1-1503, Cayman Islands
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 D’ Embassy. All rights reserved.</span>
        <span>Website redesign concept</span>
        <a href="#main">Back to top ↑</a>
      </div>
    </footer>
  );
}
