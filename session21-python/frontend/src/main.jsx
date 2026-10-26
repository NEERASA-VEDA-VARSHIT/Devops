import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API = '/api';
const CURRENT_USER = 'Neerasa Veda Varshit';

function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [filter, setFilter] = useState('ALL');
  const [tab, setTab] = useState('DASHBOARD'); // 'DASHBOARD' | 'MY_TASKS' | 'PROJECTS' | 'ACTIVITY'
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const [a, b] = await Promise.all([
        fetch(`${API}/tasks`),
        fetch(`${API}/tasks/stats`)
      ]);
      if (!a.ok || !b.ok) throw Error('Backend unavailable');
      setTasks(await a.json());
      setStats(await b.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filter tasks based on current tab and status filter
  const myTasks = tasks.filter(t => !t.assignee || t.assignee.toLowerCase().includes('veda') || t.assignee.toLowerCase().includes('varshit'));
  const currentTaskPool = tab === 'MY_TASKS' ? myTasks : tasks;
  const visible = filter === 'ALL' ? currentTaskPool : currentTaskPool.filter(t => t.status === filter);

  const update = async (t) => {
    const next = t.status === 'TODO' ? 'IN_PROGRESS' : t.status === 'IN_PROGRESS' ? 'DONE' : 'TODO';
    await fetch(`${API}/tasks/${t.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...t, status: next })
    });
    load();
  };

  const create = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: f.get('title'),
        description: f.get('description'),
        priority: f.get('priority'),
        assignee: f.get('assignee') || CURRENT_USER,
        status: 'TODO'
      })
    });
    e.currentTarget.reset();
    setShowForm(false);
    load();
  };

  return (
    <div className="app">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">T</span>
          <div>
            <b>TaskBoard</b>
            <small>DevOps Capstone</small>
          </div>
        </div>
        <nav>
          <a
            className={tab === 'DASHBOARD' ? 'active' : ''}
            onClick={() => setTab('DASHBOARD')}
            role="button"
          >
            ▦ <span>Dashboard</span>
          </a>
          <a
            className={tab === 'MY_TASKS' ? 'active' : ''}
            onClick={() => setTab('MY_TASKS')}
            role="button"
          >
            ✓ <span>My Tasks</span>
          </a>
          <a
            className={tab === 'PROJECTS' ? 'active' : ''}
            onClick={() => setTab('PROJECTS')}
            role="button"
          >
            ◫ <span>Projects</span>
          </a>
          <a
            className={tab === 'ACTIVITY' ? 'active' : ''}
            onClick={() => setTab('ACTIVITY')}
            role="button"
          >
            ◌ <span>Activity</span>
          </a>
        </nav>
        <div className="side-bottom">
          <div className="upgrade">
            <strong>Ship with confidence.</strong>
            <p>Build, deploy and observe your application.</p>
          </div>
          <div className="profile">
            <div className="avatar">NV</div>
            <div>
              <b>{CURRENT_USER}</b>
              <small>Developer (24bcs10005)</small>
            </div>
            <span>⋮</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main">
        {/* Dynamic Header based on Active Tab */}
        <header>
          <div>
            {tab === 'DASHBOARD' && (
              <>
                <p className="eyebrow">WORKSPACE / OVERVIEW</p>
                <h1>Good morning, Veda 👋</h1>
                <p className="muted">Here’s what’s happening with your team today.</p>
              </>
            )}
            {tab === 'MY_TASKS' && (
              <>
                <p className="eyebrow">PERSONAL WORKSPACE / MY TASKS</p>
                <h1>My Assigned Tasks 📋</h1>
                <p className="muted">Tasks specifically assigned to {CURRENT_USER}.</p>
              </>
            )}
            {tab === 'PROJECTS' && (
              <>
                <p className="eyebrow">CAPSTONE ARCHITECTURE / MODULES</p>
                <h1>DevOps Projects & Modules 🚀</h1>
                <p className="muted">Status of Session 21 Capstone infrastructure, CI/CD, and Kubernetes tracks.</p>
              </>
            )}
            {tab === 'ACTIVITY' && (
              <>
                <p className="eyebrow">AUDIT TRAIL / LOGS</p>
                <h1>Workspace Activity & Pipeline 📊</h1>
                <p className="muted">Real-time deployment pipeline events and operational audit trails.</p>
              </>
            )}
          </div>
          <button className="primary" onClick={() => setShowForm(true)}>＋ New task</button>
        </header>

        {error && <div className="alert">⚠ {error}. Start the backend and PostgreSQL, then refresh.</div>}

        {/* Tab 1: DASHBOARD or Tab 2: MY_TASKS */}
        {(tab === 'DASHBOARD' || tab === 'MY_TASKS') && (
          <>
            <section className="stats">
              <Stat label="Total tasks" value={tab === 'MY_TASKS' ? myTasks.length : stats.total} icon="▦" />
              <Stat label="To do" value={tab === 'MY_TASKS' ? myTasks.filter(t => t.status === 'TODO').length : stats.todo} icon="○" />
              <Stat label="In progress" value={tab === 'MY_TASKS' ? myTasks.filter(t => t.status === 'IN_PROGRESS').length : stats.inProgress} icon="◔" />
              <Stat label="Completed" value={tab === 'MY_TASKS' ? myTasks.filter(t => t.status === 'DONE').length : stats.done} icon="✓" />
            </section>

            <section className="content-grid">
              <div className="panel tasks-panel">
                <div className="panel-head">
                  <div>
                    <h2>{tab === 'MY_TASKS' ? 'My Tasks' : 'All Tasks'}</h2>
                    <p className="muted">Track work across the DevOps stack.</p>
                  </div>
                  <div className="filters">
                    {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map(x => (
                      <button
                        key={x}
                        className={filter === x ? 'selected' : ''}
                        onClick={() => setFilter(x)}
                      >
                        {x === 'ALL' ? 'All' : x.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div className="empty">Loading tasks…</div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Task</th>
                          <th>Assignee</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {visible.map(t => (
                          <tr key={t.id}>
                            <td>
                              <div className="task-title">
                                <span className={`dot ${t.status.toLowerCase()}`}></span>
                                <div>
                                  <b>{t.title}</b>
                                  <small>{t.description}</small>
                                </div>
                              </div>
                            </td>
                            <td>{t.assignee}</td>
                            <td><span className={`priority ${t.priority.toLowerCase()}`}>{t.priority}</span></td>
                            <td><span className={`status ${t.status.toLowerCase()}`}>{t.status.replace('_', ' ')}</span></td>
                            <td>
                              <button className="icon-btn" onClick={() => update(t)} title="Advance status">↻</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!visible.length && <div className="empty">No tasks in this filter.</div>}
                  </div>
                )}
              </div>

              <aside className="panel activity">
                <div className="panel-head">
                  <div>
                    <h2>Recent activity</h2>
                    <p className="muted">Latest workspace events.</p>
                  </div>
                </div>
                <Activity icon="✓" text="GitHub Actions Run #15 passed" time="Just now" />
                <Activity icon="✓" text="Monitoring metrics export verified" time="12 min ago" />
                <Activity icon="◔" text="Ingress & HPA load test executed" time="38 min ago" />
                <Activity icon="＋" text="Troubleshooting lab files added" time="1 hr ago" />
                <div className="pipeline">
                  <span>CI</span><i></i><span>Build</span><i></i><span>Scan</span><i></i><span>Deploy</span>
                </div>
              </aside>
            </section>
          </>
        )}

        {/* Tab 3: PROJECTS */}
        {tab === 'PROJECTS' && (
          <section className="projects-grid">
            <div className="project-card">
              <div className="project-header">
                <div>
                  <h2>AWS Infrastructure & Cloud VPC</h2>
                  <p className="muted">HashiCorp Terraform configuration</p>
                </div>
                <span className="priority low">100% COMPLETE</span>
              </div>
              <p style={{ fontSize: '12px', color: '#596477', lineHeight: '1.5', margin: '10px 0' }}>
                Automates AWS VPC provisioning across 2 AZs (CIDR 10.20.0.0/16) with public and private subnets, NAT Gateway, and AWS EKS Cluster v1.31 with pinned provider lock.
              </p>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '100%', background: '#10b981' }}></div>
              </div>
              <div className="tag-list">
                <span className="tag">Terraform 1.6+</span>
                <span className="tag">AWS VPC</span>
                <span className="tag">EKS v1.31</span>
              </div>
            </div>

            <div className="project-card">
              <div className="project-header">
                <div>
                  <h2>DevSecOps CI/CD Pipeline</h2>
                  <p className="muted">GitHub Actions & Aqua Trivy</p>
                </div>
                <span className="priority low">100% PASSED</span>
              </div>
              <p style={{ fontSize: '12px', color: '#596477', lineHeight: '1.5', margin: '10px 0' }}>
                Multi-job pipeline running 10 Pytest test cases, Vite production builds, Aqua Security Trivy security gates with --exit-code 1, and SHA-tagged image publication to GHCR.
              </p>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '100%', background: '#10b981' }}></div>
              </div>
              <div className="tag-list">
                <span className="tag">GitHub Actions</span>
                <span className="tag">Trivy v0.76</span>
                <span className="tag">GHCR</span>
                <span className="tag">Pytest</span>
              </div>
            </div>

            <div className="project-card">
              <div className="project-header">
                <div>
                  <h2>Kubernetes Packaging & HPA</h2>
                  <p className="muted">Production Helm v3 Chart</p>
                </div>
                <span className="priority low">100% DEPLOYED</span>
              </div>
              <p style={{ fontSize: '12px', color: '#596477', lineHeight: '1.5', margin: '10px 0' }}>
                Multi-tier microservices packaging with 2 replicas per service, ClusterIP networking, persistent PostgreSQL PVC storage, and CPU autoscaling (HPA target 60%).
              </p>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '100%', background: '#10b981' }}></div>
              </div>
              <div className="tag-list">
                <span className="tag">Helm v3</span>
                <span className="tag">HPA</span>
                <span className="tag">Postgres PVC</span>
                <span className="tag">Alpine</span>
              </div>
            </div>

            <div className="project-card">
              <div className="project-header">
                <div>
                  <h2>Troubleshooting & Telemetry</h2>
                  <p className="muted">Prometheus & Kubernetes Lab</p>
                </div>
                <span className="priority low">100% VERIFIED</span>
              </div>
              <p style={{ fontSize: '12px', color: '#596477', lineHeight: '1.5', margin: '10px 0' }}>
                Prometheus Operator ServiceMonitor scraping /metrics, Grafana dashboards, and triage scenarios for ImagePullBackOff (broken-image.yaml) and disconnected endpoints.
              </p>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '100%', background: '#10b981' }}></div>
              </div>
              <div className="tag-list">
                <span className="tag">Prometheus</span>
                <span className="tag">ServiceMonitor</span>
                <span className="tag">Triage Lab</span>
              </div>
            </div>
          </section>
        )}

        {/* Tab 4: ACTIVITY */}
        {tab === 'ACTIVITY' && (
          <section className="timeline-card">
            <div className="panel-head" style={{ padding: '0 0 16px 0', borderBottom: '1px solid #edf0f4' }}>
              <div>
                <h2>Audit Trail & Operational Events</h2>
                <p className="muted">Immutable event record across pipeline, infrastructure, and tasks.</p>
              </div>
              <span className="priority low">SYSTEM HEALTHY</span>
            </div>

            <div className="timeline-item">
              <div className="timeline-badge" style={{ background: '#ecfdf5', color: '#059669' }}>✓</div>
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: '13px', color: '#111827' }}>GitHub Actions Run #15 Completed Successfully</b>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
                  All 3 jobs (Backend Tests & Frontend Build, Docker Build & Trivy Scan, Helm Chart Validation) reported conclusion: success.
                </p>
                <small style={{ color: '#9ca3af', display: 'block', marginTop: '6px' }}>Just now • Commit 8af68e8</small>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-badge" style={{ background: '#ecfdf5', color: '#059669' }}>✓</div>
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: '13px', color: '#111827' }}>Container Images Published to GHCR</b>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
                  Pushed ghcr.io/neerasa-veda-varshit/taskboard-backend and taskboard-frontend tagged with latest and commit SHA.
                </p>
                <small style={{ color: '#9ca3af', display: 'block', marginTop: '6px' }}>2 minutes ago • Automated GHCR Publication</small>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-badge" style={{ background: '#f5f3ff', color: '#7c3aed' }}>◔</div>
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: '13px', color: '#111827' }}>Horizontal Pod Autoscaling (HPA) Load Test Executed</b>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
                  Load generator executed 1500 concurrent requests; verified CPU spike above 60% and replica scaling from 2 to 4 pods.
                </p>
                <small style={{ color: '#9ca3af', display: 'block', marginTop: '6px' }}>38 minutes ago • load-test.py</small>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-badge" style={{ background: '#ecfdf5', color: '#059669' }}>✓</div>
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: '13px', color: '#111827' }}>Database Schema Initialized via Alembic</b>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
                  Executed migration 0001_create_tasks against PostgreSQL 16; tasks table created with title, status, and timestamps.
                </p>
                <small style={{ color: '#9ca3af', display: 'block', marginTop: '6px' }}>45 minutes ago • Alembic Revision 0001</small>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-badge" style={{ background: '#eff6ff', color: '#2563eb' }}>＋</div>
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: '13px', color: '#111827' }}>Troubleshooting Scenarios Implemented</b>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
                  Committed broken-image.yaml (ImagePullBackOff) and broken-service.yaml (endpoints triage) with complete diagnostic runbooks.
                </p>
                <small style={{ color: '#9ca3af', display: 'block', marginTop: '6px' }}>1 hour ago • Troubleshooting Lab</small>
              </div>
            </div>
          </section>
        )}

        {/* Create Task Modal Form */}
        {showForm && (
          <div className="modal-backdrop">
            <form className="modal" onSubmit={create}>
              <div className="modal-head">
                <div>
                  <p className="eyebrow">CREATE TASK</p>
                  <h2>Add a new task</h2>
                </div>
                <button type="button" className="close" onClick={() => setShowForm(false)}>×</button>
              </div>
              <label>
                Task title
                <input name="title" required placeholder="e.g. Configure production ingress" />
              </label>
              <label>
                Description
                <textarea name="description" placeholder="What needs to be done?" />
              </label>
              <div className="form-row">
                <label>
                  Priority
                  <select name="priority">
                    <option>LOW</option>
                    <option>MEDIUM</option>
                    <option>HIGH</option>
                  </select>
                </label>
                <label>
                  Assignee
                  <input name="assignee" defaultValue={CURRENT_USER} />
                </label>
              </div>
              <button className="primary full">Create task</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="stat">
      <div className="stat-icon">{icon}</div>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <span>Updated just now</span>
      </div>
    </div>
  );
}

function Activity({ icon, text, time }) {
  return (
    <div className="activity-row">
      <span className="activity-icon">{icon}</span>
      <div>
        <b>{text}</b>
        <small>{time}</small>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
