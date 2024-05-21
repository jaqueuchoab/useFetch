import React from 'react';

function useFetch<InterfaceData>(
  url: RequestInfo | URL,
  options?: RequestInit,
) {
  // Como data pode ser qualquer tipo, usaremos o generic para definir o tipo
  const [data, setData] = React.useState<InterfaceData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Prevenir problema com o uso da url como dependencia, criando uma ref para o valor de options
  const optionsRef = React.useRef(options);
  optionsRef.current = options;

  React.useEffect(() => {
    // Usando controler da class AbortController e método signal que se liga ao fetch e define se foi concluido ou não assim abortando o que nao foi sucesso
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      setLoading(true);
      setData(null);
      try {
        const response = await fetch(url, { signal, ...optionsRef.current });
        if(!response.ok) throw new Error(`Error: ${response.status}`);
        // Inferindo tipo da promisse retornada em json()
        const json = (await response.json()) as InterfaceData;
        // setDate mudado apenas quando a requisição não for abortada
        if(!signal.aborted) setData(json);
      } catch (error) {
        // Erro no tipo do argumento erro
        if(!signal.aborted && error instanceof Error) {
          setError(error.message);
        }
      } finally {
        if(!signal.aborted) setLoading(false);
      }
    };

    fetchData();

    // return de quando o componente é desmonstado, benficio que o AbortControler dá, visto que o componente é testado inicialmente
    return () => {
      controller.abort();
    }
  }),
    [url]; // a url é uma dependencia para que o useEffect seja ativado

  // States do fetch
  return { data, loading, error };
}

export default useFetch;
