// frontend/src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Carrega as variáveis de ambiente. Certifique-se de que estão definidas no seu .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as variáveis de ambiente estão carregadas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidas.');
}

// Cria e exporta o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase client inicializado com URL:', supabaseUrl);