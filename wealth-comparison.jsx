import { useState, useEffect, useRef } from "react";

const billionaires = [
  { name: "Elon Musk", wealth: 714.2, company: "Tesla / SpaceX / xAI", emoji: "🚀" },
  { name: "Larry Page", wealth: 257.7, company: "Alphabet / Google", emoji: "🔍" },
  { name: "Jeff Bezos", wealth: 251.4, company: "Amazon / Blue Origin", emoji: "📦" },
  { name: "Larry Ellison", wealth: 242.6, company: "Oracle", emoji: "🗄️" },
  { name: "Sergey Brin", wealth: 237.8, company: "Alphabet / Google", emoji: "🧪" },
  { name: "Bernard Arnault", wealth: 233.0, company: "LVMH", emoji: "👜" },
  { name: "Mark Zuckerberg", wealth: 229.3, company: "Meta", emoji: "👤" },
  { name: "Jensen Huang", wealth: 162.5, company: "NVIDIA", emoji: "🎮" },
  { name: "Warren Buffett", wealth: 147.5, company: "Berkshire Hathaway", emoji: "📈" },
  { name: "Amancio Ortega", wealth: 120.0, company: "Inditex / Zara", emoji: "👔" },
];

const totalBillionaireWealth = billionaires.reduce((sum, b) => sum + b.wealth, 0);

// Upper middle class data
const UMC_HOUSEHOLDS = 54_000_000; // ~54M US households earning $100K-$1M
const UMC_AVG_NET_WORTH = 0.000450; // ~$450K average net worth in billions
const UMC_TOTAL_NET_WORTH = UMC_HOUSEHOLDS * UMC_AVG_NET_WORTH; // ~$24.3 trillion
const UMC_AVG_INCOME = 0.000165; // ~$165K average income in billions
const UMC_TOTAL_INCOME = UMC_HOUSEHOLDS * UMC_AVG_INCOME; // ~$8.9 trillion

function AnimatedNumber({ target, duration = 1500, prefix = "$", suffix = "B", decimals = 1 }) {
  const [current, setCurrent] = useState(0);
  const startTime = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    startTime.current = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(target * eased);
      if (progress < 1) rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [target, duration]);

  const formatted = current >= 1000
    ? `${(current / 1000).toFixed(1)}T`
    : `${current.toFixed(decimals)}${suffix}`;

  return <span>{prefix}{formatted}</span>;
}

function PixelGrid({ count, color, label }) {
  const gridSize = Math.min(count, 200);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 1, maxWidth: gridSize > 50 ? 300 : 200 }}>
      {Array.from({ length: gridSize }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: 4,
            borderRadius: 1,
            backgroundColor: color,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
}

export default function WealthComparison() {
  const [activeView, setActiveView] = useState("overview");
  const [hoveredBillionaire, setHoveredBillionaire] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const maxWealth = billionaires[0].wealth;

  const yearsToMatch = (totalBillionaireWealth * 1_000_000_000) / (UMC_TOTAL_INCOME * 1_000_000_000);

  return (
    <div style={{
      fontFamily: "'Courier New', 'Consolas', monospace",
      background: "#0a0a0a",
      color: "#e8e8e8",
      minHeight: "100vh",
      padding: "0",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "48px 40px 32px",
        borderBottom: "1px solid #1a1a1a",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, #ff3333, #ff6633, #ffcc33, #33ff66, #3366ff, #9933ff)",
        }} />
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#666", textTransform: "uppercase", marginBottom: 16 }}>
          Wealth Inequality Visualized
        </div>
        <h1 style={{
          fontSize: 36,
          fontWeight: 700,
          lineHeight: 1.1,
          margin: 0,
          color: "#fff",
          maxWidth: 700,
        }}>
          10 People Own More Than <br />
          <span style={{ color: "#ff4444" }}>54 Million Households</span> Earn in a Year
        </h1>
        <p style={{ color: "#777", fontSize: 13, marginTop: 16, maxWidth: 600, lineHeight: 1.6 }}>
          The combined net worth of the world's 10 richest people compared to the combined annual income of every U.S. household earning $100K–$1M per year. Forbes data, January 2026.
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: "flex",
        gap: 0,
        borderBottom: "1px solid #1a1a1a",
        padding: "0 40px",
      }}>
        {[
          { id: "overview", label: "THE SCALE" },
          { id: "individual", label: "BY BILLIONAIRE" },
          { id: "perspective", label: "IN PERSPECTIVE" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            style={{
              background: "none",
              border: "none",
              borderBottom: activeView === tab.id ? "2px solid #ff4444" : "2px solid transparent",
              color: activeView === tab.id ? "#fff" : "#555",
              padding: "16px 24px",
              fontSize: 11,
              letterSpacing: 3,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.3s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "40px" }}>
        {activeView === "overview" && (
          <div style={{ animation: "fadeIn 0.6s ease" }}>
            {/* Main Comparison Bars */}
            <div style={{ display: "flex", gap: 60, marginBottom: 60 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, letterSpacing: 4, color: "#ff4444", marginBottom: 8 }}>
                  TOP 10 BILLIONAIRES — COMBINED NET WORTH
                </div>
                <div style={{ fontSize: 56, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                  {animated && <AnimatedNumber target={totalBillionaireWealth} suffix="B" decimals={1} />}
                </div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 8 }}>
                  That's ${(totalBillionaireWealth / 1000).toFixed(1)} Trillion from just 10 people
                </div>

                {/* Visual bar */}
                <div style={{
                  marginTop: 24,
                  height: 48,
                  background: "linear-gradient(90deg, #ff2222, #ff4444, #ff6644)",
                  borderRadius: 4,
                  width: animated ? "100%" : "0%",
                  transition: "width 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  position: "relative",
                  boxShadow: "0 0 40px rgba(255,68,68,0.3)",
                }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 60, marginBottom: 60 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, letterSpacing: 4, color: "#44aaff", marginBottom: 8 }}>
                  54M UPPER-MIDDLE-CLASS HOUSEHOLDS — COMBINED ANNUAL INCOME
                </div>
                <div style={{ fontSize: 56, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                  {animated && <AnimatedNumber target={UMC_TOTAL_INCOME} suffix="B" decimals={1} />}
                </div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 8 }}>
                  Every household earning $100K–$1M/yr, combined
                </div>

                <div style={{
                  marginTop: 24,
                  height: 48,
                  background: "linear-gradient(90deg, #2266ff, #44aaff, #66ccff)",
                  borderRadius: 4,
                  width: animated ? "100%" : "0%",
                  transition: "width 1.8s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 0 40px rgba(68,170,255,0.2)",
                }} />
              </div>
            </div>

            {/* The shocking stat */}
            <div style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: 8,
              padding: 40,
              marginBottom: 40,
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 4,
                height: "100%",
                background: "#ff4444",
              }} />
              <div style={{ fontSize: 11, letterSpacing: 4, color: "#888", marginBottom: 16 }}>
                KEY INSIGHT
              </div>
              <div style={{ fontSize: 24, color: "#fff", lineHeight: 1.4, maxWidth: 700 }}>
                The top 10 billionaires' combined wealth equals{" "}
                <span style={{ color: "#ff4444", fontWeight: 700 }}>
                  ~{yearsToMatch.toFixed(1)} months
                </span>{" "}
                of the entire combined annual income of 54 million upper-middle-class households.
              </div>
              <div style={{ fontSize: 13, color: "#555", marginTop: 16 }}>
                Elon Musk alone holds wealth equal to ~{((714.2 / UMC_TOTAL_INCOME) * 12).toFixed(0)} months of income from all 54M households combined.
              </div>
            </div>

            {/* People comparison */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 20,
            }}>
              <div style={{
                background: "#111",
                border: "1px solid #1a1a1a",
                borderRadius: 8,
                padding: 28,
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🧑‍💼</div>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#666", marginBottom: 4 }}>PEOPLE REPRESENTED</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#44aaff" }}>~140M</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                  People in 54M households earning $100K–$1M
                </div>
              </div>
              <div style={{
                background: "#111",
                border: "1px solid #1a1a1a",
                borderRadius: 8,
                padding: 28,
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>💰</div>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#666", marginBottom: 4 }}>AVERAGE HOUSEHOLD INCOME</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#44aaff" }}>$165K</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                  These aren't poor people — they're the "successful" class
                </div>
              </div>
              <div style={{
                background: "#111",
                border: "1px solid #1a1a1a",
                borderRadius: 8,
                padding: 28,
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>⏳</div>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#666", marginBottom: 4 }}>YEARS FOR 1 HOUSEHOLD TO MATCH MUSK</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#ff4444" }}>4.3M</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                  At $165K/yr, saving every penny, no taxes
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "individual" && (
          <div style={{ animation: "fadeIn 0.6s ease" }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#666", marginBottom: 24 }}>
              EACH BAR = ONE BILLIONAIRE'S NET WORTH vs. WHAT HOUSEHOLDS EARN
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {billionaires.map((b, i) => {
                const barWidth = (b.wealth / maxWealth) * 100;
                const householdsEquivalent = Math.round((b.wealth * 1_000_000_000) / 165_000);
                const isHovered = hoveredBillionaire === i;
                return (
                  <div
                    key={b.name}
                    onMouseEnter={() => setHoveredBillionaire(i)}
                    onMouseLeave={() => setHoveredBillionaire(null)}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.3s",
                      transform: isHovered ? "translateX(4px)" : "none",
                    }}
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 4,
                    }}>
                      <span style={{ fontSize: 20 }}>{b.emoji}</span>
                      <span style={{
                        fontSize: 13,
                        color: isHovered ? "#fff" : "#aaa",
                        minWidth: 160,
                        transition: "color 0.3s",
                      }}>
                        {b.name}
                      </span>
                      <span style={{
                        fontSize: 13,
                        color: "#ff4444",
                        fontWeight: 700,
                        minWidth: 80,
                      }}>
                        ${b.wealth}B
                      </span>
                      <div style={{ flex: 1, position: "relative", height: 32 }}>
                        <div style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width: animated ? `${barWidth}%` : "0%",
                          background: `linear-gradient(90deg, hsl(${5 + i * 3}, 80%, 50%), hsl(${5 + i * 3}, 70%, 40%))`,
                          borderRadius: 3,
                          transition: `width ${1 + i * 0.15}s cubic-bezier(0.16, 1, 0.3, 1)`,
                          boxShadow: isHovered ? `0 0 20px hsla(${5 + i * 3}, 80%, 50%, 0.4)` : "none",
                        }} />
                      </div>
                    </div>
                    {isHovered && (
                      <div style={{
                        marginLeft: 192,
                        fontSize: 12,
                        color: "#666",
                        paddingBottom: 4,
                      }}>
                        {b.company} · Equal to {householdsEquivalent.toLocaleString()} household-years of income at $165K
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Scale reference */}
            <div style={{
              marginTop: 40,
              padding: 28,
              background: "#111",
              border: "1px solid #1a1a1a",
              borderRadius: 8,
            }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#666", marginBottom: 12 }}>
                SCALE COMPARISON
              </div>
              <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 12, color: "#555" }}>If you earned $165K/yr and saved every cent:</div>
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ fontSize: 13, color: "#aaa" }}>
                      <span style={{ color: "#ff4444", fontWeight: 700 }}>After 100 years:</span> $16.5M
                      <span style={{ color: "#444" }}> — 0.002% of Musk's wealth</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#aaa" }}>
                      <span style={{ color: "#ff4444", fontWeight: 700 }}>After 1,000 years:</span> $165M
                      <span style={{ color: "#444" }}> — 0.02% of Musk's wealth</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#aaa" }}>
                      <span style={{ color: "#ff4444", fontWeight: 700 }}>After 1,000,000 years:</span> $165B
                      <span style={{ color: "#444" }}> — 23% of Musk's wealth</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#aaa" }}>
                      <span style={{ color: "#ff4444", fontWeight: 700 }}>To match Musk:</span> ~4.3 million years
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "perspective" && (
          <div style={{ animation: "fadeIn 0.6s ease" }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#666", marginBottom: 32 }}>
              PUTTING THE NUMBERS IN HUMAN TERMS
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Time comparisons */}
              {[
                {
                  icon: "🏠",
                  label: "HOMES",
                  stat: `${(totalBillionaireWealth * 1_000_000_000 / 400_000).toLocaleString(undefined, {maximumFractionDigits: 0})}`,
                  desc: "Median-priced US homes the top 10 could buy outright",
                  color: "#ff6644",
                },
                {
                  icon: "🎓",
                  label: "FULL-RIDE SCHOLARSHIPS",
                  stat: `${(totalBillionaireWealth * 1_000_000_000 / 200_000).toLocaleString(undefined, {maximumFractionDigits: 0})}`,
                  desc: "4-year university educations they could fully fund",
                  color: "#44aaff",
                },
                {
                  icon: "💳",
                  label: "SPENDING SPEED",
                  stat: "$1M / minute",
                  desc: `At $1M per minute, Elon Musk's wealth would last ${Math.round(714_200 / 525_960)} years of nonstop spending`,
                  color: "#ffcc33",
                },
                {
                  icon: "🌍",
                  label: "vs. COUNTRIES",
                  stat: "Larger than most GDPs",
                  desc: `$${(totalBillionaireWealth / 1000).toFixed(1)}T combined — exceeds the GDP of the UK, France, or India`,
                  color: "#44ff88",
                },
                {
                  icon: "📊",
                  label: "THE RATIO",
                  stat: `1 : ${Math.round(UMC_HOUSEHOLDS / 10).toLocaleString()}`,
                  desc: "For every 1 top-10 billionaire, there are 5.4 million upper-middle-class households",
                  color: "#cc66ff",
                },
                {
                  icon: "⏰",
                  label: "SECONDS IN CONTEXT",
                  stat: `$${Math.round(714_200_000_000 / 31_536_000).toLocaleString()}/sec`,
                  desc: "If Musk's wealth accumulated over one year, that's what he'd 'earn' every second — $22,639",
                  color: "#ff4488",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 20,
                    padding: 28,
                    background: "#111",
                    border: "1px solid #1a1a1a",
                    borderRadius: 8,
                    borderLeft: `3px solid ${item.color}`,
                    alignItems: "center",
                    opacity: animated ? 1 : 0,
                    transform: animated ? "translateY(0)" : "translateY(20px)",
                    transition: `all 0.6s ease ${i * 0.1}s`,
                  }}
                >
                  <div style={{ fontSize: 36, minWidth: 50 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: 3, color: "#555", marginBottom: 4 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: item.color }}>
                      {item.stat}
                    </div>
                    <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Dot Comparison */}
            <div style={{
              marginTop: 40,
              padding: 28,
              background: "#111",
              border: "1px solid #1a1a1a",
              borderRadius: 8,
            }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#666", marginBottom: 16 }}>
                VISUAL SCALE — EACH DOT = $1 BILLION
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "#ff4444", marginBottom: 8 }}>
                  Elon Musk — $714.2B ({Math.round(714.2)} dots)
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {Array.from({ length: Math.round(714.2) }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        backgroundColor: "#ff4444",
                        opacity: 0.7 + (i / 714) * 0.3,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#44aaff", marginBottom: 8 }}>
                  Average upper-middle-class household net worth — $0.00045B (invisible at this scale)
                </div>
                <div style={{
                  width: 1,
                  height: 1,
                  backgroundColor: "#44aaff",
                  borderRadius: "50%",
                  boxShadow: "0 0 4px #44aaff",
                }} />
                <div style={{ fontSize: 11, color: "#444", marginTop: 8 }}>
                  ↑ That's $450,000 — a single pixel you can barely see. At this scale, it would take 1.6 million of those dots to equal Musk's dots above.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: "24px 40px",
        borderTop: "1px solid #1a1a1a",
        fontSize: 11,
        color: "#333",
        display: "flex",
        justifyContent: "space-between",
      }}>
        <span>Sources: Forbes Billionaires Index (Jan 2026), U.S. Census Bureau, IBISWorld</span>
        <span>Net worth figures fluctuate daily with market conditions</span>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
