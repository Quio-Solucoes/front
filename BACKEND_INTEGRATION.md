# 🔧 Guia de Integração Backend

## Modificações Necessárias no app.py

Para garantir que o backend Flask funcione perfeitamente com o novo frontend, adicione o seguinte no início do seu `app.py`:

```python
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS  # IMPORTANTE: Adicionar esta linha
import unicodedata

# ... (suas importações existentes)

app = Flask(__name__, template_folder="templates", static_folder="static")

# ✅ ADICIONAR ESTAS LINHAS PARA HABILITAR CORS
CORS(app, resources={
    r"/chat": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# ... (resto do código)
```

## Instalação da Dependência CORS

```bash
pip install flask-cors
```

## Estrutura de Resposta Esperada

O frontend espera respostas no seguinte formato:

### 1. Resposta Simples (sem opções)
```python
return jsonify({
    "response": "Mensagem do bot aqui"
})
```

### 2. Resposta com Opções (botões)
```python
return jsonify({
    "response": "Escolha uma opção:",
    "options": [
        {"id": "1", "label": "📏 Dimensão"},
        {"id": "2", "label": "🎨 Cor"},
        {"id": "3", "label": "🪵 Material"}
    ]
})
```

## Exemplo de Helper Function

Adicione esta função ao seu `app.py` se ainda não tiver:

```python
def resposta_com_opcoes(mensagem, opcoes):
    """
    Helper para criar respostas com opções de botões
    
    Args:
        mensagem: Texto da mensagem
        opcoes: Lista de dicts com 'id' e 'label'
    
    Returns:
        Dict com formato esperado pelo frontend
    """
    return {
        "response": mensagem,
        "options": opcoes
    }
```

## Testando a Integração

### 1. Teste Básico via cURL

```bash
curl -X POST http://localhost:5001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Guarda-roupa", "session_id": "test-123"}'
```

### 2. Resposta Esperada

```json
{
  "response": "📏 Digite as dimensões no formato:\n\nL x A x P",
  "options": [
    {"id": "1", "label": "📏 Dimensão"},
    {"id": "2", "label": "🎨 Cor"}
  ]
}
```

## Verificação de Funcionamento

Checklist para garantir que está tudo correto:

- [ ] Flask instalado (`pip install flask`)
- [ ] Flask-CORS instalado (`pip install flask-cors`)
- [ ] CORS configurado no app.py
- [ ] Servidor rodando na porta 5001
- [ ] Endpoint `/chat` aceitando POST
- [ ] Resposta no formato JSON correto

## Debugging

### Ver logs do Flask

```python
if __name__ == "__main__":
    app.run(debug=True, port=5001)
```

### Adicionar logs nas rotas

```python
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    print(f"📥 Recebido: {data}")  # Log de entrada
    
    # ... seu código ...
    
    response = jsonify({"response": "..."})
    print(f"📤 Enviando: {response.get_json()}")  # Log de saída
    return response
```

## Exemplo Completo de Rota

```python
@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    # Tratar preflight CORS
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST")
        return response
    
    # Processar requisição normal
    data = request.get_json()
    message = str(data.get("message", "")).strip()
    session_id = data.get("session_id", "default")
    
    # Seu código de lógica aqui...
    
    return jsonify({
        "response": "Sua mensagem aqui",
        "options": [
            {"id": "1", "label": "Opção 1"},
            {"id": "2", "label": "Opção 2"}
        ]
    })
```

## Proxying (Opcional)

O Vite já está configurado para fazer proxy das requisições:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/chat': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
})
```

Isso significa que o frontend pode fazer requisições para `/chat` e o Vite automaticamente redireciona para `http://localhost:5001/chat`.

## Troubleshooting

### Erro: CORS Policy

**Problema**: `Access to fetch at 'http://localhost:5001/chat' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solução**: 
1. Verificar se `flask-cors` está instalado
2. Verificar se `CORS(app)` foi adicionado
3. Reiniciar o servidor Flask

### Erro: Connection Refused

**Problema**: `Failed to fetch` ou `ERR_CONNECTION_REFUSED`

**Solução**:
1. Verificar se o Flask está rodando
2. Verificar se está na porta correta (5001)
3. Testar com `curl http://localhost:5001/chat`

### Erro: 404 Not Found

**Problema**: Rota não encontrada

**Solução**:
1. Verificar se a rota `/chat` existe no Flask
2. Verificar se o método POST está permitido
3. Verificar logs do Flask

---

**Com essas configurações, seu backend estará 100% compatível com o novo frontend!** ✨
