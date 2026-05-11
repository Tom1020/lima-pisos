import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const INITIAL_PRODUCTS = [
  { id: 1, nome: "Porcelanato Retificado Bianco", categoria: "Porcelanato", marca: "Portobello", preco: 89.9, quantidade: 245, minimo: 50, descricao: "Acabamento polido, 60x60cm, ideal para ambientes internos.", imagem: null },
  { id: 2, nome: "Piso Cerâmico Madeirado Carvalho", categoria: "Cerâmica", marca: "Eliane", preco: 42.5, quantidade: 180, minimo: 40, descricao: "Efeito madeira natural, 20x90cm, resistente.", imagem: null },
  { id: 3, nome: "Revestimento Mármore Travertino", categoria: "Revestimento", marca: "Ceusa", preco: 134.0, quantidade: 12, minimo: 30, descricao: "Alta durabilidade, 32x57cm, ótimo para fachadas.", imagem: null },
  { id: 4, nome: "Pastilha Vidro Azul Oceano", categoria: "Pastilha", marca: "Artistone", preco: 210.0, quantidade: 8, minimo: 20, descricao: "Pastilha de vidro esmaltado, 5x5cm, para piscinas.", imagem: null },
  { id: 5, nome: "Porcelanato Externo Antiderrapante", categoria: "Porcelanato", marca: "Portobello", preco: 68.0, quantidade: 320, minimo: 60, descricao: "Superfície texturizada, 60x60cm, uso externo.", imagem: null },
  { id: 6, nome: "Cerâmica Banheiro Branca Brilhante", categoria: "Cerâmica", marca: "Roca", preco: 28.9, quantidade: 410, minimo: 80, descricao: "Acabamento brilhante, 25x40cm, para banheiros.", imagem: null },
];

const INITIAL_CLIENTS = [
  { id: 1, nome: "João Carlos Ferreira", telefone: "(11) 98765-4321", cpf_cnpj: "123.456.789-00", endereco: "Rua das Flores, 123 - São Paulo/SP", historico: [] },
  { id: 2, nome: "Construtora Alvorada LTDA", telefone: "(11) 3344-5566", cpf_cnpj: "12.345.678/0001-99", endereco: "Av. Paulista, 1000 - São Paulo/SP", historico: [] },
  { id: 3, nome: "Maria Aparecida Santos", telefone: "(11) 97654-3210", cpf_cnpj: "987.654.321-11", endereco: "Rua Ipiranga, 45 - Osasco/SP", historico: [] },
];

const INITIAL_FINANCE = [
  { id: 1, tipo: "entrada", valor: 15800.0, descricao: "Venda #001 - Porcelanato Bianco", data: "2025-05-02", categoria: "Vendas" },
  { id: 2, tipo: "saida", valor: 8200.0, descricao: "Compra de estoque - Fornecedor ABC", data: "2025-05-03", categoria: "Compras" },
  { id: 3, tipo: "entrada", valor: 4200.0, descricao: "Venda #002 - Cerâmica Madeirada", data: "2025-05-05", categoria: "Vendas" },
  { id: 4, tipo: "saida", valor: 1500.0, descricao: "Aluguel do galpão - Maio/2025", data: "2025-05-05", categoria: "Despesas Fixas" },
  { id: 5, tipo: "entrada", valor: 9650.0, descricao: "Venda #003 - Revestimento Travertino", data: "2025-05-07", categoria: "Vendas" },
  { id: 6, tipo: "saida", valor: 620.0, descricao: "Conta de energia - Maio/2025", data: "2025-05-08", categoria: "Despesas Fixas" },
  { id: 7, tipo: "entrada", valor: 3300.0, descricao: "Venda #004 - Pastilhas Vidro", data: "2025-05-09", categoria: "Vendas" },
  { id: 8, tipo: "saida", valor: 2800.0, descricao: "Frete e logística", data: "2025-05-10", categoria: "Operacional" },
];

const INITIAL_SALES = [
  { id: 1, cliente_id: 1, cliente_nome: "João Carlos Ferreira", valor_total: 15800, forma_pagamento: "Cartão de Crédito", data: "2025-05-02", status: "concluida", itens: [{ produto: "Porcelanato Retificado Bianco", qtd: 50, unit: 89.9, total: 4495 }, { produto: "Piso Cerâmico Madeirado", qtd: 200, unit: 42.5, total: 8500 }] },
  { id: 2, cliente_id: 2, cliente_nome: "Construtora Alvorada LTDA", valor_total: 4200, forma_pagamento: "Boleto Bancário", data: "2025-05-05", status: "concluida", itens: [{ produto: "Cerâmica Madeirada Carvalho", qtd: 40, unit: 42.5, total: 1700 }, { produto: "Cerâmica Banheiro Branca", qtd: 86, unit: 28.9, total: 2485 }] },
  { id: 3, cliente_id: 3, cliente_nome: "Maria Aparecida Santos", valor_total: 9650, forma_pagamento: "PIX", data: "2025-05-07", status: "concluida", itens: [{ produto: "Revestimento Mármore Travertino", qtd: 30, unit: 134.0, total: 4020 }] },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
const fmtNum = (v) => new Intl.NumberFormat("pt-BR").format(v);

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  };
  return { toasts, add };
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  // Layout
  app: { display: "flex", minHeight: "100vh", background: "#0d0f14", fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif", color: "#e8eaf0" },
  sidebar: { width: 240, background: "#111318", borderRight: "1px solid #1e2028", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100 },
  sidebarCollapsed: { width: 64 },
  main: { marginLeft: 240, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", transition: "margin .3s" },
  mainCollapsed: { marginLeft: 64 },
  topbar: { background: "#111318", borderBottom: "1px solid #1e2028", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 90 },
  content: { padding: 28, flex: 1 },

  // Sidebar
  logo: { padding: "20px 16px 12px", borderBottom: "1px solid #1e2028" },
  logoText: { fontSize: 15, fontWeight: 700, color: "#f5a623", letterSpacing: ".3px" },
  logoSub: { fontSize: 11, color: "#5a6070", marginTop: 2 },
  navSection: { fontSize: 10, letterSpacing: "1.5px", color: "#3d4455", fontWeight: 600, padding: "14px 16px 6px", textTransform: "uppercase" },
  navItem: { display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", cursor: "pointer", borderRadius: 6, margin: "1px 8px", fontSize: 13, fontWeight: 500, color: "#8892a4", transition: "all .2s", border: "none", background: "none", width: "calc(100% - 16px)", textAlign: "left" },
  navItemActive: { background: "linear-gradient(90deg,#f5a62322,#f5a62308)", color: "#f5a623", borderLeft: "2px solid #f5a623", paddingLeft: 14 },
  navIcon: { fontSize: 17, minWidth: 17 },

  // Cards
  card: { background: "#161820", border: "1px solid #1e2028", borderRadius: 10, padding: "20px 22px" },
  cardSm: { background: "#161820", border: "1px solid #1e2028", borderRadius: 10, padding: "16px 18px" },
  statCard: { background: "#161820", border: "1px solid #1e2028", borderRadius: 10, padding: "18px 20px", flex: 1 },

  // Typography
  pageTitle: { fontSize: 22, fontWeight: 700, color: "#f0f1f5", margin: 0 },
  pageSub: { fontSize: 13, color: "#5a6070", marginTop: 4 },
  label: { fontSize: 11, color: "#5a6070", letterSpacing: ".5px", textTransform: "uppercase", fontWeight: 600 },
  value: { fontSize: 24, fontWeight: 700, color: "#f0f1f5", marginTop: 4 },
  badge: { fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 },

  // Buttons
  btn: { padding: "8px 16px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, transition: "all .15s" },
  btnPrimary: { background: "#f5a623", color: "#111" },
  btnSecondary: { background: "#1e2028", color: "#8892a4", border: "1px solid #2a2d3a" },
  btnDanger: { background: "#c0392b22", color: "#e74c3c", border: "1px solid #e74c3c44" },
  btnSuccess: { background: "#27ae6022", color: "#2ecc71", border: "1px solid #2ecc7144" },
  btnIcon: { padding: "7px 10px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 14, background: "#1e2028", color: "#8892a4", display: "inline-flex", alignItems: "center" },

  // Forms
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  formLabel: { fontSize: 12, fontWeight: 600, color: "#8892a4", letterSpacing: ".3px" },
  input: { background: "#0d0f14", border: "1px solid #2a2d3a", borderRadius: 7, padding: "9px 12px", color: "#e8eaf0", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" },
  select: { background: "#0d0f14", border: "1px solid #2a2d3a", borderRadius: 7, padding: "9px 12px", color: "#e8eaf0", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" },
  textarea: { background: "#0d0f14", border: "1px solid #2a2d3a", borderRadius: 7, padding: "9px 12px", color: "#e8eaf0", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box", minHeight: 80, resize: "vertical" },

  // Table
  table: { width: "100%", borderCollapse: "collapse" },
  th: { fontSize: 11, fontWeight: 600, letterSpacing: ".8px", color: "#5a6070", textTransform: "uppercase", padding: "10px 14px", borderBottom: "1px solid #1e2028", textAlign: "left" },
  td: { padding: "12px 14px", borderBottom: "1px solid #1a1d24", fontSize: 13, color: "#c0c6d4", verticalAlign: "middle" },
  tr: { transition: "background .1s", cursor: "default" },
};

// ─── MINI COMPONENTS ─────────────────────────────────────────────────────────
function Badge({ children, color = "#f5a623" }) {
  const colors = {
    green: { bg: "#2ecc7120", color: "#2ecc71" },
    red: { bg: "#e74c3c20", color: "#e74c3c" },
    amber: { bg: "#f5a62320", color: "#f5a623" },
    blue: { bg: "#3498db20", color: "#3498db" },
    gray: { bg: "#8892a420", color: "#8892a4" },
  };
  const c = colors[color] || { bg: "#f5a62320", color: "#f5a623" };
  return <span style={{ ...S.badge, background: c.bg, color: c.color }}>{children}</span>;
}

function Toasts({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ background: t.type === "error" ? "#c0392b" : t.type === "warning" ? "#e67e22" : "#1e6b41", color: "#fff", padding: "11px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500, minWidth: 260, boxShadow: "0 4px 20px #00000060", animation: "slideIn .25s ease" }}>
          {t.type === "success" && "✓ "}{t.type === "error" && "✕ "}{t.msg}
        </div>
      ))}
    </div>
  );
}

function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000090", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#161820", border: "1px solid #2a2d3a", borderRadius: 12, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: "1px solid #1e2028" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#f0f1f5" }}>{title}</h3>
          <button onClick={onClose} style={{ ...S.btnIcon, background: "none", border: "none", fontSize: 18, color: "#5a6070" }}>✕</button>
        </div>
        <div style={{ padding: "22px" }}>{children}</div>
      </div>
    </div>
  );
}

function Confirm({ open, onClose, onConfirm, message }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000090", zIndex: 1010, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#161820", border: "1px solid #2a2d3a", borderRadius: 12, padding: 28, maxWidth: 380, width: "90%" }}>
        <p style={{ margin: "0 0 20px", color: "#c0c6d4", lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button style={{ ...S.btn, ...S.btnSecondary }} onClick={onClose}>Cancelar</button>
          <button style={{ ...S.btn, ...S.btnDanger }} onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}

// ─── MINI BAR CHART ───────────────────────────────────────────────────────────
function BarChart({ data, height = 140 }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height, paddingTop: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: "100%", height: Math.max(4, (d.value / max) * (height - 30)), background: d.color || "#f5a623", borderRadius: "4px 4px 0 0", position: "relative", transition: "height .5s" }} title={fmt(d.value)} />
          <span style={{ fontSize: 10, color: "#5a6070", whiteSpace: "nowrap" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data, height = 120 }) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const w = 100 / (data.length - 1);
  const points = data.map((d, i) => `${i * w},${100 - ((d.value - min) / range) * 90}`).join(" ");
  return (
    <div style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5a623" stopOpacity=".3" />
            <stop offset="100%" stopColor="#f5a623" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={`0,100 ${points} 100,100`} fill="url(#lg)" />
        <polyline points={points} fill="none" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("admin@limapisos.com.br");
  const [pass, setPass] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f14", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}`}</style>
      <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp .5s ease" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 60, height: 60, background: "linear-gradient(135deg,#f5a623,#e67e00)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 26 }}>🏠</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f0f1f5", margin: 0 }}>Lima Pisos & Revestimentos</h1>
          <p style={{ color: "#5a6070", fontSize: 13, marginTop: 6 }}>Sistema de Gestão Empresarial</p>
        </div>

        <div style={{ background: "#161820", border: "1px solid #1e2028", borderRadius: 14, padding: "32px 28px" }}>
          {!forgot ? (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f1f5", margin: "0 0 6px" }}>Entrar no sistema</h2>
              <p style={{ fontSize: 13, color: "#5a6070", margin: "0 0 24px" }}>Acesse com suas credenciais</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={S.formGroup}>
                  <label style={S.formLabel}>E-mail</label>
                  <input style={S.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com.br" />
                </div>
                <div style={S.formGroup}>
                  <label style={S.formLabel}>Senha</label>
                  <input style={S.input} type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
                </div>
                <button onClick={handleLogin} disabled={loading} style={{ ...S.btn, ...S.btnPrimary, justifyContent: "center", padding: "11px 16px", fontSize: 14, marginTop: 4, opacity: loading ? .7 : 1 }}>
                  {loading ? <span style={{ animation: "pulse 1s infinite" }}>Entrando...</span> : "Entrar →"}
                </button>
              </div>
              <button onClick={() => setForgot(true)} style={{ background: "none", border: "none", color: "#f5a623", fontSize: 13, cursor: "pointer", marginTop: 16, display: "block", textAlign: "center", width: "100%" }}>
                Esqueceu a senha?
              </button>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f1f5", margin: "0 0 6px" }}>Recuperar senha</h2>
              {!forgotSent ? (
                <>
                  <p style={{ fontSize: 13, color: "#5a6070", margin: "0 0 22px" }}>Enviaremos um link para seu e-mail.</p>
                  <div style={S.formGroup}>
                    <label style={S.formLabel}>E-mail cadastrado</label>
                    <input style={S.input} type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="seu@email.com.br" />
                  </div>
                  <button onClick={() => setForgotSent(true)} style={{ ...S.btn, ...S.btnPrimary, justifyContent: "center", padding: "11px 16px", marginTop: 16, width: "100%" }}>Enviar link de recuperação</button>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📬</div>
                  <p style={{ color: "#c0c6d4", lineHeight: 1.6, fontSize: 14 }}>Link enviado! Verifique sua caixa de entrada em <strong style={{ color: "#f5a623" }}>{forgotEmail}</strong>.</p>
                </div>
              )}
              <button onClick={() => { setForgot(false); setForgotSent(false); }} style={{ background: "none", border: "none", color: "#5a6070", fontSize: 13, cursor: "pointer", marginTop: 14, display: "block", width: "100%", textAlign: "center" }}>← Voltar</button>
            </>
          )}
        </div>
        <p style={{ textAlign: "center", color: "#2a2d3a", fontSize: 12, marginTop: 20 }}>Lima Pisos & Revestimentos © 2025 • v1.0.0</p>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ products, sales, finance }) {
  const totalEstoque = products.reduce((s, p) => s + p.quantidade * p.preco, 0);
  const totalVendas = sales.reduce((s, v) => s + v.valor_total, 0);
  const entradas = finance.filter((f) => f.tipo === "entrada").reduce((s, f) => s + f.valor, 0);
  const saidas = finance.filter((f) => f.tipo === "saida").reduce((s, f) => s + f.valor, 0);
  const lucro = entradas - saidas;
  const alertas = products.filter((p) => p.quantidade <= p.minimo);

  const chartData = [
    { label: "Jan", value: 28000, color: "#2a2d3a" },
    { label: "Fev", value: 35000, color: "#2a2d3a" },
    { label: "Mar", value: 31000, color: "#2a2d3a" },
    { label: "Abr", value: 42000, color: "#2a2d3a" },
    { label: "Mai", value: totalVendas, color: "#f5a623" },
  ];

  const lineData = [
    { label: "S1", value: 8200 },
    { label: "S2", value: 11400 },
    { label: "S3", value: 9650 },
    { label: "S4", value: totalVendas },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={S.pageTitle}>Dashboard</h1>
        <p style={S.pageSub}>Visão geral do negócio — Maio 2025</p>
      </div>

      {alertas.length > 0 && (
        <div style={{ background: "#e67e2215", border: "1px solid #e67e2240", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span style={{ color: "#e67e22", fontSize: 13, fontWeight: 600 }}>{alertas.length} produto(s) com estoque baixo:</span>
          <span style={{ color: "#c0c6d4", fontSize: 13 }}>{alertas.map((p) => p.nome).join(", ")}</span>
        </div>
      )}

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Valor em Estoque", value: fmt(totalEstoque), icon: "📦", color: "#3498db" },
          { label: "Vendas do Mês", value: fmt(totalVendas), icon: "🛒", color: "#9b59b6" },
          { label: "Entradas", value: fmt(entradas), icon: "↗", color: "#2ecc71" },
          { label: "Saídas", value: fmt(saidas), icon: "↙", color: "#e74c3c" },
          { label: "Lucro do Mês", value: fmt(lucro), icon: "💰", color: lucro >= 0 ? "#2ecc71" : "#e74c3c" },
        ].map((k, i) => (
          <div key={i} style={{ ...S.statCard }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{k.icon}</div>
            <div style={{ fontSize: 11, color: "#5a6070", fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase" }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: k.color, marginTop: 4 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 22 }}>
        <div style={S.card}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#8892a4", letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 14 }}>Vendas por Mês</div>
          <BarChart data={chartData} height={150} />
        </div>
        <div style={S.card}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#8892a4", letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 6 }}>Evolução Semanal (Maio)</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f5a623", marginBottom: 10 }}>{fmt(totalVendas)}</div>
          <LineChart data={lineData} height={110} />
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Top Produtos */}
        <div style={S.card}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#8892a4", letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 14 }}>Produtos Mais Vendidos</div>
          {products.slice(0, 5).map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, background: "#f5a62320", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#f5a623" }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#c0c6d4" }}>{p.nome.slice(0, 28)}...</div>
                <div style={{ fontSize: 11, color: "#5a6070" }}>{p.categoria} · {fmtNum(p.quantidade)} unid.</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#f5a623" }}>{fmt(p.preco)}</div>
            </div>
          ))}
        </div>
        {/* Últimas vendas */}
        <div style={S.card}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#8892a4", letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 14 }}>Últimas Vendas</div>
          {sales.map((v) => (
            <div key={v.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "10px 12px", background: "#0d0f14", borderRadius: 7 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#c0c6d4" }}>{v.cliente_nome}</div>
                <div style={{ fontSize: 11, color: "#5a6070" }}>{v.data} · {v.forma_pagamento}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#2ecc71" }}>{fmt(v.valor_total)}</div>
                <Badge color="green">concluída</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ESTOQUE ──────────────────────────────────────────────────────────────────
function Estoque({ products, setProducts, toast }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState({ nome: "", categoria: "Porcelanato", marca: "", preco: "", quantidade: "", minimo: "", descricao: "" });

  const cats = ["Todos", ...new Set(INITIAL_PRODUCTS.map((p) => p.categoria))];
  const filtered = products.filter((p) => {
    const ok = catFilter === "Todos" || p.categoria === catFilter;
    const match = p.nome.toLowerCase().includes(search.toLowerCase()) || p.marca.toLowerCase().includes(search.toLowerCase());
    return ok && match;
  });

  const openNew = () => { setEditing(null); setForm({ nome: "", categoria: "Porcelanato", marca: "", preco: "", quantidade: "", minimo: 30, descricao: "" }); setShowModal(true); };
  const openEdit = (p) => { setEditing(p.id); setForm({ nome: p.nome, categoria: p.categoria, marca: p.marca, preco: p.preco, quantidade: p.quantidade, minimo: p.minimo, descricao: p.descricao }); setShowModal(true); };
  const save = () => {
    if (!form.nome || !form.preco) return toast("Preencha nome e preço.", "error");
    if (editing) {
      setProducts((p) => p.map((x) => x.id === editing ? { ...x, ...form, preco: +form.preco, quantidade: +form.quantidade, minimo: +form.minimo } : x));
      toast("Produto atualizado!");
    } else {
      setProducts((p) => [...p, { ...form, id: Date.now(), preco: +form.preco, quantidade: +form.quantidade, minimo: +form.minimo || 30, imagem: null }]);
      toast("Produto cadastrado!");
    }
    setShowModal(false);
  };
  const del = (id) => { setProducts((p) => p.filter((x) => x.id !== id)); setConfirm(null); toast("Produto excluído.", "warning"); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h1 style={S.pageTitle}>Controle de Estoque</h1>
          <p style={S.pageSub}>{products.length} produtos cadastrados</p>
        </div>
        <button style={{ ...S.btn, ...S.btnPrimary }} onClick={openNew}>+ Novo Produto</button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <input style={{ ...S.input, maxWidth: 280 }} placeholder="🔍 Buscar produto ou marca..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div style={{ display: "flex", gap: 6 }}>
          {cats.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)} style={{ ...S.btn, ...(catFilter === c ? S.btnPrimary : S.btnSecondary), padding: "7px 14px" }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>
              {["Produto", "Categoria", "Marca", "Preço", "Estoque", "Status", "Ações"].map((h) => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const low = p.quantidade <= p.minimo;
              return (
                <tr key={p.id} style={{ ...S.tr }} onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1d24")} onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
                  <td style={S.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, background: "#f5a62318", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🪟</div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#e8eaf0", fontSize: 13 }}>{p.nome}</div>
                        <div style={{ fontSize: 11, color: "#5a6070" }}>{p.descricao?.slice(0, 35)}...</div>
                      </div>
                    </div>
                  </td>
                  <td style={S.td}><Badge color="blue">{p.categoria}</Badge></td>
                  <td style={S.td} >{p.marca}</td>
                  <td style={S.td}><span style={{ fontWeight: 700, color: "#f5a623" }}>{fmt(p.preco)}</span><span style={{ color: "#5a6070", fontSize: 11 }}>/m²</span></td>
                  <td style={S.td}>
                    <div style={{ fontWeight: 700, color: low ? "#e74c3c" : "#c0c6d4" }}>{fmtNum(p.quantidade)} un.</div>
                    <div style={{ fontSize: 10, color: "#5a6070" }}>mín: {p.minimo}</div>
                  </td>
                  <td style={S.td}><Badge color={low ? "red" : "green"}>{low ? "⚠ Baixo" : "OK"}</Badge></td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ ...S.btn, ...S.btnSecondary, padding: "5px 10px" }} onClick={() => openEdit(p)}>✏</button>
                      <button style={{ ...S.btn, ...S.btnDanger, padding: "5px 10px" }} onClick={() => setConfirm(p.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#5a6070" }}>Nenhum produto encontrado.</div>}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? "Editar Produto" : "Novo Produto"}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ ...S.formGroup, gridColumn: "1/-1" }}>
            <label style={S.formLabel}>Nome do produto *</label>
            <input style={S.input} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Porcelanato Retificado Bianco 60x60" />
          </div>
          <div style={S.formGroup}>
            <label style={S.formLabel}>Categoria *</label>
            <select style={S.select} value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
              {["Porcelanato", "Cerâmica", "Revestimento", "Pastilha", "Pedra Natural", "Acessórios"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={S.formGroup}>
            <label style={S.formLabel}>Marca</label>
            <input style={S.input} value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} placeholder="Ex: Portobello, Eliane..." />
          </div>
          <div style={S.formGroup}>
            <label style={S.formLabel}>Preço (R$/m²) *</label>
            <input style={S.input} type="number" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} placeholder="0,00" />
          </div>
          <div style={S.formGroup}>
            <label style={S.formLabel}>Quantidade (m²)</label>
            <input style={S.input} type="number" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: e.target.value })} placeholder="0" />
          </div>
          <div style={{ ...S.formGroup, gridColumn: "1/-1" }}>
            <label style={S.formLabel}>Descrição</label>
            <textarea style={S.textarea} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Detalhes do produto..." />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, borderTop: "1px solid #1e2028", paddingTop: 16 }}>
          <button style={{ ...S.btn, ...S.btnSecondary }} onClick={() => setShowModal(false)}>Cancelar</button>
          <button style={{ ...S.btn, ...S.btnPrimary }} onClick={save}>{editing ? "Salvar Alterações" : "Cadastrar Produto"}</button>
        </div>
      </Modal>
      <Confirm open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita." />
    </div>
  );
}

// ─── FINANCEIRO ───────────────────────────────────────────────────────────────
function Financeiro({ finance, setFinance, toast }) {
  const [showModal, setShowModal] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [form, setForm] = useState({ tipo: "entrada", valor: "", descricao: "", categoria: "Vendas", data: new Date().toISOString().split("T")[0] });

  const filtered = finance.filter((f) => {
    const tipoOk = tipoFilter === "todos" || f.tipo === tipoFilter;
    const dateOk = !dateFilter || f.data.startsWith(dateFilter);
    return tipoOk && dateOk;
  });

  const entradas = filtered.filter((f) => f.tipo === "entrada").reduce((s, f) => s + f.valor, 0);
  const saidas = filtered.filter((f) => f.tipo === "saida").reduce((s, f) => s + f.valor, 0);
  const saldo = entradas - saidas;

  const add = () => {
    if (!form.valor || !form.descricao) return toast("Preencha todos os campos.", "error");
    setFinance((p) => [{ ...form, id: Date.now(), valor: +form.valor }, ...p]);
    toast(form.tipo === "entrada" ? "Entrada registrada!" : "Saída registrada!");
    setShowModal(false);
    setForm({ tipo: "entrada", valor: "", descricao: "", categoria: "Vendas", data: new Date().toISOString().split("T")[0] });
  };

  const del = (id) => { setFinance((p) => p.filter((f) => f.id !== id)); toast("Lançamento excluído.", "warning"); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h1 style={S.pageTitle}>Controle Financeiro</h1>
          <p style={S.pageSub}>Fluxo de caixa e movimentações</p>
        </div>
        <button style={{ ...S.btn, ...S.btnPrimary }} onClick={() => setShowModal(true)}>+ Novo Lançamento</button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 22 }}>
        <div style={S.statCard}>
          <div style={{ fontSize: 11, color: "#5a6070", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>↗ Entradas</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#2ecc71", marginTop: 4 }}>{fmt(entradas)}</div>
        </div>
        <div style={S.statCard}>
          <div style={{ fontSize: 11, color: "#5a6070", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>↙ Saídas</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#e74c3c", marginTop: 4 }}>{fmt(saidas)}</div>
        </div>
        <div style={S.statCard}>
          <div style={{ fontSize: 11, color: "#5a6070", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>💰 Saldo</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: saldo >= 0 ? "#f5a623" : "#e74c3c", marginTop: 4 }}>{fmt(saldo)}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input type="month" style={{ ...S.input, maxWidth: 180 }} value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        {["todos", "entrada", "saida"].map((t) => (
          <button key={t} onClick={() => setTipoFilter(t)} style={{ ...S.btn, ...(tipoFilter === t ? S.btnPrimary : S.btnSecondary), padding: "7px 14px", textTransform: "capitalize" }}>{t === "todos" ? "Todos" : t === "entrada" ? "↗ Entradas" : "↙ Saídas"}</button>
        ))}
      </div>

      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>{["Data", "Descrição", "Categoria", "Tipo", "Valor", ""].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id} onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1d24")} onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
                <td style={S.td}>{f.data}</td>
                <td style={S.td}><span style={{ color: "#e8eaf0", fontWeight: 500 }}>{f.descricao}</span></td>
                <td style={S.td}><Badge color="gray">{f.categoria}</Badge></td>
                <td style={S.td}><Badge color={f.tipo === "entrada" ? "green" : "red"}>{f.tipo === "entrada" ? "↗ Entrada" : "↙ Saída"}</Badge></td>
                <td style={{ ...S.td, fontWeight: 800, color: f.tipo === "entrada" ? "#2ecc71" : "#e74c3c", fontSize: 14 }}>{fmt(f.valor)}</td>
                <td style={S.td}><button style={{ ...S.btn, ...S.btnDanger, padding: "4px 8px" }} onClick={() => del(f.id)}>🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#5a6070" }}>Nenhum lançamento encontrado.</div>}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Novo Lançamento">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 10 }}>
            {["entrada", "saida"].map((t) => (
              <button key={t} onClick={() => setForm({ ...form, tipo: t })} style={{ ...S.btn, flex: 1, justifyContent: "center", padding: "10px", ...(form.tipo === t ? (t === "entrada" ? S.btnSuccess : S.btnDanger) : S.btnSecondary) }}>
                {t === "entrada" ? "↗ Entrada" : "↙ Saída"}
              </button>
            ))}
          </div>
          <div style={S.formGroup}>
            <label style={S.formLabel}>Descrição *</label>
            <input style={S.input} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição do lançamento..." />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={S.formGroup}>
              <label style={S.formLabel}>Valor (R$) *</label>
              <input style={S.input} type="number" step="0.01" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} placeholder="0,00" />
            </div>
            <div style={S.formGroup}>
              <label style={S.formLabel}>Data</label>
              <input style={S.input} type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
            </div>
            <div style={S.formGroup}>
              <label style={S.formLabel}>Categoria</label>
              <select style={S.select} value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                {["Vendas", "Compras", "Despesas Fixas", "Operacional", "Marketing", "Outros"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, borderTop: "1px solid #1e2028", paddingTop: 16 }}>
          <button style={{ ...S.btn, ...S.btnSecondary }} onClick={() => setShowModal(false)}>Cancelar</button>
          <button style={{ ...S.btn, ...S.btnPrimary }} onClick={add}>Registrar Lançamento</button>
        </div>
      </Modal>
    </div>
  );
}

// ─── CLIENTES ─────────────────────────────────────────────────────────────────
function Clientes({ clients, setClients, toast }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nome: "", telefone: "", cpf_cnpj: "", endereco: "" });
  const [confirm, setConfirm] = useState(null);

  const filtered = clients.filter((c) => c.nome.toLowerCase().includes(search.toLowerCase()) || c.cpf_cnpj.includes(search) || c.telefone.includes(search));

  const openNew = () => { setEditing(null); setForm({ nome: "", telefone: "", cpf_cnpj: "", endereco: "" }); setShowModal(true); };
  const openEdit = (c) => { setEditing(c.id); setForm({ nome: c.nome, telefone: c.telefone, cpf_cnpj: c.cpf_cnpj, endereco: c.endereco }); setShowModal(true); };
  const save = () => {
    if (!form.nome) return toast("Informe o nome do cliente.", "error");
    if (editing) {
      setClients((p) => p.map((x) => x.id === editing ? { ...x, ...form } : x));
      toast("Cliente atualizado!");
    } else {
      setClients((p) => [...p, { ...form, id: Date.now(), historico: [] }]);
      toast("Cliente cadastrado!");
    }
    setShowModal(false);
  };
  const del = (id) => { setClients((p) => p.filter((x) => x.id !== id)); setConfirm(null); toast("Cliente excluído.", "warning"); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h1 style={S.pageTitle}>Cadastro de Clientes</h1>
          <p style={S.pageSub}>{clients.length} clientes cadastrados</p>
        </div>
        <button style={{ ...S.btn, ...S.btnPrimary }} onClick={openNew}>+ Novo Cliente</button>
      </div>

      <div style={{ marginBottom: 18 }}>
        <input style={{ ...S.input, maxWidth: 360 }} placeholder="🔍 Buscar por nome, CPF/CNPJ ou telefone..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
        {filtered.map((c) => (
          <div key={c.id} style={{ ...S.card, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#f5a62320", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#f5a623" }}>
                {c.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#e8eaf0", fontSize: 14 }}>{c.nome}</div>
                <div style={{ fontSize: 12, color: "#5a6070" }}>{c.cpf_cnpj}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, color: "#8892a4" }}>
              <span>📞 {c.telefone}</span>
              <span>📍 {c.endereco}</span>
            </div>
            <div style={{ display: "flex", gap: 8, borderTop: "1px solid #1e2028", paddingTop: 12 }}>
              <button style={{ ...S.btn, ...S.btnSecondary, flex: 1, justifyContent: "center" }} onClick={() => openEdit(c)}>✏ Editar</button>
              <button style={{ ...S.btn, ...S.btnDanger, flex: 1, justifyContent: "center" }} onClick={() => setConfirm(c.id)}>🗑 Excluir</button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "#5a6070" }}>Nenhum cliente encontrado.</div>}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? "Editar Cliente" : "Novo Cliente"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={S.formGroup}>
            <label style={S.formLabel}>Nome completo / Razão Social *</label>
            <input style={S.input} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome do cliente" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={S.formGroup}>
              <label style={S.formLabel}>Telefone</label>
              <input style={S.input} value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="(11) 9xxxx-xxxx" />
            </div>
            <div style={S.formGroup}>
              <label style={S.formLabel}>CPF / CNPJ</label>
              <input style={S.input} value={form.cpf_cnpj} onChange={(e) => setForm({ ...form, cpf_cnpj: e.target.value })} placeholder="000.000.000-00" />
            </div>
          </div>
          <div style={S.formGroup}>
            <label style={S.formLabel}>Endereço</label>
            <input style={S.input} value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} placeholder="Rua, número, bairro, cidade/UF" />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, borderTop: "1px solid #1e2028", paddingTop: 16 }}>
          <button style={{ ...S.btn, ...S.btnSecondary }} onClick={() => setShowModal(false)}>Cancelar</button>
          <button style={{ ...S.btn, ...S.btnPrimary }} onClick={save}>{editing ? "Salvar" : "Cadastrar"}</button>
        </div>
      </Modal>
      <Confirm open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(confirm)} message="Excluir este cliente definitivamente?" />
    </div>
  );
}

// ─── VENDAS ───────────────────────────────────────────────────────────────────
function Vendas({ products, setProducts, clients, sales, setSales, finance, setFinance, toast }) {
  const [showModal, setShowModal] = useState(false);
  const [viewSale, setViewSale] = useState(null);
  const [clienteId, setClienteId] = useState("");
  const [pagamento, setPagamento] = useState("PIX");
  const [itens, setItens] = useState([]);
  const [prodSel, setProdSel] = useState("");
  const [qtdSel, setQtdSel] = useState(1);

  const addItem = () => {
    const p = products.find((x) => x.id === +prodSel);
    if (!p) return toast("Selecione um produto.", "error");
    if (qtdSel > p.quantidade) return toast(`Estoque insuficiente. Disponível: ${p.quantidade}`, "error");
    const existing = itens.find((i) => i.produto_id === p.id);
    if (existing) {
      setItens((prev) => prev.map((i) => i.produto_id === p.id ? { ...i, quantidade: i.quantidade + +qtdSel, total: (i.quantidade + +qtdSel) * i.unit } : i));
    } else {
      setItens((prev) => [...prev, { produto_id: p.id, produto: p.nome, quantidade: +qtdSel, unit: p.preco, total: +qtdSel * p.preco }]);
    }
    setProdSel(""); setQtdSel(1);
  };

  const removeItem = (id) => setItens((p) => p.filter((i) => i.produto_id !== id));
  const total = itens.reduce((s, i) => s + i.total, 0);

  const finalizarVenda = () => {
    if (!clienteId) return toast("Selecione um cliente.", "error");
    if (itens.length === 0) return toast("Adicione pelo menos um produto.", "error");
    const cliente = clients.find((c) => c.id === +clienteId);
    const venda = { id: Date.now(), cliente_id: +clienteId, cliente_nome: cliente.nome, valor_total: total, forma_pagamento: pagamento, data: new Date().toISOString().split("T")[0], status: "concluida", itens };
    setSales((p) => [venda, ...p]);
    setFinance((p) => [{ id: Date.now(), tipo: "entrada", valor: total, descricao: `Venda #${venda.id} - ${cliente.nome}`, data: venda.data, categoria: "Vendas" }, ...p]);
    setProducts((prev) => prev.map((p) => { const item = itens.find((i) => i.produto_id === p.id); return item ? { ...p, quantidade: p.quantidade - item.quantidade } : p; }));
    toast("Venda finalizada com sucesso! ✓");
    setShowModal(false); setItens([]); setClienteId(""); setPagamento("PIX");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h1 style={S.pageTitle}>Vendas</h1>
          <p style={S.pageSub}>{sales.length} vendas realizadas</p>
        </div>
        <button style={{ ...S.btn, ...S.btnPrimary }} onClick={() => setShowModal(true)}>+ Nova Venda</button>
      </div>

      {/* Sales summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 22 }}>
        <div style={S.statCard}>
          <div style={{ fontSize: 11, color: "#5a6070", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>Total de Vendas</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f5a623", marginTop: 4 }}>{fmt(sales.reduce((s, v) => s + v.valor_total, 0))}</div>
        </div>
        <div style={S.statCard}>
          <div style={{ fontSize: 11, color: "#5a6070", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>Nº de Vendas</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#3498db", marginTop: 4 }}>{sales.length}</div>
        </div>
        <div style={S.statCard}>
          <div style={{ fontSize: 11, color: "#5a6070", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>Ticket Médio</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#9b59b6", marginTop: 4 }}>{fmt(sales.length ? sales.reduce((s, v) => s + v.valor_total, 0) / sales.length : 0)}</div>
        </div>
      </div>

      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>{["#", "Cliente", "Data", "Pagamento", "Itens", "Total", "Status", ""].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {sales.map((v) => (
              <tr key={v.id} onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1d24")} onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
                <td style={S.td}><span style={{ color: "#5a6070", fontSize: 12 }}>#{String(v.id).slice(-4)}</span></td>
                <td style={S.td}><span style={{ fontWeight: 600, color: "#e8eaf0" }}>{v.cliente_nome}</span></td>
                <td style={S.td}>{v.data}</td>
                <td style={S.td}><Badge color="blue">{v.forma_pagamento}</Badge></td>
                <td style={S.td}>{v.itens?.length || 0} produto(s)</td>
                <td style={{ ...S.td, fontWeight: 800, color: "#2ecc71", fontSize: 14 }}>{fmt(v.valor_total)}</td>
                <td style={S.td}><Badge color="green">Concluída</Badge></td>
                <td style={S.td}><button style={{ ...S.btn, ...S.btnSecondary, padding: "5px 10px" }} onClick={() => setViewSale(v)}>👁</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Sale Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setItens([]); }} title="Nova Venda" width={640}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={S.formGroup}>
              <label style={S.formLabel}>Cliente *</label>
              <select style={S.select} value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                <option value="">Selecione...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div style={S.formGroup}>
              <label style={S.formLabel}>Forma de Pagamento</label>
              <select style={S.select} value={pagamento} onChange={(e) => setPagamento(e.target.value)}>
                {["PIX", "Dinheiro", "Cartão de Crédito", "Cartão de Débito", "Boleto Bancário", "Transferência"].map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div style={{ background: "#0d0f14", borderRadius: 8, padding: 14, border: "1px solid #1e2028" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#8892a4", textTransform: "uppercase", marginBottom: 12 }}>Adicionar Produto</div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ ...S.formGroup, flex: 1 }}>
                <label style={S.formLabel}>Produto</label>
                <select style={S.select} value={prodSel} onChange={(e) => setProdSel(e.target.value)}>
                  <option value="">Selecione...</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.nome} — {fmt(p.preco)} (estoque: {p.quantidade})</option>)}
                </select>
              </div>
              <div style={{ ...S.formGroup, width: 80 }}>
                <label style={S.formLabel}>Qtd</label>
                <input style={S.input} type="number" min="1" value={qtdSel} onChange={(e) => setQtdSel(+e.target.value)} />
              </div>
              <button style={{ ...S.btn, ...S.btnPrimary, whiteSpace: "nowrap" }} onClick={addItem}>+ Adicionar</button>
            </div>
          </div>

          {itens.length > 0 && (
            <div>
              <table style={S.table}>
                <thead><tr>{["Produto", "Qtd", "Unit.", "Total", ""].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {itens.map((i) => (
                    <tr key={i.produto_id}>
                      <td style={S.td}>{i.produto}</td>
                      <td style={S.td}>{i.quantidade} m²</td>
                      <td style={S.td}>{fmt(i.unit)}</td>
                      <td style={{ ...S.td, fontWeight: 700, color: "#f5a623" }}>{fmt(i.total)}</td>
                      <td style={S.td}><button style={{ ...S.btn, ...S.btnDanger, padding: "3px 8px" }} onClick={() => removeItem(i.produto_id)}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: "right", marginTop: 12, fontSize: 18, fontWeight: 800, color: "#2ecc71" }}>Total: {fmt(total)}</div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, borderTop: "1px solid #1e2028", paddingTop: 16 }}>
          <button style={{ ...S.btn, ...S.btnSecondary }} onClick={() => { setShowModal(false); setItens([]); }}>Cancelar</button>
          <button style={{ ...S.btn, ...S.btnPrimary }} onClick={finalizarVenda}>✓ Finalizar Venda</button>
        </div>
      </Modal>

      {/* View Sale */}
      <Modal open={!!viewSale} onClose={() => setViewSale(null)} title="Comprovante de Venda">
        {viewSale && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #1e2028" }}>
              <div style={{ fontSize: 22 }}>🏠</div>
              <div style={{ fontWeight: 800, color: "#f5a623", fontSize: 16 }}>Lima Pisos & Revestimentos</div>
              <div style={{ color: "#5a6070", fontSize: 12 }}>CNPJ: 00.000.000/0001-00</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16, fontSize: 13 }}>
              <div><span style={{ color: "#5a6070" }}>Cliente: </span><span style={{ color: "#e8eaf0", fontWeight: 600 }}>{viewSale.cliente_nome}</span></div>
              <div><span style={{ color: "#5a6070" }}>Data: </span><span style={{ color: "#e8eaf0" }}>{viewSale.data}</span></div>
              <div><span style={{ color: "#5a6070" }}>Pagamento: </span><span style={{ color: "#e8eaf0" }}>{viewSale.forma_pagamento}</span></div>
              <div><span style={{ color: "#5a6070" }}>Status: </span><Badge color="green">Concluída</Badge></div>
            </div>
            <table style={S.table}>
              <thead><tr>{["Produto", "Qtd", "Unit.", "Total"].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {viewSale.itens?.map((i, idx) => (
                  <tr key={idx}>
                    <td style={S.td}>{i.produto || i.produto}</td>
                    <td style={S.td}>{i.quantidade || i.qtd}</td>
                    <td style={S.td}>{fmt(i.unit || i.unit)}</td>
                    <td style={{ ...S.td, fontWeight: 700, color: "#f5a623" }}>{fmt(i.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: "right", marginTop: 14, fontSize: 20, fontWeight: 800, color: "#2ecc71", borderTop: "1px solid #1e2028", paddingTop: 14 }}>TOTAL: {fmt(viewSale.valor_total)}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV = [
  { key: "dashboard", icon: "📊", label: "Dashboard" },
  { key: "estoque", icon: "📦", label: "Estoque" },
  { key: "financeiro", icon: "💰", label: "Financeiro" },
  { key: "clientes", icon: "👥", label: "Clientes" },
  { key: "vendas", icon: "🛒", label: "Vendas" },
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [finance, setFinance] = useState(INITIAL_FINANCE);
  const [sales, setSales] = useState(INITIAL_SALES);
  const { toasts, add: toast } = useToast();

  if (!loggedIn) return <><LoginScreen onLogin={() => setLoggedIn(true)} /><Toasts toasts={toasts} /></>;

  const alertCount = products.filter((p) => p.quantidade <= p.minimo).length;
  const sideW = collapsed ? 64 : 240;

  return (
    <div style={S.app}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:none; } }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:#0d0f14; }
        ::-webkit-scrollbar-thumb { background:#2a2d3a; border-radius:2px; }
        input:focus, select:focus, textarea:focus { border-color:#f5a623 !important; box-shadow:0 0 0 2px #f5a62320; }
        button:hover { opacity:.9; }
        a { color:#f5a623; }
      `}</style>

      {/* Sidebar */}
      <div style={{ ...S.sidebar, width: sideW, transition: "width .3s" }}>
        <div style={S.logo}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#f5a623,#e67e00)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🏠</div>
            {!collapsed && (
              <div>
                <div style={S.logoText}>Lima Pisos</div>
                <div style={S.logoSub}>Sistema ERP</div>
              </div>
            )}
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: "auto", paddingTop: 8 }}>
          {!collapsed && <div style={S.navSection}>Menu</div>}
          {NAV.map((n) => (
            <button key={n.key} onClick={() => setPage(n.key)} style={{ ...S.navItem, ...(page === n.key ? S.navItemActive : {}), justifyContent: collapsed ? "center" : "flex-start" }} title={collapsed ? n.label : ""}>
              <span style={S.navIcon}>{n.icon}</span>
              {!collapsed && <span>{n.label}</span>}
              {!collapsed && n.key === "estoque" && alertCount > 0 && (
                <span style={{ marginLeft: "auto", background: "#e74c3c", color: "#fff", fontSize: 10, fontWeight: 800, padding: "1px 6px", borderRadius: 10 }}>{alertCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: "12px 8px", borderTop: "1px solid #1e2028" }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{ ...S.navItem, justifyContent: collapsed ? "center" : "flex-start", margin: 0, width: "100%" }}>
            <span>{collapsed ? "→" : "←"}</span>
            {!collapsed && <span style={{ fontSize: 12 }}>Recolher menu</span>}
          </button>
          <button onClick={() => setLoggedIn(false)} style={{ ...S.navItem, justifyContent: collapsed ? "center" : "flex-start", margin: "4px 0 0", width: "100%", color: "#e74c3c" }}>
            <span>🚪</span>
            {!collapsed && <span style={{ fontSize: 12 }}>Sair do sistema</span>}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ ...S.main, marginLeft: sideW, transition: "margin .3s" }}>
        {/* Topbar */}
        <div style={S.topbar}>
          <div style={{ fontSize: 14, color: "#5a6070" }}>
            {NAV.find((n) => n.key === page)?.icon} <span style={{ color: "#e8eaf0", fontWeight: 600, marginLeft: 6 }}>{NAV.find((n) => n.key === page)?.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {alertCount > 0 && (
              <button onClick={() => setPage("estoque")} style={{ background: "#e74c3c20", border: "1px solid #e74c3c40", borderRadius: 20, padding: "4px 12px", color: "#e74c3c", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                ⚠ {alertCount} alerta(s) de estoque
              </button>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f5a62320", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5a623", fontWeight: 800, fontSize: 13 }}>A</div>
              <div style={{ fontSize: 13, color: "#8892a4" }}>Admin</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={S.content}>
          {page === "dashboard" && <Dashboard products={products} sales={sales} finance={finance} />}
          {page === "estoque" && <Estoque products={products} setProducts={setProducts} toast={toast} />}
          {page === "financeiro" && <Financeiro finance={finance} setFinance={setFinance} toast={toast} />}
          {page === "clientes" && <Clientes clients={clients} setClients={setClients} toast={toast} />}
          {page === "vendas" && <Vendas products={products} setProducts={setProducts} clients={clients} sales={sales} setSales={setSales} finance={finance} setFinance={setFinance} toast={toast} />}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 28px", borderTop: "1px solid #1e2028", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#2a2d3a" }}>Lima Pisos & Revestimentos © 2025 — Sistema ERP v1.0</span>
          <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" style={{ background: "#25D36620", border: "1px solid #25D36640", color: "#25D366", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            📱 WhatsApp
          </a>
        </div>
      </div>

      <Toasts toasts={toasts} />
    </div>
  );
}
