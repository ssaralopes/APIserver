import express from 'express';
import mysql from 'mysql';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json())
 
const host = 'localhost';
const port = '4040';

const db = mysql.createConnection({

    // host: "localhost",
    // user: 'aluno40-pfsii',
    // password: 'WE34HtdB4YOiYOLagNkr',
    // port: 3306,
    // database: 'biblioteca'


    // URL LOCAL 
    host: "localhost",
    user: 'root',
    password:'',
    port: 3306,
    database: 'usuarios'
});

app.get('/', (re, res) => {
    return res.json("From backend side");
});

app.get('/usuarios', (req, res) => {
    const sql = "SELECT * FROM usuarios";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
});

app.get('/usuarios/:id', (req, res) => {
    const sql = "SELECT * FROM usuarios WHERE id = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) => {
        if(err) return res.json(err);
        return res.json(result);
    })
});


app.post('/usuarios', (req, res) =>{
    const sql = "INSERT INTO usuarios (`id`, `nome`, `cpf`, `rg`, `email`, `endereco`) VALUES (?)";
    const values = [
        req.body.id,
        req.body.nome,
        req.body.cpf,
        req.body.rg,
        req.body.email,
        req.body.endereco
    ]
    db.query(sql, [values], (err, result) =>{
        if(err) return res.json(err);
        return res.json(result);
    })

});

app.put('/usuarios/:id', (req, res) => {
    const sql = 'UPDATE usuarios SET `id`=?, `nome`=?, `cpf`=?, `rg`=?, `email`=?, `endereco`=? WHERE id=?';
    const id = req.params.id;
    db.query(sql, [req.body.id, req.body.nome, req.body.cpf, req.body.rg, req.body.email, req.body.endereco, id], (err, result)=>{
        if(err) return res.json(err);
        return res.json(result);
    })
});

app.delete('/usuarios/:id', (req, res) =>{
    const sql = 'DELETE FROM usuarios WHERE id = ?';
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json(err);
        return res.json(result);
    })
}); 

//  SERVER TABELA LIVRO //
app.get('/livros', (req, res) => {
    const sql = "SELECT * FROM livros";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
});

app.get('/livros/:idlivros', (req, res) => {// onde vc chma esse cara?!
    const sql = "SELECT * FROM livros WHERE idlivros = ?";
    const id = req.params.idlivros;

    db.query(sql, [id], (err, result) => {
        if(err) return res.json(err);
        return res.json(result);
    })
});

// // Rota para associar um livro a um tipo de baixa
// app.post('/livros_baixas', (req, res) => {
//     const { livro_id, tipo_baixa_id } = req.body;
//     const sql = 'INSERT INTO livros_tipobaixa (livro_id, tipo_baixa_id) VALUES (?, ?)';
//     const values = [livro_id, tipo_baixa_id];
//     db.query(sql, values, (err, result) => {
//       if (err) return res.json(err);
//       return res.json(result);
//     });
//   });
  
//   // Rota para desassociar um livro de um tipo de baixa
//   app.delete('/livros_baixas/:livro_id/:tipo_baixa_id', (req, res) => {
//     const livro_id = req.params.livro_id;
//     const tipo_baixa_id = req.params.tipo_baixa_id;
//     const sql = 'DELETE FROM livros_tipobaixa WHERE livro_id = ? AND tipo_baixa_id = ?';
//     db.query(sql, [livro_id, tipo_baixa_id], (err, result) => {
//       if (err) return res.json(err);
//       return res.json(result);
//     });
//   });
  
//   // Rota para listar os tipos de baixa associados a um livro
//   app.get('/livros_tipobaixa/:livro_id'), (req, res) => {
//     const livro_id = req.params.livro_id;
//     const sql = 'SELECT tipo_baixa_id FROM livros_tipobaixa WHERE livro_id = ?';
//     db.query(sql, [livro_id], (err, data) => {
//       if (err) return res.json(err);
//       return res.json(data);
//     });
//   }

// codigo teste G.
app.get('/baixa/:idlivros', (req, res) => {
    const id = req.params.idlivros;
    const sql = `
        SELECT  tb.nomebaixa
        FROM livros_tipobaixa lt
        INNER JOIN tipobaixa tb ON lt.tipo_baixa_id = tb.id
        WHERE lt.livro_id = ?
    `;
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao consultar o banco de dados" });
        }
        if(result != ""){
            return res.status(200).json(result[0]);
        }else{
            return res.status(200).json({ nomebaixa: "" });
        }
        
    });
});

app.get('/baixas', (req, res) => {
    const sql = "SELECT * FROM tipobaixa";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
});

app.post('/livros', (req, res) =>{
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
    db.query(sql, [values], (err, result) =>{
        if(err) return res.json(err);
        return res.json(result);
    });

});

app.put('/livros/:idlivros', (req, res) => {
    const sql = 'UPDATE livros SET `idlivros`=?, `titulo`=?, `autor`=?, `publicado`=?, `local`=?, `material`=?,`idioma`=?, `original`=? WHERE idlivros=?';
    const id = req.params.idlivros;
    db.query(sql, [req.body.idlivros, req.body.titulo, req.body.autor, req.body.publicado, req.body.local, req.body.material, req.body.idioma, req.body.original, id], (err, result)=>{
        if(err) return res.json(err);
        return res.json(result);
    })
});

app.delete('/livros/:idlivros', (req, res) =>{
    const sql = 'DELETE FROM livros WHERE idlivros = ?';
    const id = req.params.idlivros;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json(err);
        return res.json(result);
    })
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

// //URL LOCAL 
// app.listen(4040, ()=>{
//     console.log("Listening");
// })









