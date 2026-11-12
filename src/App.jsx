import { useState } from "react";
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users, BarChart3,
  Plus, Search, Bell, ChevronDown, ChevronRight, CalendarDays,
  Clock, AlertTriangle, CheckCircle2, Circle, MoreHorizontal,
  X, ArrowUpRight, Activity, Target, TrendingUp, Menu,
  ClipboardList, UserPlus, Trash2, Pencil, Download,
} from "lucide-react";
import "./App.css";

const initialMembers = [
  { id: 1, name: "Vivan Garg", role: "Frontend Developer", initials: "VG", color: "purple" },
  { id: 2, name: "Aarav Mehta", role: "Backend Developer", initials: "AM", color: "blue" },
  { id: 3, name: "Ishita Sharma", role: "UI/UX Designer", initials: "IS", color: "pink" },
  { id: 4, name: "Rohan Gupta", role: "Research & Testing", initials: "RG", color: "orange" },
];

const initialProjects = [
  {
    id: 1,
    name: "Smart Campus Portal",
    description: "A centralized platform for improving student campus life.",
    category: "Web Development",
    color: "purple",
    deadline: "2026-11-20",
    members: [1, 2, 3, 4],
    tasks: [
      { id: 101, title: "Design dashboard UI", memberId: 3, priority: "High", status: "Done", deadline: "2026-11-10", hours: 6 },
      { id: 102, title: "Build authentication flow", memberId: 2, priority: "High", status: "In Progress", deadline: "2026-11-12", hours: 8 },
      { id: 103, title: "Create project overview", memberId: 1, priority: "Medium", status: "In Progress", deadline: "2026-11-14", hours: 5 },
      { id: 104, title: "Research user requirements", memberId: 4, priority: "Medium", status: "Done", deadline: "2026-11-11", hours: 4 },
      { id: 105, title: "Integrate frontend and backend", memberId: 2, priority: "High", status: "Todo", deadline: "2026-11-18", hours: 10 },
      { id: 106, title: "Prepare final presentation", memberId: 1, priority: "Low", status: "Todo", deadline: "2026-11-19", hours: 3 },
    ],
  },
  {
    id: 2,
    name: "Campus Event Planner",
    description: "Simplify event planning and student registrations.",
    category: "App Development",
    color: "blue",
    deadline: "2026-11-25",
    members: [1, 3, 4],
    tasks: [
      { id: 201, title: "Create event wireframes", memberId: 3, priority: "Medium", status: "Done", deadline: "2026-11-12", hours: 5 },
      { id: 202, title: "Build registration page", memberId: 1, priority: "High", status: "In Progress", deadline: "2026-11-18", hours: 7 },
      { id: 203, title: "Collect event requirements", memberId: 4, priority: "Low", status: "Todo", deadline: "2026-11-20", hours: 4 },
    ],
  },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Projects", icon: FolderKanban },
  { label: "Task Board", icon: CheckSquare },
  { label: "Team Workload", icon: Users },
  { label: "Contribution Report", icon: BarChart3 },
];

const statusOptions = ["Todo", "In Progress", "Done"];
const priorityOptions = ["Low", "Medium", "High"];

function App() {
  const [page, setPage] = useState("Overview");
  const [projects, setProjects] = useState(initialProjects);
  const [activeProjectId, setActiveProjectId] = useState(1);
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState("");

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const tasks = activeProject?.tasks || [];

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const updateProject = (projectId, updater) => {
    setProjects((prev) => prev.map((p) => p.id === projectId ? updater(p) : p));
  };

  const updateTask = (taskId, updates) => {
    updateProject(activeProject.id, (p) => ({
      ...p,
      tasks: p.tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t),
    }));
  };

  const addTask = (task) => {
    updateProject(activeProject.id, (p) => ({
      ...p,
      tasks: [...p.tasks, { ...task, id: Date.now() }],
    }));
    setModal(null);
    notify("Task created successfully!");
  };

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now(),
      members: [1, 2, 3, 4],
      tasks: [],
    };
    setProjects((prev) => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    setModal(null);
    setPage("Projects");
    notify("Project created!");
  };

  const addMember = (member) => {
    const newMember = { ...member, id: Date.now() };
    setMembers((prev) => [...prev, newMember]);
    updateProject(activeProject.id, (p) => ({
      ...p,
      members: [...p.members, newMember.id],
    }));
    setModal(null);
    notify("Team member added!");
  };

  const projectMembers = members.filter((m) => activeProject.members.includes(m.id));
  const doneCount = tasks.filter((t) => t.status === "Done").length;
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
  const totalHours = tasks.reduce((sum, t) => sum + (Number(t.hours) || 0), 0);
  const completedHours = tasks.filter((t) => t.status === "Done").reduce((sum, t) => sum + (Number(t.hours) || 0), 0);
  const overdueTasks = tasks.filter((t) => t.status !== "Done" && new Date(t.deadline) < new Date("2026-11-09"));

  const memberStats = projectMembers.map((member) => {
    const assigned = tasks.filter((t) => t.memberId === member.id);
    const completed = assigned.filter((t) => t.status === "Done");
    const hours = assigned.reduce((sum, t) => sum + Number(t.hours || 0), 0);
    const finishedHours = completed.reduce((sum, t) => sum + Number(t.hours || 0), 0);
    return {
      ...member,
      assigned: assigned.length,
      completed: completed.length,
      hours,
      finishedHours,
      progress: assigned.length ? Math.round(completed.length / assigned.length * 100) : 0,
    };
  });

  const maxHours = Math.max(1, ...memberStats.map((m) => m.hours));

  const pageSubtitle = {
    Overview: "Here's what's happening with your team projects.",
    Projects: "Manage projects, deadlines, and team members.",
    "Task Board": "Keep every task moving and every responsibility clear.",
    "Team Workload": "Understand who's doing what and prevent burnout.",
    "Contribution Report": "A transparent overview of individual contributions.",
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Activity size={22} /></div>
          <div>
            <strong>Group<span>Guard</span></strong>
            <small>Teamwork, made fair.</small>
          </div>
        </div>

        <div className="workspace">
          <div className="workspace-avatar">GG</div>
          <div><strong>Student Workspace</strong><span>College Projects</span></div>
          <ChevronDown size={15} />
        </div>

        <div className="nav-label">WORKSPACE</div>
        <nav>
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${page === item.label ? "active" : ""}`}
              onClick={() => { setPage(item.label); setMobileOpen(false); }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.label === "Task Board" && <span className="nav-count">{tasks.length}</span>}
            </button>
          ))}
        </nav>

        <div className="nav-label projects-label">YOUR PROJECTS</div>
        <div className="sidebar-projects">
          {projects.map((p) => (
            <button
              key={p.id}
              className={`project-nav ${activeProjectId === p.id ? "selected" : ""}`}
              onClick={() => { setActiveProjectId(p.id); setPage("Overview"); }}
            >
              <span className={`project-dot ${p.color}`} />
              <span>{p.name}</span>
            </button>
          ))}
          <button className="add-project-nav" onClick={() => setModal("project")}>
            <Plus size={15} /> Add project
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="fairness-tip">
            <Target size={18} />
            <strong>Fairness starts with clarity</strong>
            <p>Keep tasks visible, responsibilities clear, and conversations open.</p>
          </div>
          <div className="profile">
            <div className="profile-avatar">VG</div>
            <div><strong>Vivan Garg</strong><span>Project Lead</span></div>
            <button onClick={() => notify("Settings coming soon")}><MoreHorizontal size={18} /></button>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={20} /></button>
          <div className="breadcrumb">Workspace <ChevronRight size={14} /> <strong>{page}</strong></div>
          <div className="top-right">
            <div className="top-search"><Search size={16} /><input placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <button className="icon-button" onClick={() => notify("You're all caught up!")}><Bell size={18} /><i /></button>
            <div className="top-avatar">VG</div>
          </div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div>
              <span className="eyebrow">GROUPGUARD · PROJECT WORKSPACE</span>
              <h1>{page === "Overview" ? "Team Overview 👋" : page}</h1>
              <p>{pageSubtitle[page]}</p>
            </div>
            <div className="heading-actions">
              <select className="project-select" value={activeProjectId} onChange={(e) => setActiveProjectId(Number(e.target.value))}>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button className="primary-btn" onClick={() => setModal("task")}><Plus size={16} /> Add task</button>
            </div>
          </div>

          {page === "Overview" && (
            <>
              <div className="hero">
                <div className="hero-content">
                  <div className="hero-tag"><Activity size={14} /> TEAM HEALTH CHECK</div>
                  <h2>Great projects start<br />with <span>fair teamwork.</span></h2>
                  <p>Track responsibilities, balance workloads, and keep everyone accountable without the awkward conversations.</p>
                  <button className="hero-btn" onClick={() => setPage("Team Workload")}>Check team workload <ArrowUpRight size={15} /></button>
                </div>
                <div className="hero-visual">
                  <div className="hero-ring ring-one" /><div className="hero-ring ring-two" />
                  <div className="hero-art">⚖️</div>
                  <div className="floating-progress"><CheckCircle2 size={18}/><div><strong>{progress}% completed</strong><span>Project progress</span></div></div>
                  <div className="floating-team"><Users size={17}/><div><strong>{projectMembers.length} members</strong><span>Working together</span></div></div>
                </div>
              </div>

              <div className="stats-grid">
                <Stat icon={<ClipboardList />} label="Total tasks" value={tasks.length} note="Across this project" color="purple" />
                <Stat icon={<CheckCircle2 />} label="Completed" value={doneCount} note={`${progress}% project progress`} color="green" />
                <Stat icon={<Clock />} label="Estimated workload" value={`${totalHours}h`} note={`${completedHours}h completed`} color="blue" />
                <Stat icon={<AlertTriangle />} label="Overdue tasks" value={overdueTasks.length} note="Need attention" color="orange" />
              </div>

              <div className="overview-grid">
                <section className="panel">
                  <div className="panel-title">
                    <div><h2>Task overview</h2><p>Current project progress at a glance</p></div>
                    <button className="link-btn" onClick={() => setPage("Task Board")}>View board <ArrowUpRight size={14}/></button>
                  </div>
                  <div className="progress-overview">
                    <div className="progress-circle" style={{ "--progress": `${progress * 3.6}deg` }}>
                      <div><strong>{progress}%</strong><span>complete</span></div>
                    </div>
                    <div className="progress-legend">
                      <Legend color="green" label="Completed" value={doneCount} />
                      <Legend color="blue" label="In progress" value={tasks.filter(t => t.status === "In Progress").length} />
                      <Legend color="gray" label="To do" value={tasks.filter(t => t.status === "Todo").length} />
                    </div>
                  </div>
                  <div className="mini-task-list">
                    {tasks.slice(0, 4).map((task) => <TaskLine key={task.id} task={task} member={members.find(m => m.id === task.memberId)} />)}
                  </div>
                </section>

                <section className="panel">
                  <div className="panel-title">
                    <div><h2>Contribution balance</h2><p>Estimated hours by team member</p></div>
                    <button className="link-btn" onClick={() => setPage("Team Workload")}>Details <ArrowUpRight size={14}/></button>
                  </div>
                  <div className="workload-mini">
                    {memberStats.map((m) => (
                      <div className="workload-row" key={m.id}>
                        <div className={`member-avatar ${m.color}`}>{m.initials}</div>
                        <div className="workload-info"><strong>{m.name}</strong><div className="bar-track"><div className={`bar-fill ${m.color}`} style={{width: `${m.hours / maxHours * 100}%`}} /></div></div>
                        <span className="hours-label">{m.hours}h</span>
                      </div>
                    ))}
                  </div>
                  <div className="balance-note"><AlertTriangle size={15}/><span>Compare workload estimates with actual team availability.</span></div>
                </section>
              </div>

              <div className="section-title"><div><h2>Team members</h2><p>Who's contributing to this project</p></div><button className="secondary-btn" onClick={() => setModal("member")}><UserPlus size={15}/> Add member</button></div>
              <div className="team-grid">
                {memberStats.map((m) => <MemberCard key={m.id} member={m} />)}
              </div>
            </>
          )}

          {page === "Projects" && (
            <>
              <div className="project-cards">
                {projects.map((p) => {
                  const complete = p.tasks.filter(t => t.status === "Done").length;
                  const pct = p.tasks.length ? Math.round(complete / p.tasks.length * 100) : 0;
                  return (
                    <div className="project-card" key={p.id}>
                      <div className="project-card-top"><span className={`project-icon ${p.color}`}><FolderKanban size={20}/></span><button className="icon-button" onClick={() => notify("Project options coming soon")}><MoreHorizontal size={18}/></button></div>
                      <span className="category-tag">{p.category}</span>
                      <h3>{p.name}</h3><p>{p.description}</p>
                      <div className="project-members">{members.filter(m => p.members.includes(m.id)).slice(0,4).map(m => <div className={`member-avatar small ${m.color}`} key={m.id}>{m.initials}</div>)}<span>{p.members.length} members</span></div>
                      <div className="project-progress-label"><span>Progress</span><strong>{pct}%</strong></div>
                      <div className="bar-track big"><div className={`bar-fill ${p.color}`} style={{width: `${pct}%`}}/></div>
                      <div className="project-card-footer"><span><CalendarDays size={14}/> Due {p.deadline}</span><button className="link-btn" onClick={() => {setActiveProjectId(p.id);setPage("Overview");}}>Open project <ChevronRight size={14}/></button></div>
                    </div>
                  );
                })}
                <button className="new-project-card" onClick={() => setModal("project")}><div><Plus size={24}/></div><strong>Create a new project</strong><span>Start organizing your next team assignment</span></button>
              </div>
            </>
          )}

          {page === "Task Board" && (
            <div className="board">
              {statusOptions.map((status) => {
                const statusTasks = tasks.filter(t => t.status === status && `${t.title} ${t.priority}`.toLowerCase().includes(search.toLowerCase()));
                return (
                  <div className="board-column" key={status}>
                    <div className="column-heading"><div className={`column-dot ${status.replace(" ", "-").toLowerCase()}`}/><strong>{status}</strong><span>{statusTasks.length}</span><button onClick={() => setModal("task")}><Plus size={15}/></button></div>
                    {statusTasks.map((task) => {
                      const member = members.find(m => m.id === task.memberId);
                      return <div className="task-card" key={task.id}>
                        <div className="task-card-top"><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority} priority</span><button onClick={() => updateTask(task.id, {status: status === "Todo" ? "In Progress" : status === "In Progress" ? "Done" : "Todo"})}><MoreHorizontal size={16}/></button></div>
                        <h3>{task.title}</h3>
                        <div className="task-card-meta"><span><CalendarDays size={13}/>{task.deadline}</span><span><Clock size={13}/>{task.hours}h</span></div>
                        <div className="task-card-bottom"><div className={`member-avatar small ${member?.color || "purple"}`}>{member?.initials || "?"}</div><span>{member?.name || "Unassigned"}</span><button className="status-change" onClick={() => updateTask(task.id, {status: status === "Todo" ? "In Progress" : status === "In Progress" ? "Done" : "Todo"})}>{status === "Done" ? <CheckCircle2 size={16}/> : <Circle size={16}/>}</button></div>
                      </div>;
                    })}
                    <button className="add-task-column" onClick={() => setModal("task")}><Plus size={15}/> Add task</button>
                  </div>
                );
              })}
            </div>
          )}

          {page === "Team Workload" && (
            <>
              <div className="workload-banner"><div><span className="eyebrow">WORKLOAD ANALYSIS</span><h2>Balance the load, protect the team.</h2><p>Compare estimated hours across team members. Uneven workloads are a signal to discuss—not a verdict on effort.</p></div><div className="workload-banner-icon"><BarChart3 size={38}/></div></div>
              <div className="stats-grid">
                <Stat icon={<Users/>} label="Team members" value={projectMembers.length} note="Active project team" color="purple"/>
                <Stat icon={<Clock/>} label="Total estimated hours" value={`${totalHours}h`} note="All assigned tasks" color="blue"/>
                <Stat icon={<TrendingUp/>} label="Average workload" value={`${Math.round(totalHours / Math.max(1,projectMembers.length))}h`} note="Per team member" color="green"/>
                <Stat icon={<AlertTriangle/>} label="Potential overload" value={memberStats.filter(m => m.hours > totalHours / Math.max(1,projectMembers.length) * 1.5 && m.hours > 0).length} note="Above 150% of average" color="orange"/>
              </div>
              <section className="panel workload-panel">
                <div className="panel-title"><div><h2>Individual workload</h2><p>Assigned effort and task distribution</p></div><span className="tag-neutral">Estimated hours</span></div>
                {memberStats.map(m => {
                  const avg = totalHours / Math.max(1, memberStats.length);
                  const overloaded = m.hours > avg * 1.5 && m.hours > 0;
                  return <div className="workload-detail" key={m.id}>
                    <div className={`member-avatar ${m.color}`}>{m.initials}</div>
                    <div className="workload-detail-info"><div className="workload-detail-heading"><div><strong>{m.name}</strong><span>{m.role}</span></div><div className="workload-number">{m.hours}h <small> / {m.assigned} tasks</small></div></div>
                      <div className="bar-track large"><div className={`bar-fill ${m.color}`} style={{width: `${m.hours / maxHours * 100}%`}}/></div>
                      <div className="workload-detail-foot"><span>{m.completed} completed · {m.assigned - m.completed} remaining</span>{overloaded && <span className="overload-label"><AlertTriangle size={13}/> Potentially overloaded</span>}</div>
                    </div>
                  </div>;
                })}
              </section>
              <div className="balance-note wide"><AlertTriangle size={16}/><span>Workload estimates are based on task hours. Check with team members before redistributing tasks—hours alone don't reflect task complexity or personal availability.</span></div>
            </>
          )}

          {page === "Contribution Report" && (
            <>
              <div className="report-hero"><div><span className="eyebrow">PROJECT CONTRIBUTION SUMMARY</span><h2>{activeProject.name}</h2><p>Generated from task assignments and completion status.</p></div><button className="secondary-btn" onClick={() => {const text = `${activeProject.name} contribution report\n\n${memberStats.map(m => `${m.name}: ${m.completed}/${m.assigned} tasks completed, ${m.hours} estimated hours`).join("\n")}`; const blob = new Blob([text], {type:"text/plain"}); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "groupguard-report.txt"; a.click(); URL.revokeObjectURL(url); notify("Report downloaded!");}}><Download size={15}/> Export summary</button></div>
              <div className="stats-grid">
                <Stat icon={<CheckCircle2/>} label="Tasks completed" value={`${doneCount}/${tasks.length}`} note="Completion count" color="green"/>
                <Stat icon={<Clock/>} label="Effort completed" value={`${completedHours}h`} note="Estimated completed effort" color="blue"/>
                <Stat icon={<Users/>} label="Contributors" value={memberStats.filter(m => m.assigned > 0).length} note="Members with assigned tasks" color="purple"/>
                <Stat icon={<Target/>} label="Project completion" value={`${progress}%`} note="Based on task completion" color="orange"/>
              </div>
              <section className="panel report-table-panel">
                <div className="panel-title"><div><h2>Individual contribution breakdown</h2><p>Task completion and estimated effort by member</p></div></div>
                <div className="report-table-wrap"><table><thead><tr><th>Team member</th><th>Assigned</th><th>Completed</th><th>Hours</th><th>Completion</th><th>Status</th></tr></thead><tbody>
                  {memberStats.map(m => <tr key={m.id}><td><div className="table-member"><div className={`member-avatar small ${m.color}`}>{m.initials}</div><div><strong>{m.name}</strong><span>{m.role}</span></div></div></td><td>{m.assigned}</td><td>{m.completed}</td><td>{m.hours}h</td><td><div className="table-progress"><div className="bar-track"><div className={`bar-fill ${m.color}`} style={{width:`${m.progress}%`}}/></div><span>{m.progress}%</span></div></td><td><span className={`report-status ${m.assigned && m.progress === 100 ? "complete" : m.assigned ? "active" : "none"}`}>{m.assigned && m.progress === 100 ? "Complete" : m.assigned ? "In progress" : "No tasks"}</span></td></tr>)}
                </tbody></table></div>
                <div className="report-disclaimer"><AlertTriangle size={15}/> This report reflects task assignments and estimated hours, not a definitive measure of effort, quality, or individual performance.</div>
              </section>
            </>
          )}
        </div>

        <footer><span>GroupGuard · Better collaboration through transparency.</span><span>Built for student teams <span className="footer-heart">♥</span></span></footer>
      </main>

      {modal && <Modal type={modal} members={members} onClose={() => setModal(null)} onAddTask={addTask} onAddProject={addProject} onAddMember={addMember} projectMembers={projectMembers}/>}
      {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
    </div>
  );
}

function Stat({icon,label,value,note,color}) {
  return <div className="stat-card"><div className={`stat-icon ${color}`}>{icon}</div><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}

function Legend({color,label,value}) {
  return <div className="legend-row"><i className={color}/><span>{label}</span><strong>{value}</strong></div>;
}

function TaskLine({task,member}) {
  return <div className="task-line"><div className={`task-check ${task.status === "Done" ? "checked" : ""}`}>{task.status === "Done" ? <CheckCircle2 size={16}/> : <Circle size={16}/>}</div><div className="task-line-info"><strong>{task.title}</strong><span>{member?.name || "Unassigned"} · Due {task.deadline}</span></div><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span></div>;
}

function MemberCard({member}) {
  return <div className="member-card"><div className={`member-avatar ${member.color}`}>{member.initials}</div><div className="member-card-info"><strong>{member.name}</strong><span>{member.role}</span><div className="member-card-stats"><span><CheckSquare size={13}/> {member.completed}/{member.assigned} tasks</span><span><Clock size={13}/> {member.hours}h assigned</span></div></div><div className="member-progress"><strong>{member.progress}%</strong><div className="bar-track"><div className={`bar-fill ${member.color}`} style={{width:`${member.progress}%`}}/></div></div></div>;
}

function Modal({type,members,onClose,onAddTask,onAddProject,onAddMember,projectMembers}) {
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [memberId,setMemberId] = useState(projectMembers[0]?.id || members[0]?.id || "");
  const [priority,setPriority] = useState("Medium");
  const [status,setStatus] = useState("Todo");
  const [hours,setHours] = useState(4);
  const [deadline,setDeadline] = useState("2026-11-20");
  const [category,setCategory] = useState("Web Development");
  const [color,setColor] = useState("purple");
  const [role,setRole] = useState("Team Member");

  const submit = (e) => {
    e.preventDefault();
    if(type === "task") onAddTask({title,memberId:Number(memberId),priority,status,hours:Number(hours),deadline});
    if(type === "project") onAddProject({name:title,description,category,color,deadline});
    if(type === "member") onAddMember({name:title,role,initials:title.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase(),color});
  };

  const headings = {task:["Create a task","Assign a responsibility to your team."],project:["Create a project","Start a new collaborative workspace."],member:["Add team member","Bring someone into your project team."]};

  return <div className="modal-overlay" onClick={onClose}><form className="modal" onSubmit={submit} onClick={e=>e.stopPropagation()}>
    <div className="modal-header"><div><span className="eyebrow">GROUPGUARD WORKSPACE</span><h2>{headings[type][0]}</h2><p>{headings[type][1]}</p></div><button type="button" className="icon-button" onClick={onClose}><X size={19}/></button></div>
    <label>{type === "task" ? "Task title" : type === "project" ? "Project name" : "Full name"}<input required value={title} onChange={e=>setTitle(e.target.value)} placeholder={type === "task" ? "e.g. Build login page" : type === "project" ? "e.g. Campus Companion" : "e.g. Aditi Sharma"}/></label>
    {type === "project" && <><label>Description<textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="What is this project about?"/></label><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option>Web Development</option><option>App Development</option><option>Research</option><option>Design</option><option>Other</option></select></label><label>Accent color<select value={color} onChange={e=>setColor(e.target.value)}><option value="purple">Purple</option><option value="blue">Blue</option><option value="green">Green</option><option value="orange">Orange</option></select></label></>}
    {type === "member" && <label>Role<input value={role} onChange={e=>setRole(e.target.value)} placeholder="e.g. Frontend Developer"/></label>}
    {type === "task" && <>
      <label>Assign to<select value={memberId} onChange={e=>setMemberId(e.target.value)}>{projectMembers.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
      <div className="modal-two"><label>Priority<select value={priority} onChange={e=>setPriority(e.target.value)}>{priorityOptions.map(x=><option key={x}>{x}</option>)}</select></label><label>Status<select value={status} onChange={e=>setStatus(e.target.value)}>{statusOptions.map(x=><option key={x}>{x}</option>)}</select></label></div>
      <div className="modal-two"><label>Estimated hours<input type="number" min="1" max="100" value={hours} onChange={e=>setHours(e.target.value)}/></label><label>Deadline<input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)}/></label></div>
    </>}
    {type === "project" && <label>Deadline<input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)}/></label>}
    <div className="modal-actions"><button type="button" className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" type="submit"><Plus size={15}/>{type === "task" ? "Create task" : type === "project" ? "Create project" : "Add member"}</button></div>
  </form></div>;
}

export default App;