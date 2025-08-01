// Arquivo: src/supabaseClient.js
// IMPORTANTE: Certifique-se de que este arquivo SÓ contenha este código.
// Acesso às variáveis de ambiente no Vite deve ser feito através de `import.meta.env`.

import { createClient } from "@supabase/supabase-js";

// Acessa as variáveis de ambiente com o prefixo VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as variáveis de ambiente estão presentes
if (!supabaseUrl || !supabaseAnonKey) {
  // Lança um erro para que a aplicação não inicie sem as chaves
  throw new Error("As variáveis de ambiente do Supabase não estão definidas. Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão configuradas.");
}

// Cria a instância do cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
  No Vercel, as variáveis de ambiente devem ser configuradas sem o prefixo VITE_.
  O Vite irá injetá-las no build com o prefixo automaticamente.
  
  Exemplo de configuração no painel do Vercel:
  SUPABASE_URL = <sua-url-do-supabase>
  SUPABASE_ANON_KEY = <sua-anon-key>
*/