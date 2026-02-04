# 🚀 Guia Rápido de Instalação

## Pré-requisitos

- Node.js 18+ instalado
- Python 3.8+ instalado
- npm ou yarn

## Instalação Rápida

### 1️⃣ Frontend

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

### 2️⃣ Backend (Flask)

Em outro terminal:

```bash
# Navegar para pasta do backend (onde está app.py)
cd caminho/para/backend

# Instalar Flask
pip install flask flask-cors

# Executar servidor
python app.py
```

Acesse: http://localhost:5001

## 🎯 Primeiro Acesso

1. Abra http://localhost:3000
2. Faça login com qualquer email/senha
3. Crie seu primeiro projeto
4. Acesse o chat e comece a orçar!

## 🔑 Login de Teste

- **Email**: qualquer@email.com
- **Senha**: qualquer senha

## 📋 Fluxo de Uso

1. **Login** → Entre no sistema
2. **Home** → Veja seus projetos ou crie um novo
3. **Chat** → Configure o móvel desejado
4. **Confirmar** → Finalize o orçamento

## ⚙️ Configuração do Backend

Certifique-se que seu `app.py` tem CORS habilitado:

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Importante para comunicação com frontend
```

## 🐛 Problemas Comuns

### Erro de CORS
**Solução**: Instale flask-cors
```bash
pip install flask-cors
```

### Porta 3000 em uso
**Solução**: Altere a porta no vite.config.ts

### Porta 5001 em uso
**Solução**: Altere a porta no app.py e no vite.config.ts (proxy)

## 📞 Suporte

Caso encontre problemas, verifique:
- ✅ Node.js e Python instalados
- ✅ Dependências instaladas (npm install)
- ✅ Backend rodando na porta 5001
- ✅ Frontend rodando na porta 3000
- ✅ CORS habilitado no Flask

---

**Pronto! Seu sistema está rodando** 🎉
