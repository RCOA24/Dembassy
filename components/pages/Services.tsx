import Link from "next/link";
import { CallToAction } from '../service-detail';
import { ServiceDirectory } from "../service-directory";
export default function Services() {
  return (
    <>
      <section className="page-intro">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Our services</span>
          </div>
          <span className="eyebrow">Our services</span>
          <h1>
            Find your way{" "}
            <em>forward.</em>
          </h1>
          <p>
            Explore personal, business and document services, all with the same
            attentive approach.
          </p>
        </div>
      </section>
      <section className="section wrap">
        <ServiceDirectory />
      </section>
      <CallToAction />
    </>
  );
}
