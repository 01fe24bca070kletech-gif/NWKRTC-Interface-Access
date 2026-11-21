// A simple city bus drawn with SVG, so no image file is needed.
// To use a real photo instead, put a photo in the "public" folder
// and replace <BusIllustration /> in Home.jsx with <img src="/bus.jpg" alt="City bus" />
function BusIllustration() {
  return (
    <svg viewBox="0 0 480 280" role="img" aria-label="City bus illustration" className="bus-svg">
      {/* road */}
      <rect x="0" y="236" width="480" height="44" fill="#123c3a" />
      <rect x="30" y="256" width="60" height="5" rx="2" fill="#f5f7f4" opacity="0.7" />
      <rect x="160" y="256" width="60" height="5" rx="2" fill="#f5f7f4" opacity="0.7" />
      <rect x="290" y="256" width="60" height="5" rx="2" fill="#f5f7f4" opacity="0.7" />
      <rect x="410" y="256" width="60" height="5" rx="2" fill="#f5f7f4" opacity="0.7" />

      {/* bus body */}
      <rect x="40" y="60" width="400" height="160" rx="22" fill="#167d70" />
      <rect x="40" y="160" width="400" height="30" fill="#f0a43a" />
      <rect x="40" y="190" width="400" height="30" rx="0" fill="#123c3a" opacity="0.25" />

      {/* windows */}
      {[64, 134, 204, 274, 344].map((x) => (
        <rect key={x} x={x} y="82" width="56" height="58" rx="8" fill="#e8f4f1" />
      ))}
      {/* front door and windshield */}
      <rect x="404" y="82" width="26" height="58" rx="6" fill="#e8f4f1" />

      {/* route board */}
      <rect x="150" y="66" width="150" height="12" rx="4" fill="#123c3a" />
      <text x="225" y="76" textAnchor="middle" fontSize="9" fontWeight="700" fill="#f0a43a">
        HUBBALLI - DHARWAD
      </text>

      {/* name on side */}
      <text x="240" y="181" textAnchor="middle" fontSize="16" fontWeight="700" fill="#123c3a">
        NWKRTC
      </text>

      {/* headlight */}
      <rect x="432" y="196" width="10" height="14" rx="3" fill="#f0a43a" />

      {/* wheels */}
      <circle cx="115" cy="222" r="26" fill="#1d2b2a" />
      <circle cx="115" cy="222" r="11" fill="#cfd8d5" />
      <circle cx="365" cy="222" r="26" fill="#1d2b2a" />
      <circle cx="365" cy="222" r="11" fill="#cfd8d5" />
    </svg>
  );
}

export default BusIllustration;
