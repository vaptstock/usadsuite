import { supabase } from './supabaseClient';

async function testarConexao() {
  console.log("Iniciando teste de conexão...");
  const { data, error } = await supabase.from('active_ops').select('*');
  
  if (error) {
    console.error("Erro ao conectar:", error);
  } else {
    console.log("Sucesso! Dados encontrados:", data);
  }
}

testarConexao();