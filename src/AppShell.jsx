import React from 'react';
// Importe os componentes de gráfico aqui (AreaChart, etc.)
// Se precisar dos dados 'CD', você pode passar via props ou usar o Contexto

export default function AppShell() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard UsAdSuite</h1>
      {/* Aqui você colocará o seu componente de gráfico */}
      <p>Área de visualização dos dados de spend, revenue e clicks.</p>
    </div>
  );
}