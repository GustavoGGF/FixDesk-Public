/**
 * Importações internas do React necessárias para o funcionamento deste componente.
 * - React: permite a criação e manipulação de componentes React.
 * - useState: hook que possibilita a adição de estado a componentes funcionais.
 * - useEffect: hook utilizado para executar efeitos colaterais em componentes funcionais, como ações após renderizações.
 * - useRef: hook que fornece uma maneira de armazenar referências a elementos DOM ou valores mutáveis que persistem entre as renderizações.
 * Importação da classe Chart do módulo "chart.js/auto" para a renderização de gráficos.
 */
import { useState, useEffect, useRef, useContext } from "react";
import { Chart } from "chart.js/auto";

/**
 * Importações de componentes e estilos já criados neste projeto.
 * - Loading: componente responsável pela exibição de um indicador de carregamento.
 * - Message: componente utilizado para exibir mensagens ao usuário.
 * - Div1 e Div2: estilos importados do módulo "../styles/dashboardBar", utilizados para estilizar elementos do componente DashboardBar.
 */
import Loading from "../loading/loading";
import Message from "../utility/message";
import { Div1, Div2 } from "../../styles/dashboardBar";
import { MessageContext } from "../../context/MessageContext";

export default function DashboardBar() {
  // Variáveis de Estado Array
  const [histogramData, setHistogramData] = useState([]);
  const [oldHistogramData, setOldHistogramData] = useState([]);
  // Variáveis de Estado Boolean
  const [loadingHistogram, setLoadingHistogram] = useState(true);
  const [messageBar, setMessageBar] = useState(false);
  // Variáveis de Referência Null
  const [myChart, setMyChart] = useState(null);
  const dashboardBar = useRef(null);
  const selectPeriod = useRef(null);
  const timeoutBarUpdateRef = useRef(null);
  // Variáveis de Referência String
  const barChatDataRange = useRef("")
  const labeldash = useRef("")
  // Variáveis de Referência Number
  const countAccess = useRef(0)

  const { setTypeError, setMessageError } = useContext(MessageContext);

  /**
   * Variável timeoutBarUpdate utilizada para armazenar o identificador do timeout responsável pela atualização contínua do dashboard.
   * barChartData: variável que armazena os dados do dashboard em formato de string.
   */
  let barChartData = "";

  /**
   * Efeito colateral utilizado para buscar os dados da semana ao inicializar o componente.
   * - periodweek(): função responsável por buscar os dados da semana.
   * A dependência vazia [] garante que o efeito será executado apenas uma vez após a montagem do componente.
   */
  useEffect(() => {
    GetDataBar({ range_days: "week" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Função periodweek() utilizada para buscar os dados semanais para o dashboard.
   * - Reinicia o rótulo do dashboard e os dados do histograma.
   * - Realiza uma requisição GET para obter os dados da semana.
   * - Se o status da resposta for 210 (falta de dados), a função tenta buscar os dados mensais e exibe uma mensagem informativa.
   * - Se a requisição for bem-sucedida, atualiza o rótulo do dashboard, chama a função CallNewBar() para atualizar o gráfico e define os dados do histograma.
   * - Em caso de erro, exibe uma mensagem de erro.
   */
  function GetDataBar({ range_days }) {
    fetch("get-dash-board-bar/" + range_days, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.status === 204) {
          var day = ""
          switch(range_days){
            case "week": 
              day = "month";
              break;
            case "month": 
              day = "year";
              break;
            case "year": 
              day = "all";
              break;
            default:
              day = "month";
              break;
          }
          return RecallGetBarData({ range: day });
        }
        return response.json();
      })
      .then((data) => {
        if(data){
          try {
            switch (range_days) {
              default:
                break;
              case "week":
                barChartData = range_days;

                labeldash.current = "Chamados da Semana";
                break;
              case "month":
                barChartData = range_days;
                labeldash.current = "Chamados do Mês";
                break;
              case "year":
                barChartData = "year";
                labeldash.current = "Chamados deste Ano";
                break;
              case "all":
                barChartData = "all";
                labeldash.current = "Todos os Chamados";
                break;
            }
            barChatDataRange.current = barChartData;
            setHistogramData(data);
          } catch (err) {
            return console.log(err);
          }
        }

      })
      .catch((err) => {
        setMessageBar(true);
        setTypeError("Fatal Error");
        setMessageError(err);
      });
  }

  function RecallGetBarData({ range }) {
    try {
      switch (range) {
        case "week":
          setHistogramData([])
          selectPeriod.current.value = "2";
          setMessageBar(true);
          setTypeError("Falta de Dados");
          setMessageError("Buscando Chamados do Mês");
          barChartData = "";
          barChatDataRange.current = "";
          GetDataBar({ range_days: "month" });
          break;
        case "month":
          selectPeriod.current.value = "3";
          setMessageBar(true);
          setTypeError("Falta de Dados");
          setMessageError("Buscando Chamados do Ano");
          barChartData = "";
          barChatDataRange.current = "";
          console.log("at");
          
          GetDataBar({ range_days: "year" });
          break;
        case "year":
          selectPeriod.current.value = "4";
          setMessageBar(true);
          setTypeError("Falta de Dados");
          setMessageError("Buscando todos os Chamados");
          barChartData = "";
          barChatDataRange.current = "";
          GetDataBar({ range_days: "year" });
          break;
          default:
          setHistogramData([])
          selectPeriod.current.value = "2";
          setMessageBar(true);
          setTypeError("Falta de Dados");
          setMessageError("Buscando Chamados do Mês");
          barChartData = "";
          barChatDataRange.current = "";
          GetDataBar({ range_days: "month" });
          break;
      }
    } catch (err) {
      return console.log(err);
    }
  }
  /**
   * Acionado sempre que os dados do dashboard (histogramData) são atualizados.
   * - A função initChart() é chamada para inicializar o gráfico com os novos dados.
   * - Verifica se os dados do histograma estão presentes e válidos antes de criar o gráfico.
   * - Se o gráfico já existir, ele é destruído para evitar duplicatas.
   * - Cria um novo gráfico utilizando os dados atualizados.
   * - Define o novo gráfico como estado.
   * - Exibe a barra do dashboard e desativa o indicador de carregamento.
   * - Em caso de erro, exibe uma mensagem de erro.
   * - O retorno da função de limpeza é responsável por destruir o gráfico ao desmontar o componente.
   * - É executado apenas quando os dados do histograma são modificados.
   */
  useEffect(() => {
    var recall = false;
    const initChart = () => {
      try {
        if (histogramData && histogramData.days && histogramData.values) {
          try {
            if (
              countAccess.current >= 0 &&
              JSON.stringify(histogramData) === JSON.stringify(oldHistogramData)
            ) {
              CallNewBar();
              recall = true;
              return;
            }

            if (myChart) {
              myChart.destroy();
            }
            const dashboard = document.getElementById("dashboard");
            const newChart = new Chart(dashboard, {
              type: "bar",
              data: {
                labels: histogramData.days,
                datasets: [
                  {
                    label: [labeldash.current],
                    data: histogramData.values,
                  },
                ],
              },
            });

            setMyChart(newChart);
            setOldHistogramData(histogramData);
            countAccess.current ++;
            dashboardBar.current.style.display = "block";
            setLoadingHistogram(false);
            return CallNewBar();
          } catch (err) {
            return console.log(err);
          }
        } else {
          dashboardBar.current.style.display = "block";
          setLoadingHistogram(false);
          return;
        }
      } catch (err) {
        setMessageBar(true);
        setTypeError("Fatal Error");
        setMessageError(err);
        console.log(err);
        return;
      }
    };

    initChart();

    return () => {
      if (!recall) {
        if (myChart) {
          myChart.destroy();
        }
      }
      return;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [histogramData]);

  /**
   * Função CallNewBar() utilizada para reativar a função de busca de dados do dashboard a cada 1 minuto, caso existam dados.
   * - Se houver um timeoutBarUpdate anteriormente definido, ele é limpo para evitar múltiplas execuções.
   * - Determina a função de atualização com base no tipo de dados do dashboard selecionado.
   * - Define um novo timeoutBarUpdate para chamar a função de atualização a cada 1 minuto.
   */
  function CallNewBar() {
    try {
      if (timeoutBarUpdateRef.current) {
        clearTimeout(timeoutBarUpdateRef.current);
      }

      timeoutBarUpdateRef.current = setTimeout(() => {
        GetDataBar({ range_days: barChatDataRange.current });

        timeoutBarUpdateRef.current = null;
      }, 60000);
    } catch (err) {
      return console.log(err);
    }
  }

  /**
   * Função changePeriod() acionada pelo evento de seleção do período na interface do usuário.
   * - Obtém o valor selecionado no elemento select de período.
   * - Com base no valor selecionado, chama a função correspondente para buscar os dados do dashboard.
   * - Em caso de valor inválido, exibe uma mensagem de erro.
   */
  function ChangePeriod() {
    try {
      const period =
        selectPeriod.current.options[selectPeriod.current.selectedIndex].value;

      switch (period) {
        case "1":
          GetDataBar({ range_days: "week" });
          break;
        case "2":
          GetDataBar({ range_days: "month" });
          break;
        case "3":
          GetDataBar({ range_days: "year" });
          break;
        case "4":
          GetDataBar({ range_days: "all" });
          break;
        default:
          console.log("periodo inválido: ", period);
          setMessageBar(true);
          setTypeError("Fatal Error");
          setMessageError("Periodo inválido:", period);
          break;
      }
    } catch (err) {
      return console.log(err);
    }
  }

  return (
    <Div1 className="mt-5 mb-5 position-relative">
      {messageBar && (
        <div className="position-absolute top-50 start-50 translate-middle z-1">
          <Message
            CloseMessage={() => {
              setMessageBar(false);
            }}
          />
        </div>
      )}
      <div>
        <div className="h-100 w-100 d-flex justify-content-center">
          {loadingHistogram && <Loading />}
        </div>
        <Div2 className="d-flex flex-column">
          <select
            className="form-select"
            ref={selectPeriod}
            onChange={ChangePeriod}
            defaultValue="1"
          >
            <option value="1" selected>
              Está Semana
            </option>
            <option value="2">Este Mês</option>
            <option value="3">Este Ano</option>
            <option value="4">Todo Período</option>
          </select>
          <canvas id="dashboard" ref={dashboardBar}></canvas>
        </Div2>
      </div>
    </Div1>
  );
}
