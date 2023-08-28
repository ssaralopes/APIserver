import express from 'express';
import mysql from 'mysql';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json())

const db = mysql.createConnection({
    host: "localhost",
    user: 'aluno40-pfsii',
    password: 'WE34HtdB4YOiYOLagNkr',
    port: 3306,
    database: 'biblioteca'
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

app.get('/livros/:idlivros', (req, res) => {
    const sql = "SELECT * FROM livros WHERE idlivros = ?";
    const id = req.params.idlivros;

    db.query(sql, [id], (err, result) => {
        if(err) return res.json(err);
        return res.json(result);
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
    })

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



app.listen(4040, ()=>{
    console.log("Listening");
})









