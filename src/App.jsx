import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const scheduleData = {
  manha: {
    label: "MANHÃ",
    period: "05:30 → 11:00",
    icon: "☀️",
    accentColor: "#F7B731",
    blocks: [
      { time:"05:30", dur:"15min", title:"Despertar & Hidratação", desc:"Água com limão, respiração profunda, 3 coisas pelas quais és grato.", tip:"Coloca um copo d'água na mesa de cabeceira antes de dormir.", tags:["saúde"], icon:"🌅" },
      { time:"05:45", dur:"20min", title:"Devocional & Oração", desc:"Leitura bíblica, entrega do dia ao Senhor. Define 1 versículo foco.", tip:"Este bloco alimenta tudo o resto — nunca o saltes.", tags:["fé"], icon:"🙏" },
      { time:"06:05", dur:"30min", title:"Treino de Médio-Campista ⚽", desc:"Os teus 30min de exercícios específicos da posição. Consistência > intensidade.", tip:"Prepara o equipamento na noite anterior. Zero atrito = zero desculpas.", tags:["saúde","desporto"], icon:"⚽", isHighlight:true, highlightColor:"#2DD4BF" },
      { time:"06:35", dur:"30min", title:"Banho Frio + Cuidados Pessoais", desc:"Banho frio activa cortisol natural, aumenta energia e estado de alerta.", tip:"Últimos 30 segundos em água fria — muda completamente o estado mental.", tags:["saúde"], icon:"🚿" },
      { time:"07:05", dur:"25min", title:"Pequeno-Almoço Power", desc:"Proteína + carboidratos complexos + fruta + água. Combustível cerebral.", tip:"Evita açúcar — destrói o foco em menos de 1 hora.", tags:["nutrição"], icon:"🍳" },
      { time:"07:30", dur:"90min", title:"DEEP WORK #1 — Aprendizagem Matinal", desc:"Um(a) video/aula 30min → Um livro 30min → Prática 30min.", tip:"Modo avião no telemóvel. Sem redes sociais. É o teu bloco mais valioso. De acordo a ROTAÇÃO SEMANAL", tags:["estudo"], icon:"🧠", isDeep:true },
      { time:"09:00", dur:"45min", title:"Gestão: Recreio e Desporto + Afro Studio", desc:"Mensagens urgentes, tarefas da semana, Recreio e Desporto da JIMUCL, fotos pendentes.", tip:"Limite rígido de 45min. Usa lista de prioridades para não desviar.", tags:["ministério","trabalho"], icon:"📋" },
      { time:"09:45", dur:"75min", title:"Preparação & Organização de Saída", desc:"Rever plano do dia, preparar material de estudo, arrumar. Saída às 11h pontual.", tip:"Escreve as 3 prioridades do dia numa folha antes de sair.", tags:["logística"], icon:"🎒" },
    ]
  },
  tarde: {
    label: "TARDE / ESTUDO",
    period: "11:00 → 19:00",
    icon: "🌤",
    accentColor: "#60A5FA",
    blocks: [
      { time:"11:00", dur:"2h", title:"Deslocação Produtiva (Táxi/Escola antes das aulas)", desc:"BBC Learning English, 6 Minute English, ou vídeos de gestão/aprendizado no YouTube/TED. ", tip:"O táxi é uma sala de aula e chegar antes das aulas— 2h por dia × 5 dias = 500h/ano de aprendizagem.", tags:["aprendizagem"], icon:"🚕" },
      { time:"13:00", dur:"4h55min", title:"DEEP WORK #2 — Aula", desc:"Presta atenção. Faz perguntas. Toma notas estruturadas (título + pontos + dúvidas).", tip:"Técnica Pomodoro: 50min estudo → 10min pausa × 3 ciclos.", tags:["estudo"], icon:"💻", isDeep:true },
      { time:"5min", title:"Intervalos entre tempos", desc:"Lanche, hidratação, sem ecrãs nos 05min.", tip:"Sol + movimento físico resetam o foco. Não trabalhes durante esta pausa.", tags:["Hidratação","nutrição"], icon:"🍎" },
            { time:"17:55", dur:"5min", title:"Fim das aulas — Saída", desc:"No táxi de regresso: resume mentalmente o que aprendeste hoje (3 pontos principais).", tip:"Técnica Feynman: explica o que aprendeste como se ensinasses a alguém.", tags:["estudo","reflexão"], icon:"📝" },
    ]
  },
  noite: {
    label: "NOITE",
    period: "19:00 → 22:00",
    icon: "🌙",
    accentColor: "#A78BFA",
    blocks: [
      { time:"19:00", dur:"10min", title:"Retorno & Descompressão", desc:"Chegada. 10min sem telemóvel. Transição consciente entre modo estudo e descanso.", tip:"Muda de roupa — sinal psicológico de mudança de modo para o cérebro.", tags:["recuperação"], icon:"🏠" },
      { time:"19:10", dur:"30min", title:"Jantar Nutritivo", desc:"Proteína + vegetais + água. Refeição leve e nutritiva. Sem TV durante.", tip:"Come devagar, com gratidão. Hidratação antes e após a refeição.", tags:["nutrição"], icon:"🍽️" },
      { time:"19:40", dur:"5min", title:"Transição", desc:"Pequena pausa antes de entrar em modo de trabalho criativo.", tip:"Prepara o espaço de trabalho antes de sentar.", tags:["recuperação"], icon:"✨" },
      { time:"19:45", dur:"30min", title:"Secretariado — Juventude da IMUCL ou Trabalho Afro Studio", desc:"Planeamento ou revisão de actividades/dinâmicas recreativas e desportivas da Juventude Metodista..... Edição de fotos, comunicação com clientes, redes sociais, orçamentos de eventos.", tip:"Separa sempre 10min para planear o próximo evento da semana.", tags:["ministério","trabalho"],  icon:"⛪📸", isHighlight:true, highlightColor:"#F472B6" },
      { time:"20:15", dur:"30min", title:"Aula Noturna", desc:"1 vídeo / módulo de Gestão Comercial ou um livro. Máximo 30 minutos.", tip:"Cérebro cansado retém pouco. Qualidade > quantidade neste bloco.", tags:["estudo"], icon:"🎓" },
      { time:"20:45", dur:"30min", title:"Revisão do Dia + Plano Amanhã", desc:"3 vitórias do dia. 3 prioridades de amanhã. Agradecimento e oração.", tip:"Escreve à mão — consolida a memória e aumenta o compromisso.", tags:["reflexão","fé"], icon:"📔" },
      { time:"21h15", dur:"45min", title:"Higiene + Ritual de Sono", desc:"Sem ecrãs. Leitura da Bíblia ou livro físico. Oração de encerramento.", tip:"Quarto fresco e escuro = sono mais profundo e reparador.", tags:["recuperação","fé"], icon:"🌙" },
      { time:"22:00", dur:"7h30", title:"SONO REPARADOR", desc:"Recuperação muscular do treino + consolidação de toda a aprendizagem do dia.", tip:"Alarme às 5h30, fora do alcance da cama. Levanta imediatamente.", tags:["saúde"], icon:"😴", isSleep:true },
    ]
  }
};

const studyRotation = [
  { day:"SEG", focus:"Programação", sub:"Lógica + Prática", color:"#60A5FA" },
  { day:"TER", focus:"Photoshop / Lightroom", sub:"Design Visual", color:"#F472B6" },
  { day:"QUA", focus:"Inglês", sub:"Fluência + Escrita", color:"#86EFAC" },
  { day:"QUI", focus:"Gestão Comercial", sub:"Negócios e Clientes", color:"#F7B731" },
  { day:"SEX", focus:"Grow up mind and CapCut.", sub:"Videos & Livros", color:"#FB923C" },
];

const pillars = [
  { icon:"🙏", label:"FÉ", desc:"Serviço ao Senhor e à Juventude Metodista Unida", color:"#A78BFA" },
  { icon:"⚽", label:"DESPORTO", desc:"Treino diário 30min — médio-campista", color:"#2DD4BF" },
  { icon:"🧠", label:"APRENDIZAGEM", desc:"Prog · Design · Inglês · Gestão · CapCut", color:"#60A5FA" },
  { icon:"📸", label:"NEGÓCIO", desc:"Afro Studio + Gestor Comercial/Operacio.", color:"#F472B6" },
  { icon:"🍃", label:"SAÚDE", desc:"Nutrição · Sono · Hidratação · Treino", color:"#86EFAC" },
  { icon:"📈", label:"CRESCIMENTO", desc:"Revisão diária · Metas · Evolução", color:"#F7B731" },
];

const goldenRules = [
  ["🔇","Modo AVIÃO durante todos os blocos Deep Work — sem excepções"],
  ["📵","Sem redes sociais antes das 12h00 — protege o foco matinal sagrado"],
  ["💧","3 litros de água diários — hidratação directa = performance cognitiva"],
  ["📒","1 diário físico — escreve metas, vitórias e plano do dia à mão"],
  ["🔁","Revisão semanal todo domingo — ajusta o que não funcionou"],
  ["📈","Aplica o que estudas ao Afro Studio — aprender fazendo é 10× mais rápido"],
  ["⚽","Os teus 30min de treino são inegociáveis — corpo forte = mente forte"],
  ["🌙","22h00 é a hora de dormir — o sono é o teu melhor suplemento"],
];

// ─── HABITS DATA ──────────────────────────────────────────────────────────────

const habitsData = {
  morning: [
    { emoji:"💧", label:"Acordar 5h30 + copo de água" },
    { emoji:"🙏", label:"Oração / Meditação (20 min)" },
    { emoji:"⚽", label:"Treino de médio campista (30 min)" },
    { emoji:"🥗", label:"Pequeno-almoço nutritivo" },
  ],
  day: [
    { emoji:"📚", label:"Estudo matinal (90min — bloco 1)" },
    { emoji:"⛪", label:"Tarefa Igreja / Recreio & Desporto" },
    { emoji:"🎒", label:"Saída pontual 11h para escola" },
    { emoji:"🏫", label:"Presença total na escola" },
  ],
  night: [
    { emoji:"📕", label:"Leitura (30 min)" },
    { emoji:"📝", label:"Revisão + plano amanhã" },
    { emoji:"😴", label:"Dormir às 22h00" },
  ]
};

const dailyQuestions = [
  "O que fará maior diferença hoje?",
  "Que habilidade estás a desenvolver esta semana?",
  "O que podes concluir antes das 10h?",
  "Qual é o maior obstáculo actual?",
  "Que tarefa estás a evitar?",
  "Como podes servir melhor hoje?",
  "Que decisão tens adiado que podes tomar agora?",
  "O que fiz bem ?",
  "O que posso melhorar ?",
  "Qual é a prioridade de amanhã ? ",
  "O que melhorar amanhã?" ,
];

// ─── DATE HELPERS ─────────────────────────────────────────────────────────────
// Retorna a data de hoje no formato YYYY-MM-DD, usada como chave para
// guardar dados por dia e para escolher a pergunta/estado de forma estável.
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Escolhe um item de uma lista de forma determinística a partir de uma string
// (ex: a data de hoje) — assim o mesmo dia sempre mostra o mesmo item.
function pickForToday(list, seedStr) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  return list[hash % list.length];
}

// ─── TAG CONFIG ───────────────────────────────────────────────────────────────

const TAG_CONFIG = {
  saúde:       { bg:"rgba(45,212,191,0.10)", border:"rgba(45,212,191,0.25)", text:"#2DD4BF" },
  fé:          { bg:"rgba(167,139,250,0.10)", border:"rgba(167,139,250,0.25)", text:"#A78BFA" },
  estudo:      { bg:"rgba(96,165,250,0.10)", border:"rgba(96,165,250,0.25)", text:"#60A5FA" },
  trabalho:    { bg:"rgba(134,239,172,0.10)", border:"rgba(134,239,172,0.25)", text:"#86EFAC" },
  ministério:  { bg:"rgba(192,132,252,0.10)", border:"rgba(192,132,252,0.25)", text:"#C084FC" },
  nutrição:    { bg:"rgba(251,146,60,0.10)", border:"rgba(251,146,60,0.25)", text:"#FB923C" },
  aprendizagem:{ bg:"rgba(147,197,253,0.10)", border:"rgba(147,197,253,0.25)", text:"#93C5FD" },
  reflexão:    { bg:"rgba(94,234,212,0.10)", border:"rgba(94,234,212,0.25)", text:"#5EEAD4" },
  recuperação: { bg:"rgba(129,140,248,0.10)", border:"rgba(129,140,248,0.25)", text:"#818CF8" },
  logística:   { bg:"rgba(156,163,175,0.10)", border:"rgba(156,163,175,0.25)", text:"#9CA3AF" },
  desporto:    { bg:"rgba(45,212,191,0.10)", border:"rgba(45,212,191,0.25)", text:"#2DD4BF" },
};

// ─── NAV TABS ─────────────────────────────────────────────────────────────────

const NAV_TABS = [
  { id:"rotina",  label:"Rotina",   icon:"📋" },
  { id:"habits",  label:"Hábitos",  icon:"✅" },
  { id:"focus",   label:"Foco",     icon:"⚡" },
  { id:"timer",   label:"Timer",    icon:"⏱" },
  { id:"week",    label:"Semana",   icon:"📅" },
  { id:"x10ia",   label:"X10 ",     icon:"🧠" },
];

// ─── HABIT TRACKER COMPONENT ──────────────────────────────────────────────────

function HabitTracker() {
  const storageKey = `x10habits_${getTodayKey()}`;

  const [state, setState] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch { return {}; }
  });

  const toggle = (key) => {
    const next = { ...state, [key]: !state[key] };
    setState(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const reset = () => {
    if (window.confirm("Reiniciar todos os hábitos de hoje?")) {
      setState({});
      localStorage.setItem(storageKey, "{}");
    }
  };

  const total = Object.values(habitsData).reduce((sum, arr) => sum + arr.length, 0);
  const done = Object.values(state).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  const groupColors = { morning:"#F7B731", day:"#60A5FA", night:"#A78BFA" };
  const groupLabels = { morning:"🌅 MANHÃ", day:"☀️ DIA", night:"🌙 NOITE" };

  return (
    <div>
      {/* Progress */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#4B5563", letterSpacing:1.5, textTransform:"uppercase" }}>Progresso do Dia</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#F7B731" }}>{done} / {total} ({pct}%)</span>
        </div>
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:4, height:6, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#00E5FF,#00FF88)", borderRadius:4, transition:"width .4s ease" }} />
        </div>
      </div>

      {Object.entries(habitsData).map(([group, habits]) => (
        <div key={group} style={{ marginBottom:20, background:"rgba(13,17,26,0.7)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"16px 18px" }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, letterSpacing:".5px", color:groupColors[group], marginBottom:14 }}>
            {groupLabels[group]}
          </div>
          {habits.map((h, i) => {
            const key = `${group}_${i}`;
            const isDone = !!state[key];
            return (
              <div key={key} onClick={() => toggle(key)} style={{
                display:"flex", alignItems:"center", gap:12, padding:"11px 0",
                borderBottom: i < habits.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                cursor:"pointer"
              }}>
                <div style={{
                  width:22, height:22, borderRadius:4, flexShrink:0,
                  border: isDone ? "2px solid #00FF88" : "2px solid rgba(255,255,255,0.12)",
                  background: isDone ? "#00FF88" : "transparent",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, color:"#000", transition:"all .2s"
                }}>
                  {isDone ? "✓" : ""}
                </div>
                <span style={{ fontSize:16 }}>{h.emoji}</span>
                <span style={{ fontSize:14, color: isDone ? "#374151" : "#E2E8F0", textDecoration: isDone ? "line-through" : "none", transition:"all .2s" }}>
                  {h.label}
                </span>
              </div>
            );
          })}
        </div>
      ))}

      <button onClick={reset} style={{
        width:"100%", padding:"11px", background:"transparent",
        border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, color:"#4B5563",
        fontFamily:"'DM Mono',monospace", fontSize:12, letterSpacing:1, cursor:"pointer",
        transition:"border-color .2s, color .2s", marginTop:6
      }}
        onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; e.target.style.color = "#E2E8F0"; }}
        onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.color = "#4B5563"; }}
      >
        ↺ Reiniciar para amanhã
      </button>
    </div>
  );
}

// ─── FOCUS SECTION ────────────────────────────────────────────────────────────

function FocusSection() {
  const blocks = [
    {
      color:"#00E5FF", bg:"rgba(0,229,255,0.04)", border:"rgba(0,229,255,0.15)",
      title:"🎯 MÉTODO DE ESTUDO ACTIVO",
      items:[
        "<strong>LEARN:</strong> Estuda o conteúdo (vídeo, livro, tutorial) — 30 min",
        "<strong>APPLY:</strong> Pratica imediatamente — faz um exercício, projecto ou resumo — 30 min",
        "<strong>TEACH:</strong> Explica para ti mesmo em voz alta — consolida a memória",
        "<strong>REVIEW:</strong> Revê no dia seguinte os pontos principais — 5 min",
      ]
    },
    {
      color:"#A78BFA", bg:"rgba(167,139,250,0.04)", border:"rgba(167,139,250,0.15)",
      title:"📱 GESTÃO DO TELEMÓVEL",
      items:[
        "Telemóvel em modo silencioso durante blocos de estudo",
        "Redes sociais: máximo 60min por dia (tarde entre escola e noite)",
        "Notificações desactivadas excepto chamadas urgentes",
        "Grayscale no telemóvel durante horas de trabalho",
        "Sem telemóvel 30min antes de dormir — regra de ferro",
      ]
    },
    {
      color:"#F7B731", bg:"rgba(247,183,49,0.04)", border:"rgba(247,183,49,0.15)",
      title:"⚡ TÉCNICA POMODORO ADAPTADA",
      items:[
        "<strong>45 min de foco total</strong> → 10 min de pausa activa",
        "Durante os 45min: só UMA tarefa — sem multitasking",
        "Pausa activa: levanta, água, 10 polichinelos, olha pela janela",
        "Após 3 pomodoros: pausa maior de 20 min (come, descansa)",
      ]
    },
    {
      color:"#86EFAC", bg:"rgba(134,239,172,0.04)", border:"rgba(134,239,172,0.15)",
      title:"🗓 PLANEAMENTO SEMANAL DE ESTUDOS",
      items:[
        "<strong>Segunda:</strong> Programação (linguagem que escolheres)",
        "<strong>Terça:</strong> Photoshop + Lightroom (técnicas de edição)",
        "<strong>Quarta:</strong> Inglês (gramática, vocabulário, conversação)",
        "<strong>Quinta:</strong> Gestão Comercial + Operacional + Marketing",
        "<strong>Sexta:</strong> Grow up + CapCut (edição de vídeo, reels, conteúdo)",
        "<strong>Sábado manhã:</strong> Revisão geral + Projecto livre",
        "<strong>Domingo:</strong> Igreja, família, descanso activo, planeamento da semana seguinte",
      ]
    },
    {
      color:"#FB923C", bg:"rgba(251,146,60,0.04)", border:"rgba(251,146,60,0.15)",
      title:"📸 CRESCIMENTO AFRO STUDIO",
      items:[
        "1 foto editada por dia — mesmo que simples, mantém o músculo criativo",
        "Estudar 1 técnica nova de Lightroom por semana",
        "Criar portfólio digital progressivo",
        "Aprender sobre precificação e captação de clientes (gestão comercial aplicada)",
        "CapCut para criar reels dos eventos fotografados → mais visibilidade",
      ]
    },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {blocks.map((b, i) => (
        <div key={i} style={{ background:b.bg, border:`1px solid ${b.border}`, borderRadius:14, padding:"18px 20px" }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:b.color, marginBottom:12, letterSpacing:"-.2px" }}>
            {b.title}
          </div>
          <ul style={{ listStyle:"none", padding:0, display:"flex", flexDirection:"column", gap:7 }}>
            {b.items.map((item, j) => (
              <li key={j} style={{ display:"flex", gap:10, alignItems:"flex-start", fontSize:13, color:"#6B7280", lineHeight:1.55 }}>
                <span style={{ color:b.color, fontSize:10, marginTop:4, flexShrink:0 }}>▸</span>
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ─── TIMER COMPONENT ──────────────────────────────────────────────────────────

function TimerSection() {
  const modes = [
    { mins:25, label:"FOCO PROFUNDO — 25MIN" },
    { mins:45, label:"BLOCO ELITE — 45MIN" },
    { mins:30, label:"TREINO FUTEBOL — 30MIN" },
    { mins:10, label:"PAUSA ACTIVA — 10MIN" },
    { mins:5,  label:"REVISÃO RÁPIDA — 5MIN" },
  ];

  const [modeIdx, setModeIdx] = useState(0);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(() => parseInt(localStorage.getItem("x10sessions") || "0"));
  const intervalRef = useRef(null);

  const pad = (n) => String(n).padStart(2, "0");
  const display = `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;

  const beep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
      osc.start(); osc.stop(ctx.currentTime + 1);
    } catch(e) {}
  };

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setSessions(prev => {
            const next = prev + 1;
            localStorage.setItem("x10sessions", next);
            return next;
          });
          beep();
          return modes[modeIdx].mins * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, modeIdx]);

  const selectMode = (idx) => {
    if (running) return;
    setModeIdx(idx);
    setSeconds(modes[idx].mins * 60);
  };

  const btnStyle = (active) => ({
    fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:1,
    padding:"7px 16px", borderRadius:20,
    border: active ? "1px solid rgba(0,229,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
    background: active ? "rgba(0,229,255,0.08)" : "transparent",
    color: active ? "#00E5FF" : "#4B5563",
    cursor:"pointer", transition:"all .2s"
  });

  return (
    <div style={{ background:"rgba(13,17,26,0.7)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"24px 22px" }}>
      {/* Modes */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:28 }}>
        {modes.map((m, i) => (
          <button key={i} onClick={() => selectMode(i)} style={btnStyle(modeIdx === i)}>
            {m.mins} min{i === 2 ? " ⚽" : i === 3 ? " 😴" : i === 4 ? " 📖" : ""}
          </button>
        ))}
      </div>

      {/* Display */}
      <div style={{ textAlign:"center", paddingBottom:24 }}>
        <div style={{
          fontFamily:"'Bebas Neue',sans-serif", fontSize:88, letterSpacing:4,
          color:"#00E5FF", textShadow:"0 0 40px rgba(0,229,255,0.35)", lineHeight:1
        }}>
          {display}
        </div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#4B5563", letterSpacing:3, marginTop:8, textTransform:"uppercase" }}>
          {modes[modeIdx].label}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
        {!running ? (
          <button onClick={() => setRunning(true)} style={{
            fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, letterSpacing:1.5,
            textTransform:"uppercase", padding:"11px 28px", borderRadius:8,
            background:"#00E5FF", color:"#000", border:"1px solid #00E5FF", cursor:"pointer", transition:"all .2s"
          }}>▶ {seconds < modes[modeIdx].mins * 60 ? "CONTINUAR" : "INICIAR"}</button>
        ) : (
          <button onClick={() => { clearInterval(intervalRef.current); setRunning(false); }} style={{
            fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, letterSpacing:1.5,
            textTransform:"uppercase", padding:"11px 28px", borderRadius:8,
            background:"transparent", color:"#00E5FF", border:"1px solid #00E5FF", cursor:"pointer"
          }}>⏸ PAUSAR</button>
        )}
        <button onClick={() => { clearInterval(intervalRef.current); setRunning(false); setSeconds(modes[modeIdx].mins * 60); }} style={{
          fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, letterSpacing:1.5,
          textTransform:"uppercase", padding:"11px 28px", borderRadius:8,
          background:"transparent", color:"#E2E8F0", border:"1px solid rgba(255,255,255,0.12)", cursor:"pointer"
        }}>↺ RESET</button>
      </div>

      {/* Sessions */}
      <div style={{ marginTop:28, paddingTop:20, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#2D3748", letterSpacing:2, marginBottom:12, textTransform:"uppercase" }}>
          SESSÕES HOJE
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", minHeight:18 }}>
          {Array.from({ length: sessions }).map((_, i) => (
            <div key={i} style={{ width:12, height:12, borderRadius:"50%", background:"#00E5FF", boxShadow:"0 0 8px rgba(0,229,255,0.5)" }} />
          ))}
        </div>
        <div style={{ marginTop:12, fontFamily:"'DM Mono',monospace", fontSize:12, color:"#374151" }}>
          {sessions} sessão{sessions !== 1 ? "ões" : ""} completada{sessions !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}

// ─── WEEK SECTION ─────────────────────────────────────────────────────────────

function WeekSection() {
  const days = [
    { name:"SEG", items:["⚽ Treino 6h","💻 Programação","⛪ Igreja tasks","🏫 Escola 13h","📖 Leitura noite"] },
    { name:"TER", items:["⚽ Treino 6h","🎨 Photoshop/Lr","📸 Afro Studio","🏫 Escola 13h","📖 Leitura noite"] },
    { name:"QUA", items:["⚽ Treino 6h","🇬🇧 Inglês","⛪ Igreja tasks","🏫 Escola 13h","📖 Leitura noite"] },
    { name:"QUI", items:["⚽ Treino 6h","💼 Gestão/Mktg","📸 Afro Studio","🏫 Escola 13h","📖 Leitura noite"] },
    { name:"SEX", items:["⚽ Treino 6h","🎬 CapCut/Grow up","📸 Afro Studio","🏫 Escola 13h","📖 Reflexão semanal"] },
  ];

  const goals = [
    { num:1, color:"#00E5FF", title:"Dominar Lightroom — Edição profissional", desc:"Meta: editar um evento completo em menos de 2 horas" },
    { num:2, color:"#00FF88", title:"Inglês nível conversacional básico", desc:"Meta: apresentar a tua empresa em inglês sem hesitação" },
    { num:3, color:"#FB923C", title:"Criar plano de negócio Afro Studio", desc:"Meta: preços, pacotes, estratégia de captação de clientes definidos" },
    { num:4, color:"#A78BFA", title:"Construir rotina 90 dias seguidos", desc:"Meta: 90% de consistência no tracker de hábitos" },
  ];

  return (
    <div>
      {/* Tip */}
      <div style={{ background:"rgba(247,183,49,0.06)", border:"1px solid rgba(247,183,49,0.2)", borderRadius:12, padding:"14px 16px", marginBottom:22 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color:"#F7B731", letterSpacing:1, marginBottom:6 }}>
          📅 ESTRUTURA DA SEMANA
        </div>
        <div style={{ fontSize:13, color:"#92751A", lineHeight:1.6 }}>
          Escola 13h–18h/19h · Sais de casa 11h · Manhã livre para produzir · Noite para crescer
        </div>
      </div>

      {/* Week grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10, marginBottom:20 }}>
        {days.map(d => (
          <div key={d.name} style={{ background:"rgba(13,17,26,0.7)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"14px 13px" }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:17, letterSpacing:1, color:"#00E5FF", marginBottom:10 }}>{d.name}</div>
            {d.items.map((item, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#374151", padding:"3px 0" }}>
                <span style={{ color:"#00E5FF", fontSize:9 }}>·</span>{item}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Sat/Sun */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
        {[
          { name:"🏖 SÁBADO", items:["⚽ Treino livre ou jogo","📚 Revisão geral (2h)","⛪ Igreja tasks","👨‍👩‍👦 Família + Descanso","📸 Afro Studio (se eventos)"] },
          { name:"⛪ DOMINGO", items:["🙏 Igreja + Secretariado","👨‍👩‍👦 Família + Amigos","🚶 Caminhada activa","📖 Leitura leve","🗓 Plano da semana seguinte"] },
        ].map(col => (
          <div key={col.name} style={{ background:"rgba(13,17,26,0.7)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"14px 14px" }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:16, letterSpacing:1, color:"#E2E8F0", marginBottom:10 }}>{col.name}</div>
            {col.items.map((item, i) => (
              <div key={i} style={{ fontSize:11, color:"#374151", padding:"3px 0", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ color:"#A78BFA", fontSize:9 }}>·</span>{item}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 90-day goals */}
      <div style={{ background:"rgba(13,17,26,0.7)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"20px 20px" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"#E2E8F0", marginBottom:16, letterSpacing:"-.2px" }}>
          📈 METAS A 90 DIAS
        </div>
        {goals.map(g => (
          <div key={g.num} style={{ display:"flex", alignItems:"flex-start", gap:14, paddingBottom:14, marginBottom:14, borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ width:36, height:36, borderRadius:8, background:`rgba(${g.color === "#00E5FF" ? "0,229,255" : g.color === "#00FF88" ? "0,255,136" : g.color === "#FB923C" ? "251,146,60" : "167,139,250"},0.12)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:"'Bebas Neue',sans-serif", fontSize:16, color:g.color }}>
              {g.num}
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:14, color:"#E2E8F0", marginBottom:3 }}>{g.title}</div>
              <div style={{ fontSize:12, color:"#4B5563", lineHeight:1.5 }}>{g.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── X10 IA SECTION ───────────────────────────────────────────────────────────

function X10IASection() {
  const question = pickForToday(dailyQuestions, getTodayKey());
  const [mission, setMission] = useState(() => localStorage.getItem("x10mission") || "");
  const [reflection, setReflection] = useState(() => localStorage.getItem("x10reflection") || "");

  const saveMission = (v) => { setMission(v); localStorage.setItem("x10mission", v); };
  const saveReflection = (v) => { setReflection(v); localStorage.setItem("x10reflection", v); };

  const inputStyle = {
    width:"100%", background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:10, padding:"12px 14px", color:"#E2E8F0", fontSize:13, fontFamily:"'DM Sans',sans-serif",
    outline:"none", resize:"none", lineHeight:1.6, transition:"border-color .2s"
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Daily question */}
      <div style={{ background:"rgba(0,229,255,0.04)", border:"1px solid rgba(0,229,255,0.15)", borderRadius:14, padding:"20px 20px" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:"#00E5FF", letterSpacing:".5px", marginBottom:12 }}>
          💡 PERGUNTA ESTRATÉGICA DO DIA
        </div>
        <p style={{ fontSize:15, color:"#E2E8F0", fontStyle:"italic", lineHeight:1.6 }}>"{question}"</p>
      </div>

      {/* Mission */}
      <div style={{ background:"rgba(13,17,26,0.7)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"20px 20px" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:"#F7B731", letterSpacing:".5px", marginBottom:12 }}>
          🎯 MISSÃO PRINCIPAL DO DIA
        </div>
        <input
          type="text"
          value={mission}
          onChange={e => saveMission(e.target.value)}
          placeholder="Escreve a missão de hoje..."
          style={{ ...inputStyle, height:44 }}
          onFocus={e => e.target.style.borderColor = "rgba(247,183,49,0.35)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
        />
      </div>

      {/* Pillars */}
      <div style={{ background:"rgba(13,17,26,0.7)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"20px 20px" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:"#E2E8F0", letterSpacing:".5px", marginBottom:14 }}>
          📊 THE 5 POINTS TO GROW UP
        </div>
        {[
          { icon:"⛪", color:"rgba(155,89,255,0.12)", title:" Igreja Metodista Unida Central — Secretário", desc:"Recreio & Desporto da Juventude. Servir com excelência é liderança." },
          { icon:"📸", color:"rgba(255,140,0,0.12)", title:"Afro Studio", desc:"Dominar CapCut, Lightroom e Photoshop para elevar qualidade e velocidade de entrega." },
          { icon:"💼", color:"rgba(0,229,255,0.12)", title:"Grow Up Mind - Bíblia, Livros sobre Filosofia, Marketing, Gestão Comercial ", desc:"Ler, Aprender, aplicar, crescer." },
          { icon:"⚽", color:"rgba(0,255,136,0.12)", title:"Consistência : Médio Central — Treino Diário 30min", desc:"Disciplina física = disciplina mental. Os teus exercícios específicos todos os dias." },
          { icon:"🧠", color:"rgba(255,215,0,0.12)", title:"Estudo Contínuo", desc:"Programação · Inglês." },
        ].map((p, i) => (
          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, paddingBottom:12, marginBottom:12, borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            <div style={{ width:36, height:36, borderRadius:8, background:p.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{p.icon}</div>
            <div>
              <div style={{ fontWeight:600, fontSize:13, color:"#E2E8F0", marginBottom:2 }}>{p.title}</div>
              <div style={{ fontSize:12, color:"#4B5563", lineHeight:1.5 }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Night reflection */}
      <div style={{ background:"rgba(167,139,250,0.04)", border:"1px solid rgba(167,139,250,0.15)", borderRadius:14, padding:"20px 20px" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:"#A78BFA", letterSpacing:".5px", marginBottom:8 }}>
          🌙 REFLEXÃO NOTURNA
        </div>
        <div style={{ fontSize:12, color:"#4B5563", marginBottom:12, lineHeight:1.6 }}>
          1 — O que fiz bem?&nbsp;&nbsp;<br />2 — O que posso melhorar?&nbsp;&nbsp;<br />3 — Qual é a prioridade de amanhã?
        </div>
        <textarea
          value={reflection}
          onChange={e => saveReflection(e.target.value)}
          rows={5}
          placeholder="Escreve a tua reflexão aqui..."
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = "rgba(167,139,250,0.35)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
        />
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function RotinasX10() {
  const [activeNav, setActiveNav] = useState("rotina");
  const [activeTab, setActiveTab] = useState("manha");
  const [expanded, setExpanded] = useState(null);

  const current = scheduleData[activeTab];
  const toggle = (i) => setExpanded(expanded === i ? null : i);

  return (
    <div style={{ minHeight:"100vh", background:"#06080F", fontFamily:"'DM Sans', sans-serif", color:"#E2E8F0", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .bg-dots {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: radial-gradient(rgba(247,183,49,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .orb { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
        .wrap { position: relative; z-index: 1; max-width: 840px; margin: 0 auto; padding: 28px 16px 100px; }

        .nav-tab { cursor: pointer; border-radius: 10px; border: 1px solid transparent; transition: all .2s; background: none; }
        .nav-tab.on { border-color: rgba(255,255,255,0.10); background: rgba(255,255,255,0.05); }
        .nav-tab:hover:not(.on) { background: rgba(255,255,255,0.03); }

        .sched-tab { cursor: pointer; border-radius: 12px; border: 1px solid transparent; transition: all .25s; background: none; }
        .sched-tab.on { border-color: rgba(255,255,255,0.10); background: rgba(255,255,255,0.05); }
        .sched-tab:hover:not(.on) { background: rgba(255,255,255,0.03); }

        .card { border-radius: 14px; cursor: pointer; transition: transform .2s, filter .2s; }
        .card:hover { transform: translateY(-2px); filter: brightness(1.06); }

        .deep-pulse { animation: dp 3s ease-in-out infinite; }
        @keyframes dp {
          0%,100% { box-shadow: 0 0 0 0 rgba(96,165,250,0); }
          50%      { box-shadow: 0 0 24px 2px rgba(96,165,250,0.18); }
        }

        .tag { display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 999px;
               font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500;
               letter-spacing: .6px; text-transform: uppercase; border: 1px solid; white-space: nowrap; }

        .pillar { transition: transform .2s; }
        .pillar:hover { transform: translateY(-4px); }
        .day-pill { transition: transform .15s, opacity .15s; }
        .day-pill:hover { transform: scale(1.03); opacity: .85; }

        .tip-enter { animation: fadeSlide .25s ease; }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .section-fade { animation: secFade .3s ease; }
        @keyframes secFade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #2a2f3a; border-radius: 3px; }
      `}</style>

      <div className="bg-dots" />
      <div className="orb" style={{ width:480, height:480, background:"rgba(247,183,49,0.05)", top:-120, right:-100 }} />
      <div className="orb" style={{ width:320, height:320, background:"rgba(96,165,250,0.05)", bottom:300, left:-80 }} />
      <div className="orb" style={{ width:260, height:260, background:"rgba(167,139,250,0.04)", bottom:0, right:80 }} />

      <div className="wrap">

        {/* ── HEADER ── */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(247,183,49,0.08)", border:"1px solid rgba(247,183,49,0.22)",
            borderRadius:999, padding:"5px 18px", marginBottom:16
          }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#F7B731", display:"inline-block", boxShadow:"0 0 8px #F7B731" }} />
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#F7B731", letterSpacing:2.5, textTransform:"uppercase" }}>
              Sistema de Alta Consistência
            </span>
          </div>
          <h1 style={{
            fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,7vw,48px)",
            fontWeight:800, color:"#FFFFFF", lineHeight:1.08, letterSpacing:"-1.5px", marginBottom:10
          }}>
            ROTINA<br />
            <span style={{ color:"#F7B731" }}>10× CONSISTÊNCIA</span>
          </h1>
          <p style={{ color:"#4B5563", fontSize:13, maxWidth:420, margin:"0 auto", lineHeight:1.6 }}>
            Secretário · Fotógrafo · Gestor · Médio Central · Programador
          </p>
        </div>

        {/* ── TOP NAV ── */}
        <div style={{
          display:"flex", gap:5, padding:5, marginBottom:28,
          background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14,
          overflowX:"auto"
        }}>
          {NAV_TABS.map(t => (
            <button key={t.id} className={`nav-tab${activeNav === t.id ? " on" : ""}`}
              onClick={() => setActiveNav(t.id)}
              style={{ flex:"1 1 auto", minWidth:60, padding:"9px 6px", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
              <span style={{ fontSize:17 }}>{t.icon}</span>
              <span style={{
                fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:1, textTransform:"uppercase",
                color: activeNav === t.id ? "#F7B731" : "#374151"
              }}>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── ROTINA TAB ── */}
        {activeNav === "rotina" && (
          <div className="section-fade">
            {/* Schedule sub-tabs */}
            <div style={{
              display:"flex", gap:6, padding:5, marginBottom:24,
              background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:14
            }}>
              {Object.entries(scheduleData).map(([key, d]) => (
                <button key={key} className={`sched-tab${activeTab === key ? " on" : ""}`}
                  onClick={() => { setActiveTab(key); setExpanded(null); }}
                  style={{ flex:1, padding:"10px 6px", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                  <span style={{ fontSize:18 }}>{d.icon}</span>
                  <span style={{
                    fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:1, textTransform:"uppercase",
                    color: activeTab === key ? d.accentColor : "#374151"
                  }}>{d.label}</span>
                  <span style={{ fontSize:9, color:"#1e2530" }}>{d.period}</span>
                </button>
              ))}
            </div>

            {/* Blocks */}
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              {current.blocks.map((b, i) => {
                const isOpen = expanded === i;
                const tc = TAG_CONFIG[b.tags[0]] || TAG_CONFIG["logística"];
                return (
                  <div key={i} onClick={() => toggle(i)}
                    className={`card${b.isDeep ? " deep-pulse" : ""}`}
                    style={{
                      background: b.isSleep ? "rgba(10,12,18,0.6)"
                        : b.isDeep ? "rgba(96,165,250,0.05)"
                        : b.isHighlight ? `rgba(${b.highlightColor === "#F472B6" ? "244,114,182" : "45,212,191"},0.05)`
                        : "rgba(13,17,26,0.7)",
                      border: b.isDeep ? "1px solid rgba(96,165,250,0.18)"
                        : b.isHighlight ? `1px solid ${b.highlightColor}30`
                        : "1px solid rgba(255,255,255,0.055)",
                      padding:"15px 17px",
                    }}>
                    <div style={{ display:"flex", alignItems:"flex-start", gap:13 }}>
                      <div style={{ textAlign:"right", minWidth:54, flexShrink:0 }}>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:14, fontWeight:500, color: b.isDeep ? "#60A5FA" : "#F7B731" }}>{b.time}</div>
                        <div style={{ fontSize:10, color:"#2d3748", marginTop:2 }}>{b.dur}</div>
                      </div>
                      <div style={{ width:38, height:38, borderRadius:10, background:"rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{b.icon}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:5 }}>
                          <span style={{
                            fontFamily:"'Syne',sans-serif", fontWeight: b.isDeep ? 700 : 600,
                            fontSize: b.isDeep ? 14.5 : 13.5,
                            color: b.isSleep ? "#2D3748" : "#E2E8F0", letterSpacing: b.isDeep ? "-.3px" : 0
                          }}>{b.title}</span>
                          {b.isDeep && (
                            <span style={{ background:"rgba(96,165,250,0.12)", border:"1px solid rgba(96,165,250,0.22)", color:"#60A5FA", fontSize:9, padding:"2px 8px", borderRadius:999, fontFamily:"'DM Mono',monospace", letterSpacing:1.2, textTransform:"uppercase" }}>
                              deep work
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize:12.5, color:"#4B5563", lineHeight:1.55, marginBottom:8 }}>{b.desc}</p>
                        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                          {b.tags.map(tag => {
                            const t = TAG_CONFIG[tag] || TAG_CONFIG["logística"];
                            return <span key={tag} className="tag" style={{ background:t.bg, borderColor:t.border, color:t.text }}>{tag}</span>;
                          })}
                        </div>
                      </div>
                      <div style={{ color:"#2D3748", fontSize:11, flexShrink:0, marginTop:5, transition:"transform .2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</div>
                    </div>
                    {isOpen && b.tip && (
                      <div className="tip-enter" style={{
                        marginTop:13, marginLeft:105, padding:"10px 14px",
                        background:"rgba(247,183,49,0.06)", border:"1px solid rgba(247,183,49,0.14)", borderRadius:10,
                        display:"flex", gap:9, alignItems:"flex-start"
                      }}>
                        <span style={{ fontSize:13 }}>💡</span>
                        <span style={{ fontSize:12.5, color:"#B8960A", lineHeight:1.5 }}>
                          <strong style={{ color:"#D4A017" }}>Dica:</strong> {b.tip}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Study rotation (tarde only) */}
            {(activeTab === "tarde" || activeTab === "manha") && (
              <div style={{ marginTop:26, background:"rgba(13,17,26,0.7)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"20px 22px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:15 }}>
                  <span style={{ fontSize:15 }}>🔄</span>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13.5, color:"#E2E8F0", letterSpacing:"-.3px" }}>ROTAÇÃO SEMANAL DE ESTUDO</span>
                </div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {studyRotation.map(d => (
                    <div key={d.day} className="day-pill" style={{
                      flex:"1 1 120px", padding:"12px 14px",
                      background:"rgba(255,255,255,0.025)", border:`1px solid ${d.color}28`, borderRadius:11
                    }}>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:d.color, marginBottom:6, letterSpacing:1.2 }}>{d.day}</div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#D1D5DB", marginBottom:3 }}>{d.focus}</div>
                      <div style={{ fontSize:11, color:"#374151" }}>{d.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weekend (noite only) */}
            {activeTab === "noite" && (
              <div style={{ marginTop:26, background:"rgba(13,17,26,0.7)", border:"1px solid rgba(167,139,250,0.14)", borderRadius:16, padding:"20px 22px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                  <span style={{ fontSize:15 }}>🗓</span>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13.5, color:"#A78BFA", letterSpacing:"-.3px" }}>RITMO DO FIM DE SEMANA</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {[
                    { day:"SÁBADO", items:["Treino de futebol ou jogo","Trabalho Afro Studio (eventos)","Estudo leve 1h à escolha","Actividade Igreja / Juventude","Descanso e socialização"] },
                    { day:"DOMINGO", items:["Igreja Metodista Unida Central de Luanda","Revisão semanal (30min)","Planeamento da semana seguinte","Descanso profundo e família","Oração e renovação espiritual"] },
                  ].map(col => (
                    <div key={col.day} style={{ padding:"14px 16px", background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:12 }}>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#A78BFA", letterSpacing:1.2, marginBottom:10 }}>{col.day}</div>
                      {col.items.map(it => (
                        <div key={it} style={{ display:"flex", alignItems:"flex-start", gap:7, marginBottom:6 }}>
                          <div style={{ width:4, height:4, borderRadius:"50%", background:"#A78BFA", flexShrink:0, marginTop:5 }} />
                          <span style={{ fontSize:12, color:"#6B7280", lineHeight:1.5 }}>{it}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pillars */}
            <div style={{ marginTop:44 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#2D3748", letterSpacing:2.5, textTransform:"uppercase" }}>Os 6 Pilares do Sistema</span>
                <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.05)" }} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(118px,1fr))", gap:10 }}>
                {pillars.map(p => (
                  <div key={p.label} className="pillar" style={{
                    padding:"16px 13px", textAlign:"center",
                    background:"rgba(13,17,26,0.7)", border:`1px solid ${p.color}18`, borderRadius:14
                  }}>
                    <div style={{ fontSize:26, marginBottom:9 }}>{p.icon}</div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:500, color:p.color, letterSpacing:1.2, marginBottom:6 }}>{p.label}</div>
                    <div style={{ fontSize:11, color:"#374151", lineHeight:1.4 }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Golden rules */}
            <div style={{ marginTop:28, padding:"22px 24px", background:"rgba(247,183,49,0.04)", border:"1px solid rgba(247,183,49,0.14)", borderRadius:16 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"#F7B731", marginBottom:16, letterSpacing:"-.3px" }}>
                ⚡ REGRAS DE OURO
              </div>
              <div style={{ display:"grid", gap:9 }}>
                {goldenRules.map(([icon, rule]) => (
                  <div key={rule} style={{ display:"flex", gap:11, alignItems:"flex-start" }}>
                    <span style={{ fontSize:14, flexShrink:0 }}>{icon}</span>
                    <span style={{ fontSize:12.5, color:"#92751A", lineHeight:1.55 }}>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop:36, textAlign:"center", borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:20 }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#1F2937", letterSpacing:1.5 }}>
                X10THINK • SISTEMA DE ALTA CONSISTÊNCIA • LUANDA, ANGOLA
              </span>
            </div>
          </div>
        )}

        {/* ── HABITS TAB ── */}
        {activeNav === "habits" && (
          <div className="section-fade">
            <div style={{ marginBottom:22 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"#E2E8F0", marginBottom:6, letterSpacing:"-.5px" }}>
                <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:"#00E5FF", boxShadow:"0 0 12px #00E5FF", marginRight:10, animation:"dp 2s infinite" }} />
                TRACKER DE HÁBITOS
              </div>
              <p style={{ fontSize:13, color:"#4B5563" }}>Marca os teus hábitos diários. A consistência constrói o campeão.</p>
            </div>
            <HabitTracker />
          </div>
        )}

        {/* ── FOCUS TAB ── */}
        {activeNav === "focus" && (
          <div className="section-fade">
            <div style={{ marginBottom:22 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"#E2E8F0", marginBottom:6, letterSpacing:"-.5px" }}>
                <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:"#00E5FF", boxShadow:"0 0 12px #00E5FF", marginRight:10 }} />
                SISTEMA DE FOCO 
              </div>
              <p style={{ fontSize:13, color:"#4B5563" }}>Métodos, técnicas e regras para maximizar cada hora de estudo.</p>
            </div>
            <FocusSection />
          </div>
        )}

        {/* ── TIMER TAB ── */}
        {activeNav === "timer" && (
          <div className="section-fade">
            <div style={{ marginBottom:22 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"#E2E8F0", marginBottom:6, letterSpacing:"-.5px" }}>
                <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:"#00E5FF", boxShadow:"0 0 12px #00E5FF", marginRight:10 }} />
                TIMER DE FOCO
              </div>
              <p style={{ fontSize:13, color:"#4B5563" }}>Cronómetro Pomodoro adaptado ao sistema.</p>
            </div>
            <TimerSection />
          </div>
        )}

        {/* ── WEEK TAB ── */}
        {activeNav === "week" && (
          <div className="section-fade">
            <div style={{ marginBottom:22 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"#E2E8F0", marginBottom:6, letterSpacing:"-.5px" }}>
                <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:"#00E5FF", boxShadow:"0 0 12px #00E5FF", marginRight:10 }} />
                VISÃO SEMANAL
              </div>
              <p style={{ fontSize:13, color:"#4B5563" }}>Plano semanal completo e metas a 90 dias.</p>
            </div>
            <WeekSection />
          </div>
        )}

        {/* ── X10 IA TAB ── */}
        {activeNav === "x10ia" && (
          <div className="section-fade">
            <div style={{ marginBottom:22 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"#E2E8F0", marginBottom:6, letterSpacing:"-.5px" }}>
                <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:"#00E5FF", boxShadow:"0 0 12px #00E5FF", marginRight:10 }} />
                X10THINK 
              </div>
              <p style={{ fontSize:13, color:"#4B5563" }}>Pergunta estratégica, missão do dia e reflexão noturna.</p>
            </div>
            <X10IASection />
          </div>
        )}

      </div>
    </div>
  );
}