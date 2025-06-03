import BellDiagram from '../components/BellDiagram/BellDiagram';

export default function Home() {
  return (
    <main>
      <div className="container">
        <div className="heading">
          <h1 className="title">
            Topcoder <span className="highlight">Solutions</span>
          </h1>
          <p className="subtitle">
            Simply click on any of the categories below to explore.
          </p>
        </div>
        <BellDiagram />
      </div>
    </main>
  );
}
