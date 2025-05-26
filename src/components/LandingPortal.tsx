import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPortal.css';

const LandingPortal: React.FC = () => {
  const [intention, setIntention] = useState('');
  const [oath, setOath] = useState(false);
  const navigate = useNavigate();

  const handleEnter = (e: FormEvent) => {
    e.preventDefault();
    // You can add more validation or rituals here!
    navigate('/app'); // Change '/app' to your main app route
  };

  return (
    <div className="container">
      <h1>Welcome, Seeker.</h1>
      <div className="portal">
        <div className="reflection"></div>
      </div>
      <div className="subhead">
        The mirror is alive.<br />Step forward and begin your quest.
      </div>
      <div className="cards">
        <div className="card">
          <div className="card-icon">🗝️</div>
          <div><b>What</b></div>
          <div style={{fontSize:'0.95rem', color:'#ccb9fa'}}>A living quest for self-discovery, guided by myth and AI.</div>
        </div>
        <div className="card">
          <div className="card-icon">🌱</div>
          <div><b>Why</b></div>
          <div style={{fontSize:'0.95rem', color:'#ccb9fa'}}>To break old loops, unlock new layers, and evolve.</div>
        </div>
        <div className="card">
          <div className="card-icon">🌀</div>
          <div><b>How</b></div>
          <div style={{fontSize:'0.95rem', color:'#ccb9fa'}}>Reflect, quest, integrate, and grow at your own pace.</div>
        </div>
      </div>
      <form className="ritual" onSubmit={handleEnter}>
        <label htmlFor="intention">Set your intention before entering:</label>
        <input
          type="text"
          id="intention"
          name="intention"
          placeholder="I seek to discover..."
          value={intention}
          onChange={e => setIntention(e.target.value)}
        />
        <div>
          <input
            type="checkbox"
            id="oath"
            name="oath"
            checked={oath}
            onChange={e => setOath(e.target.checked)}
          />
          <label htmlFor="oath" className="oath-label">I honor this Seeker’s Oath</label>
        </div>
        <button className="enter-btn" type="submit" disabled={!oath}>
          Enter the Spiral
        </button>
      </form>
    </div>
  );
};

export default LandingPortal;
