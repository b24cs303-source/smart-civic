import React, { useEffect, useMemo, useState } from 'react'
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, Check,
  CheckCircle2, ChevronDown, ClipboardList, Clock3, CloudUpload, FileText, Filter,
  Gauge, LayoutDashboard, Lightbulb, LogOut, MapPin, Menu, MessageSquareText,
  Plus, Search, Send, ShieldCheck, Sparkles, Trash2, TrendingUp, Users, X,
  Building2, Droplets, Construction, Recycle, Wrench, Image as ImageIcon
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell
} from 'recharts'

const DEMO = [
  { id:'SC-2026-1048', title:'Large pothole near NIT junction', category:'Road damage', location:'NIT Junction, Hanamkonda', description:'A deep pothole is causing traffic to slow down and may cause accidents, especially at night.', priority:'High', status:'In Progress', date:'2026-10-31', citizen:'Aarav Reddy', email:'citizen@smartcivic.in', department:'Roads & Infrastructure', imageName:'road-damage.jpg' },
  { id:'SC-2026-1047', title:'Garbage not collected for three days', category:'Garbage', location:'Kishanpura, Warangal', description:'Waste is overflowing from the community bin and creating an unpleasant smell.', priority:'Medium', status:'Submitted', date:'2026-10-31', citizen:'Aarav Reddy', email:'citizen@smartcivic.in', department:'Sanitation' },
  { id:'SC-2026-1046', title:'Streetlight not working', category:'Streetlight', location:'Balasamudram Road, Hanamkonda', description:'The streetlight outside the park has not been working for the past week.', priority:'Low', status:'Resolved', date:'2026-10-29', citizen:'Priya Sharma', email:'priya@example.com', department:'Electrical' },
  { id:'SC-2026-1045', title:'Water leakage from main pipeline', category:'Water supply', location:'Subedari, Hanamkonda', description:'Continuous water leakage near the main road. Water is being wasted.', priority:'Critical', status:'In Progress', date:'2026-10-28', citizen:'Mohammed Imran', email:'imran@example.com', department:'Water Works' },
  { id:'SC-2026-1044', title:'Blocked drainage causing water stagnation', category:'Drainage', location:'Lashkar Bazar, Warangal', description:'Drainage is blocked and rainwater is collecting on the road.', priority:'High', status:'Submitted', date:'2026-10-27', citizen:'Sneha Rao', email:'sneha@example.com', department:'Public Health' },
  { id:'SC-2026-1043', title:'Damaged footpath tiles', category:'Road damage', location:'Public Garden Road, Hanamkonda', description:'Broken tiles are making the footpath difficult for pedestrians.', priority:'Low', status:'Resolved', date:'2026-10-26', citizen:'Aarav Reddy', email:'citizen@smartcivic.in', department:'Roads & Infrastructure' },
]

const statusOptions = ['Submitted', 'In Progress', 'Resolved', 'Rejected']
const categoryInfo = {
  'Road damage': { icon: Construction, dept: 'Roads & Infrastructure', keywords: ['pothole','road','footpath','crack','broken','tile'] },
  'Garbage': { icon: Recycle, dept: 'Sanitation', keywords: ['garbage','waste','trash','dustbin','litter','smell'] },
  'Water supply': { icon: Droplets, dept: 'Water Works', keywords: ['water','leak','pipeline','supply','tap'] },
  'Drainage': { icon: Wrench, dept: 'Public Health', keywords: ['drain','drainage','sewage','stagnant','flood'] },
  'Streetlight': { icon: Lightbulb, dept: 'Electrical', keywords: ['light','streetlight','lamp','electricity'] },
  'Other': { icon: ClipboardList, dept: 'General Administration', keywords: [] },
}
const initialStats = [
  { day:'Mon', count:18 }, { day:'Tue', count:25 }, { day:'Wed', count:21 },
  { day:'Thu', count:34 }, { day:'Fri', count:29 }, { day:'Sat', count:42 }, { day:'Sun', count:36 },
]

function loadComplaints() {
  try {
    const saved = localStorage.getItem('smartcivic_complaints')
    return saved ? JSON.parse(saved) : DEMO
  } catch { return DEMO }
}
function classify(text) {
  const value = text.toLowerCase()
  for (const [category, info] of Object.entries(categoryInfo)) {
    if (category !== 'Other' && info.keywords.some(word => value.includes(word))) return { category, department: info.dept }
  }
  return { category: 'Other', department: categoryInfo.Other.dept }
}
function priorityFor(text, category) {
  const value = text.toLowerCase()
  if (['accident','danger','exposed wire','fire','overflow','major leak','injury'].some(w => value.includes(w))) return 'Critical'
  if (['pothole','blocked','stagnant','leak','broken','overflowing'].some(w => value.includes(w))) return 'High'
  if (category === 'Garbage' || category === 'Water supply') return 'Medium'
  return 'Low'
}
function formatDate(date) {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
}
function Badge({ children, tone='slate' }) { return <span className={`badge ${tone}`}>{children}</span> }
function priorityTone(p) { return ({Critical:'critical',High:'high',Medium:'medium',Low:'low'})[p] || 'slate' }
function statusTone(s) { return ({Submitted:'blue','In Progress':'amber',Resolved:'green',Rejected:'red'})[s] || 'slate' }

function Brand({ compact=false }) {
  return <div className="brand"><div className="brand-mark"><Building2 size={21}/><span className="brand-spark">✦</span></div>{!compact && <div><strong>smart<span>civic</span></strong><small>CIVIC INTELLIGENCE</small></div>}</div>
}

function Login({ onLogin }) {
  const [role, setRole] = useState('citizen')
  const [email, setEmail] = useState('citizen@smartcivic.in')
  const [password, setPassword] = useState('citizen123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const chooseRole = (r) => { setRole(r); setEmail(r === 'admin' ? 'admin@smartcivic.in' : 'citizen@smartcivic.in'); setPassword(r === 'admin' ? 'admin123' : 'citizen123'); setError('') }
  const submit = (e) => {
    e.preventDefault()
    const valid = role === 'admin'
      ? email === 'admin@smartcivic.in' && password === 'admin123'
      : email === 'citizen@smartcivic.in' && password === 'citizen123'
    if (!valid) { setError('Please use the demo credentials shown below.'); return }
    onLogin({ role, email, name: role === 'admin' ? 'Municipal Administrator' : 'Aarav Reddy' })
  }
  return <div className="login-page">
    <div className="login-left">
      <div className="login-top"><Brand/></div>
      <div className="login-hero">
        <div className="eyebrow"><span className="pulse-dot"/> SMARTER CITIES START HERE</div>
        <h1>Better streets.<br/><em>Better living.</em></h1>
        <p>One connected platform to report civic issues, bring communities together, and help city teams respond faster.</p>
        <div className="hero-points">
          <div><span className="point-icon"><ShieldCheck size={17}/></span><span><b>Transparent service</b><small>Track every complaint from start to finish.</small></span></div>
          <div><span className="point-icon"><Sparkles size={17}/></span><span><b>AI-assisted insights</b><small>Smarter categorisation and priority suggestions.</small></span></div>
          <div><span className="point-icon"><Activity size={17}/></span><span><b>Community impact</b><small>Build cleaner, safer neighbourhoods together.</small></span></div>
        </div>
      </div>
      <div className="login-footer">© 2026 Smart Civic · A smarter way to serve our city</div>
      <div className="orb orb-one"/><div className="orb orb-two"/>
    </div>
    <div className="login-right">
      <div className="login-mobile-brand"><Brand/></div>
      <div className="login-card">
        <div className="welcome-label">WELCOME TO SMART CIVIC</div>
        <h2>Sign in to your portal</h2>
        <p className="muted">Choose how you'd like to access the platform.</p>
        <div className="role-switch">
          <button className={role === 'citizen' ? 'selected' : ''} onClick={() => chooseRole('citizen')}><Users size={17}/> Citizen</button>
          <button className={role === 'admin' ? 'selected' : ''} onClick={() => chooseRole('admin')}><ShieldCheck size={17}/> Admin</button>
        </div>
        <form onSubmit={submit} className="login-form">
          <label>Email address</label>
          <div className="field-wrap"><span className="field-icon">@</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com"/></div>
          <label>Password</label>
          <div className="field-wrap"><span className="field-icon">⌑</span><input type={showPassword ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" className="show-pass" onClick={()=>setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div>
          {error && <div className="form-error">{error}</div>}
          <button className="btn-primary login-submit" type="submit">Continue to {role === 'admin' ? 'Admin' : 'Citizen'} Portal <ArrowRight size={17}/></button>
        </form>
        <div className="demo-box"><div className="demo-heading"><Sparkles size={14}/> DEMO ACCESS</div><div><span>Email</span><b>{role === 'admin' ? 'admin@smartcivic.in' : 'citizen@smartcivic.in'}</b></div><div><span>Password</span><b>{role === 'admin' ? 'admin123' : 'citizen123'}</b></div><button onClick={()=>{setEmail(role === 'admin' ? 'admin@smartcivic.in' : 'citizen@smartcivic.in');setPassword(role === 'admin' ? 'admin123' : 'citizen123')}}>Fill demo details</button></div>
        <p className="login-note"><ShieldCheck size={14}/> Secure role-based demo access · No real personal data required</p>
      </div>
      <div className="login-bottom">Need help? <a href="mailto:support@smartcivic.in">Contact platform support</a></div>
    </div>
  </div>
}

function Sidebar({ role, active, setActive, user, logout, mobileOpen, closeMobile }) {
  const citizenNav = [
    {id:'overview',label:'My dashboard',icon:LayoutDashboard},
    {id:'new',label:'Submit a complaint',icon:Plus},
    {id:'my-complaints',label:'My complaints',icon:ClipboardList},
  ]
  const adminNav = [
    {id:'overview',label:'Overview',icon:LayoutDashboard},
    {id:'all-complaints',label:'All complaints',icon:ClipboardList},
    {id:'analytics',label:'City insights',icon:TrendingUp},
  ]
  const nav = role === 'admin' ? adminNav : citizenNav
  return <><div className={`sidebar-overlay ${mobileOpen?'visible':''}`} onClick={closeMobile}/><aside className={`sidebar ${mobileOpen?'mobile-open':''}`}>
    <div className="sidebar-brand"><Brand/><button className="mobile-close" onClick={closeMobile}><X size={19}/></button></div>
    <div className="workspace-label">WORKSPACE</div>
    <div className="nav-list">{nav.map(item=><button key={item.id} className={`nav-item ${active===item.id?'active':''}`} onClick={()=>{setActive(item.id);closeMobile()}}><item.icon size={18}/><span>{item.label}</span>{item.id==='new' && <span className="nav-plus">+</span>}</button>)}</div>
    <div className="sidebar-bottom">
      <div className="help-card"><div className="help-icon"><MessageSquareText size={17}/></div><b>Need a hand?</b><p>Our support team is here to help you.</p><a href="mailto:support@smartcivic.in">Get support <ArrowRight size={13}/></a></div>
      <div className="user-mini"><div className="avatar">{user.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div className="user-mini-info"><b>{user.name}</b><small>{role === 'admin' ? 'Administrator' : 'Citizen account'}</small></div><button title="Sign out" onClick={logout}><LogOut size={17}/></button></div>
    </div>
  </aside></>
}

function Header({ title, subtitle, user, onMenu }) {
  return <header className="topbar"><div className="topbar-left"><button className="menu-button" onClick={onMenu}><Menu size={20}/></button><div><h2>{title}</h2><p>{subtitle}</p></div></div><div className="topbar-right"><div className="today-chip"><span className="live-dot"/> SYSTEM LIVE</div><button className="icon-button notification" title="Notifications"><Bell size={18}/><i/></button><div className="top-user"><div className="avatar small">{user.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><b>{user.name}</b><small>{user.role === 'admin' ? 'City administrator' : 'Citizen'}</small></div><ChevronDown size={15}/></div></div></header>
}

function StatCard({ label, value, note, icon:Icon, tone='blue', trend }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className={`stat-icon ${tone}`}><Icon size={18}/></span></div><div className="stat-value">{value}</div><div className="stat-foot"><span className="stat-note">{trend && <ArrowUpRight size={13}/>} {note}</span>{trend && <span className="trend">{trend}</span>}</div></div>
}

function ComplaintRow({ item, onClick, admin=false, onStatus }) {
  return <tr onClick={()=>onClick?.(item)} className="complaint-row">
    <td><div className="case-cell"><span className="case-dot"/><div><b>{item.title}</b><small>{item.id}</small></div></div></td>
    <td><span className="category-cell">{item.category}</span></td>
    {admin && <td><span className="citizen-cell">{item.citizen}</span></td>}
    <td><div className="location-cell"><MapPin size={13}/>{item.location}</div></td>
    <td><Badge tone={priorityTone(item.priority)}>{item.priority}</Badge></td>
    <td>{admin ? <select className={`status-select ${statusTone(item.status)}`} value={item.status} onClick={e=>e.stopPropagation()} onChange={e=>onStatus(item.id,e.target.value)}>{statusOptions.map(s=><option key={s}>{s}</option>)}</select> : <Badge tone={statusTone(item.status)}>{item.status}</Badge>}</td>
    <td className="date-cell">{formatDate(item.date)}</td>
    <td><button className="row-arrow" onClick={e=>{e.stopPropagation();onClick?.(item)}}><ArrowUpRight size={16}/></button></td>
  </tr>
}

function Table({ items, admin=false, onClick, onStatus }) {
  return <div className="table-wrap"><table><thead><tr><th>COMPLAINT</th><th>CATEGORY</th>{admin&&<th>REPORTED BY</th>}<th>LOCATION</th><th>PRIORITY</th><th>STATUS</th><th>DATE</th><th></th></tr></thead><tbody>{items.length ? items.map(item=><ComplaintRow key={item.id} item={item} admin={admin} onClick={onClick} onStatus={onStatus}/>) : <tr><td colSpan={admin?8:7} className="empty-cell">No complaints found. Your next update will appear here.</td></tr>}</tbody></table></div>
}

function Dashboard({ role, user, complaints, setActive, onSelect, onStatus }) {
  const mine = complaints.filter(c=>c.email===user.email)
  const data = role === 'admin' ? complaints : mine
  const resolved = data.filter(c=>c.status==='Resolved').length
  const pending = data.filter(c=>c.status==='Submitted').length
  const progress = data.filter(c=>c.status==='In Progress').length
  const recent = [...data].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5)
  const admin = role === 'admin'
  return <div className="page-content">
    <div className="welcome-banner"><div><div className="eyebrow light"><Sparkles size={13}/> {admin ? 'CITY OPERATIONS' : 'YOUR COMMUNITY, YOUR VOICE'}</div><h1>{admin ? 'Good day, Administrator' : `Welcome back, ${user.name.split(' ')[0]}`} <span>✦</span></h1><p>{admin ? 'Here’s what is happening across your city today.' : 'Small actions create better neighbourhoods. Here’s your civic activity at a glance.'}</p></div><div className="banner-art"><div className="banner-ring ring-a"/><div className="banner-ring ring-b"/><div className="banner-building"><Building2 size={55}/><span>✦</span></div></div></div>
    <div className="section-heading"><div><h3>{admin ? 'City performance' : 'Your activity'}</h3><p>{admin ? 'A live snapshot of civic service requests.' : 'A quick overview of your submitted reports.'}</p></div>{!admin && <button className="btn-primary" onClick={()=>setActive('new')}><Plus size={16}/> New complaint</button>}</div>
    <div className="stats-grid">
      <StatCard label={admin?'Total complaints':'Complaints submitted'} value={data.length} note={admin?'Across all neighbourhoods':'All time'} icon={ClipboardList} tone="blue"/>
      <StatCard label="Awaiting action" value={pending} note="Recently submitted" icon={Clock3} tone="amber"/>
      <StatCard label="In progress" value={progress} note="Being worked on" icon={Activity} tone="violet"/>
      <StatCard label="Resolved" value={resolved} note="Successfully closed" icon={CheckCircle2} tone="green" trend={admin?'+12%':'Great work!'}/>
    </div>
    {admin && <div className="insight-strip"><div className="insight-icon"><Sparkles size={18}/></div><div><b>AI service insight</b><p>Road damage and drainage are the most frequently reported categories in the current sample. Prioritise high-severity cases for faster field inspection.</p></div><Badge tone="violet">AI INSIGHT</Badge></div>}
    <div className="dashboard-grid">
      <div className="panel recent-panel"><div className="panel-heading"><div><h3>{admin?'Latest city complaints':'Recent complaints'}</h3><p>{admin?'Newest reports submitted by citizens':'Your latest complaint activity'}</p></div><button className="text-button" onClick={()=>setActive(admin?'all-complaints':'my-complaints')}>View all <ArrowRight size={14}/></button></div><Table items={recent} admin={admin} onClick={onSelect} onStatus={onStatus}/></div>
      <div className="panel quick-panel"><div className="panel-heading"><div><h3>Quick actions</h3><p>{admin?'Manage city operations':'What would you like to do?'}</p></div></div>
        {admin ? <><button className="quick-action" onClick={()=>setActive('all-complaints')}><span className="quick-icon blue"><ClipboardList size={17}/></span><span><b>Review complaints</b><small>Open and manage all reports</small></span><ArrowRight size={16}/></button><button className="quick-action" onClick={()=>setActive('analytics')}><span className="quick-icon violet"><TrendingUp size={17}/></span><span><b>View city insights</b><small>Explore performance metrics</small></span><ArrowRight size={16}/></button></> : <><button className="quick-action" onClick={()=>setActive('new')}><span className="quick-icon blue"><Plus size={17}/></span><span><b>Report an issue</b><small>Tell us what needs attention</small></span><ArrowRight size={16}/></button><button className="quick-action" onClick={()=>setActive('my-complaints')}><span className="quick-icon violet"><ClipboardList size={17}/></span><span><b>Track a complaint</b><small>Check progress and updates</small></span><ArrowRight size={16}/></button></>}
        <div className="response-card"><div className="response-top"><span>RESOLUTION RATE</span><TrendingUp size={15}/></div><strong>{data.length ? Math.round(resolved/data.length*100) : 0}%</strong><div className="progress-track"><div style={{width:`${data.length ? resolved/data.length*100 : 0}%`}}/></div><small>Based on {data.length} complaint{data.length===1?'':'s'} in this view</small></div>
      </div>
    </div>
    <div className="bottom-note"><ShieldCheck size={16}/><span>{admin?'You are viewing the municipal administration workspace. Updates are reflected in the citizen portal.':'Your reports help municipal teams identify and resolve local issues.'}</span><span className="note-link">Powered by Smart Civic AI</span></div>
  </div>
}

function NewComplaint({ user, onSubmit, setActive }) {
  const [title,setTitle] = useState('')
  const [description,setDescription] = useState('')
  const [location,setLocation] = useState('')
  const [image,setImage] = useState(null)
  const [category,setCategory] = useState('Auto-detect with AI')
  const [preview,setPreview] = useState('')
  const [done,setDone] = useState('')
  const suggestion = classify(`${title} ${description}`)
  const priority = priorityFor(`${title} ${description}`, suggestion.category)
  const handleImage = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }
  const submit = e => {
    e.preventDefault()
    const detected = category === 'Auto-detect with AI' ? suggestion : {category,department:categoryInfo[category].dept}
    const item = {
      id:`SC-${new Date().getFullYear()}-${Math.floor(1000+Math.random()*8999)}`,
      title, description, location, category:detected.category, department:detected.department,
      priority:priorityFor(`${title} ${description}`, detected.category), status:'Submitted',
      date:new Date().toISOString().slice(0,10), citizen:user.name, email:user.email,
      imageName:image?.name || ''
    }
    onSubmit(item)
    setDone(item.id)
    setTitle('');setDescription('');setLocation('');setImage(null);setPreview('');setCategory('Auto-detect with AI')
  }
  if(done) return <div className="page-content"><div className="success-card"><div className="success-mark"><Check size={32}/></div><div className="eyebrow">COMPLAINT SUBMITTED</div><h2>Your voice has been heard.</h2><p>Your complaint has been registered successfully. Our AI assistant has categorised the issue and suggested a priority for the municipal team.</p><div className="success-id"><span>COMPLAINT REFERENCE</span><b>{done}</b></div><div className="success-actions"><button className="btn-primary" onClick={()=>{setDone('');setActive('my-complaints')}}>Track complaint <ArrowRight size={16}/></button><button className="btn-secondary" onClick={()=>setDone('')}>Submit another</button></div></div></div>
  return <div className="page-content form-page">
    <div className="page-intro"><div><div className="eyebrow"><span className="pulse-dot"/> CITIZEN SERVICES</div><h1>Report a civic issue</h1><p>Help us make your neighbourhood better. Share the details and we'll route it to the right team.</p></div><div className="form-step"><span>01</span><div><b>New report</b><small>Usually takes 2–3 minutes</small></div></div></div>
    <div className="form-layout"><form className="panel complaint-form" onSubmit={submit}>
      <div className="form-section-title"><span>01</span><div><h3>Issue details</h3><p>Tell us what happened and where.</p></div></div>
      <label>Complaint title <span className="required">*</span></label><input className="input" value={title} onChange={e=>setTitle(e.target.value)} required minLength={5} placeholder="e.g. Large pothole near the main road"/>
      <label>Describe the issue <span className="required">*</span></label><textarea className="input textarea" value={description} onChange={e=>setDescription(e.target.value)} required minLength={10} rows={4} placeholder="Describe what you noticed, how long it has been happening, and who may be affected..."/>
      <div className="field-grid"><div><label>Issue category</label><select className="input" value={category} onChange={e=>setCategory(e.target.value)}><option>Auto-detect with AI</option>{Object.keys(categoryInfo).map(c=><option key={c}>{c}</option>)}</select></div><div><label>Location / landmark <span className="required">*</span></label><div className="input-icon-wrap"><MapPin size={16}/><input className="input" value={location} onChange={e=>setLocation(e.target.value)} required placeholder="Area, street or landmark"/></div></div></div>
      <label>Attach a photo <span className="optional">OPTIONAL</span></label><label className="upload-zone"><input type="file" accept="image/*" onChange={handleImage}/>{preview ? <img src={preview} alt="Complaint preview"/> : <><span className="upload-icon"><CloudUpload size={23}/></span><b>Click to upload an image</b><small>PNG, JPG or WEBP · Max 10 MB</small></>}<span className="upload-action">{image ? image.name : 'Browse files'}</span></label>
      <div className="form-footer"><span><ShieldCheck size={15}/> Your contact details stay private.</span><button className="btn-primary" type="submit">Submit complaint <Send size={15}/></button></div>
    </form>
    <aside className="form-aside"><div className="ai-card"><div className="ai-card-top"><span className="ai-spark"><Sparkles size={17}/></span><Badge tone="violet">AI ASSISTANT</Badge></div><h3>Smart issue analysis</h3><p>As you describe the issue, our AI assistant suggests a category and priority to help the right team respond.</p><div className="ai-result"><small>DETECTED CATEGORY</small><b>{title || description ? suggestion.category : 'Waiting for details...'}</b></div><div className="ai-result"><small>SUGGESTED PRIORITY</small><Badge tone={title || description ? priorityTone(priority) : 'slate'}>{title || description ? priority : 'Not yet assessed'}</Badge></div><div className="ai-result"><small>ROUTING DEPARTMENT</small><b>{title || description ? suggestion.department : 'To be determined'}</b></div><div className="ai-disclaimer"> <Activity size={14}/> Demo AI uses keyword-based rules. Connect a trained ML model for production predictions.</div></div><div className="tips-card"><h4><Lightbulb size={16}/> Tips for a faster response</h4><ul><li>Use a clear, specific title.</li><li>Include a nearby landmark.</li><li>Add a photo if it helps explain the issue.</li><li>Mention any immediate safety risk.</li></ul></div></aside></div>
  </div>
}

function ComplaintList({ items, admin, onSelect, onStatus }) {
  const [query,setQuery] = useState('')
  const [filter,setFilter] = useState('All')
  const filtered = items.filter(i => {
    const match = `${i.id} ${i.title} ${i.location} ${i.citizen} ${i.category}`.toLowerCase().includes(query.toLowerCase())
    return match && (filter==='All' || (filter==='Open' ? i.status!=='Resolved' && i.status!=='Rejected' : filter===i.status || filter===i.priority))
  })
  return <div className="page-content"><div className="page-intro"><div><div className="eyebrow"><span className="pulse-dot"/> {admin?'MUNICIPAL WORKSPACE':'CITIZEN WORKSPACE'}</div><h1>{admin?'Complaint management':'My complaints'}</h1><p>{admin?'Review incoming reports, assign priorities and keep citizens informed.':'All your submitted reports in one place. Select a complaint to view its details.'}</p></div>{!admin&&<div className="complaint-count"><b>{items.length}</b><small>Total reports</small></div>}</div>
    <div className="panel list-panel"><div className="list-toolbar"><div className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by ID, title or location..."/></div><div className="filter-wrap"><Filter size={15}/><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Open</option><option>Submitted</option><option>In Progress</option><option>Resolved</option><option>Rejected</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></div></div><Table items={filtered} admin={admin} onClick={onSelect} onStatus={onStatus}/><div className="table-summary">Showing <b>{filtered.length}</b> of <b>{items.length}</b> complaints</div></div>
  </div>
}

function Analytics({ complaints }) {
  const categories = Object.keys(categoryInfo).map(name=>({name,value:complaints.filter(c=>c.category===name).length})).filter(x=>x.value>0)
  const colors = ['#5488ff','#28b9a5','#a78bfa','#f5a84c','#ef7187','#9aa9bb']
  const weekly = initialStats.map((x,i)=>({...x,count:x.count + (complaints.length%7)*(i%3)}))
  return <div className="page-content"><div className="page-intro"><div><div className="eyebrow"><span className="pulse-dot"/> DATA & INTELLIGENCE</div><h1>City insights</h1><p>Understand civic trends and use data to make better service decisions.</p></div><Badge tone="green">LIVE DEMO DATA</Badge></div>
    <div className="stats-grid analytics-stats"><StatCard label="Total reports" value={complaints.length} note="All recorded cases" icon={ClipboardList}/><StatCard label="Open cases" value={complaints.filter(c=>!['Resolved','Rejected'].includes(c.status)).length} note="Require attention" icon={Clock3} tone="amber"/><StatCard label="Critical priority" value={complaints.filter(c=>c.priority==='Critical').length} note="Review immediately" icon={AlertTriangle} tone="red"/><StatCard label="Resolved cases" value={complaints.filter(c=>c.status==='Resolved').length} note="Closed successfully" icon={CheckCircle2} tone="green"/></div>
    <div className="analytics-grid"><div className="panel chart-panel"><div className="panel-heading"><div><h3>Complaint activity</h3><p>Illustrative weekly reporting trend</p></div><Badge tone="blue">THIS WEEK</Badge></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weekly} margin={{top:10,right:10,left:-20,bottom:0}}><defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5488ff" stopOpacity={0.25}/><stop offset="95%" stopColor="#5488ff" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9eef5"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill:'#8996a8',fontSize:12}}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#8996a8',fontSize:12}}/><Tooltip contentStyle={{border:'1px solid #e8edf4',borderRadius:12,boxShadow:'0 8px 25px #13294b12'}}/><Area type="monotone" dataKey="count" stroke="#5488ff" strokeWidth={3} fill="url(#areaFill)"/></AreaChart></ResponsiveContainer></div></div>
      <div className="panel chart-panel"><div className="panel-heading"><div><h3>Issue categories</h3><p>Distribution of current complaints</p></div></div><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categories} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={4} stroke="none">{categories.map((entry,i)=><Cell key={entry.name} fill={colors[i%colors.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="donut-center"><b>{complaints.length}</b><small>REPORTS</small></div></div><div className="legend">{categories.map((c,i)=><div key={c.name}><span style={{background:colors[i%colors.length]}}/><span>{c.name}</span><b>{c.value}</b></div>)}</div></div></div>
    <div className="insight-strip"><div className="insight-icon"><Sparkles size={18}/></div><div><b>AI-powered decision support</b><p>Use category trends and priority levels to plan inspections, coordinate departments and allocate field resources. Chart activity is illustrative demo data.</p></div><Badge tone="violet">INSIGHT</Badge></div>
  </div>
}

function DetailModal({ item, close, admin, onStatus }) {
  if(!item) return null
  return <div className="modal-backdrop" onClick={close}><div className="detail-modal" onClick={e=>e.stopPropagation()}><div className="modal-top"><div><span className="eyebrow">COMPLAINT DETAILS</span><h2>{item.id}</h2></div><button className="icon-button" onClick={close}><X size={19}/></button></div><h3>{item.title}</h3><p className="detail-description">{item.description}</p><div className="detail-badges"><Badge tone={priorityTone(item.priority)}>{item.priority} priority</Badge><Badge tone={statusTone(item.status)}>{item.status}</Badge></div><div className="detail-grid"><div><small>CATEGORY</small><b>{item.category}</b></div><div><small>DEPARTMENT</small><b>{item.department}</b></div><div><small>LOCATION</small><b><MapPin size={13}/>{item.location}</b></div><div><small>SUBMITTED ON</small><b>{formatDate(item.date)}</b></div><div><small>REPORTED BY</small><b>{item.citizen}</b></div><div><small>ATTACHMENT</small><b><ImageIcon size={13}/>{item.imageName || 'No image attached'}</b></div></div>{admin&&<div className="modal-status"><label>Update complaint status</label><select className="input" value={item.status} onChange={e=>onStatus(item.id,e.target.value)}>{statusOptions.map(s=><option key={s}>{s}</option>)}</select></div>}<div className="modal-footer"><span><ShieldCheck size={15}/> Smart Civic · Transparent civic service</span><button className="btn-secondary" onClick={close}>Close details</button></div></div></div>
}

function App() {
  const [user,setUser] = useState(null)
  const [active,setActive] = useState('overview')
  const [complaints,setComplaints] = useState(loadComplaints)
  const [selected,setSelected] = useState(null)
  const [mobileOpen,setMobileOpen] = useState(false)
  useEffect(()=>{localStorage.setItem('smartcivic_complaints',JSON.stringify(complaints))},[complaints])
  const login = u => {setUser(u);setActive('overview')}
  const logout = () => {setUser(null);setSelected(null);setMobileOpen(false)}
  const addComplaint = item => setComplaints(prev=>[item,...prev])
  const updateStatus = (id,status) => setComplaints(prev=>prev.map(c=>c.id===id?{...c,status}:c))
  const visible = useMemo(()=>user?.role==='admin'?complaints:complaints.filter(c=>c.email===user?.email),[complaints,user])
  if(!user) return <Login onLogin={login}/>
  const admin = user.role==='admin'
  const titles = {
    overview: admin?'Overview':'My dashboard',
    new:'Submit a complaint',
    'my-complaints':'My complaints',
    'all-complaints':'Complaint management',
    analytics:'City insights'
  }
  const subtitles = {
    overview:admin?'Monitor reports and city service performance':'Your personal civic service centre',
    new:'Report a problem in your neighbourhood',
    'my-complaints':'Follow the progress of your submitted reports',
    'all-complaints':'Review, prioritise and update civic reports',
    analytics:'Data-led insights for a better city'
  }
  const page = () => {
    if(active==='new'&&!admin) return <NewComplaint user={user} onSubmit={addComplaint} setActive={setActive}/>
    if(active==='my-complaints'&&!admin) return <ComplaintList items={visible} admin={false} onSelect={setSelected}/>
    if(active==='all-complaints'&&admin) return <ComplaintList items={visible} admin onSelect={setSelected} onStatus={updateStatus}/>
    if(active==='analytics'&&admin) return <Analytics complaints={complaints}/>
    return <Dashboard role={user.role} user={user} complaints={complaints} setActive={setActive} onSelect={setSelected} onStatus={updateStatus}/>
  }
  return <div className="app-shell"><Sidebar role={user.role} active={active} setActive={setActive} user={user} logout={logout} mobileOpen={mobileOpen} closeMobile={()=>setMobileOpen(false)}/><main className="main-area"><Header title={titles[active]||'Dashboard'} subtitle={subtitles[active]||''} user={{...user,role:user.role}} onMenu={()=>setMobileOpen(true)}/>{page()}<footer className="app-footer"><span>© 2026 Smart Civic. Building better communities, together.</span><span><span className="footer-dot"/> All systems operational</span></footer></main>{selected&&<DetailModal item={selected} close={()=>setSelected(null)} admin={admin} onStatus={(id,s)=>{updateStatus(id,s);setSelected({...selected,status:s})}}/>}</div>
}

export default App
