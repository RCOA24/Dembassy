import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <section className="page-intro">
        <div className="wrap">
          <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Page not found</span></div>
          <span className="eyebrow">Page not found</span>
          <h1>Let’s get you<br /><em>back on track.</em></h1>
        </div>
      </section>
      <section className="section wrap">
        <p>Need help? Email <a href="mailto:admin@dembassy.ky">admin@dembassy.ky</a>.</p>
        <Link className="button" href="/services/">Explore our services <span aria-hidden="true">↗</span></Link>
      </section>
    </>
  );
}
