import Link from "next/link";
import { CallToAction } from '../service-detail';
export default function About() {
  return (
    <>
      <section className="page-intro">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>About us</span>
          </div>
          <span className="eyebrow">About us</span>
          <h1>
            Connections that go
            <br />
            <em>beyond borders.</em>
          </h1>
          <p>
            We help individuals and businesses move forward with reliable
            solutions, personal attention and a global outlook.
          </p>
        </div>
      </section>
      <section className="section wrap split">
        <img
          src="/assets/team.jpg"
          alt="Amerigo House, D’ Embassy’s office location"
        />
        <div className="split-copy">
          <span className="eyebrow">Who we are</span>
          <h2>
            People first.
            <br />
            Possibilities always.
          </h2>
          <p>
            D’ Embassy is a team of dedicated professionals connecting
            individuals and businesses across borders. We make complex tasks
            easier to understand, with a tailored approach to each client’s
            goals.
          </p>
          <p>
            We serve people from different industries, nationalities and
            backgrounds, building relationships through trust, integrity and
            care.
          </p>
          <p>
            From the Cayman Islands to opportunities beyond, we believe personal
            understanding is the starting point for meaningful support.
          </p>
          <Link className="button " href="/appointment/">
            Meet your next step
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <section className="section dark-section">
        <div className="wrap mission-grid">
          <div>
            <span className="eyebrow">Our mission</span>
            <h2>
              Connecting people
              <br />
              with the right solutions.
            </h2>
            <p style={{ marginTop: "25px" }}>
              Reliable service, innovative thinking and personalized guidance
              that help people and businesses thrive locally and
              internationally.
            </p>
          </div>
          <div>
            <span className="eyebrow">Our vision</span>
            <h2>
              A trusted partner
              <br />
              for what comes next.
            </h2>
            <p style={{ marginTop: "25px" }}>
              To be the go-to provider for solutions that support growth and new
              possibilities, in Cayman and beyond.
            </p>
          </div>
        </div>
      </section>
      <section className="section wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">What guides us</span>
            <h2>The way we work matters.</h2>
          </div>
        </div>
        <div className="value-grid">
          <article>
            <h3>Trust &amp; integrity</h3>
            <p>
              Lasting relationships begin with dependable support and thoughtful
              communication.
            </p>
          </article>
          <article>
            <h3>Your needs, understood</h3>
            <p>
              Every client brings a different story. Our approach starts with
              listening to yours.
            </p>
          </article>
          <article>
            <h3>Ideas that move you forward</h3>
            <p>
              Practical problem-solving and an inclusive perspective help us
              respond to different challenges.
            </p>
          </article>
        </div>
      </section>
      <CallToAction />
    </>
  );
}
