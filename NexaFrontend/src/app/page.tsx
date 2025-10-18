import Image from "next/image";

export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <Image src="/globe.svg" alt="NexaPoll Logo" width={40} height={40} />
          <h1>NexaPoll</h1>
        </div>
        <nav className="nav">
          <a href="#">DAOs</a>
          <a href="#">Create DAO</a>
          <a href="#">Profile</a>
        </nav>
        <div className="wallet">
          <button>Connect Wallet</button>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <h2>Welcome to NexaPoll</h2>
          <p>Your platform for decentralized governance.</p>
          <button className="cta">Create a new DAO</button>
        </section>

        <section className="dao-list">
          <h3>Discover DAOs</h3>
          <div className="search-bar">
            <input type="text" placeholder="Search by DAO name, token, or creator" />
            <button>Search</button>
          </div>
          <div className="dao-grid">
            {/* DAO Card */}
            <div className="dao-card">
              <h4>My Awesome DAO</h4>
              <p>A short description of the DAO.</p>
              <div className="details">
                <span>Token: ERC20</span>
                <span>Treasury: 10 ETH</span>
              </div>
            </div>
            {/* DAO Card */}
            <div className="dao-card">
              <h4>Another DAO</h4>
              <p>This is another DAO for testing.</p>
              <div className="details">
                <span>Token: ERC721</span>
                <span>Treasury: 5 ETH</span>
              </div>
            </div>
            {/* Add more DAO cards as needed */}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 NexaPoll. All rights reserved.</p>
      </footer>
    </div>
  );
}