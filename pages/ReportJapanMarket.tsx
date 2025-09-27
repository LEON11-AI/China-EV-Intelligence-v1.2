import React, { useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const ReportJapanMarket: React.FC = () => {
  useEffect(() => {
    let evSalesChart: Chart | null = null;
    let costChart: Chart | null = null;
    let globalChart: Chart | null = null;

    const initializeCharts = () => {
      console.log('DOM loaded, initializing charts...');
      
      try {
        // EV Sales Trend Chart (2023-2025)
        const evSalesCtx = document.getElementById('evSalesChart') as HTMLCanvasElement;
        if (evSalesCtx) {
          evSalesChart = new Chart(evSalesCtx, {
            type: 'line',
            data: {
              labels: ['Jan 2023', 'Apr 2023', 'Jul 2023', 'Oct 2023', 'Jan 2024', 'Apr 2024', 'Jul 2024', 'Oct 2024', 'Jan 2025', 'Apr 2025', 'Jul 2025'],
              datasets: [{
                label: 'EV Sales (Units)',
                data: [5200, 4800, 4500, 4200, 4600, 4300, 4100, 3900, 4200, 3800, 3600],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                fill: true,
                tension: 0.4
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'top'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Monthly Sales (Units)'
                  }
                }
              }
            }
          });
        }

        // Total Cost of Ownership Comparison
        const costCtx = document.getElementById('costComparisonChart') as HTMLCanvasElement;
        if (costCtx) {
          costChart = new Chart(costCtx, {
            type: 'bar',
            data: {
              labels: ['Purchase Price', 'Fuel/Energy', 'Maintenance', 'Insurance', 'Depreciation'],
              datasets: [{
                label: 'EV',
                data: [45000, 8000, 3000, 12000, 18000],
                backgroundColor: '#3498db'
              }, {
                label: 'ICE',
                data: [35000, 15000, 8000, 10000, 15000],
                backgroundColor: '#e74c3c'
              }, {
                label: 'Hybrid',
                data: [40000, 10000, 5000, 11000, 16000],
                backgroundColor: '#f39c12'
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'top'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Cost (USD)'
                  }
                }
              }
            }
          });
        }

        // Global EV Adoption Rates Comparison
        const globalCtx = document.getElementById('globalAdoptionChart') as HTMLCanvasElement;
        if (globalCtx) {
          globalChart = new Chart(globalCtx, {
            type: 'doughnut',
            data: {
              labels: ['China', 'Europe', 'USA', 'Japan', 'Others'],
              datasets: [{
                label: 'EV Penetration Rate (%)',
                data: [35.2, 22.8, 9.1, 1.4, 8.5],
                backgroundColor: [
                  '#e74c3c',
                  '#3498db', 
                  '#f39c12',
                  '#9b59b6',
                  '#95a5a6'
                ],
                borderWidth: 2,
                borderColor: '#fff'
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'right'
                },
                tooltip: {
                  callbacks: {
                    label: function(context: any) {
                      return context.label + ': ' + context.parsed + '%';
                    }
                  }
                }
              }
            }
          });
        }
        
        console.log('All charts initialized successfully');
        
      } catch (error) {
        console.error('Error initializing charts:', error);
      }
    };

    initializeCharts();

    // Cleanup function to destroy charts
    return () => {
      if (evSalesChart) {
        evSalesChart.destroy();
      }
      if (costChart) {
        costChart.destroy();
      }
      if (globalChart) {
        globalChart.destroy();
      }
    };
  }, []);

  return (
    <div className="report-japan-market">
      <style>{`
        .report-japan-market {
          font-family: 'Georgia', 'Times New Roman', serif;
          line-height: 1.8;
          color: #2c3e50;
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
          background-color: #fafafa;
        }
        .article-header {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: white;
          padding: 40px;
          border-radius: 15px;
          text-align: center;
          margin-bottom: 40px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .article-header h1 {
          font-size: 2.5em;
          margin: 0 0 15px 0;
          font-weight: 700;
        }
        .article-meta {
          font-size: 1.1em;
          opacity: 0.9;
          margin-top: 20px;
        }
        .content-section {
          background: white;
          padding: 40px;
          border-radius: 15px;
          margin-bottom: 30px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.08);
        }
        .content-section h2 {
          color: #1e3c72;
          font-size: 1.8em;
          margin-bottom: 25px;
          border-bottom: 3px solid #3498db;
          padding-bottom: 10px;
        }
        .content-section h3 {
          color: #2c3e50;
          font-size: 1.4em;
          margin: 30px 0 20px 0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }
        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .stat-number {
          font-size: 2.2em;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .stat-label {
          font-size: 0.9em;
          opacity: 0.9;
        }
        .chart-container {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 12px;
          margin: 30px 0;
          text-align: center;
          border: 2px dashed #dee2e6;
        }
        .chart-placeholder {
          font-size: 1.2em;
          color: #6c757d;
          margin-bottom: 15px;
        }
        .key-points {
          background: #e8f4fd;
          border-left: 5px solid #3498db;
          padding: 25px;
          margin: 30px 0;
          border-radius: 0 10px 10px 0;
        }
        .key-points h4 {
          color: #1e3c72;
          margin-top: 0;
          font-size: 1.3em;
        }
        .conclusion {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white;
          padding: 30px;
          border-radius: 15px;
          margin-top: 40px;
        }
        .conclusion h3 {
          color: white;
          margin-top: 0;
        }
        .highlight {
          background: #fff3cd;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #ffc107;
          margin: 20px 0;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin: 25px 0;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        .data-table th {
          background: #1e3c72;
          color: white;
          padding: 15px;
          text-align: left;
        }
        .data-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #eee;
        }
        .data-table tr:nth-child(even) {
          background: #f8f9fa;
        }
      `}</style>
      
      <div className="article-header">
        <h1>The REAL Reason Japan is Rejecting Electric Cars</h1>
        <div className="article-meta">
          <strong>Published:</strong> September 27, 2025 | <strong>Analysis by:</strong> China EV Intelligence
        </div>
      </div>

      <div className="content-section">
        <h2>Executive Summary</h2>
        <p>Japan's electric vehicle market is facing unprecedented challenges. In the first half of 2025, Japan's EV sales declined by 7% year-over-year, marking the second consecutive year of decline. This comprehensive analysis reveals the underlying factors behind Japan's resistance to electric vehicle adoption.</p>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">-7%</div>
            <div className="stat-label">H1 2025 EV Sales Decline</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">1.4%</div>
            <div className="stat-label">EV Market Penetration</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">-20%</div>
            <div className="stat-label">February 2025 YoY Decline</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">16</div>
            <div className="stat-label">Consecutive Months of Contraction</div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>Market Performance Data</h2>
        
        <div className="chart-container">
          <h4 style={{textAlign: 'center', marginBottom: '20px', color: '#1e3c72'}}>📊 EV Sales Trend Chart (2023-2025)</h4>
          <canvas id="evSalesChart" width="400" height="200"></canvas>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>EV Sales (Units)</th>
              <th>Total Car Sales</th>
              <th>EV Penetration Rate</th>
              <th>YoY Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jan-Aug 2025</td>
              <td>33,600</td>
              <td>2,410,000</td>
              <td>1.4%</td>
              <td>-7.2%</td>
            </tr>
            <tr>
              <td>Feb 2025</td>
              <td>4,390</td>
              <td>312,000</td>
              <td>1.4%</td>
              <td>-20.0%</td>
            </tr>
            <tr>
              <td>Jan-Aug 2024</td>
              <td>36,200</td>
              <td>2,380,000</td>
              <td>1.5%</td>
              <td>-3.1%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="content-section">
        <h2>Root Causes Analysis</h2>
        
        <h3>1. Infrastructure Challenges</h3>
        <div className="key-points">
          <h4>🔌 Charging Infrastructure Gaps</h4>
          <ul>
            <li>Limited fast-charging network coverage in rural areas</li>
            <li>Apartment dwellers face home charging installation barriers</li>
            <li>High electricity costs compared to gasoline</li>
            <li>Inconsistent charging standards across manufacturers</li>
          </ul>
        </div>

        <h3>2. Cultural and Consumer Preferences</h3>
        <div className="highlight">
          <strong>Key Insight:</strong> Japanese consumers prioritize reliability and proven technology over cutting-edge innovation, creating resistance to EV adoption.
        </div>
        
        <ul>
          <li><strong>Hybrid Heritage:</strong> Strong preference for proven hybrid technology (Toyota Prius legacy)</li>
          <li><strong>Range Anxiety:</strong> Concerns about long-distance travel capabilities</li>
          <li><strong>Brand Loyalty:</strong> Deep trust in traditional Japanese automakers</li>
          <li><strong>Conservative Adoption:</strong> Preference for mature, tested technologies</li>
        </ul>

        <h3>3. Economic Factors</h3>
        <div className="chart-container">
          <h4 style={{textAlign: 'center', marginBottom: '20px', color: '#1e3c72'}}>💰 Total Cost of Ownership Comparison</h4>
          <canvas id="costComparisonChart" width="400" height="200"></canvas>
        </div>

        <ul>
          <li>Higher upfront purchase costs for EVs</li>
          <li>Limited government incentives compared to other markets</li>
          <li>Uncertain resale values for electric vehicles</li>
          <li>Battery replacement cost concerns</li>
        </ul>
      </div>

      <div className="content-section">
        <h2>Industry Response and Strategic Implications</h2>
        
        <h3>Automaker Strategies</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">Toyota</div>
            <div className="stat-label">Hybrid-First Approach</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">Nissan</div>
            <div className="stat-label">EV Pioneer Struggling</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">Honda</div>
            <div className="stat-label">Cautious EV Rollout</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">Mazda</div>
            <div className="stat-label">ICE Optimization Focus</div>
          </div>
        </div>

        <h3>Government Policy Impact</h3>
        <p>Japan's approach to EV adoption differs significantly from China and Europe:</p>
        <ul>
          <li><strong>Technology Neutrality:</strong> Support for multiple powertrain technologies</li>
          <li><strong>Gradual Transition:</strong> No aggressive ICE phase-out timeline</li>
          <li><strong>Hydrogen Investment:</strong> Significant resources allocated to fuel cell technology</li>
          <li><strong>Industrial Protection:</strong> Policies favoring domestic automaker interests</li>
        </ul>
      </div>

      <div className="content-section">
        <h2>Global Context and Competitive Analysis</h2>
        
        <div className="chart-container">
          <h4 style={{textAlign: 'center', marginBottom: '20px', color: '#1e3c72'}}>🌍 Global EV Adoption Rates Comparison</h4>
          <canvas id="globalAdoptionChart" width="400" height="200"></canvas>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Market</th>
              <th>2025 EV Penetration</th>
              <th>YoY Growth</th>
              <th>Key Drivers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>China</td>
              <td>35.2%</td>
              <td>+12.3%</td>
              <td>Government mandates, local brands</td>
            </tr>
            <tr>
              <td>Europe</td>
              <td>22.8%</td>
              <td>+8.7%</td>
              <td>Emissions regulations, incentives</td>
            </tr>
            <tr>
              <td>USA</td>
              <td>9.1%</td>
              <td>+15.2%</td>
              <td>Tesla leadership, state policies</td>
            </tr>
            <tr>
              <td><strong>Japan</strong></td>
              <td><strong>1.4%</strong></td>
              <td><strong>-7.0%</strong></td>
              <td><strong>Hybrid preference, infrastructure</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="conclusion">
        <h3>🎯 Key Takeaways and Future Outlook</h3>
        <p><strong>Japan's EV resistance stems from a unique combination of cultural preferences, infrastructure challenges, and strategic industrial policies.</strong></p>
        
        <h4>Critical Success Factors for EV Adoption in Japan:</h4>
        <ol>
          <li><strong>Infrastructure Investment:</strong> Massive charging network expansion required</li>
          <li><strong>Cost Parity:</strong> EVs must reach price competitiveness with hybrids</li>
          <li><strong>Range Improvement:</strong> Technology advances to address range anxiety</li>
          <li><strong>Cultural Shift:</strong> Gradual change in consumer preferences toward sustainability</li>
          <li><strong>Government Support:</strong> Enhanced incentives and supportive policies</li>
        </ol>
        
        <p><em>Japan's EV market represents both a significant challenge and opportunity for global automakers. Success requires understanding and adapting to unique local market dynamics.</em></p>
      </div>

      <div style={{textAlign: 'center', marginTop: '40px', padding: '20px', background: '#f8f9fa', borderRadius: '10px'}}>
        <p style={{color: '#6c757d', margin: '0'}}>📊 <strong>China EV Intelligence</strong> | Comprehensive Analysis &amp; Market Insights</p>
        <p style={{color: '#6c757d', fontSize: '0.9em', margin: '5px 0 0 0'}}>Data sources: Japan Automobile Dealers Association, Japan Mini Vehicles Association, Industry Analysis</p>
      </div>
    </div>
  );
};

export default ReportJapanMarket;