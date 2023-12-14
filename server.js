import express from 'express';
import mysql from 'mysql';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json())

const host = 'localhost';
const port = '4040';

const db = mysql.createConnection({

  // URL LOCAL 
  host: "localhost",
  user: 'root',
  password: '',
  port: 3306,
  database: 'usuarios'
});

app.get('/', (re, res) => {
  return res.json("From backend side");
});

// SERVER USUARIOS
app.get('/usuarios', (req, res) => {
  const sql = "SELECT * FROM usuarios";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  })
});

app.get('/usuarios/:id', (req, res) => {
  const sql = "SELECT * FROM usuarios WHERE id = ?";
  const id = req.params.id;

  db.query(sql, [id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  })
});


app.post('/usuarios', (req, res) => {
  const sql = "INSERT INTO usuarios (`id`, `nome`, `cpf`, `rg`, `email`, `endereco`) VALUES (?)";
  const values = [
    req.body.id,
    req.body.nome,
    req.body.cpf,
    req.body.rg,
    req.body.email,
    req.body.endereco
  ]
  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  })

});

app.put('/usuarios/:id', (req, res) => {
  const sql = 'UPDATE usuarios SET `id`=?, `nome`=?, `cpf`=?, `rg`=?, `email`=?, `endereco`=? WHERE id=?';
  const id = req.params.id;
  db.query(sql, [req.body.id, req.body.nome, req.body.cpf, req.body.rg, req.body.email, req.body.endereco, id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  })
});

app.delete('/usuarios/:id', (req, res) => {
  const sql = 'DELETE FROM usuarios WHERE id = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  })
});

//  SERVER TABELA LIVRO 
app.get('/livros', async (req, res) => {
  const sql = `
        SELECT livros.*, GROUP_CONCAT(categorias.nome) AS categorias
        FROM livros
        LEFT JOIN livro_categoria ON livros.idlivros = livro_categoria.livro_id
        LEFT JOIN categorias ON livro_categoria.categoria_id = categorias.id
        GROUP BY livros.idlivros
    `;
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get('/livros/:idlivros', (req, res) => {
  const sql = "SELECT * FROM livros WHERE idlivros = ?";
  const id = req.params.idlivros;

  db.query(sql, [id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  })
});

app.post('/livros', (req, res) => {
  const sql = "INSERT INTO livros (`idlivros`, `titulo`, `autor`, `publicado`, `local`, `material`, `idioma`, `original`) VALUES (?)";
  const values = [
    req.body.idlivros,
    req.body.titulo,
    req.body.autor,
    req.body.publicado,
    req.body.local,
    req.body.material,
    req.body.idioma,
    req.body.original
  ]
  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });

});

app.put('/livros/:idlivros', (req, res) => {
  const sql = 'UPDATE livros SET `idlivros`=?, `titulo`=?, `autor`=?, `publicado`=?, `local`=?, `material`=?,`idioma`=?, `original`=? WHERE idlivros=?';
  const id = req.params.idlivros;
  db.query(sql, [req.body.idlivros, req.body.titulo, req.body.autor, req.body.publicado, req.body.local, req.body.material, req.body.idioma, req.body.original, id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  })
});

app.delete('/livros/:idlivros', (req, res) => {
  const sql = 'DELETE FROM livros WHERE idlivros = ?';
  const id = req.params.idlivros;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  })
});


// Rota para obter informações sobre a associação de categorias a um livro
app.get('/livros/:idlivros/associar-categoria', async (req, res) => {
  const idlivros = req.params.idlivros;

  try {
    // Obtenha as informações de associação de categorias para o livro com o ID fornecido
    const livroComCategorias = await obterLivroComCategorias(idlivros);

    // Retorna as informações
    return res.json(livroComCategorias);
  } catch (error) {
    console.error('Erro ao obter informações de associação de categoria ao livro:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ...

// Rota para associar categorias a livros
// Alterações no endpoint para associar categorias ao livro
app.post('/livros/:idlivros/associar-categoria', async (req, res) => {
  const idlivros = req.params.idlivros;
  const categorias = req.body.categorias;

  try {
    // Verifica se o livro existe
    const livroExistente = await obterLivroPorId(idlivros);
    if (!livroExistente) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }

    // Se o livro já possui categorias, mantém as existentes
    if (livroExistente.categorias) {
      const categoriasAtuais = livroExistente.categorias.split(',').map(Number);
      categorias.push(...categoriasAtuais);
    }

    // Remove todas as associações de categorias existentes para este livro
    await removerAssociacoesDeCategorias(idlivros);

    // Associa as novas categorias ao livro
    await associarCategoriasAoLivro(idlivros, categorias);

    // Retorna os dados atualizados do livro, incluindo as categorias associadas
    const livroAtualizado = await obterLivroComCategorias(idlivros);
    return res.json(livroAtualizado);
  } catch (error) {
    console.error('Erro ao associar categoria ao livro:', error);
    // Verifique se a resposta existe antes de acessar suas propriedades
    if (response && response.data) {
      // Faça algo com response.data
      console.log(response.data);
    } else {
      // Trate o caso em que a resposta não existe ou não tem uma propriedade 'data'
      console.error('A resposta está vazia ou não possui a propriedade "data".');
    }
  }
});

// Novo endpoint para adicionar uma nova categoria a um livro específico
app.post('/livros/:idlivros/adicionar-categoria', async (req, res) => {
  const idlivros = req.params.idlivros;
  const novaCategoria = req.body.novaCategoria;

  try {
    // Verifica se o livro existe
    const livroExistente = await obterLivroPorId(idlivros);
    if (!livroExistente) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }

    // Adiciona a nova categoria ao livro
    const novaCategoriaId = await adicionarNovaCategoria(novaCategoria);
    await associarCategoriasAoLivro(idlivros, [novaCategoriaId]);

    // Retorna os dados atualizados do livro, incluindo as categorias associadas
    const livroAtualizado = await obterLivroComCategorias(idlivros);
    return res.json(livroAtualizado);
  } catch (error) {
    console.error('Erro ao adicionar nova categoria ao livro:', error);
    console.log('Detalhes do erro:', error.response.data);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


// Função para adicionar uma nova categoria ao banco de dados
async function adicionarNovaCategoria(nome, descricao) {
  const sql = "INSERT INTO categorias (`nome`, `descricao`) VALUES (?)";
  return new Promise((resolve, reject) => {
    db.query(sql, [nome, descricao], (err, result) => {
      if (err) reject(err);
      else resolve(result.insertId); // Retorna o ID da nova categoria
    });
  });
}

async function obterLivroComCategorias(idlivros) {
  const sql = `
    SELECT livros.*, categorias.id AS categoria_id, categorias.nome AS categoria_nome
    FROM livros
    LEFT JOIN livro_categoria ON livros.idlivros = livro_categoria.livro_id
    LEFT JOIN categorias ON livro_categoria.categoria_id = categorias.id
    WHERE livros.idlivros = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [idlivros], (err, result) => {
      if (err) reject(err);
      else resolve(result); // Retorna um array de objetos de categoria
    });
  });
}

// SERVER PARA CATEGORIAS
app.get('/categorias', (req, res) => {
  const sql = "SELECT * FROM categorias";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get('/categorias/:id', (req, res) => {
  const sql = "SELECT * FROM categorias WHERE id = ?";
  const id = req.params.id;

  db.query(sql, [id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.post('/categorias', (req, res) => {
  const sql = "INSERT INTO categorias (`id`, `nome`, `descricao`) VALUES (?)";
  const values = [req.body.id, req.body.nome, req.body.descricao];

  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.put('/categorias/:id', (req, res) => {
  const sql = 'UPDATE categorias SET `id`=?, `nome`=? WHERE id=?';
  const id = req.params.id;

  db.query(sql, [req.body.id, req.body.nome, id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.delete('/categorias/:id', (req, res) => {
  const sql = 'DELETE FROM categorias WHERE id = ?';
  const id = req.params.id;

  db.query(sql, [id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

//  SERVER TABELA EMPRESTIMOS //
app.get('/emprestimos', (req, res) => {
  const sql = `
      SELECT e.*, u.nome AS nome_usuario, l.titulo AS nome_livro
      FROM emprestimos e
      INNER JOIN usuarios u ON e.id_usuario = u.id
      INNER JOIN livros l ON e.id_livro = l.idlivros
    `;

  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post('/emprestimos', (req, res) => {
  const { id_usuario, id_livro, data_emprestimo, data_devolucao, renovacao } = req.body;
  const sql = "INSERT INTO emprestimos (id_usuario, id_livro, data_emprestimo, data_devolucao, renovacao) VALUES (?, ?, ?, ?, ?)";
  const values = [id_usuario, id_livro, data_emprestimo, data_devolucao, renovacao];

  db.query(sql, values, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.put('/emprestimos/:id_emprestimo', (req, res) => {
  const { id_usuario, id_livro, data_emprestimo, data_devolucao, renovacao } = req.body;
  const id_emprestimo = req.params.id_emprestimo;
  const sql = 'UPDATE emprestimos SET id_usuario=?, id_livro=?, data_emprestimo=?, data_devolucao=?, renovacao=? WHERE id_emprestimo=?';

  const values = [id_usuario, id_livro, data_emprestimo, data_devolucao, renovacao, id_emprestimo];

  db.query(sql, values, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.delete('/emprestimos/:id_emprestimo', (req, res) => {
  const id_emprestimo = req.params.id_emprestimo;
  const sql = 'DELETE FROM emprestimos WHERE id_emprestimo=?';

  db.query(sql, [id_emprestimo], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});


app.listen(port, host, () => {
  console.log(`Listening in : http://${host}/${port}`)

});












