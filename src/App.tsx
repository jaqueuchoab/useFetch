import React from 'react';
import useFetch from './useFetch';

type Produto = {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  descricao: string;
  internacional: boolean;
};

function App() {
  const [id, setId] = React.useState("p001");
  const produtos = useFetch<Produto[]>('https://data.origamid.dev/produtos');
  const produto = useFetch<Produto>(`https://data.origamid.dev/produtos/${id}`, {cache: "force-cache"});
  // esse force cache é um atributo de options que permite guardar o que já foi carregado e faz o fetch apenas de um novo dado que n tenha sido requisitado antes

  return (
    <section style={{display: 'flex'}}>
      <div>
        {produtos.data &&
          produtos.data.map((produto) => {
            return <button onClick={() => setId(produto.id)} key={produto.id}>{produto.id}</button>;
          })}
      </div>
      {produto.loading && <div>Carregando...</div>}
      <div>
        {produto.data && (<ul>
          <li>ID: {produto.data.id}</li>
          <li>Nome: {produto.data.nome}</li>
          <li>Descrição: {produto.data.descricao}</li>
          <li>Quantidade: {produto.data.quantidade}</li>
        </ul>)}
      </div>
    </section>
  );
}

export default App;
