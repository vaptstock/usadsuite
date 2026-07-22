import React from 'react';
import { supabase } from '../lib/supabaseClient';
import{useState,useEffect,useCallback,useRef,createContext,useContext}from"react";
import{AreaChart,Area,BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid}from"recharts";
 
// ─── CONTEXT ─────────────────────────────────────────────────
const Ctx=createContext(null);
 
// ─── CHART DATA ──────────────────────────────────────────────
const CD=[
  {day:"Seg",spend:320,revenue:568,clicks:420,conv:4},
  {day:"Ter",spend:290,revenue:740,clicks:390,conv:5},
  {day:"Qua",spend:410,revenue:920,clicks:540,conv:7},
  {day:"Qui",spend:380,revenue:680,clicks:490,conv:5},
  {day:"Sex",spend:520,revenue:1240,clicks:680,conv:9},
  {day:"Sab",spend:460,revenue:1080,clicks:590,conv:8},
  {day:"Dom",spend:340,revenue:860,clicks:440,conv:6},
];
 
// ─── PLANS ───────────────────────────────────────────────────
const PLANS=[
  {id:"free",name:"Free",price:0,features:["3 produtos","Keywords","Presell","Simulador"]},
  {id:"pro",name:"Pro",price:47,popular:true,features:["Produtos ilimitados","Scout","Analytics","CSV Export","Reverso AI"]},
  {id:"agency",name:"Agency",price:97,features:["Tudo do Pro","5 assentos","White-label"]},
];
 
// ─── SEED PRODUCTS ───────────────────────────────────────────
const SEED=[
  {id:1,name:"LeanBiome",platform:"ClickBank",commission:142,refundRate:12,link:"https://hop.clickbank.net",niche:"Saude",spend:1240,conversions:14,clicks:1820},
  {id:2,name:"Java Burn",platform:"Digistore24",commission:185,refundRate:9,link:"https://digistore24.com",niche:"Saude",spend:980,conversions:9,clicks:1340},
  {id:3,name:"Trade Genius",platform:"BuyGoods",commission:210,refundRate:7,link:"https://buygoods.com",niche:"Financas",spend:2100,conversions:18,clicks:2980},
];
 
// ─── SCOUT PRODUCTS ──────────────────────────────────────────
const SP=[
  {id:"bg001",name:"Red Boost",platform:"BuyGoods",niche:"Saude",gravity:234,commission:177,convRate:3.7,refundRate:8,epc:1.52,trending:true,desc:"Fluxo sanguineo masculino. Alta comissao, reembolso controlado.",tags:["mens-health"],url:"https://backoffice.buygoods.com/campaigns"},
  {id:"bg002",name:"FlowForce Max",platform:"BuyGoods",niche:"Saude",gravity:187,commission:163,convRate:3.2,refundRate:9,epc:1.36,trending:true,desc:"Prostata masculina. EPC $1.36 comprovado. Nao sazonal.",tags:["prostate"],url:"https://backoffice.buygoods.com/campaigns"},
  {id:"bg003",name:"Cortexi",platform:"BuyGoods",niche:"Saude",gravity:212,commission:147,convRate:3.5,refundRate:10,epc:1.18,trending:true,desc:"Saude auditiva e cognitiva. Crescimento rapido.",tags:["hearing"],url:"https://backoffice.buygoods.com/campaigns"},
  {id:"bg004",name:"SonoVive",platform:"BuyGoods",niche:"Saude",gravity:165,commission:134,convRate:2.8,refundRate:11,epc:0.98,trending:false,desc:"Saude auditiva. Menos competitivo, boa demanda.",tags:["tinnitus"],url:"https://backoffice.buygoods.com/campaigns"},
  {id:"bg005",name:"ErecPrime",platform:"BuyGoods",niche:"Saude",gravity:198,commission:116,convRate:0.89,refundRate:8,epc:0.88,trending:false,desc:"Performance masculina. Reembolso excelente.",tags:["performance"],url:"https://backoffice.buygoods.com/campaigns"},
  {id:"bg006",name:"GlucoBerry",platform:"BuyGoods",niche:"Saude",gravity:178,commission:128,convRate:3.1,refundRate:10,epc:1.05,trending:false,desc:"Niveis de acucar no sangue. Nicho metabolico.",tags:["blood-sugar"],url:"https://backoffice.buygoods.com/campaigns"},
  {id:"cb001",name:"LeanBiome",platform:"ClickBank",niche:"Saude",gravity:312,commission:142,convRate:4.2,refundRate:9,epc:1.68,trending:true,desc:"Probiotico emagrecimento. Publico feminino. Upsells.",tags:["weight-loss"],url:"https://accounts.clickbank.com/marketplace.htm"},
  {id:"cb002",name:"Java Burn",platform:"ClickBank",niche:"Saude",gravity:287,commission:185,convRate:3.8,refundRate:11,epc:1.54,trending:true,desc:"Formula cafe metabolismo. Alto EPC.",tags:["metabolism"],url:"https://accounts.clickbank.com/marketplace.htm"},
  {id:"cb003",name:"Alpilean",platform:"ClickBank",niche:"Fitness",gravity:274,commission:148,convRate:4.0,refundRate:10,epc:1.42,trending:true,desc:"Temperatura corporal. Competitivo mas lucrativo.",tags:["thermogenic"],url:"https://accounts.clickbank.com/marketplace.htm"},
  {id:"cb004",name:"ProDentim",platform:"ClickBank",niche:"Saude",gravity:198,commission:127,convRate:3.4,refundRate:8,epc:1.22,trending:true,desc:"Saude oral. Nicho menos saturado.",tags:["dental"],url:"https://accounts.clickbank.com/marketplace.htm"},
  {id:"cb005",name:"His Secret Obsession",platform:"ClickBank",niche:"Relacionamento",gravity:167,commission:38,convRate:6.2,refundRate:7,epc:0.96,trending:false,desc:"Relacionamento feminino. Conversao 6.2%.",tags:["relationship"],url:"https://accounts.clickbank.com/marketplace.htm"},
  {id:"ds001",name:"Trade Genius",platform:"Digistore24",niche:"Financas",gravity:198,commission:210,convRate:2.9,refundRate:7,epc:1.74,trending:true,desc:"Trading recorrente. Reembolso excelente.",tags:["trading"],url:"https://www.digistore24.com/marketplace"},
  {id:"ds002",name:"Manifestation Magic",platform:"Digistore24",niche:"Digital",gravity:134,commission:47,convRate:4.7,refundRate:12,epc:0.94,trending:false,desc:"Audio reprogramacao. Alta conversao.",tags:["mindset"],url:"https://www.digistore24.com/marketplace"},
];
 
// ─── COMPLIANCE RULES ────────────────────────────────────────
const CR={
  "Saude":{safe:false,reasons:["Disclaimer de resultados obrigatorio","Before/after proibido","Evite: cura, trata, elimina"]},
  "Fitness":{safe:true,reasons:["Geralmente aceito","Evite garantias de resultado","Use: pode ajudar, apoiar"]},
  "Financas":{safe:false,reasons:["Alto risco de violacao","Renda garantida proibida","Exige disclaimer"]},
  "Relacionamento":{safe:true,reasons:["Seguro na maioria dos casos","Evite linguagem manipulativa"]},
  "Digital":{safe:true,reasons:["Baixo risco","Landing page deve carregar rapido","Privacidade obrigatoria"]},
  "Sobrevivencia":{safe:true,reasons:["Baixa saturacao no Google Ads","Claims factuais aceitos"]},
};
 
// ─── PRESELL COMPLIANCE SCANNER ──────────────────────────────
// Varre o texto real (headline+subtitle+body+cta) por frases que o Google Ads rejeita
const PRESELL_BANNED_PHRASES=[
  {match:/\bcure[sd]?\b|\bcura\b/i,level:"critical",msg:"Claim de 'cura' — proibido pelo Google Ads em qualquer nicho de saude"},
  {match:/\bguarantee[d]?\b|\bgaranti[ad][o]?\b/i,level:"critical",msg:"Promessa de 'garantia de resultado' — viola politica de claims enganosos"},
  {match:/\b100% (effective|efficient|safe|guaranteed)\b/i,level:"critical",msg:"Claim absoluto '100%' — quase sempre rejeitado"},
  {match:/\bmiracle\b|\bmilagre\b/i,level:"critical",msg:"Palavra 'milagre' — gatilho automatico de rejeicao"},
  {match:/\bbefore (and|&) after\b|\bantes e depois\b/i,level:"critical",msg:"Mencao a 'before/after' — proibido em saude e emagrecimento"},
  {match:/\blose \d+\s?(lbs|kg|pounds)\b/i,level:"warn",msg:"Claim numerico de perda de peso especifico — alto risco de rejeicao"},
  {match:/\bdoctors? (hate|recommend)\b/i,level:"warn",msg:"Apelo a autoridade medica nao verificada"},
  {match:/\bact now\b|\blast chance\b|\bonly \d+ left\b/i,level:"warn",msg:"Urgencia artificial — pode acionar revisao manual do Google"},
  {match:/\bclick here\b/i,level:"info",msg:"'Click here' no CTA e aceitavel, mas CTAs especificos convertem mais"},
  {match:/\bfree money\b|\bget rich\b|\benriquecer\b/i,level:"critical",msg:"Claim de renda/enriquecimento facil — proibido para ofertas financeiras"},
];
 
function analyzePresellCompliance(d,niche){
  const fullText=[d.headline,d.subtitle,d.body,d.cta].join(" \n ");
  const hits=[];
  PRESELL_BANNED_PHRASES.forEach(rule=>{
    if(rule.match.test(fullText))hits.push(rule);
  });
  const critical=hits.filter(h=>h.level==="critical").length;
  const warn=hits.filter(h=>h.level==="warn").length;
  const nicheRule=CR[niche]||{safe:true,reasons:[]};
  const score=Math.max(0,100-critical*35-warn*15);
  const status=critical>0?"bloqueado":warn>0||!nicheRule.safe?"atencao":"aprovado";
  return{hits,critical,warn,score,status,nicheRule};
}
 
function PresellComplianceBox({d,niche}){
  const r=analyzePresellCompliance(d,niche);
  const cfg={
    bloqueado:{bg:"#fef2f2",border:"#fecaca",color:"#991b1b",icon:"✗",label:"Bloqueado"},
    atencao:{bg:"#fffbeb",border:"#fcd34d",color:"#92400e",icon:"⚠",label:"Atencao"},
    aprovado:{bg:"#ecfdf5",border:"#a7f3d0",color:"#065f46",icon:"✓",label:"Aprovado"},
  }[r.status];
  return(
    <div style={{background:cfg.bg,border:"1.5px solid "+cfg.border,borderRadius:10,padding:"14px 16px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:r.hits.length?10:0,flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:cfg.color}}>{cfg.icon} Compliance Presell — {cfg.label}</span>
        </div>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:cfg.color,fontWeight:700}}>Score {r.score}/100</span>
      </div>
      {r.hits.length>0&&(
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {r.hits.map((h,i)=>(
            <div key={i} style={{display:"flex",gap:8,fontSize:11,color:cfg.color,alignItems:"flex-start"}}>
              <span style={{flexShrink:0,fontWeight:700}}>{h.level==="critical"?"🛑":h.level==="warn"?"⚠":"ℹ"}</span>
              <span>{h.msg}</span>
            </div>
          ))}
        </div>
      )}
      {!r.nicheRule.safe&&(
        <div style={{marginTop:r.hits.length?10:0,paddingTop:r.hits.length?10:0,borderTop:r.hits.length?"1px solid "+cfg.border:"none",fontSize:11,color:cfg.color}}>
          Nicho "{niche}" exige cuidado extra: {r.nicheRule.reasons.join(" · ")}
        </div>
      )}
      {r.hits.length===0&&r.nicheRule.safe&&(
        <div style={{fontSize:11,color:cfg.color}}>Nenhuma frase de risco detectada no copy atual.</div>
      )}
    </div>
  );
}
 
// ─── CALC VIABILITY v2 ───────────────────────────────────────
// Formula central: (comissao * conversao) - custos = lucro
// Preservado integralmente — nenhuma linha alterada
function calcViability(product,params){
  const p=params||{};
  const ctr=Math.max(parseFloat(p.ctr)||5,0.1);
  const conv=Math.max(parseFloat(p.conv)||3,0.1);
  const roi=Math.max(parseFloat(p.roi)||100,0);
  const budget=Math.max(parseFloat(p.budget)||50,1);
  const safety=parseFloat(p.safety)||0;
  const refundRate=Math.max(parseFloat(product.refundRate)||0,0);
  const commission=Math.max(parseFloat(product.commission)||0,0);
  const netComm=commission*(1-refundRate/100);
  const convRate=conv/100;
  const revenuePerClick=netComm*convRate;
  const cpcMaxRaw=revenuePerClick>0?revenuePerClick/(1+roi/100):0;
  const cpcMax=cpcMaxRaw*(1-safety/100);
  const breakEven=revenuePerClick;
  const profitPerClick=revenuePerClick-cpcMax;
  const rev100=revenuePerClick*100;
  const cost100=cpcMax*100;
  const prf100=rev100-cost100;
  const clicksPerDay=budget/Math.max(cpcMax,0.01);
  const profitPerDay=clicksPerDay*profitPerClick;
  const daysToROI=profitPerDay>0?Math.ceil(budget/profitPerDay):999;
  const epcScore=product.epc?parseFloat(product.epc):revenuePerClick;
  const roiActual=cost100>0?((rev100-cost100)/cost100*100).toFixed(1):0;
  const gravScore=Math.min((product.gravity||0)/3,33);
  const cpcScore=cpcMax>=2?34:cpcMax>=1?28:cpcMax>=0.5?18:5;
  const refScore=refundRate<=8?33:refundRate<=12?20:refundRate<=15?10:3;
  const totalScore=Math.round(gravScore+cpcScore+refScore);
  const tv=Math.max(0.50-(safety/200),0.25);
  const tm=Math.max(0.20-(safety/400),0.10);
  const status=
    cpcMax>=1.0&&refundRate<=12&&(product.gravity||0)>=100?"viavel":
    cpcMax>=tv&&refundRate<=15?"viavel":
    cpcMax>=tm&&refundRate<=18?"marginal":"inviavel";
  const issues=[];
  if(cpcMax<tm) issues.push("CPC max $"+cpcMax.toFixed(4)+" baixo — aumente conversao ou comissao");
  if(refundRate>15) issues.push("Reembolso "+refundRate+"% alto — risco de cancelamentos");
  if((product.gravity||0)<100) issues.push("Gravity "+((product.gravity)||0)+" baixo — produto pouco testado");
  if(conv<1) issues.push("Conversao "+conv+"% muito baixa — revise a presell");
  if(netComm<30) issues.push("Comissao liquida $"+netComm.toFixed(2)+" insuficiente para ads");
  return{netComm,revenuePerClick,cpcMax,cpcMaxRaw,breakEven,rev100,cost100,prf100,
    profitPerClick,profitPerDay,clicksPerDay,roiActual,daysToROI,epcScore,
    totalScore,status,issues,_params:{conv,ctr,roi,budget,safety,netComm,convRate}};
}
 
// ─── CSS ─────────────────────────────────────────────────────
const css=`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}:root{--bg:#eef2f8;--surface:#fff;--surf2:#f4f7fc;--border:#d0d9e8;--border2:#b8c6da;--accent:#1e4db7;--accent2:#1a3f9a;--al:#e8eef8;--text:#0f1f3d;--text2:#4a5e78;--text3:#8fa3bf;--red:#e03e3e;--green:#059669;--amber:#d97706;--blue:#2563eb;--purple:#7c3aed;--navy:#0f2a5c}body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh}body.dark{--bg:#07080d;--surface:#0d1018;--surf2:#131720;--border:#1e2535;--border2:#283040;--accent:#3b82f6;--al:#1e2f50;--text:#e2e8f8;--text2:#6b80a0;--text3:#3a4a65;--navy:#0a0e18}.fd{font-family:'Syne',sans-serif!important}.fm{font-family:'DM Mono',monospace!important}html{scrollbar-width:thin;scrollbar-color:var(--border2) var(--surf2)}::-webkit-scrollbar{width:12px;height:12px}::-webkit-scrollbar-track{background:var(--surf2);border-radius:8px}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:8px;border:3px solid var(--surf2);min-height:40px}::-webkit-scrollbar-thumb:hover{background:var(--accent)}::-webkit-scrollbar-corner{background:var(--surf2)}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}.fu{animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both}.fu2{animation:fadeUp .4s .07s cubic-bezier(.22,1,.36,1) both}.fu3{animation:fadeUp .4s .14s cubic-bezier(.22,1,.36,1) both}.pulse{animation:pulse 2s ease-in-out infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}.app{display:flex;min-height:100vh}.sidebar{position:fixed;top:0;left:0;height:100%;width:216px;background:linear-gradient(160deg,rgba(20,52,100,.97) 0%,rgba(15,35,75,.95) 100%);backdrop-filter:blur(20px);border-right:1px solid rgba(100,140,200,.15);display:flex;flex-direction:column;z-index:50;transition:transform .28s cubic-bezier(.22,1,.36,1)}.main{flex:1;margin-left:216px;display:flex;flex-direction:column;min-height:100vh}.topbar{position:sticky;top:0;z-index:30;background:rgba(238,242,248,.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);padding:10px 24px;display:flex;align-items:center;gap:12px}body.dark .topbar{background:rgba(7,8,13,.9)}.content{flex:1;padding:28px 24px;max-width:1100px;width:100%;margin:0 auto}.nav-logo{padding:18px 16px 14px;border-bottom:1px solid rgba(100,140,200,.15);display:flex;align-items:center;gap:10px}.nav-icon{width:32px;height:32px;background:var(--accent);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.nav-wrap{flex:1;padding:8px;overflow-y:auto}.nav-grp{font-size:9px;color:rgba(100,140,190,.5);font-family:'DM Mono',monospace;letter-spacing:.1em;text-transform:uppercase;padding:10px 12px 4px;display:block}.nav-btn{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:9px;font-size:13px;color:rgba(180,210,255,.7);cursor:pointer;border:1px solid transparent;transition:all .2s;background:none;width:100%;text-align:left;font-family:'DM Sans',sans-serif}.nav-btn:hover{color:rgba(220,235,255,.95);background:rgba(255,255,255,.08)}.nav-btn.active{color:#fff;background:rgba(59,130,246,.2);border-color:rgba(100,160,255,.25);font-weight:600}.nav-btn svg{width:14px;height:14px;flex-shrink:0}.nav-foot{padding:10px;border-top:1px solid rgba(100,140,200,.15)}.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:40}.overlay.show{display:block}.mob-btn{display:none;background:none;border:none;cursor:pointer;color:var(--text2);padding:4px}.card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:24px;transition:all .2s;box-shadow:0 1px 4px rgba(15,31,61,.06)}.card:hover{border-color:var(--border2)}.btn{display:inline-flex;align-items:center;gap:6px;font-family:'Syne',sans-serif;font-weight:700;font-size:13px;padding:10px 18px;border-radius:9px;border:none;cursor:pointer;transition:all .2s;white-space:nowrap}.btn-accent{background:var(--accent);color:#fff}.btn-accent:hover{background:var(--accent2);transform:translateY(-1px)}.btn-accent:disabled{opacity:.55;cursor:not-allowed;transform:none}.btn-ghost{background:transparent;color:var(--text2);border:1.5px solid var(--border2);font-family:'DM Sans',sans-serif}.btn-ghost:hover{border-color:var(--accent);color:var(--accent);background:var(--al)}.btn-sm{display:inline-flex;align-items:center;gap:5px;background:var(--al);color:var(--accent);font-size:11px;font-family:'DM Mono',monospace;padding:6px 11px;border-radius:7px;border:1px solid var(--border);cursor:pointer;transition:all .2s}.btn-sm:hover{background:var(--accent);color:#fff}.tag{display:inline-flex;align-items:center;font-family:'DM Mono',monospace;font-size:10px;padding:3px 8px;border-radius:4px;border:1px solid;font-weight:500}.tag-cb{color:#059669;border-color:#05966920;background:#05966910}.tag-ds{color:#2563eb;border-color:#2563eb20;background:#2563eb10}.tag-bg{color:#d97706;border-color:#d9770620;background:#d9770610}.tbl{width:100%;border-collapse:collapse;font-size:13px}.tbl th{color:var(--text3);font-weight:600;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;padding:10px 16px;text-align:left;border-bottom:1px solid var(--border);background:var(--surf2)}.tbl td{padding:12px 16px;border-bottom:1px solid var(--border);color:var(--text)}.tbl tr:hover td{background:var(--al)}.sec-label{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);margin-bottom:10px;display:block}.stat-chip{background:var(--surf2);border:1.5px solid var(--border);border-radius:10px;padding:16px 18px}.scout-sort{display:inline-flex;align-items:center;gap:5px;background:var(--al);color:var(--accent);font-size:11px;font-family:'DM Mono',monospace;padding:6px 11px;border-radius:7px;border:1.5px solid var(--border);cursor:pointer;transition:all .2s}.scout-sort:hover,.scout-sort.active{background:var(--accent);color:#fff;border-color:var(--accent)}.scout-card{background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:20px;transition:all .2s;box-shadow:0 1px 4px rgba(15,31,61,.06)}.scout-card:hover{border-color:var(--border2)}.kw-chip{display:flex;align-items:center;justify-content:space-between;background:var(--surf2);border:1.5px solid var(--border);border-radius:8px;padding:8px 12px;font-family:'DM Mono',monospace;font-size:11px;margin-bottom:4px;transition:all .15s}.kw-chip:hover{border-color:var(--accent);background:var(--al)}.progress{height:4px;background:var(--border);border-radius:2px;overflow:hidden}.progress-fill{height:100%;border-radius:2px;transition:width .4s}.check-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;border:none;background:none;width:100%;text-align:left;font-size:13px;color:var(--text2);transition:background .15s}.check-item:hover{background:var(--al)}.plan-card{border-radius:14px;border:2px solid var(--border);padding:24px;cursor:pointer;background:var(--surface);transition:all .25s}.plan-card:hover{border-color:var(--accent);transform:translateY(-3px)}.plan-card.sel{border-color:var(--accent);background:var(--al)}.box-info{background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:12px 14px}.box-warn{background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:12px 14px}input,select,textarea{width:100%;background:var(--surf2);border:1.5px solid var(--border);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--text);font-family:'DM Sans',sans-serif;outline:none;transition:all .2s}input:focus,select:focus,textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(30,77,183,.1)}input::placeholder{color:var(--text3)}select option{background:var(--surface)}textarea{resize:vertical;min-height:80px}.cpc-green{color:#059669;background:#ecfdf5;border:1.5px solid #a7f3d0}.cpc-amber{color:#d97706;background:#fffbeb;border:1.5px solid #fcd34d}.cpc-red{color:#e03e3e;background:#fef2f2;border:1.5px solid #fecaca}@media(max-width:900px){.sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}.main{margin-left:0}.mob-btn{display:flex}.content{padding:18px 14px}.topbar{padding:10px 16px}}@media(max-width:600px){.sim-grid,.presell-grid,.camp-grid{grid-template-columns:1fr!important}.plan-grid{grid-template-columns:1fr!important}}`;
 
// ─── HELPERS ─────────────────────────────────────────────────
function Tag({p}){
  const cls=p==="ClickBank"?"tag-cb":p==="Digistore24"?"tag-ds":"tag-bg";
  return <span className={"tag "+cls}>{p}</span>;
}
function Spin(){return <span style={{width:14,height:14,border:"2px solid currentColor",borderTopColor:"transparent",borderRadius:"50%",display:"inline-block",animation:"spin 1s linear infinite"}}/>;}
function SH({title,sub,desc}){
  return(
    <div className="fu" style={{marginBottom:4}}>
      <div className="fd" style={{fontSize:26,fontWeight:800,color:"var(--text)",display:"flex",alignItems:"baseline",gap:10}}>
        {title}
        {sub&&<span style={{fontSize:11,color:"var(--accent)",fontFamily:"'DM Mono',monospace",fontWeight:400}}>{sub}</span>}
      </div>
      {desc&&<div style={{fontSize:13,color:"var(--text2)",marginTop:4}}>{desc}</div>}
    </div>
  );
}
function StatChip({label,value,color}){
  return(
    <div className="stat-chip">
      <div style={{fontSize:10,color:"var(--text3)",fontFamily:"'DM Mono',monospace",marginBottom:6}}>{label}</div>
      <div className="fm" style={{fontSize:18,fontWeight:700,color:color||"var(--text)"}}>{value}</div>
    </div>
  );
}
function Tip({text,children}){
  const [show,setShow]=useState(false);
  return(
    <span style={{position:"relative",display:"inline-flex",alignItems:"center",gap:3}}>
      {children}
      <button onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)} onClick={()=>setShow(!show)} style={{width:14,height:14,borderRadius:"50%",background:"var(--accent)",color:"#fff",border:"none",cursor:"pointer",fontSize:8,fontWeight:800,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>?</button>
      {show&&<div style={{position:"absolute",bottom:"calc(100% + 6px)",left:"50%",transform:"translateX(-50%)",background:"var(--navy)",color:"#e8f0ff",fontSize:11,padding:"7px 10px",borderRadius:8,zIndex:999,boxShadow:"0 4px 16px rgba(0,0,0,.25)",border:"1px solid rgba(100,150,255,.2)",maxWidth:240,whiteSpace:"normal",lineHeight:1.5}}>
        {text}
        <div style={{position:"absolute",top:"100%",left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"5px solid transparent",borderRight:"5px solid transparent",borderTop:"5px solid var(--navy)"}}/>
      </div>}
    </span>
  );
}
function VBadge({status,score,cpcMax,issues,prf100}){
  const cfg={
    viavel:{label:"Viavel",bg:"#ecfdf5",border:"#a7f3d0",color:"#065f46",icon:"✓"},
    marginal:{label:"Marginal",bg:"#fffbeb",border:"#fcd34d",color:"#92400e",icon:"~"},
    inviavel:{label:"Inviavel",bg:"#fef2f2",border:"#fecaca",color:"#991b1b",icon:"✗"},
  }[status]||{label:"?",bg:"var(--surf2)",border:"var(--border)",color:"var(--text3)",icon:"?"};
  const [showD,setShowD]=useState(false);
  return(
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 12px",borderRadius:8,background:cfg.bg,border:"1.5px solid "+cfg.border,cursor:(issues&&issues.length)?"pointer":"default"}} onClick={()=>issues&&issues.length&&setShowD(!showD)}>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:12,color:cfg.color}}>{cfg.icon} {cfg.label}</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:cfg.color,opacity:.8}}>CPC {"$"+cpcMax.toFixed(4)} · {score}/100</span>
          {issues&&issues.length>0&&<span style={{fontSize:10,color:cfg.color,opacity:.7}}>({issues.length} alerta{issues.length>1?"s":""})</span>}
        </div>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,padding:"4px 8px",borderRadius:6,background:prf100>0?"#ecfdf5":"#fef2f2",border:"1px solid "+(prf100>0?"#a7f3d0":"#fecaca"),color:prf100>0?"#065f46":"#991b1b"}}>
          Lucro/100: {"$"+prf100.toFixed(2)}
        </span>
      </div>
      {showD&&issues&&issues.length>0&&(
        <div style={{marginTop:6,background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:8,padding:"10px 12px"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#92400e",marginBottom:4}}>Por que {cfg.label}:</div>
          {issues.map((iss,i)=><div key={i} style={{fontSize:11,color:"#92400e",marginBottom:3}}>▸ {iss}</div>)}
        </div>
      )}
    </div>
  );
}
function ComplianceModal({product,onClose}){
  const rule=CR[product.niche]||{safe:true,reasons:["Verifique politicas do Google para este nicho"]};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:16,padding:28,maxWidth:440,width:"100%"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <div style={{width:40,height:40,borderRadius:10,background:rule.safe?"#ecfdf5":"#fef2f2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{rule.safe?"✓":"⚠"}</div>
          <div>
            <div className="fd" style={{fontWeight:800,fontSize:16,color:"var(--text)"}}>Analise de Risco — {product.name}</div>
            <div style={{fontSize:12,color:rule.safe?"var(--green)":"var(--red)",fontWeight:600,marginTop:2}}>{rule.safe?"Geralmente seguro para Google Ads":"Requer cuidado especial"}</div>
          </div>
        </div>
        {rule.reasons.map((r,i)=>(
          <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 12px",background:rule.safe?"#f0fdf4":"#fff7ed",borderRadius:8,border:"1px solid "+(rule.safe?"#bbf7d0":"#fed7aa"),marginBottom:6}}>
            <span style={{flexShrink:0}}>{rule.safe?"✓":"▸"}</span>
            <span style={{fontSize:12,color:"var(--text2)",lineHeight:1.5}}>{r}</span>
          </div>
        ))}
        <button onClick={onClose} style={{width:"100%",marginTop:16,padding:11,background:"var(--accent)",color:"#fff",border:"none",borderRadius:9,cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13}}>Fechar</button>
      </div>
    </div>
  );
}
function ScoutRiskBtn({product}){
  const [show,setShow]=useState(false);
  return(
    <>
      <button onClick={()=>setShow(true)} style={{display:"inline-flex",alignItems:"center",gap:5,background:"var(--surf2)",color:"var(--text2)",fontSize:11,padding:"7px 12px",borderRadius:9,border:"1.5px solid var(--border2)",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>🔍 Risco</button>
      {show&&<ComplianceModal product={product} onClose={()=>setShow(false)}/>}
    </>
  );
}
 
// ─── PROVIDER ────────────────────────────────────────────────
function Provider({children}){
  const [products,setProducts]=useState(SEED);
  const [user,setUser]=useState(null);
  const [toast,setToast]=useState(null);
  const [theme,setTheme]=useState("light");
  const [plan,setPlan]=useState("pro");
  const [billing,setBilling]=useState("monthly");
  const timer=useRef(null);
  const [activeOps,setActiveOps]=useState(()=>{try{const s=localStorage.getItem("uas_ops");return s?JSON.parse(s):[]}catch{return[]}});
  const [presellData,setPresellData]=useState(()=>{try{const s=localStorage.getItem("uas_presell");return s?JSON.parse(s):null}catch{return null}});
  const [presellMap,setPresellMap]=useState(()=>{try{const s=localStorage.getItem("uas_presell_map");return s?JSON.parse(s):{}}catch{return{}}});
  const savePresellData=useCallback(d=>{
    setPresellData(d);
    try{localStorage.setItem("uas_presell",JSON.stringify(d));}catch{}
    if(d&&d._productName){
      const key=d._productName.toLowerCase().trim();
      const nm={...presellMap,[key]:d};
      setPresellMap(nm);
      try{localStorage.setItem("uas_presell_map",JSON.stringify(nm));}catch{}
    }
  },[presellMap]);
  const getPresellForProduct=useCallback(name=>{
    if(!name)return null;
    const key=name.toLowerCase().trim();
    if(presellMap&&presellMap[key])return presellMap[key];
    try{
      const s=localStorage.getItem("uas_presell_map");
      if(s){const m=JSON.parse(s);if(m&&m[key])return m[key];}
    }catch{}
    return null;
  },[presellMap]);
  const [globalParams,setGlobalParams]=useState(()=>{try{const s=localStorage.getItem("uas_vp");return s?JSON.parse(s):{ctr:5,conv:3,roi:100,budget:50}}catch{return{ctr:5,conv:3,roi:100,budget:50}}});
 
  useEffect(()=>{document.body.className=theme==="dark"?"dark":"";},[theme]);
 
  const showToast=useCallback((msg,type)=>{
    clearTimeout(timer.current);
    setToast({msg,type:"ok"||(type||"ok")});
    timer.current=setTimeout(()=>setToast(null),2800);
  },[]);
 
  const copy=useCallback((text,label)=>{
    const done=()=>showToast((label||"Texto")+" copiado!");
    const fail=()=>showToast("Nao foi possivel copiar","err");
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(()=>{
        try{
          const ta=document.createElement("textarea");
          ta.value=text;
          ta.style.position="fixed";
          ta.style.left="-9999px";
          ta.style.top="0";
          document.body.appendChild(ta);
          ta.focus();ta.select();
          const ok=document.execCommand("copy");
          document.body.removeChild(ta);
          ok?done():fail();
        }catch(e){fail();}
      });
    }else{
      try{
        const ta=document.createElement("textarea");
        ta.value=text;
        ta.style.position="fixed";
        ta.style.left="-9999px";
        ta.style.top="0";
        document.body.appendChild(ta);
        ta.focus();ta.select();
        const ok=document.execCommand("copy");
        document.body.removeChild(ta);
        ok?done():fail();
      }catch(e){fail();}
    }
  },[showToast]);
 
  const addProduct=useCallback(p=>{setProducts(prev=>[{...p,id:Date.now(),spend:0,conversions:0,clicks:0},...prev]);},[]);
  const removeProduct=useCallback(id=>{setProducts(prev=>prev.filter(p=>p.id!==id));},[]);
 
  const saveGlobalParams=useCallback(p=>{
    setGlobalParams(p);
    try{localStorage.setItem("uas_vp",JSON.stringify(p));}catch{}
    showToast("Parametros salvos!");
  },[showToast]);
 
  const addActiveOp=useCallback((product,viability)=>{
    const op={id:Date.now().toString(),product_name:product.name,platform:product.platform,commission:product.commission,status:"active",cpc_max:viability.cpcMax,budget:globalParams.budget,created_at:new Date().toISOString(),details:{refundRate:product.refundRate,niche:product.niche,gravity:product.gravity,convRate:product.convRate,epc:product.epc,score:viability.totalScore,netComm:viability.netComm,prf100:viability.prf100,link:product.url}};
    const updated=[op,...activeOps];
    setActiveOps(updated);
    try{localStorage.setItem("uas_ops",JSON.stringify(updated));}catch{}
    showToast(product.name+" adicionado as Operacoes Ativas!");
  },[activeOps,globalParams,showToast]);
 
  const removeActiveOp=useCallback(id=>{
    const u=activeOps.filter(o=>o.id!==id);
    setActiveOps(u);
    try{localStorage.setItem("uas_ops",JSON.stringify(u));}catch{}
  },[activeOps]);
 
  const updateOpStatus=useCallback((id,status)=>{
    const u=activeOps.map(o=>o.id===id?{...o,status}:o);
    setActiveOps(u);
    try{localStorage.setItem("uas_ops",JSON.stringify(u));}catch{}
  },[activeOps]);
 
  const login=useCallback((name,email)=>{setUser({name,email,avatar:name[0].toUpperCase()});},[]);
  const logout=useCallback(()=>setUser(null),[]);
 
  const tip=({active,payload,label})=>{
    if(!active||!payload?.length)return null;
    return(<div style={{background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:8,padding:"10px 14px",fontFamily:"'DM Mono',monospace",fontSize:11}}>
      <div style={{color:"var(--text3)",marginBottom:6}}>{label}</div>
      {payload.map(p=><div key={p.name} style={{color:p.color,marginBottom:2}}>{p.name}: {"$"+p.value}</div>)}
    </div>);
  };
 
  return(
    <Ctx.Provider value={{products,addProduct,removeProduct,user,login,logout,showToast,copy,theme,setTheme,plan,setPlan,billing,setBilling,activeOps,addActiveOp,removeActiveOp,updateOpStatus,globalParams,saveGlobalParams,tip,presellData,savePresellData,getPresellForProduct}}>
      <style>{css}</style>
      {children}
      {toast&&<div style={{position:"fixed",bottom:24,right:24,zIndex:9999,padding:"10px 18px",borderRadius:9,fontSize:12,fontFamily:"'DM Mono',monospace",fontWeight:500,boxShadow:"0 8px 32px rgba(0,0,0,.25)",display:"flex",alignItems:"center",gap:8,maxWidth:320,background:toast.type==="err"?"var(--red)":"var(--accent)",color:"#fff"}}>{toast.type==="err"?"✕":"✓"} {toast.msg}</div>}
    </Ctx.Provider>
  );
}

 // ─── AUTH ────────────────────────────────────────────────────
function Auth(){
  const [mode,setMode]=useState("login");
  const [f,setF]=useState({email:"",password:""});
  const [err,setErr]=useState("");
  const [busy,setBusy]=useState(false);
  
  const submit=async()=>{
    setBusy(true);
    setErr("");
    const { error } = mode === "login" 
      ? await supabase.auth.signInWithPassword({ email: f.email, password: f.password })
      : await supabase.auth.signUp({ email: f.email, password: f.password });
    
    if(error) setErr(error.message);
    setBusy(false);
  };

  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)",padding:24}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div className="fd" style={{fontSize:30,fontWeight:800,color:"var(--text)"}}>UsAdSuite</div>
        </div>
        <div className="card fu" style={{padding:32}}>
          <div style={{display:"flex",background:"var(--surf2)",borderRadius:9,padding:3,marginBottom:24}}>
            {["login","signup"].map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:8,borderRadius:7,border:"none",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,background:mode===m?"var(--accent)":"transparent",color:mode===m?"#fff":"var(--text2)"}}>
                {m==="login"?"Entrar":"Criar Conta"}
              </button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <input type="email" placeholder="Email" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/>
            <input type="password" placeholder="Senha" value={f.password} onChange={e=>setF({...f,password:e.target.value})}/>
            {err&&<div style={{fontSize:12,color:"var(--red)"}}>✕ {err}</div>}
            <button className="btn btn-accent" onClick={submit} disabled={busy} style={{width:"100%",justifyContent:"center"}}>{busy?"...":mode==="login"?"Entrar":"Criar Conta"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
 const NAV = [
  {id:"dashboard", g:"plataforma", l:"Dashboard", icon:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>},
  {id:"products", g:"plataforma", l:"Produtos", icon:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>},
  {id:"scout", g:"plataforma", l:"Scout", badge:"LIVE", badgeColor:"#059669", icon:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>},
  {id:"keywords", g:"ferramentas", l:"Keywords", icon:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>},
  {id:"simulator", g:"ferramentas", l:"Simulador", icon:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/></svg>},
  {id:"reverso", g:"ferramentas", l:"Reverso AI", badge:"AI", badgeColor:"var(--accent)", icon:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>},
  {id:"presell", g:"ferramentas", l:"Presell", badge:"NOVO", badgeColor:"var(--green)", icon:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>},
  {id:"compliance", g:"ferramentas", l:"Compliance", icon:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>},
  {id:"campaign", g:"inteligencia", l:"Campanha", badge:"DEPLOY", badgeColor:"var(--accent)", icon:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 13a8 8 0 0 1 7 7 6 6 0 0 0 3-5 9 9 0 0 0 6-8 3 3 0 0 0-3-3 9 9 0 0 0-8 6 6 6 0 0 0-5 3z"/><path d="M9 16l-4 4"/></svg>},
  {id:"ops", g:"inteligencia", l:"Operacoes", badge:"LIVE", badgeColor:"var(--green)", icon:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>},
  {id:"analytics", g:"inteligencia", l:"Analytics", icon:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>},
  {id:"export", g:"inteligencia", l:"Exportar", icon:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>},
  {id:"plans", g:"conta", l:"Planos", icon:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>},
  {id:"settings", g:"conta", l:"Configuracoes", icon:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>},
];

const GRP={plataforma:"Plataforma",ferramentas:"Ferramentas",inteligencia:"Inteligencia",conta:"Conta"};
const TITLES={dashboard:"Dashboard",products:"Produtos",scout:"Scout",keywords:"Keywords",simulator:"Simulador",reverso:"Reverso AI",presell:"Presell",compliance:"Compliance",campaign:"Campanha",ops:"Operacoes Ativas",analytics:"Analytics",export:"Exportar",plans:"Planos",settings:"Configuracoes"};
 
// ─── PAGES ───────────────────────────────────────────────────
function Dashboard(){
  const {products,activeOps,tip}=useContext(Ctx);
  const active=activeOps.filter(o=>o.status==="active");
  const totalRev=products.reduce((a,b)=>a+(b.conversions*b.commission*(1-b.refundRate/100)),0);
  const totalSpend=products.reduce((a,b)=>a+b.spend,0);
  const roi=totalSpend>0?((totalRev-totalSpend)/totalSpend*100).toFixed(1):0;
  const avgC=products.length?(products.reduce((a,b)=>a+b.commission,0)/products.length).toFixed(0):0;
  const sugestao=active.length===0?"Va ao Scout e inicie sua primeira operacao.":active[0]?.cpc_max<0.5?"CPC maximo de "+active[0]?.product_name+" abaixo de $0.50. Revise a presell.":"Voce tem "+active.length+" operacao(oes) ativa(s). Verifique o desempenho hoje.";
  return(
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <SH title="Dashboard" desc="Visao estrategica do portfolio — Bottom of Funnel"/>
      <div style={{background:"linear-gradient(135deg,var(--al),var(--surface))",border:"1.5px solid var(--accent)",borderRadius:14,padding:20}} className="fu">
        <div className="fd" style={{fontWeight:800,fontSize:15,color:"var(--accent)",marginBottom:4}}>Minha Proxima Acao</div>
        <div style={{fontSize:13,color:"var(--text2)"}}>{sugestao}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}} className="fu2">
        <StatChip label="Produtos" value={products.length} color="var(--accent)"/>
        <StatChip label="Comissao Media" value={"$"+avgC} color="var(--blue)"/>
        <StatChip label="Receita Total" value={"$"+totalRev.toFixed(0)} color="var(--green)"/>
        <StatChip label="ROI Portfolio" value={roi+"%"} color="var(--amber)"/>
      </div>
      <div className="card fu3">
        <div className="fd" style={{fontSize:13,fontWeight:700,marginBottom:16}}>Receita — Ultimos 7 Dias</div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={CD}>
            <defs><linearGradient id="gD" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity={0.18}/><stop offset="100%" stopColor="var(--accent)" stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="day" tick={{fontSize:9,fill:"var(--text3)"}} axisLine={false} tickLine={false}/>
            <Tooltip content={tip}/>
            <Area type="monotone" dataKey="revenue" name="Receita" stroke="var(--accent)" strokeWidth={2} fill="url(#gD)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card fu4" style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid var(--border)"}}><span className="fd" style={{fontSize:13,fontWeight:700}}>Portfolio</span></div>
        <div style={{overflowX:"auto"}}>
          <table className="tbl">
            <thead><tr><th>Produto</th><th>Plataforma</th><th>Comissao</th><th>Reembolso</th><th>Nicho</th></tr></thead>
            <tbody>{products.map(p=><tr key={p.id}><td style={{fontWeight:600}}>{p.name}</td><td><Tag p={p.platform}/></td><td className="fm" style={{color:"var(--green)"}}>${p.commission}</td><td className="fm" style={{color:"var(--amber)"}}>{p.refundRate}%</td><td style={{color:"var(--text2)"}}>{p.niche}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
 
function Products(){
  const {products,addProduct,removeProduct,showToast,plan}=useContext(Ctx);
  const [open,setOpen]=useState(false);
  const [f,setF]=useState({name:"",platform:"ClickBank",commission:"",refundRate:"",link:"",niche:"Saude"});
  const locked=plan==="free"&&products.length>=3;
  const save=()=>{
    if(locked){showToast("Limite Free — upgrade para Pro","err");return;}
    if(!f.name||!f.commission||!f.link){showToast("Preencha os campos obrigatorios","err");return;}
    addProduct({...f,commission:parseFloat(f.commission),refundRate:parseFloat(f.refundRate)||0});
    setF({name:"",platform:"ClickBank",commission:"",refundRate:"",link:"",niche:"Saude"});
    setOpen(false);showToast("Produto salvo!");
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div className="fu" style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
        <SH title="Produtos" desc="Portfolio de afiliados"/>
        <button className="btn btn-accent" onClick={()=>setOpen(!open)}>+ Novo Produto</button>
      </div>
      {open&&(
        <div className="card fu2" style={{borderColor:"var(--border2)"}}>
          <span className="sec-label">Adicionar Produto</span>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
            {[{l:"Nome *",k:"name",t:"text",ph:"LeanBiome"},{l:"Comissao USD *",k:"commission",t:"number",ph:"142"},{l:"Reembolso %",k:"refundRate",t:"number",ph:"12"},{l:"Link de Afiliado *",k:"link",t:"text",ph:"https://..."}].map(x=>(
              <div key={x.k}><span className="sec-label">{x.l}</span><input type={x.t} placeholder={x.ph} value={f[x.k]} onChange={e=>setF({...f,[x.k]:e.target.value})}/></div>
            ))}
            <div><span className="sec-label">Plataforma</span><select value={f.platform} onChange={e=>setF({...f,platform:e.target.value})}><option>ClickBank</option><option>Digistore24</option><option>BuyGoods</option></select></div>
            <div><span className="sec-label">Nicho</span><select value={f.niche} onChange={e=>setF({...f,niche:e.target.value})}><option>Saude</option><option>Financas</option><option>Fitness</option><option>Relacionamento</option><option>Digital</option></select></div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16}}>
            <button className="btn btn-accent" onClick={save}>Salvar</button>
            <button className="btn btn-ghost" onClick={()=>setOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}} className="fu3">
        {products.map(p=>(
          <div key={p.id} style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:14,padding:20,position:"relative",boxShadow:"0 1px 4px rgba(15,31,61,.06)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div><div className="fd" style={{fontWeight:700,fontSize:15,marginBottom:4}}>{p.name}</div><Tag p={p.platform}/></div>
              <button onClick={()=>{removeProduct(p.id);showToast(p.name+" removido");}} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text3)",padding:4,display:"flex"}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{l:"Comissao",v:"$"+p.commission,c:"var(--green)"},{l:"Reembolso",v:p.refundRate+"%",c:"var(--amber)"},{l:"Nicho",v:p.niche,c:"var(--text2)"},{l:"Conversoes",v:p.conversions,c:"var(--blue)"}].map(x=>(
                <div key={x.l} style={{background:"var(--surf2)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 12px"}}>
                  <div style={{fontSize:10,color:"var(--text3)",fontFamily:"'DM Mono',monospace",marginBottom:3}}>{x.l}</div>
                  <div className="fm" style={{fontSize:13,fontWeight:700,color:x.c}}>{x.v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 
function ScoutCard({p,idx,gP,addToPortfolio,addActiveOp}){
  const vb=calcViability(p,gP);
  const gc=vb.cpcMax>=1?"var(--green)":vb.cpcMax>=0.5?"var(--amber)":"var(--red)";
  const plColor=p.platform==="ClickBank"?"var(--green)":p.platform==="Digistore24"?"var(--blue)":"var(--amber)";
  const metrics=[
    {l:"GRAVITY",v:String(p.gravity),c:p.gravity>=250?"var(--green)":p.gravity>=150?"var(--amber)":"var(--red)"},
    {l:"COMISSAO",v:"$"+p.commission,c:"var(--accent)"},
    {l:"COM.LIQ",v:"$"+vb.netComm.toFixed(2),c:"var(--blue)"},
    {l:"EPC",v:p.epc?"$"+p.epc:"N/A",c:(p.epc||0)>=1.2?"var(--green)":(p.epc||0)>=0.8?"var(--amber)":"var(--red)"},
    {l:"CONVERSAO",v:p.convRate+"%",c:p.convRate>=4?"var(--green)":p.convRate>=2.5?"var(--amber)":"var(--red)"},
    {l:"REEMBOLSO",v:p.refundRate+"%",c:p.refundRate<=8?"var(--green)":p.refundRate<=12?"var(--amber)":"var(--red)"},
  ];
  return(
    <div className="scout-card" style={{borderLeft:"4px solid "+gc}}>
      <VBadge status={vb.status} score={vb.totalScore} cpcMax={vb.cpcMax} issues={vb.issues} prf100={vb.prf100}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:12}}>
        {[{l:"CPC Max",v:"$"+vb.cpcMax.toFixed(4),c:gc},{l:"Com.Liq.",v:"$"+vb.netComm.toFixed(2),c:"var(--accent)"},{l:"Lucro/100",v:(vb.prf100>=0?"$":"-$")+Math.abs(vb.prf100).toFixed(2),c:vb.prf100>0?"var(--green)":"var(--red)"},{l:"Score",v:vb.totalScore+"/100",c:vb.totalScore>=70?"var(--green)":vb.totalScore>=45?"var(--amber)":"var(--red)"}].map(x=>(
          <div key={x.l} style={{background:"var(--surf2)",border:"1px solid var(--border)",borderRadius:6,padding:"7px 10px",textAlign:"center"}}>
            <div style={{fontSize:9,color:"var(--text3)",fontFamily:"'DM Mono',monospace",marginBottom:3}}>{x.l}</div>
            <div style={{fontSize:12,fontWeight:700,color:x.c,fontFamily:"'DM Mono',monospace"}}>{x.v}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:180}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8,flexWrap:"wrap"}}>
            <div className="fd" style={{fontSize:14,fontWeight:800}}>{idx+1}. {p.name}</div>
            <Tag p={p.platform}/>
            <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,fontFamily:"'DM Mono',monospace",background:plColor+"15",color:plColor}}>{p.niche}</span>
            {p.trending&&<span style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:"#fef3c7",color:"#d97706"}}>Trending</span>}
          </div>
          <p style={{fontSize:11,color:"var(--text2)",lineHeight:1.5,marginBottom:8}}>{p.desc}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:3}}>{p.tags.map(t=><span key={t} style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"var(--surf2)",color:"var(--text3)",border:"1px solid var(--border)"}}>{t}</span>)}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,minWidth:220}}>
          {metrics.map(x=>(
            <div key={x.l} style={{background:"var(--surf2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
              <div style={{fontSize:8,color:"var(--text3)",fontFamily:"'DM Mono',monospace",marginBottom:3}}>{x.l}</div>
              <div className="fm" style={{fontSize:13,fontWeight:800,color:x.c}}>{x.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginTop:12,paddingTop:12,borderTop:"1px solid var(--border)",flexWrap:"wrap"}}>
        <button className="btn btn-accent" onClick={()=>addToPortfolio(p)} style={{padding:"7px 14px",fontSize:12}}>+ Portfolio</button>
        {vb.status==="viavel"&&(
          <button onClick={()=>addActiveOp(p,vb)} style={{display:"inline-flex",alignItems:"center",gap:5,background:"#059669",color:"#fff",fontSize:12,padding:"7px 14px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:700}}>Iniciar Operacao</button>
        )}
        <ScoutRiskBtn product={p}/>
        <a href={p.url} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",fontSize:12,padding:"7px 12px",borderRadius:9,border:"1px solid var(--border2)",textDecoration:"none",color:"var(--text2)"}}>Marketplace</a>
      </div>
    </div>
  );
}
 
function Scout(){
  const {addProduct,products,showToast,addActiveOp,globalParams}=useContext(Ctx);
  const [platform,setPlatform]=useState("BuyGoods");
  const [niche,setNiche]=useState("all");
  const [sort,setSort]=useState("gravity");
  const [vOnly,setVOnly]=useState(false);
  const [vParams,setVParams]=useState(globalParams);
  const [applied,setApplied]=useState(globalParams);
  useEffect(()=>{setVParams(globalParams);setApplied(globalParams);},[globalParams]);
  const apply=()=>{setApplied({...vParams});setVOnly(true);showToast("Filtro aplicado!");};
  let filtered=SP.filter(p=>{
    if(platform!=="all"&&p.platform!==platform)return false;
    if(niche!=="all"&&p.niche!==niche)return false;
    if(vOnly&&calcViability(p,applied).status==="inviavel")return false;
    return true;
  }).sort((a,b)=>{
    if(sort==="viability")return calcViability(b,applied).totalScore-calcViability(a,applied).totalScore;
    return sort==="gravity"?b.gravity-a.gravity:sort==="commission"?b.commission-a.commission:sort==="conversion"?b.convRate-a.convRate:a.refundRate-b.refundRate;
  });
  const addToPortfolio=p=>{
    if(products.find(x=>x.name===p.name)){showToast(p.name+" ja no portfolio","err");return;}
    addProduct({name:p.name,platform:p.platform,commission:p.commission,refundRate:p.refundRate,link:p.url,niche:p.niche});
    showToast(p.name+" adicionado!");
  };
  const avgComm=filtered.length?(filtered.reduce((a,b)=>a+b.commission,0)/filtered.length).toFixed(0):0;
  const viaveis=filtered.filter(p=>calcViability(p,applied).status==="viavel").length;
  const prev=calcViability({commission:177,refundRate:8,gravity:234,convRate:3.7,epc:1.52},vParams);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SH title="Scout" sub="Melhores Produtos" desc="Produtos mais rentaveis por plataforma e nicho"/>
      <div className="card">
        <div className="fd" style={{fontSize:13,fontWeight:700,marginBottom:14}}>Filtro de Viabilidade Automatico v2</div>
        <RiskProfileSelector current={vParams} onApply={v=>setVParams(p=>({...p,...v}))}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,marginBottom:12}}>
          {[{l:"Presell→Venda %",k:"conv",tip:"Conversao da presell. NAO multiplica CTR."},{l:"CTR Anuncio %",k:"ctr",tip:"Afeta volume, nao CPC max."},{l:"ROI Alvo %",k:"roi",tip:"100% = dobrar investimento."},{l:"Orcamento Diario $",k:"budget",tip:"Gasto diario previsto."},{l:"Margem Seguranca %",k:"safety",tip:"Reduz CPC max como buffer."}].map(f=>(
            <div key={f.k}>
              <div style={{fontSize:10,color:"var(--text3)",fontFamily:"'DM Mono',monospace",marginBottom:5,display:"flex",alignItems:"center",gap:4}}><Tip text={f.tip}>{f.l}</Tip></div>
              <input type="number" value={vParams[f.k]||""} onChange={e=>setVParams(p=>({...p,[f.k]:parseFloat(e.target.value)||0}))} style={{background:"var(--surface)",border:"1.5px solid var(--border2)",borderRadius:7,padding:"8px 10px",fontSize:13,color:"var(--text)",width:"100%",outline:"none"}}/>
            </div>
          ))}
        </div>
        <div style={{background:"var(--surf2)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:10,fontFamily:"'DM Mono',monospace",color:"var(--text2)"}}>
          Preview (Red Boost): Com.Liq={"$"+prev.netComm.toFixed(2)} · CPC Max={"$"+prev.cpcMax.toFixed(4)} · Lucro/100={"$"+prev.prf100.toFixed(2)} · <strong style={{color:prev.status==="viavel"?"var(--green)":prev.status==="marginal"?"var(--amber)":"var(--red)"}}>{prev.status.toUpperCase()}</strong>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button onClick={apply} className="btn btn-accent" style={{padding:"8px 16px",fontSize:12}}>Aplicar Filtro</button>
          {vOnly&&<button onClick={()=>setVOnly(false)} style={{display:"inline-flex",alignItems:"center",fontSize:11,padding:"7px 12px",borderRadius:8,background:"#fef2f2",color:"var(--red)",border:"1px solid #fecaca",cursor:"pointer"}}>✕ Remover filtro</button>}
        </div>
      </div>
      <div className="card">
        <div className="fd" style={{fontSize:13,fontWeight:700,marginBottom:14}}>Filtros de Plataforma e Nicho</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div><span className="sec-label">Plataforma</span><select value={platform} onChange={e=>setPlatform(e.target.value)}><option value="all">Todas</option><option value="ClickBank">ClickBank</option><option value="Digistore24">Digistore24</option><option value="BuyGoods">BuyGoods</option></select></div>
          <div><span className="sec-label">Nicho</span><select value={niche} onChange={e=>setNiche(e.target.value)}><option value="all">Todos</option><option value="Saude">Saude</option><option value="Fitness">Fitness</option><option value="Financas">Financas</option><option value="Relacionamento">Relacionamento</option><option value="Digital">Digital</option></select></div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[["gravity","Gravity"],["commission","Comissao"],["conversion","Conversao"],["refund","Menor Reembolso"],["viability","Score"]].map(([k,l])=>(
            <button key={k} className={"scout-sort"+(sort===k?" active":"")} onClick={()=>setSort(k)}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}}>
        <StatChip label="Produtos" value={filtered.length} color="var(--accent)"/>
        <StatChip label="Viaveis" value={viaveis} color="var(--green)"/>
        <StatChip label="Comissao Media" value={"$"+avgComm} color="var(--blue)"/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {filtered.map((p,idx)=><ScoutCard key={p.id} p={p} idx={idx} gP={applied} addToPortfolio={addToPortfolio} addActiveOp={addActiveOp}/>)}
      </div>
    </div>
  );
}
 
function Keywords(){
  const {products,copy}=useContext(Ctx);
  const [selId,setSelId]=useState("");
  const [customNeg,setCustomNeg]=useState("");
  const p=products.find(x=>x.id===parseInt(selId)||x.id===selId);
  const n=p?p.name.toLowerCase():"";
  const exact=p?["["+n+"]","[buy "+n+"]","["+n+" official]","["+n+" review]","["+n+" where to buy]"]:[];
  const q='"';
  const phrase=p?[q+n+" review"+q,q+n+" scam"+q,q+n+" price"+q,q+n+" discount"+q,q+n+" side effects"+q]:[];
  const base=["free","gratis","download","torrent","login","cancelar","reembolso","fraude"];
  const neg=[...base,...(customNeg?customNeg.split(",").map(s=>s.trim()).filter(Boolean):[])];
  const all="=== EXATA ===\n"+exact.join("\n")+"\n\n=== FRASE ===\n"+phrase.join("\n")+"\n\n=== NEGATIVAS ===\n"+neg.join("\n");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SH title="Motor de Keywords" sub="auto-generator" desc="Exact, phrase e negativas para Google Ads BoF"/>
      <div className="card fu2"><span className="sec-label">Produto</span><select value={selId} onChange={e=>setSelId(e.target.value)}><option value="">-- Escolha --</option>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      {p&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[[exact,"var(--green)","Correspondencia Exata"],[phrase,"var(--blue)","Correspondencia de Frase"]].map(([items,color,label])=>(
              <div key={label} className="card">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div className="fd" style={{fontSize:13,fontWeight:700}}>{label}</div>
                  <button className="btn-sm" onClick={()=>copy(items.join("\n"),label)}>Copiar</button>
                </div>
                {items.map(k=><div key={k} className="kw-chip"><span style={{color:color}}>{k}</span></div>)}
              </div>
            ))}
          </div>
          <div className="card fu3">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div className="fd" style={{fontSize:13,fontWeight:700}}>Negativas</div>
              <button className="btn-sm" onClick={()=>copy(neg.join("\n"),"Negativas")}>Copiar</button>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>{neg.map(k=><span key={k} style={{fontSize:10,padding:"4px 8px",borderRadius:4,background:"#fef2f2",border:"1px solid #fecaca",color:"var(--red)",fontFamily:"'DM Mono',monospace"}}>{k}</span>)}</div>
            <input placeholder="Negativas customizadas, separadas por virgula" value={customNeg} onChange={e=>setCustomNeg(e.target.value)}/>
          </div>
          <button className="btn btn-accent fu4" onClick={()=>copy(all,"Lista completa")} style={{width:"100%",justifyContent:"center"}}>Copiar Lista Completa</button>
        </div>
      )}
    </div>
  );
}
 
function Simulator(){
  const {products}=useContext(Ctx);
  const [f,setF]=useState({pid:"",commission:"",refundRate:"",conv:"",roi:"100"});
  const p=products.find(x=>x.id===parseInt(f.pid)||x.id===f.pid);
  useEffect(()=>{if(p)setF(prev=>({...prev,commission:p.commission,refundRate:p.refundRate}));},[f.pid]);
  const vb=calcViability({commission:parseFloat(f.commission)||0,refundRate:parseFloat(f.refundRate)||0,gravity:200},{conv:parseFloat(f.conv)||3,roi:parseFloat(f.roi)||100,budget:50});
  const hasData=f.commission&&f.conv;
  const cls=!hasData?"":"cpc-"+(vb.cpcMax>=1?"green":vb.cpcMax>=0.5?"amber":"red");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <SH title="Simulador de CPC" sub="formula v2" desc="(comissao * conversao) - custos = lucro"/>
      <div className="sim-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card fu2" style={{display:"flex",flexDirection:"column",gap:14}}>
          <span className="sec-label">Parametros</span>
          <div><span className="sec-label">Carregar produto</span><select value={f.pid} onChange={e=>setF({...f,pid:e.target.value})}><option value="">-- Manual --</option>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <RiskProfileSelector current={{roi:parseFloat(f.roi)||0,conv:parseFloat(f.conv)||0}} compareKeys={["roi","conv"]} onApply={v=>setF(prev=>({...prev,conv:String(v.conv),roi:String(v.roi)}))}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[{l:"Comissao Bruta $",k:"commission",ph:"177"},{l:"Reembolso %",k:"refundRate",ph:"8"},{l:"Presell→Venda %",k:"conv",ph:"3"},{l:"ROI Alvo %",k:"roi",ph:"100"}].map(x=>(
              <div key={x.k}><span className="sec-label">{x.l}</span><input type="number" placeholder={x.ph} value={f[x.k]} onChange={e=>setF({...f,[x.k]:e.target.value})}/></div>
            ))}
          </div>
          <div style={{background:"var(--surf2)",border:"1px solid var(--border)",borderRadius:8,padding:"12px 14px",fontSize:10,fontFamily:"'DM Mono',monospace",color:"var(--text2)",lineHeight:1.8}}>
            Passo 1: Liq = Bruta × (1−Reembolso%)<br/>
            Passo 2: Receita/clique = Liq × Conv%<br/>
            Passo 3: CPC Max = Receita/(1+ROI%)<br/>
            Passo 4: Lucro/100 = (Receita×100) − (CPC×100)
          </div>
        </div>
        <div className="fu3" style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="card" style={{textAlign:"center",padding:"28px 20px"}}>
            <div className="fm" style={{fontSize:10,color:"var(--text3)",marginBottom:16,letterSpacing:".1em",textTransform:"uppercase"}}>CPC Maximo Recomendado</div>
            {hasData
              ?<span className={"fm "+cls} style={{fontSize:34,fontWeight:800,borderRadius:12,padding:"10px 24px",display:"inline-block"}}>{"$"+vb.cpcMax.toFixed(4)}</span>
              :<span style={{color:"var(--text3)",fontSize:13}}>Preencha os campos</span>
            }
            {hasData&&vb.cpcMax<0.5&&<div className="box-warn" style={{marginTop:16,fontSize:11}}>CPC abaixo de $0.50 — dificil competir. Produto precisa de comissao maior.</div>}
          </div>
          {hasData&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[{l:"Com. Liquida",v:"$"+vb.netComm.toFixed(2),c:"var(--green)"},{l:"Receita/clique",v:"$"+vb.revenuePerClick.toFixed(4),c:"var(--blue)"},{l:"Lucro/100 cliques",v:"$"+vb.prf100.toFixed(2),c:vb.prf100>0?"var(--green)":"var(--red)"},{l:"Score",v:vb.totalScore+"/100",c:"var(--purple)"}].map(x=>(
                <div key={x.l} className="stat-chip"><div style={{fontSize:10,color:"var(--text3)",fontFamily:"'DM Mono',monospace",marginBottom:6}}>{x.l}</div><div className="fm" style={{fontSize:16,fontWeight:700,color:x.c}}>{x.v}</div></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 
// ─── PRESELL ENGINE ────────────────────────────────────────
// Extrai Headline/Subtitle/Body/CTA do texto gerado pelo Reverso AI
function parsePresellFromCopy(text,fallback){
  fallback=fallback||{};
  const lines=text.split("\n").map(l=>l.trim()).filter(Boolean);
  let headline="",subtitle="",body="",cta="";
  // Tenta achar a secao "Presell" no texto gerado
  const idx=lines.findIndex(l=>/presell/i.test(l));
  const block=idx>=0?lines.slice(idx+1,idx+12):lines;
  // Headline: linha mais chamativa (RSA Headline 1 ou primeira linha relevante com poucas palavras)
  const headlineLine=block.find(l=>/headline/i.test(l))||block.find(l=>l.length>15&&l.length<70);
  headline=(headlineLine||"").replace(/^[^:]*:\s*/i,"").replace(/^h\d[:.]?\s*/i,"").trim();
  // Subtitle: proxima linha relevante apos headline
  const subLine=block.find(l=>/subtitle/i.test(l));
  subtitle=(subLine||"").replace(/^[^:]*:\s*/i,"").trim();
  // Body: paragrafo mais longo e "emocional" (heuristica: maior linha com mais de 80 caracteres)
  const bodyLine=lines.reduce((best,l)=>l.length>(best?best.length:0)&&l.length>60&&!/^\d|^h\d|^=== /i.test(l)?l:best,"");
  body=bodyLine||"";
  // CTA: linha com "cta" ou "button" ou termos de acao
  const ctaLine=block.find(l=>/cta|button/i.test(l))||lines.find(l=>/click here|see the|get instant|claim|order now|learn more/i.test(l));
  cta=(ctaLine||"").replace(/^[^:]*:\s*/i,"").trim();
  return{
    headline:headline||fallback.product&&("Discover Why "+fallback.product+" Is Different")||"Discover The Natural Solution",
    subtitle:subtitle||fallback.benefit||"A simple approach backed by real results",
    body:body||("Many people struggle with this every day. "+(fallback.benefit||"This solution")+" was designed to help you move forward — naturally, and at your own pace. Thousands have already tried it. Here's what makes it different."),
    cta:cta||"Click Here To See The Official Site",
  };
}
 
// Gera o HTML final, single-file, com CSS inline, minimalista e responsivo
function buildPresellHTML(d){
  const esc=s=>String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const kw=(d.keyword||"general").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"general";
  const baseLink=(d.affiliateLink||"#").trim();
  const sep=baseLink.includes("?")?"&":"?";
  const finalLink=baseLink==="#"?"#":baseLink+sep+"subid="+encodeURIComponent(kw);
  return"<!DOCTYPE html>\n"+
"<html lang=\"en\">\n<head>\n"+
"<meta charset=\"UTF-8\">\n"+
"<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"+
"<title>"+esc(d.headline)+"</title>\n"+
"<meta name=\"description\" content=\""+esc(d.subtitle)+"\">\n"+
"<meta name=\"robots\" content=\"noindex, nofollow\">\n"+
"<style>\n"+
"*{box-sizing:border-box;margin:0;padding:0}\n"+
"html{-webkit-text-size-adjust:100%}\n"+
"body{font-family:Georgia,'Times New Roman',serif;background:#faf9f7;color:#222;line-height:1.7;font-size:17px}\n"+
".wrap{max-width:680px;margin:0 auto;padding:0 16px 60px}\n"+
".video-box{width:100%;aspect-ratio:16/9;background:#000;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}\n"+
".video-box .play{width:58px;height:58px;border-radius:50%;background:rgba(255,255,255,.94);display:flex;align-items:center;justify-content:center}\n"+
".video-box .play::after{content:'';border-style:solid;border-width:11px 0 11px 18px;border-color:transparent transparent transparent #1e4db7;margin-left:4px}\n"+
".video-cap{position:absolute;bottom:8px;left:0;right:0;text-align:center;color:#fff;font-family:Arial,Helvetica,sans-serif;font-size:11px;opacity:.85;padding:0 12px}\n"+
".byline{font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:.06em;color:#999;margin:18px 0 14px;border-bottom:1px solid #e3e0da;padding-bottom:12px;text-transform:uppercase}\n"+
"h1{font-family:Georgia,serif;font-size:26px;line-height:1.28;color:#111;margin:0 0 8px;font-weight:700}\n"+
".subtitle{font-family:Georgia,serif;font-size:16px;color:#5a5a5a;margin-bottom:20px;font-style:italic}\n"+
"p{font-size:17px;margin-bottom:16px;color:#2a2a2a}\n"+
".pain{background:#fff7f0;border-left:4px solid #d97706;padding:13px 15px;margin:20px 0;font-size:15px;font-family:Arial,Helvetica,sans-serif;color:#7a4a06;border-radius:0 6px 6px 0}\n"+
".cta-wrap{text-align:center;margin:30px 0 26px}\n"+
".cta-btn{display:block;background:#1e4db7;color:#fff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:18px;padding:17px 20px;border-radius:8px;box-shadow:0 6px 18px rgba(30,77,183,.32)}\n"+
".cta-sub{font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#999;text-align:center;margin-top:10px}\n"+
"footer{margin-top:40px;padding-top:18px;border-top:1px solid #e3e0da;font-family:Arial,Helvetica,sans-serif}\n"+
".disclosure{font-size:11px;color:#888;line-height:1.6;margin-bottom:12px}\n"+
".footlinks{font-size:11px;color:#aaa;text-align:center}\n"+
".footlinks a{color:#aaa;text-decoration:underline;margin:0 6px}\n"+
"@media(min-width:540px){body{font-size:18px}.wrap{padding:0 24px 70px}h1{font-size:32px}.subtitle{font-size:17px}p{font-size:18px}.cta-btn{display:inline-block;padding:18px 40px}}\n"+
"</style>\n</head>\n<body>\n"+
"<div class=\"video-box\"><div class=\"play\"></div><div class=\"video-cap\">Watch: The Discovery That Changed Everything</div></div>\n"+
"<div class=\"wrap\">\n"+
"<div class=\"byline\">Sponsored Health Report</div>\n"+
"<h1>"+esc(d.headline)+"</h1>\n"+
"<div class=\"subtitle\">"+esc(d.subtitle)+"</div>\n"+
"<p>"+esc(d.body)+"</p>\n"+
"<div class=\"pain\">If you've tried other solutions before and felt disappointed, you're not alone — and this is exactly why people are switching.</div>\n"+
"<p>What makes this approach stand out is its simplicity. No drastic changes, no complicated routines — just a method that works with your body, not against it.</p>\n"+
"<div class=\"cta-wrap\">\n"+
"<a href=\""+esc(finalLink)+"\" class=\"cta-btn\" rel=\"nofollow noopener\" target=\"_blank\">"+esc(d.cta)+"</a>\n"+
"<div class=\"cta-sub\">Opens the official website in a new tab</div>\n"+
"</div>\n"+
"<footer>\n"+
"<div class=\"disclosure\">Affiliate Disclosure: This page may receive a commission if you make a purchase through the link above, at no extra cost to you. Results may vary from person to person. This content is for informational purposes only.</div>\n"+
"<div class=\"footlinks\"><a href=\"#\">Privacy Policy</a>|<a href=\"#\">Terms of Service</a>|<a href=\"#\">Contact</a></div>\n"+
"</footer>\n"+
"</div>\n</body>\n</html>";
}
 
function PresellPreview({data}){
  const d=data||{headline:"Your Headline Here",subtitle:"Your subtitle here",body:"Your advertorial body text will appear here once generated.",cta:"Click Here To Continue"};
  return(
    <div style={{background:"#faf9f7",borderRadius:12,overflow:"hidden",border:"1.5px solid var(--border)",boxShadow:"0 1px 4px rgba(15,31,61,.06)"}}>
      <div style={{width:"100%",aspectRatio:"16/9",background:"#000",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        <div style={{width:54,height:54,borderRadius:"50%",background:"rgba(255,255,255,.94)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:0,height:0,borderTop:"10px solid transparent",borderBottom:"10px solid transparent",borderLeft:"16px solid #1e4db7",marginLeft:3}}/>
        </div>
        <div style={{position:"absolute",bottom:8,left:0,right:0,textAlign:"center",color:"#fff",fontSize:11,opacity:.85,fontFamily:"Georgia,serif"}}>Watch: The Discovery That Changed Everything</div>
      </div>
      <div style={{padding:"22px 24px 28px"}}>
        <div style={{fontSize:10,color:"#999",fontFamily:"Arial,sans-serif",letterSpacing:".06em",textTransform:"uppercase",marginBottom:14,borderBottom:"1px solid #e3e0da",paddingBottom:12}}>Sponsored Health Report</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:23,fontWeight:700,color:"#111",lineHeight:1.3,marginBottom:8}}>{d.headline}</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:15,color:"#5a5a5a",fontStyle:"italic",marginBottom:18}}>{d.subtitle}</div>
        <p style={{fontFamily:"Georgia,serif",fontSize:16,color:"#2a2a2a",lineHeight:1.75,marginBottom:14}}>{d.body}</p>
        <div style={{background:"#fff7f0",borderLeft:"4px solid var(--amber)",padding:"12px 15px",fontSize:13,color:"#7a4a06",marginBottom:18,borderRadius:"0 6px 6px 0"}}>If you've tried other solutions before and felt disappointed, you're not alone.</div>
        <div style={{textAlign:"center",marginBottom:6}}>
          <div style={{display:"inline-block",background:"var(--accent)",color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,padding:"15px 30px",borderRadius:8,boxShadow:"0 6px 18px rgba(30,77,183,.28)"}}>{d.cta}</div>
        </div>
        <div style={{fontSize:10,color:"#999",textAlign:"center",marginBottom:20}}>Opens the official website in a new tab</div>
        <div style={{borderTop:"1px solid #e3e0da",paddingTop:14}}>
          <div style={{fontSize:10,color:"#888",lineHeight:1.6,marginBottom:10,fontFamily:"Arial,sans-serif"}}>Affiliate Disclosure: This page may receive a commission if you make a purchase through the link above, at no extra cost to you.</div>
          <div style={{fontSize:10,color:"#bbb",textAlign:"center",fontFamily:"Arial,sans-serif"}}>Privacy Policy &nbsp;|&nbsp; Terms of Service &nbsp;|&nbsp; Contact</div>
        </div>
      </div>
    </div>
  );
}
 
function Presell(){
  const {presellData,savePresellData,showToast,products,getPresellForProduct}=useContext(Ctx);
  const EMPTY={headline:"",subtitle:"",body:"",cta:"",affiliateLink:"",keyword:"",niche:"Saude"};
  const [d,setD]=useState(presellData||EMPTY);
  const [selId,setSelId]=useState("");
  useEffect(()=>{if(presellData)setD(prev=>({...prev,...presellData}));},[presellData]);
  const setField=(k,v)=>{const nd={...d,[k]:v};setD(nd);};
  const compliance=analyzePresellCompliance(d,d.niche||"Saude");
 
  const slug=s=>String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
 
  const loadProduct=id=>{
    setSelId(id);
    if(!id){return;}
    const p=products.find(x=>String(x.id)===String(id));
    if(!p)return;
    // Verifica se ja existe copy salvo (Reverso AI) para ESTE produto especifico
    const saved=getPresellForProduct(p.name);
    const nd={
      affiliateLink:p.link||"",
      niche:p.niche||"Saude",
      keyword:slug(p.name),
      headline:saved&&saved.headline?saved.headline:"",
      subtitle:saved&&saved.subtitle?saved.subtitle:"",
      body:saved&&saved.body?saved.body:"",
      cta:saved&&saved.cta?saved.cta:"",
      _productName:p.name,
    };
    setD(nd);
    showToast(saved
      ?"Dados e copy de "+p.name+" carregados com sucesso!"
      :"Dados do produto "+p.name+" carregados — sem copy gerado ainda."
    );
  };
 
  const reset=()=>{
    setD(EMPTY);
    setSelId("");
    showToast("Campos limpos — comece do zero.");
  };
 
  const download=()=>{
    if(!d.headline&&!d.body){showToast("Preencha ou gere o conteudo primeiro","err");return;}
    if(!d.affiliateLink){showToast("Adicione o Affiliate Link antes de exportar","err");return;}
    if(compliance.status==="bloqueado"){showToast("Corrija os alertas criticos de compliance antes de exportar","err");return;}
    const html=buildPresellHTML(d);
    const blob=new Blob([html],{type:"text/html"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download="presell.html";a.click();
    URL.revokeObjectURL(url);
    showToast("Presell.html baixado!");
  };
  const save=()=>{savePresellData(d);showToast("Presell salva!");};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SH title="Presell" sub="Hibrido" desc="Video + advertorial — gerada automaticamente pelo Reverso AI ou editada manualmente"/>
      <div className="card fu" style={{display:"flex",flexDirection:"column",gap:12}}>
        <div className="fd" style={{fontSize:13,fontWeight:700}}>Carregar Produto do Portfolio</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <select value={selId} onChange={e=>loadProduct(e.target.value)} style={{flex:1,minWidth:200}}>
            <option value="">-- Selecione um produto --</option>
            {products.map(p=><option key={p.id} value={p.id}>{p.name} ({p.platform})</option>)}
          </select>
          <button className="btn btn-ghost" onClick={reset} style={{fontSize:12,whiteSpace:"nowrap"}}>Reset / Limpar</button>
        </div>
        <div className="box-info" style={{fontSize:11}}>Ao selecionar, o sistema preenche automaticamente Nicho, Affiliate Link e sugere a Keyword/SubID. Se o produto ja tiver copy gerado pelo Reverso AI, Headline/Subtitle/Body/CTA tambem sao carregados.</div>
      </div>
      <div className="presell-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div className="card fu2" style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="fd" style={{fontSize:13,fontWeight:700}}>Conteudo</div>
          <div><span className="sec-label">Headline</span><input value={d.headline} onChange={e=>setField("headline",e.target.value)} placeholder="Discover Why This Works Differently"/></div>
          <div><span className="sec-label">Subtitle</span><input value={d.subtitle} onChange={e=>setField("subtitle",e.target.value)} placeholder="A simple approach backed by real results"/></div>
          <div><span className="sec-label">Advertorial Body</span><textarea value={d.body} onChange={e=>setField("body",e.target.value)} placeholder="The emotional paragraph goes here..." style={{minHeight:120}}/></div>
          <div><span className="sec-label">CTA</span><input value={d.cta} onChange={e=>setField("cta",e.target.value)} placeholder="Click Here To See The Official Site"/></div>
          <div>
            <span className="sec-label" style={{display:"flex",alignItems:"center",gap:5}}>
              <Tip text="Define quais regras de compliance se aplicam ao seu copy. Niches como Saude e Financas tem checagem mais rigorosa.">Nicho (para Compliance)</Tip>
            </span>
            <select value={d.niche||"Saude"} onChange={e=>setField("niche",e.target.value)}>
              <option value="Saude">Saude</option><option value="Fitness">Fitness</option><option value="Financas">Financas</option><option value="Relacionamento">Relacionamento</option><option value="Digital">Digital</option><option value="Sobrevivencia">Sobrevivencia</option>
            </select>
          </div>
          <PresellComplianceBox d={d} niche={d.niche||"Saude"}/>
          <div style={{height:1,background:"var(--border)",margin:"4px 0"}}/>
          <div>
            <span className="sec-label" style={{display:"flex",alignItems:"center",gap:5}}>
              <Tip text="Preenchido automaticamente ao carregar um produto do Portfolio. Pode editar livremente.">Affiliate Link</Tip>
            </span>
            <input value={d.affiliateLink} onChange={e=>setField("affiliateLink",e.target.value)} placeholder="https://hop.clickbank.net/?vendor=..."/>
          </div>
          <div>
            <span className="sec-label" style={{display:"flex",alignItems:"center",gap:5}}>
              <Tip text="Palavra-chave ou nome da campanha usada para gerar o subid de rastreamento (ex: redboost-google-bof).">Keyword / SubID</Tip>
            </span>
            <input value={d.keyword} onChange={e=>setField("keyword",e.target.value)} placeholder="redboost-google-bof"/>
          </div>
          {d.affiliateLink&&d.keyword&&(
            <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:"var(--text3)",background:"var(--surf2)",borderRadius:6,padding:"8px 10px",wordBreak:"break-all"}}>
              Link final: {d.affiliateLink}{d.affiliateLink.includes("?")?"&":"?"}subid={d.keyword.toLowerCase().replace(/[^a-z0-9]+/g,"-")}
            </div>
          )}
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button className="btn btn-ghost" onClick={save}>Salvar</button>
            <button className="btn btn-accent" onClick={download} disabled={compliance.status==="bloqueado"} style={{flex:1,justifyContent:"center",opacity:compliance.status==="bloqueado"?.5:1,cursor:compliance.status==="bloqueado"?"not-allowed":"pointer"}}>{compliance.status==="bloqueado"?"Corrija os alertas para exportar":"Download Presell (HTML/CSS)"}</button>
          </div>
          <div className="box-info" style={{fontSize:11}}>Gerado automaticamente quando voce roda o Reverso AI. O HTML exportado inclui rel="nofollow noopener", subid de rastreamento e rodape de compliance (Privacy/Terms/Affiliate Disclosure).</div>
        </div>
        <div className="fu3">
          <div className="sec-label" style={{marginBottom:8}}>Preview em Tempo Real</div>
          <PresellPreview data={d}/>
        </div>
      </div>
    </div>
  );
}
 
 
function Reverso(){
  const {copy,showToast,savePresellData,products}=useContext(Ctx);
  const [apiKey,setApiKey]=useState(()=>{try{return localStorage.getItem("uas_key")||""}catch{return""}});
  const [f,setF]=useState({product:"",benefit:"",audience:"",niche:"health",tone:"professional"});
  const [selId,setSelId]=useState("");
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
 
  const NICHE_MAP={Saude:"health",Fitness:"fitness",Financas:"finance",Relacionamento:"relationship",Digital:"health",Sobrevivencia:"health"};
  const BENEFIT_FALLBACK={
    Saude:"Apoia sua saude de forma natural, com uma rotina simples de seguir todos os dias",
    Fitness:"Ajuda a alcancar seus objetivos fisicos sem mudancas drasticas na rotina",
    Financas:"Oferece uma abordagem pratica para organizar e fazer seu dinheiro trabalhar melhor",
    Relacionamento:"Melhora a conexao no relacionamento com passos simples e praticos",
    Digital:"Resolve um problema especifico do dia a dia de forma rapida e acessivel",
    Sobrevivencia:"Prepara para situacoes imprevistas com uma solucao pratica e confiavel",
  };
  // Tabela de referencia inteligente: nome/tags/descricao -> publico-alvo especifico
  const AUDIENCE_RULES=[
    {match:["mens","masculino","prostate","testosterone","erecprime","flowforce"],audience:"Men 40+"},
    {match:["weight-loss","feminino","leanbiome","emagrec"],audience:"Women 30-50"},
    {match:["trading","finance","financas","investidor","trade genius"],audience:"Investors & Traders"},
    {match:["hearing","tinnitus","cortexi","sonovive","cognitive"],audience:"Adults 50+"},
    {match:["blood-sugar","glucoberry","metabolic"],audience:"Adults 45+ with metabolic concerns"},
    {match:["relationship","his secret","manifestation"],audience:"Women 25-45"},
  ];
  const AUDIENCE_FALLBACK={
    Saude:"Adults 35+",Fitness:"Adults 25-45",Financas:"Adults 30-55",
    Relacionamento:"Adults 25-45",Digital:"Adults 25-50",Sobrevivencia:"Adults 30-60",
  };
  const suggestAudience=p=>{
    const haystack=[p.name,p.desc,...(p.tags||[])].join(" ").toLowerCase();
    const rule=AUDIENCE_RULES.find(r=>r.match.some(m=>haystack.includes(m)));
    if(rule)return rule.audience;
    return AUDIENCE_FALLBACK[p.niche]||"Adults 30-55";
  };
 
  const loadProduct=id=>{
    setSelId(id);
    if(!id){return;}
    const p=products.find(x=>String(x.id)===String(id));
    if(!p)return;
    const benefit=p.desc&&p.desc.trim()?p.desc:(BENEFIT_FALLBACK[p.niche]||BENEFIT_FALLBACK.Saude);
    setF({
      product:p.name,
      benefit,
      audience:suggestAudience(p),
      niche:NICHE_MAP[p.niche]||"health",
      tone:f.tone,
    });
    showToast("Dados do produto "+p.name+" carregados — revise o Beneficio antes de gerar.");
  };
 
  const gen=async()=>{
    if(!apiKey.startsWith("sk-ant-")){setErr("Configure sua chave API Claude");return;}
    if(!f.product||!f.benefit){setErr("Preencha Produto e Beneficio");return;}
    setErr("");setLoading(true);setResult(null);
    const prompt="You are an elite Google Ads copywriter for affiliate BoF campaigns. Generate ALL copy ONLY in AMERICAN ENGLISH.\n\nProduct: "+f.product+"\nBenefit: "+f.benefit+"\nAudience: "+f.audience+"\nNiche: "+f.niche+"\nTone: "+f.tone+"\n\nGenerate:\n1. 8 RSA Headlines (max 30 chars each)\n2. 4 RSA Descriptions (max 90 chars each)\n3. Presell: headline + subtitle + emotional advertorial body paragraph + CTA button text\n4. 4 Sitelinks with descriptions\n5. 6 Callouts\n\nNo guaranteed result claims. Native American English only.";
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,messages:[{role:"user",content:prompt}]})});
      if(!r.ok)throw new Error("API Error "+r.status);
      const d=await r.json();
      const text=d.content?.[0]?.text||"";
      setResult(text);
      const presell=parsePresellFromCopy(text,f);
      presell.keyword=presell.keyword||f.product.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
      presell.niche=f.niche==="health"?"Saude":f.niche==="fitness"?"Fitness":f.niche==="finance"?"Financas":f.niche==="relationship"?"Relacionamento":"Saude";
      presell._productName=f.product;
      savePresellData(presell);
      showToast("Copy gerado! Presell preenchida automaticamente.");
    }catch(e){setErr("Erro: "+e.message);}finally{setLoading(false);}
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SH title="Reverso AI" sub="PT → EN" desc="Preencha em portugues — IA gera copy americano completo"/>
      <div className="card fu" style={{display:"flex",flexDirection:"column",gap:12}}>
        <div className="fd" style={{fontSize:13,fontWeight:700}}>Carregar Produto do Portfolio</div>
        <select value={selId} onChange={e=>loadProduct(e.target.value)}>
          <option value="">-- Selecione um produto --</option>
          {products.map(p=><option key={p.id} value={p.id}>{p.name} ({p.platform})</option>)}
        </select>
        <div className="box-info" style={{fontSize:11}}>Preenche automaticamente Produto e Nicho. O Beneficio Principal vem sugerido — edite livremente o angulo de venda antes de gerar.</div>
      </div>
      <div className="card fu2">
        <div className="fd" style={{fontSize:13,fontWeight:700,marginBottom:12}}>Chave API Claude</div>
        <div style={{display:"flex",gap:8}}><input type="password" placeholder="sk-ant-api03-..." value={apiKey} onChange={e=>setApiKey(e.target.value)} style={{flex:1}}/><button className="btn btn-ghost" onClick={()=>{try{localStorage.setItem("uas_key",apiKey);}catch{}showToast("Chave salva!");}}>Salvar</button></div>
        <div className="box-info" style={{marginTop:10,fontSize:11,color:"var(--text2)"}}>Obtenha em console.anthropic.com · ~$0.01/geracao</div>
      </div>
      <div className="card fu3" style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="fd" style={{fontSize:13,fontWeight:700}}>Informacoes em Portugues</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
          <div><span className="sec-label">Produto *</span><input placeholder="LeanBiome — suplemento" value={f.product} onChange={e=>setF({...f,product:e.target.value})}/></div>
          <div><span className="sec-label">Beneficio Principal *</span><input placeholder="Perde 5kg sem dieta" value={f.benefit} onChange={e=>setF({...f,benefit:e.target.value})}/></div>
          <div><span className="sec-label">Publico-alvo</span><input placeholder="Mulheres 40+" value={f.audience} onChange={e=>setF({...f,audience:e.target.value})}/></div>
          <div><span className="sec-label">Nicho</span><select value={f.niche} onChange={e=>setF({...f,niche:e.target.value})}><option value="health">Saude</option><option value="fitness">Fitness</option><option value="finance">Financas</option><option value="relationship">Relacionamento</option></select></div>
          <div><span className="sec-label">Tom</span><select value={f.tone} onChange={e=>setF({...f,tone:e.target.value})}><option value="professional">Profissional</option><option value="urgent">Urgencia</option><option value="curious">Curiosidade</option><option value="empathetic">Empatico</option></select></div>
        </div>
      </div>
      {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"10px 14px",fontSize:12,color:"var(--red)",fontFamily:"'DM Mono',monospace"}}>✕ {err}</div>}
      <button className="btn btn-accent fu4" onClick={gen} disabled={loading} style={{width:"100%",justifyContent:"center",padding:14,fontSize:14}}>{loading?<><Spin/> Gerando...</>:"Gerar Copy Completo em Ingles"}</button>
      {result&&(
        <div className="card fu" style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div className="fd" style={{fontSize:14,fontWeight:700}}>Copy Gerado em Ingles</div><button className="btn-sm" onClick={()=>copy(result,"Copy completo")}>Copiar Tudo</button></div>
          <pre style={{fontSize:11,color:"var(--text2)",fontFamily:"'DM Mono',monospace",background:"var(--surf2)",borderRadius:8,padding:16,overflow:"auto",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{result}</pre>
          <div className="box-info" style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
            <span>A Presell foi preenchida automaticamente com Headline, Body e CTA extraidos deste copy.</span>
            <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"var(--accent)"}}>Va para a aba Presell →</span>
          </div>
        </div>
      )}
    </div>
  );
}
 
// ─── COMPLIANCE (painel de auditoria dedicado) ──────────────
function Compliance(){
  const {copy}=useContext(Ctx);
  const [mode,setMode]=useState("text");
  const [input,setInput]=useState("");
  const [url,setUrl]=useState("");
  const [niche,setNiche]=useState("Saude");
  const [checked,setChecked]=useState(false);
  const analyze=()=>{setChecked(true);};
  const fullText=mode==="text"?input:url;
  const r=checked?analyzePresellCompliance({headline:fullText,subtitle:"",body:fullText,cta:""},niche):null;
  const cfg=r?{
    bloqueado:{bg:"#fef2f2",border:"#fecaca",color:"#991b1b",icon:"✗",label:"Bloqueado"},
    atencao:{bg:"#fffbeb",border:"#fcd34d",color:"#92400e",icon:"⚠",label:"Atencao"},
    aprovado:{bg:"#ecfdf5",border:"#a7f3d0",color:"#065f46",icon:"✓",label:"Aprovado"},
  }[r.status]:null;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SH title="Compliance" sub="auditoria" desc="Cole um texto ou URL e receba um relatorio de riscos para o Google Ads"/>
      <div className="card fu2" style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",gap:8}}>
          {[["text","Colar Texto"],["url","Verificar URL"]].map(([k,l])=>(
            <button key={k} className={"btn "+(mode===k?"btn-accent":"btn-ghost")} onClick={()=>{setMode(k);setChecked(false);}} style={{fontSize:12,padding:"8px 14px"}}>{l}</button>
          ))}
        </div>
        {mode==="text"?(
          <div><span className="sec-label">Texto do anuncio, presell ou copy</span><textarea value={input} onChange={e=>{setInput(e.target.value);setChecked(false);}} placeholder="Cole aqui a headline, descricao ou advertorial completo..." style={{minHeight:140}}/></div>
        ):(
          <div><span className="sec-label">URL da pagina de destino</span><input value={url} onChange={e=>{setUrl(e.target.value);setChecked(false);}} placeholder="https://sua-presell.vercel.app/produto"/>
            <div className="box-info" style={{marginTop:8,fontSize:11}}>Verificacao de URL analisa apenas o texto colado abaixo (preview manual) — fetch automatico de paginas externas nao esta disponivel no momento.</div>
          </div>
        )}
        <div><span className="sec-label">Nicho do produto</span><select value={niche} onChange={e=>{setNiche(e.target.value);setChecked(false);}}>
          <option value="Saude">Saude</option><option value="Fitness">Fitness</option><option value="Financas">Financas</option><option value="Relacionamento">Relacionamento</option><option value="Digital">Digital</option><option value="Sobrevivencia">Sobrevivencia</option>
        </select></div>
        <button className="btn btn-accent" onClick={analyze} disabled={!fullText} style={{justifyContent:"center",opacity:!fullText?.5:1}}>Analisar Compliance</button>
      </div>
      {checked&&r&&(
        <div className="card fu3" style={{background:cfg.bg,border:"1.5px solid "+cfg.border}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:cfg.color}}>{cfg.icon} Relatorio de Compliance — {cfg.label}</span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:cfg.color,fontWeight:700}}>Score {r.score}/100</span>
          </div>
          {r.hits.length>0?(
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:r.nicheRule.safe?0:14}}>
              {r.hits.map((h,i)=>(
                <div key={i} style={{display:"flex",gap:10,fontSize:13,color:cfg.color,alignItems:"flex-start",background:"rgba(255,255,255,.4)",borderRadius:8,padding:"8px 12px"}}>
                  <span style={{flexShrink:0,fontWeight:700}}>{h.level==="critical"?"🛑":h.level==="warn"?"⚠":"ℹ"}</span>
                  <span>{h.msg}</span>
                </div>
              ))}
            </div>
          ):(
            <div style={{fontSize:13,color:cfg.color,marginBottom:r.nicheRule.safe?0:14}}>Nenhuma frase de risco detectada no texto analisado.</div>
          )}
          {!r.nicheRule.safe&&(
            <div style={{paddingTop:14,borderTop:"1px solid "+cfg.border,fontSize:13,color:cfg.color}}>
              <strong>Nicho "{niche}" exige cuidado extra:</strong>
              <div style={{marginTop:6,display:"flex",flexDirection:"column",gap:4}}>
                {r.nicheRule.reasons.map((reason,i)=><div key={i}>▸ {reason}</div>)}
              </div>
            </div>
          )}
          <button className="btn-sm" onClick={()=>copy("Compliance Score: "+r.score+"/100 ("+cfg.label+")\n"+r.hits.map(h=>"- "+h.msg).join("\n"),"Relatorio")} style={{marginTop:14}}>Copiar Relatorio</button>
        </div>
      )}
    </div>
  );
}
 
// ─── CAMPANHA (hub de lancamento + deploy real via Vercel Function) ──
function Campaign(){
  const {activeOps,products,showToast}=useContext(Ctx);
  const [selId,setSelId]=useState("");
  const [finalUrl,setFinalUrl]=useState("");
  const [budget,setBudget]=useState("50");
  const [deployLogs,setDeployLogs]=useState([]);
  const [deploying,setDeploying]=useState(false);
  const [deployResult,setDeployResult]=useState(null);
  const [apiBase,setApiBase]=useState(()=>{try{return localStorage.getItem("uas_api_base")||""}catch{return""}});
  const product=products.find(p=>String(p.id)===String(selId));
  const active=activeOps.filter(o=>o.status==="active");
  const paused=activeOps.filter(o=>o.status==="paused");
 
  const saveApiBase=v=>{setApiBase(v);try{localStorage.setItem("uas_api_base",v);}catch{}};
 
  const deploy=async()=>{
    if(!apiBase){showToast("Configure a URL do backend (Vercel) primeiro","err");return;}
    if(!product){showToast("Selecione um produto","err");return;}
    if(!finalUrl){showToast("Informe a URL final (Presell hospedada)","err");return;}
    setDeploying(true);setDeployLogs([]);setDeployResult(null);
    const payload={
      productName:product.name,
      finalUrl,
      keywords:{exact:["["+product.name.toLowerCase()+"]"],phrase:["\""+product.name.toLowerCase()+" review\""],negative:["free","gratis","download","torrent"]},
      ads:{headlines:[product.name+" Official Site",("See Why People Switched").slice(0,30),"Natural Approach That Works"],descriptions:["Discover the natural approach thousands trust.","Limited stock — check availability today."]},
      budget:parseFloat(budget)||50,
      countries:["US"],
    };
    try{
      const r=await fetch(apiBase.replace(/\/$/,"")+"/api/deploy-campaign",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const d=await r.json();
      setDeployLogs(d.logs||d.deployLogs||[]);
      if(!r.ok)throw new Error(d.error||"Erro no deploy");
      setDeployResult(d);
      showToast("Campanha criada (PAUSADA para revisao)!");
    }catch(e){
      showToast("Erro: "+e.message,"err");
    }finally{
      setDeploying(false);
    }
  };
 
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SH title="Campanha" sub="hub de lancamento" desc="Centralize o status das operacoes e dispare o deploy real no Google Ads"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}}>
        <StatChip label="Operacoes Ativas" value={active.length} color="var(--green)"/>
        <StatChip label="Pausadas" value={paused.length} color="var(--amber)"/>
        <StatChip label="Total no Portfolio" value={products.length} color="var(--accent)"/>
      </div>
      <div className="card fu2" style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="fd" style={{fontSize:13,fontWeight:700}}>Conexao com Backend (Vercel Function)</div>
        <div><span className="sec-label">URL Base da API</span><input value={apiBase} onChange={e=>saveApiBase(e.target.value)} placeholder="https://seu-projeto.vercel.app"/></div>
        <div className="box-info" style={{fontSize:11}}>Endpoint chamado: <code style={{background:"var(--surf2)",padding:"1px 5px",borderRadius:4}}>POST /api/deploy-campaign</code> — configure as credenciais do Google Ads nas Environment Variables da Vercel.</div>
      </div>
      <div className="camp-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div className="card fu3" style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="fd" style={{fontSize:13,fontWeight:700}}>Deploy de Campanha</div>
          <div><span className="sec-label">Produto</span><select value={selId} onChange={e=>setSelId(e.target.value)}><option value="">-- Selecione --</option>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div><span className="sec-label">URL Final (Presell hospedada)</span><input value={finalUrl} onChange={e=>setFinalUrl(e.target.value)} placeholder="https://sua-presell.vercel.app/produto"/></div>
          <div><span className="sec-label">Orcamento Diario USD</span><input type="number" value={budget} onChange={e=>setBudget(e.target.value)}/></div>
          <button className="btn btn-accent" onClick={deploy} disabled={deploying} style={{justifyContent:"center"}}>{deploying?<><Spin/> Implantando...</>:"Implantar Campanha (PAUSADA)"}</button>
          <div className="box-warn" style={{fontSize:11}}>A campanha e o anuncio sobem sempre com status PAUSADO. Revise no Google Ads e ative manualmente.</div>
        </div>
        <div className="fu4" style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="sec-label">Log de Deploy</div>
          <div className="card" style={{minHeight:200,maxHeight:340,overflowY:"auto",display:"flex",flexDirection:"column",gap:8}}>
            {deployLogs.length===0?(
              <span style={{fontSize:12,color:"var(--text3)"}}>Os passos do deploy aparecerao aqui em tempo real.</span>
            ):deployLogs.map((l,i)=>(
              <div key={i} style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--text2)",display:"flex",gap:8}}>
                <span style={{color:"var(--accent)",fontWeight:700,flexShrink:0}}>{l.step}</span>
                <span>{l.msg}</span>
              </div>
            ))}
          </div>
          {deployResult&&deployResult.reviewUrl&&(
            <a href={deployResult.reviewUrl} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{justifyContent:"center",textDecoration:"none"}}>Abrir no Google Ads →</a>
          )}
        </div>
      </div>
    </div>
  );
}
 
// ─── EXPORTAR (relatorios Analytics + Operacoes em JSON/CSV) ──
function ExportPage(){
  const {products,activeOps,showToast}=useContext(Ctx);
  const toCSV=(rows,headers)=>{
    const esc=v=>{const s=String(v??"");return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
    return headers.join(",")+"\n"+rows.map(r=>headers.map(h=>esc(r[h])).join(",")).join("\n");
  };
  const downloadBlob=(content,filename,type)=>{
    const b=new Blob([content],{type});
    const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=filename;a.click();URL.revokeObjectURL(u);
  };
  const exportAnalyticsCSV=()=>{
    const csv=toCSV(CD,["day","spend","revenue","clicks","conv"]);
    downloadBlob(csv,"usadsuite-analytics.csv","text/csv");
    showToast("Analytics exportado em CSV!");
  };
  const exportOpsCSV=()=>{
    const rows=activeOps.map(op=>({produto:op.product_name,plataforma:op.platform,status:op.status,comissao:op.commission,cpc_max:op.cpc_max,score:op.details&&op.details.score,criado_em:op.created_at}));
    const csv=toCSV(rows,["produto","plataforma","status","comissao","cpc_max","score","criado_em"]);
    downloadBlob(csv,"usadsuite-operacoes.csv","text/csv");
    showToast("Operacoes exportadas em CSV!");
  };
  const exportOpsJSON=()=>{
    const data=activeOps.map(op=>({id:op.id,type:"active_operation",status:op.status,created_at:op.created_at,details:{...op,id:undefined}}));
    downloadBlob(JSON.stringify(data,null,2),"usadsuite-operacoes.json","application/json");
    showToast("Operacoes exportadas em JSON (Supabase-ready)!");
  };
  const exportProductsJSON=()=>{
    downloadBlob(JSON.stringify(products,null,2),"usadsuite-produtos.json","application/json");
    showToast("Produtos exportados em JSON!");
  };
  const cards=[
    {title:"Analytics (7 dias)",desc:"Gasto, receita, cliques e conversoes diarias",actions:[["CSV",exportAnalyticsCSV]]},
    {title:"Operacoes Ativas",desc:"Status, CPC maximo, score e comissao de cada operacao",actions:[["CSV",exportOpsCSV],["JSON",exportOpsJSON]]},
    {title:"Portfolio de Produtos",desc:"Todos os produtos cadastrados com seus dados completos",actions:[["JSON",exportProductsJSON]]},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SH title="Exportar" sub="relatorios" desc="Baixe seus dados de performance e operacoes em JSON ou CSV"/>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {cards.map(c=>(
          <div key={c.title} className="card" style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <div>
              <div className="fd" style={{fontSize:14,fontWeight:700,marginBottom:4}}>{c.title}</div>
              <div style={{fontSize:12,color:"var(--text2)"}}>{c.desc}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              {c.actions.map(([label,fn])=>(
                <button key={label} className="btn btn-ghost" onClick={fn} style={{fontSize:12,padding:"8px 16px"}}>Exportar {label}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="box-info">
        <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.7}}>
          <strong style={{color:"var(--accent)"}}>Dica:</strong> arquivos JSON de Operacoes Ativas seguem o schema <code style={{background:"var(--surf2)",padding:"1px 5px",borderRadius:4}}>business_items</code> e podem ser inseridos diretamente no Supabase.
        </div>
      </div>
    </div>
  );
}
 
function ActiveOps(){
  const {activeOps,removeActiveOp,updateOpStatus,showToast}=useContext(Ctx);
  const active=activeOps.filter(o=>o.status==="active");
  const exportJSON=()=>{
    const data=activeOps.map(op=>({id:op.id,type:"active_operation",status:op.status,created_at:op.created_at,details:{...op,id:undefined}}));
    const b=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="usadsuite-ops.json";a.click();URL.revokeObjectURL(u);
    showToast("Exportado — JSONB Supabase-ready!");
  };
  const sCfg={active:{label:"Ativa",bg:"#ecfdf5",bc:"#a7f3d0",color:"#065f46"},paused:{label:"Pausada",bg:"#fffbeb",bc:"#fcd34d",color:"#92400e"},ended:{label:"Encerrada",bg:"#fef2f2",bc:"#fecaca",color:"#991b1b"}};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
        <SH title="Operacoes Ativas" sub="Supabase-ready" desc="Produtos viaveis em operacao"/>
        <button className="btn btn-ghost" onClick={exportJSON} style={{fontSize:12}}>Exportar JSON</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}}>
        <StatChip label="Total" value={activeOps.length} color="var(--accent)"/>
        <StatChip label="Ativas" value={active.length} color="var(--green)"/>
      </div>
      {activeOps.length===0?(
        <div className="card" style={{textAlign:"center",padding:60}}>
          <div style={{fontSize:40,marginBottom:16}}>🎯</div>
          <div className="fd" style={{fontSize:18,fontWeight:700,marginBottom:8}}>Nenhuma operacao ainda</div>
          <div style={{fontSize:13,color:"var(--text2)"}}>Va ao Scout, aplique o Filtro de Viabilidade e clique em Iniciar Operacao.</div>
        </div>
      ):(
        activeOps.map(op=>{
          const cfg=sCfg[op.status]||sCfg.active;
          const blColor=op.status==="active"?"var(--green)":op.status==="paused"?"var(--amber)":"var(--red)";
          return(
            <div key={op.id} style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:14,padding:20,borderLeft:"4px solid "+blColor}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:14,flexWrap:"wrap"}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                    <div className="fd" style={{fontWeight:800,fontSize:16}}>{op.product_name}</div>
                    <span style={{fontSize:10,padding:"3px 8px",borderRadius:10,background:cfg.bg,color:cfg.color,border:"1px solid "+cfg.bc,fontFamily:"'DM Mono',monospace"}}>{cfg.label}</span>
                  </div>
                  <div style={{fontSize:12,color:"var(--text2)"}}>{new Date(op.created_at).toLocaleDateString("pt-BR")} · {op.details&&op.details.niche}</div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {op.status==="active"&&<button onClick={()=>updateOpStatus(op.id,"paused")} style={{background:"#fffbeb",color:"#92400e",border:"1px solid #fcd34d",borderRadius:7,padding:"6px 12px",fontSize:11,cursor:"pointer"}}>Pausar</button>}
                  {op.status==="paused"&&<button onClick={()=>updateOpStatus(op.id,"active")} style={{background:"#ecfdf5",color:"#065f46",border:"1px solid #a7f3d0",borderRadius:7,padding:"6px 12px",fontSize:11,cursor:"pointer"}}>Reativar</button>}
                  <button onClick={()=>updateOpStatus(op.id,"ended")} style={{background:"#fef2f2",color:"#991b1b",border:"1px solid #fecaca",borderRadius:7,padding:"6px 12px",fontSize:11,cursor:"pointer"}}>Encerrar</button>
                  <button onClick={()=>{removeActiveOp(op.id);showToast(op.product_name+" removido");}} style={{background:"none",border:"1px solid var(--border)",borderRadius:7,padding:"6px 10px",cursor:"pointer",color:"var(--text3)",display:"flex"}}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:13,height:13}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                  </button>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8}}>
                {[{l:"Comissao",v:"$"+op.commission,c:"var(--accent)"},{l:"CPC Max",v:op.cpc_max?"$"+op.cpc_max.toFixed(4):"—",c:op.cpc_max>=1?"var(--green)":op.cpc_max>=0.5?"var(--amber)":"var(--red)"},{l:"Score",v:(op.details&&op.details.score)||"—",c:"var(--purple)"},{l:"Lucro/100",v:op.details&&op.details.prf100>0?"$"+op.details.prf100.toFixed(2):"—",c:"var(--green)"}].map(x=>(
                  <div key={x.l} style={{background:"var(--surf2)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 12px"}}>
                    <div style={{fontSize:9,color:"var(--text3)",fontFamily:"'DM Mono',monospace",marginBottom:4}}>{x.l}</div>
                    <div style={{fontSize:13,fontWeight:700,color:x.c,fontFamily:"'DM Mono',monospace"}}>{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
      <div className="box-info">
        <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.7}}>
          <strong style={{color:"var(--accent)"}}>Supabase:</strong> Exporte para obter o payload pronto para <code style={{background:"var(--surf2)",padding:"1px 5px",borderRadius:4}}>supabase.from("business_items").insert()</code>
        </div>
      </div>
    </div>
  );
}
 
function Analytics(){
  const {products,tip}=useContext(Ctx);
  const ts=CD.reduce((a,b)=>a+b.spend,0),tr=CD.reduce((a,b)=>a+b.revenue,0),tc=CD.reduce((a,b)=>a+b.conv,0),tCl=CD.reduce((a,b)=>a+b.clicks,0);
  const roi=((tr-ts)/ts*100).toFixed(1);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <SH title="Analytics" sub="ultimos 7 dias" desc="Performance — gasto, receita e conversoes"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}} className="fu2">
        {[{l:"Gasto Total",v:"$"+ts,c:"var(--red)"},{l:"Receita Total",v:"$"+tr,c:"var(--green)"},{l:"ROI",v:roi+"%",c:"var(--accent)"},{l:"Conversoes",v:tc,c:"var(--blue)"},{l:"Cliques",v:tCl.toLocaleString(),c:"var(--text)"},{l:"CPC Medio",v:"$"+(ts/tCl).toFixed(3),c:"var(--amber)"}].map(k=>(
          <StatChip key={k.l} label={k.l} value={k.v} color={k.c}/>
        ))}
      </div>
      <div className="card fu3">
        <div className="fd" style={{fontSize:13,fontWeight:700,marginBottom:20}}>Receita vs Gasto</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={CD}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--green)" stopOpacity={0.2}/><stop offset="100%" stopColor="var(--green)" stopOpacity={0}/></linearGradient>
              <linearGradient id="gSp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--red)" stopOpacity={0.15}/><stop offset="100%" stopColor="var(--red)" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
            <XAxis dataKey="day" tick={{fontSize:10,fill:"var(--text3)"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:10,fill:"var(--text3)"}} axisLine={false} tickLine={false} tickFormatter={v=>"$"+v}/>
            <Tooltip content={tip}/>
            <Area type="monotone" dataKey="revenue" name="Receita" stroke="var(--green)" strokeWidth={2} fill="url(#gRev)"/>
            <Area type="monotone" dataKey="spend" name="Gasto" stroke="var(--red)" strokeWidth={2} fill="url(#gSp)" strokeDasharray="5 3"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}} className="fu4">
        {[{title:"Cliques Diarios",key:"clicks",color:"var(--accent)"},{title:"Conversoes",key:"conv",color:"var(--green)"}].map(ch=>(
          <div key={ch.key} className="card">
            <div className="fd" style={{fontSize:13,fontWeight:700,marginBottom:16}}>{ch.title}</div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={CD}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                <XAxis dataKey="day" tick={{fontSize:9,fill:"var(--text3)"}} axisLine={false} tickLine={false}/>
                <Tooltip content={tip}/>
                <Bar dataKey={ch.key} name={ch.title} fill={ch.color} radius={[4,4,0,0]} opacity={.85}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
 
function Plans(){
  const {plan,setPlan,billing,setBilling,showToast}=useContext(Ctx);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <SH title="Planos" sub="& cobranca" desc="Escolha o plano ideal"/>
      <div className="fu2" style={{display:"flex",gap:8}}>
        {["monthly","annual"].map(b=>(
          <button key={b} className={"btn "+(billing===b?"btn-accent":"btn-ghost")} onClick={()=>setBilling(b)}>{b==="monthly"?"Mensal":"Anual (−20%)"}</button>
        ))}
      </div>
      <div className="plan-grid fu3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        {PLANS.map(p=>{
          const price=billing==="annual"?Math.round(p.price*.8):p.price;
          const isCur=plan===p.id;
          return(
            <div key={p.id} className={"plan-card"+(isCur?" sel":"")} onClick={()=>{if(!isCur){setPlan(p.id);showToast("Plano "+p.name+" ativado");}}}>
              {p.popular&&!isCur&&<div style={{display:"inline-flex",padding:"3px 8px",borderRadius:4,marginBottom:12,background:"#dbeafe",color:"var(--blue)",fontSize:10,fontFamily:"'DM Mono',monospace",border:"1px solid #bfdbfe"}}>Popular</div>}
              {isCur&&<div style={{display:"inline-flex",padding:"3px 8px",borderRadius:4,marginBottom:12,background:"var(--al)",color:"var(--accent)",fontSize:10,fontFamily:"'DM Mono',monospace"}}>Plano Atual</div>}
              <div className="fd" style={{fontSize:18,fontWeight:800,marginBottom:6}}>{p.name}</div>
              <div style={{marginBottom:20}}><span className="fd" style={{fontSize:32,fontWeight:800,color:isCur?"var(--accent)":"var(--text)"}}>{p.price===0?"Gratis":"$"+price}</span>{p.price>0&&<span className="fm" style={{fontSize:12,color:"var(--text3)"}}>/mes</span>}</div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                {p.features.map(feat=><div key={feat} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"var(--text2)"}}><svg viewBox="0 0 24 24" fill="none" stroke={isCur?"var(--accent)":"var(--text3)"} strokeWidth="2" style={{width:12,height:12,flexShrink:0}}><polyline points="20 6 9 17 4 12"/></svg>{feat}</div>)}
              </div>
              <button className={"btn "+(isCur?"btn-ghost":"btn-accent")} style={{width:"100%",justifyContent:"center"}} onClick={e=>{e.stopPropagation();if(!isCur){setPlan(p.id);showToast("Plano "+p.name+" ativado");}}}>{isCur?"Plano Atual":p.price===0?"Comecar Gratis":"Fazer Upgrade"}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
 
// ─── PERFIS DE RISCO ──────────────────────────────────────────
// Ordenados do mais cauteloso ao mais agressivo
const RISK_PROFILES=[
  {id:"exploratorio",label:"Exploratorio",color:"#6b7280",bg:"#f3f4f6",border:"#d1d5db",
    tip:"Cenario inicial para testar novos produtos com baixo risco.",
    values:{roi:80,budget:20,conv:1,ctr:2}},
  {id:"conservador",label:"Conservador",color:"#059669",bg:"#ecfdf5",border:"#a7f3d0",
    tip:"Foco total em margem de lucro e seguranca.",
    values:{roi:150,budget:30,conv:2,ctr:3}},
  {id:"equilibrado",label:"Equilibrado",color:"#2563eb",bg:"#eff6ff",border:"#bfdbfe",
    tip:"Otimizado para rodar a conta com consistencia.",
    values:{roi:100,budget:50,conv:3,ctr:5}},
  {id:"agressivo",label:"Agressivo",color:"#d97706",bg:"#fffbeb",border:"#fcd34d",
    tip:"Velocidade maxima para capturar mercado e testar escalas.",
    values:{roi:50,budget:100,conv:4,ctr:7}},
  {id:"sniper",label:"Sniper",color:"#7c3aed",bg:"#f5f3ff",border:"#ddd6fe",
    tip:"Uso exclusivo para presells com conversao ja validada (6%).",
    values:{roi:50,budget:100,conv:6,ctr:8}},
];
 
function RiskProfileSelector({current,onApply,compareKeys}){
  const keys=compareKeys||["roi","budget","conv","ctr"];
  // Detecta se os valores atuais correspondem a algum perfil (para destacar)
  const activeId=RISK_PROFILES.find(p=>keys.every(k=>p.values[k]===current[k]))?.id;
  const [hoverId,setHoverId]=useState(null);
  const hoverProfile=RISK_PROFILES.find(p=>p.id===hoverId);
  return(
    <div style={{marginBottom:14}}>
      <span className="sec-label" style={{marginBottom:8,display:"block"}}>Perfil de Risco</span>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6}}>
        {RISK_PROFILES.map(p=>(
          <button
            key={p.id}
            onClick={()=>onApply(p.values)}
            onMouseEnter={()=>setHoverId(p.id)}
            onMouseLeave={()=>setHoverId(null)}
            style={{
              width:"100%",padding:"9px 4px",borderRadius:8,cursor:"pointer",
              border:"1.5px solid "+(activeId===p.id?p.color:p.border),
              background:activeId===p.id?p.color:p.bg,
              color:activeId===p.id?"#fff":p.color,
              fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:10.5,
              lineHeight:1.3,transition:"all .15s",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      {hoverProfile&&(
        <div style={{marginTop:8,fontSize:11,color:hoverProfile.color,background:hoverProfile.bg,border:"1px solid "+hoverProfile.border,borderRadius:7,padding:"7px 10px"}}>
          {hoverProfile.tip}
        </div>
      )}
    </div>
  );
}
 
function Settings(){
  const {user,logout,theme,setTheme,plan,globalParams,saveGlobalParams}=useContext(Ctx);
  const [notif,setNotif]=useState({email:true,overdelivery:true,conv:false});
  const [lp,setLp]=useState(globalParams);
  const curPlan=PLANS.find(p=>p.id===plan);
  const Toggle=({on,onChange})=>(
    <button onClick={onChange} style={{width:40,height:22,borderRadius:11,border:"none",cursor:"pointer",transition:"background .2s",position:"relative",background:on?"var(--accent)":"var(--border2)"}}>
      <span style={{position:"absolute",top:3,left:on?20:3,width:16,height:16,borderRadius:"50%",background:on?"#fff":"var(--text3)",transition:"left .2s"}}/>
    </button>
  );
  return(
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <SH title="Configuracoes" sub="preferencias"/>
      <div className="card fu2">
        <span className="sec-label">Conta</span>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
          <div style={{width:48,height:48,borderRadius:12,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"#fff",flexShrink:0}}>{user&&user.avatar}</div>
          <div>
            <div className="fd" style={{fontWeight:700,fontSize:15}}>{user&&user.name}</div>
            <div style={{fontSize:12,color:"var(--text2)"}}>{user&&user.email}</div>
            <div style={{fontSize:10,color:"var(--accent)",marginTop:4,fontFamily:"'DM Mono',monospace"}}>{curPlan&&curPlan.name} Plan</div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={logout} style={{color:"var(--red)",borderColor:"#fecaca"}}>Sair da Conta</button>
      </div>
      <div className="card fu2" style={{borderColor:"var(--accent)",borderWidth:1.5}}>
        <div className="fd" style={{fontSize:13,fontWeight:700,marginBottom:14}}>Parametros de Viabilidade</div>
        <RiskProfileSelector current={lp} onApply={v=>setLp(p=>({...p,...v}))}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {[{l:"CTR %",k:"ctr",tip:"Taxa de clique do anuncio"},{l:"Conversao %",k:"conv",tip:"Taxa presell para venda"},{l:"ROI Alvo %",k:"roi",tip:"Retorno minimo desejado"},{l:"Orcamento Diario $",k:"budget",tip:"Gasto diario em ads"}].map(f=>(
            <div key={f.k}>
              <div style={{fontSize:10,color:"var(--text3)",fontFamily:"'DM Mono',monospace",marginBottom:5,display:"flex",alignItems:"center",gap:4}}><Tip text={f.tip}>{f.l}</Tip></div>
              <input type="number" value={lp[f.k]||""} onChange={e=>setLp(p=>({...p,[f.k]:parseFloat(e.target.value)||0}))} style={{background:"var(--surf2)",border:"1.5px solid var(--border2)",borderRadius:8,padding:"9px 12px",fontSize:13,color:"var(--text)",width:"100%",outline:"none"}}/>
            </div>
          ))}
        </div>
        <button onClick={()=>saveGlobalParams(lp)} className="btn btn-accent" style={{width:"100%",justifyContent:"center"}}>Salvar Parametros</button>
      </div>
      <div className="card fu3">
        <span className="sec-label">Aparencia</span>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0"}}>
          <div><div style={{fontSize:13,fontWeight:500}}>Tema</div><div style={{fontSize:11,color:"var(--text3)"}}>Azul marinho ou escuro</div></div>
          <button className="btn btn-ghost" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}>{theme==="dark"?"Claro":"Escuro"}</button>
        </div>
      </div>
      <div className="card fu4">
        <span className="sec-label">Notificacoes</span>
        {[{k:"email",l:"Relatorios por email",s:"Resumo semanal"},{k:"overdelivery",l:"Alertas Overdelivery",s:"Gasto atingiu limite"},{k:"conv",l:"Marcos de conversao",s:"Metas diarias atingidas"}].map((n,i)=>(
          <div key={n.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:i<2?"1px solid var(--border)":"none"}}>
            <div><div style={{fontSize:13,fontWeight:500}}>{n.l}</div><div style={{fontSize:11,color:"var(--text3)"}}>{n.s}</div></div>
            <Toggle on={notif[n.k]} onChange={()=>setNotif(p=>({...p,[n.k]:!p[n.k]}))}/>
          </div>
        ))}
      </div>
    </div>
  );
}
 
// ─── PAGE MAP ────────────────────────────────────────────────
const PM={dashboard:Dashboard,products:Products,scout:Scout,keywords:Keywords,simulator:Simulator,reverso:Reverso,presell:Presell,compliance:Compliance,campaign:Campaign,ops:ActiveOps,analytics:Analytics,export:ExportPage,plans:Plans,settings:Settings};
 
// ─── APP SHELL ───────────────────────────────────────────────
function AppShell(){
  const {theme}=useContext(Ctx);
  const [active,setActive]=useState("dashboard");
  const [sideOpen,setSideOpen]=useState(false);
  const View=PM[active];
  const go=id=>{setActive(id);setSideOpen(false);};
  return(
    <div className="app">
      {sideOpen&&<div className="overlay show" onClick={()=>setSideOpen(false)}/>}
      <aside className={"sidebar"+(sideOpen?" open":"")}>
        <div className="nav-logo">
          <div className="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" style={{width:18,height:18}}><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
          </div>
          <div>
            <div className="fd" style={{fontSize:14,fontWeight:800,color:"#fff"}}>UsAdSuite</div>
            <div className="fm" style={{fontSize:9,color:"rgba(100,140,190,.5)"}}>BoF Intelligence</div>
          </div>
        </div>
        <div className="nav-wrap">
          {Object.entries(GRP).map(([gid,glabel])=>(
            <div key={gid} style={{marginBottom:4}}>
              <span className="nav-grp">{glabel}</span>
              {NAV.filter(n=>n.g===gid).map(item=>(
                <button key={item.id} className={"nav-btn"+(active===item.id?" active":"")} onClick={()=>go(item.id)}>
                  {item.icon}{item.l}
                  {item.badge&&<span style={{marginLeft:"auto",fontSize:9,color:"#fff",background:item.badgeColor,borderRadius:3,padding:"1px 6px",fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{item.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="nav-foot">
          <div style={{background:"rgba(37,99,235,.15)",border:"1px solid rgba(37,99,235,.2)",borderRadius:8,padding:"9px 11px"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span className="pulse" style={{width:5,height:5,borderRadius:"50%",background:"#60a5fa",display:"block"}}/><span className="fm" style={{fontSize:9,color:"#60a5fa",fontWeight:500}}>LIVE · v1.2</span></div>
            <div className="fm" style={{fontSize:9,color:"rgba(100,140,190,.5)"}}>U.N.E. Ecosystem</div>
          </div>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <button className="mob-btn" onClick={()=>setSideOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:20,height:20}}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span className="fm" style={{fontSize:11,color:"var(--text3)"}}>UsAdSuite</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2" style={{width:11,height:11}}><polyline points="9 18 15 12 9 6"/></svg>
            <span className="fd" style={{fontSize:12,fontWeight:700,color:"var(--text)"}}>{TITLES[active]}</span>
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:6,background:"var(--surf2)",border:"1px solid var(--border)",borderRadius:7,padding:"5px 10px"}}>
              <span className="pulse" style={{width:5,height:5,borderRadius:"50%",background:"var(--accent)",display:"block"}}/>
              <span className="fm" style={{fontSize:10,color:"var(--text2)"}}>BoF Active</span>
            </div>
          </div>
        </header>
        <div className="content"><View key={active}/></div>
      </div>
    </div>
  );
}
 
// ─── ROOT ────────────────────────────────────────────────────
function AppRouter(){
  const {user}=useContext(Ctx);
  return user?<AppShell/>:<Auth/>;
}
export default function App(){
  return <Provider><AppRouter/></Provider>;
}