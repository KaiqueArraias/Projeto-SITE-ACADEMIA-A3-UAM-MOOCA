require('dotenv').config(); // Configurações do ambiente

const express = require('express');
const cors = require('cors');

const clientesRoutes = require('./routes/clienteRoutes'); // Caminho correto para as rotas de clientes
const planosRoutes = require('./routes/planos');          // Caminho correto para as rotas de planos
const assinaturaRoutes = require('./routes/assinatura');  // Caminho correto para as rotas de assinaturas
const db = require('./models/db');                       // Conexão com o banco de dados

const app = express();
const port = process.env.PORT || 3000; // Usar porta do ambiente ou 3000 como padrão

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/clientes', clientesRoutes);       // Define a rota base para clientes
app.use('/api/planos', planosRoutes);           // Define a rota base para planos
app.use('/api/assinaturas', assinaturaRoutes);  // Define a rota base para assinaturas

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

// Rota base para testar a API
app.get('/api', (req, res) => {
    res.status(200).json({
        message: "Bem-vindo à API da Academia!",
        endpoints: {
            clientes: "/api/clientes",
            planos: "/api/planos",
            assinaturas: "/api/assinaturas"
        }
    });
});