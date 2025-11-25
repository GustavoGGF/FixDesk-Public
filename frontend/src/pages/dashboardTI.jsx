import { useEffect, useState, useRef, useContext } from "react";
import "react-day-picker/dist/style.css";
import {
  Div,
  ImgSettings,
  DivSettings,
  DivShowOptions,
} from "../styles/dashboardTI/dashboardTI.js";
import DashBoardPie from "../components/dashboard/dashboardPie.jsx";
import Navbar from "../components/general/navbar.jsx";
import { DivZ } from "../styles/historyStyle.js";
import { TitlePage } from "../styles/helpdeskStyle.js";
import Message from "../components/utility/message.jsx";
import "../styles/bootstrap/css/bootstrap.css";
import "../styles/bootstrap/js/bootstrap.js";
import DashboardBar from "../components/dashboard/dashboardBar.jsx";
import FilterTickets from "../components/ticket/filter.jsx";
import { TicketContext } from "../context/TicketContext.js";
import { MessageContext } from "../context/MessageContext.js";
import OpenTicketWindow from "../components/ticket/openTicketWindow.jsx";
import setingIMG from "../images/components/definicoes.png";
import ManageUser from "../components/utility/manageUser.jsx";
import { UserManagementContext } from "../context/UserManagement.js";
import ExcludeUser from "../components/utility/excludeUser.jsx";
import ListTable from "../components/table/ListTable.jsx";
import CardList from "../components/card/CardList/CardList.jsx"
/**
 * Função para ajustar o tema com base na configuração de tema armazenada.
 * - Utiliza o hook useEffect para executar a lógica uma vez após a renderização inicial.
 * - Define o título da página como "DashBoard TI".
 * - Verifica se há uma configuração de tema armazenada no localStorage.
 *   - Se não houver configuração de tema ou se for "black", define o tema como "black" e chama a função ThemeBlack().
 *   - Caso contrário, chama a função ThemeLight().
 */

export default function DashboardTI() {
  // Ao carregar a pagina aplica o tema
  useEffect(() => {
    document.title = "DashBoard TI";
    const theme = localStorage.getItem("Theme") === null ? 'black' : localStorage.getItem("Theme");
    if (theme === "black") return ThemeBlack();
    return ThemeLight();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Variáveis de estado Boolean
   */
  const [chat, setChat] = useState(false);
  const [ticketWindow, setTicketWindow] = useState(false);
  const [showPageConfig, setShowPageConfig] = useState(false);
  /**
   * Variáveis de estado String
   */
  const [blurNav, setBlurNav] = useState("");
  const [colorTheme, setColorTheme] = useState("");
  const [theme, setTheme] = useState("");
  const [themeFilter, setThemeFilter] = useState("");
  /**
   * Variáveis de estado Int.
   */
  const [moreTickets, SetMoreTickets] = useState(0);
  /**
   * Variáveis de estado Array.
   */
  const [userData, setUserData] = useState([]);  
  // Variáveis de Referência null
  const timeoutTicketUpdateRef = useRef(null);
  // Variáveis de referência bool
  const initialFileticket = useRef(false)
  const showEquipament = useRef(false)
  const mountDataChat = useRef(false)
  const fetchchat = useRef(false)
  // Variáveis de referência string
  const lifeTime = useRef("")
  const ticketCOMPANY = useRef("")
  const token = useRef("")
  const ticketDEPARTMENT = useRef("")
  const ticketID = useRef("")
  const ticketMAIL = useRef("")
  const ticketOCCURRENCE = useRef("")
  const ticketPROBLEMN = useRef("")
  const ticketResponsibleTechnician = useRef("")
  const ticketSECTOR = useRef("")
  const equipament = useRef("")
  const ticketNAME = useRef("")
  const observation = useRef("")
  const initialFileData = useRef("")
  const initialFileName = useRef("")
  const initialContentFile = useRef("")
  const dateAlocate = useRef("")
  // Variáveis de referência Array
  const techsNames = useRef([])
  const mountInitialChat = useRef([])

  // Variáveis de contexto para os chamados
  const {
    ticketData,
    setTicketData,
    ticketWindowAtt,
    setTicketWindowAtt,
    changeTech,
    setChangeTech,
    ticketIDOpen,
    setTicketIDOpen,
    sectionTicket,
    startSearch,
    setStartSearch,
    themeCard,
    viewList,
    viewCard
  } = useContext(TicketContext);
  // Variáveis de contexto para as menssagens
  const { typeError, messageError, setMessage, message } =
    useContext(MessageContext);
  // Variáveis de contexto para usuario
  const { setConfigUsers, configUsers, showExcludeUser, setShowExcludeUser } =
    useContext(UserManagementContext);

  // Abre a tela de dados do chamado
  useEffect(() => {
    if (ticketIDOpen && ticketIDOpen !== "") {
      HelpdeskPage({ id: ticketIDOpen });
      setTicketIDOpen("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketIDOpen]);

  // Inicia o loop por novos chamados
  useEffect(()=>{
    if(startSearch){
      CallNewTicket()
      setStartSearch(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[startSearch])

  /**
   * useEffect para fechar telas específicas ao pressionar a tecla Escape.
   *
   * Escuta eventos de teclado e:
   * - Fecha a tela de exclusão de usuário se estiver aberta.
   * - Fecha a tela de configuração de usuários se estiver ativa.
   *
   * Remove o listener ao desmontar o componente para evitar vazamentos de memória.
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Verifica se a tecla pressionada é Escape
      if ((event.key === "Escape" || event.keyCode === 27) && showExcludeUser) {
        setShowExcludeUser(false); // Fecha tela de exclusão
        setConfigUsers(true); // Reabre a configuração de usuários
        return;
      } else if (
        (event.key === "Escape" || event.keyCode === 27) &&
        configUsers
      ) {
        setConfigUsers(false); // Fecha a tela de configuração de usuários
        return;
      }
    };

    // Adiciona listener para evento de keydown
    window.addEventListener("keydown", handleKeyDown);

    // Remove listener ao desmontar o componente
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configUsers, showExcludeUser]);

  /**
   * useEffect para fechar a tela de configuração ao clicar fora dela.
   *
   * Adiciona um listener de clique no elemento com id "dashboard-ti".
   * Se o clique ocorrer fora dos elementos com ids relacionados à configuração,
   * e a tela de configuração estiver aberta, ela será fechada.
   *
   */
  useEffect(() => {
    const handleClickOutsideConfig = (event) => {
      // Verifica se o clique NÃO foi em nenhum dos elementos da configuração
      if (
        event.target.id !== "setting" &&
        event.target.id !== "setting-2" &&
        event.target.id !== "setting-3" &&
        event.target.id !== "setting-4" &&
        event.target.id !== "setting-5"
      ) {
        // Se a página de configuração está aberta, fecha-a
        if (showPageConfig) {
          setShowPageConfig(false);
          return;
        }
        return;
      }
      return;
    };

    const dashboardElement = document.getElementById("dashboard-ti");
    dashboardElement.addEventListener("click", handleClickOutsideConfig);

    // Cleanup: remove o listener ao desmontar ou atualizar efeito
    return () => {
      dashboardElement.removeEventListener("click", handleClickOutsideConfig);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  useEffect(() => {
    if (ticketWindowAtt) {
      setTicketWindowAtt(false);
      CloseTicket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketWindowAtt]);

  useEffect(() => {
    if (changeTech && changeTech.length !== 0) {
      CloseTicket();
      HelpdeskPage({ id: changeTech });
      setChangeTech("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeTech]);

  /**
   * Função para alterar o tema da aplicação para o modo escuro.
   * Limpa os filtros e estilos de cartões existentes e define o tema como "themeBlack".
   */
  function ThemeBlack() {
    setThemeFilter("");
    themeCard.current = ""
    setColorTheme("text-light");
    setTheme("themeBlack");
  }

  /**
   * Função para alterar o tema da aplicação para o modo claro.
   * Define os estilos de cartões e filtros como claros e define o tema como "themeLight".
   */
  function ThemeLight() {
    themeCard.current = "theme-card-light";
    setThemeFilter("theme-filter-light");
    setTheme("theme-light");
  }

  /**
   * useEffect para carregar os dados do usuário armazenados localmente ao carregar a página.
   * Faz uma solicitação ao backend para obter os nomes dos técnicos e o token CSRF.
   * Define os dados dos técnicos e o token CSRF.
   * Em caso de erro, exibe uma mensagem de erro fatal.
   */
  useEffect(() => {
    const dataInfo = JSON.parse(localStorage.getItem("dataInfo"));
    if (dataInfo === null || dataInfo === "null") {
      return (window.location.href = "/login");
    }
    setUserData(dataInfo.data);
    fetch("get-info/", {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        techsNames.current = data.techs;
        token.current = data.token;
      })
      .catch((err) => {
        console.error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Esta função atua como um loop controlado via setTimeout para consultar
   * novos chamados a cada 60 segundos, garantindo que não existam timeouts
   * concorrentes. Utiliza uma referência para armazenar o identificador do
   * timeout, permitindo o cancelamento seguro e evitando múltiplas execuções paralelas.
   */
  function CallNewTicket() {
    try {
      // Se existir um timeout já configurado, cancela antes de agendar outro
      if (timeoutTicketUpdateRef.current) {
        clearTimeout(timeoutTicketUpdateRef.current);
      }

      // Configura um novo timeout para executar após 60 segundos
      timeoutTicketUpdateRef.current = setTimeout(() => {
        // Chama a função responsável por buscar novos chamados
        GetNewTickets();

        // Após execução, limpa o identificador do timeout para indicar inatividade
        timeoutTicketUpdateRef.current = null;
      }, 60000);
    } catch (err) {
      // Loga qualquer erro ocorrido durante o processo para facilitar debug
      return console.error(err);
    }
  }

  /**
   * Esta função realiza uma requisição HTTP GET para buscar novos chamados
   * de acordo com os filtros armazenados no localStorage (quantity, status e order).
   * Após obter a resposta em JSON, atualiza o estado local com os dados dos chamados.
   * Em caso de falha, trata o erro exibindo mensagens apropriadas e faz o log no console.
   */
  function GetNewTickets() {
    // Recupera os filtros armazenados no localStorage para definir os parâmetros da requisição
    var quantity = localStorage.getItem("quantity");
    var status = localStorage.getItem("status");
    var order = localStorage.getItem("order");

    // Realiza a requisição GET para a rota 'get-ticket-ti' com os filtros como parâmetros de path
    fetch("get-ticket-ti/" + quantity + "/" + status + "/" + order, {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        // Converte a resposta para JSON
        return response.json();
      })
      .then((data) => {
        // Atualiza o estado local com a lista de chamados retornados
        setTicketData(data.tickets);
      })
      .catch((err) => {
        // Em caso de erro, define mensagens de erro específicas e loga o erro no console
        typeError.current = "FATAL ERROR";
        messageError.current = err;
        setMessage(true);
        return console.error(err);
      });
  }

  /**
   * Altera o último visualizador de um chamado no sistema de helpdesk.
   *
   * @param {Object} params - Parâmetros da função.
   * @param {number} params.id - ID do chamado a ser atualizado.
   * @param {string} params.tech - Nome do técnico responsável pelo chamado.
   * @returns {Promise<Response>} - Retorna a resposta da requisição fetch.
   */
  async function ChangeLastVW({ id, tech }) {
    try {
      return fetch(`/helpdesk/change-last-viewer/${id}`, {
        method: "POST",
        headers: {
          "X-CSRFToken": token.current, // Token CSRF para segurança da requisição
          "Content-Type": "application/json", // Define o formato do corpo da requisição como JSON
        },
        body: JSON.stringify({
          viewer: userData.name, // Nome do usuário que está visualizando o chamado
          technician: tech, // Nome do técnico associado ao chamado
          requester: "tech", // Indica que a alteração foi feita por um usuário tecnico
          mail: userData.mail,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Função para buscar os dados do chamado selecionado.
   * @param {object} id - O ID do chamado a ser buscado.
   */
  async function HelpdeskPage({ id }) {
    try {
      CloseTicket();
      fetch("/helpdesk/ticket/" + id, {
        method: "GET",
        headers: {
          "X-CSRFToken": token.current,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((dataBack) => {
          setBlurNav("addBlur");
          if (sectionTicket && sectionTicket.current) {
            sectionTicket.current.style.filter = "blur(3px)";
          }
          const data = dataBack.data;
          // Chama a função de forma assíncrona sem bloquear o restante do código
          if (data.responsible_technician !== null) {
            const callAsyncFunction = async () => {
              await ChangeLastVW({ id: id, tech: data.responsible_technician });
            };

            // Chama a função, mas o código segue sem esperar a execução terminar
            callAsyncFunction();
          }
          setMessage(false);

          const CalculateDiference = (dataStr) => {
            const data = new Date(dataStr);
            const agora = new Date();

            // Diferença em milissegundos
            const diffMs = agora - data;

            // Se a data for no futuro, diffMs será negativo
            const diffAbs = Math.abs(diffMs);

            // Diferença em dias
            const diffDias = Math.floor(diffAbs / (1000 * 60 * 60 * 24));

            // Diferença em horas e minutos
            const diffHorasTotal = Math.floor(diffAbs / (1000 * 60 * 60));
            const diffMinutosTotal = Math.floor(diffAbs / (1000 * 60));
            const diffHoras = diffHorasTotal % 24;
            const diffMinutos = diffMinutosTotal % 60;

            // Formatar hora da data original
            const hora = data.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });

            // Formatar data da data original
            const dataFormatada = data.toLocaleDateString("pt-BR");

            return {
              hora,
              dataFormatada,
              diffDias,
              diffHoras,
              diffMinutos,
              noFuturo: diffMs < 0,
            };
          };

          const resultado = CalculateDiference(data.start_date);

          lifeTime.current = `${resultado.diffDias} Dias e ${resultado.diffHoras}:${resultado.diffMinutos} Horas`;

          ticketNAME.current = data.ticketRequester;
          ticketDEPARTMENT.current = data.department;
          ticketMAIL.current = data.mail;
          ticketCOMPANY.current = data.company;
          ticketSECTOR.current = data.sector;
          ticketOCCURRENCE.current = data.occurrence;
          ticketPROBLEMN.current = data.problemn;
          if (data.observation && data.observation.length !== 0) {
            observation.current = data.observation;
          }
          if (data.equipament && data.equipament.length !== 0) {
            showEquipament.current = true;
            equipament.current = data.equipament;
            dateAlocate.current = data.date_alocate;
          }
          if (
            data.responsible_technician &&
            data.responsible_technician.length !== 0
          ) {
            ticketResponsibleTechnician.current = data.responsible_technician;
          }
          ticketID.current = data.id;

          var name_verify = userData.name;
          // Verifica se o ticket contém arquivos do tipo e-mail e gera a visualização correspondente, se aplicável.
          if (data.file !== null && data.file.length >= 1) {           
            initialFileData.current = data.file;
            initialFileName.current = data.name_file;
            initialContentFile.current = data.content_file;
            initialFileticket.current = true;
          }
          // Identifica o chat, verifica se contém valores e os separa em grupos de Data, Receptor e Horário.
          if (
            data.chat !== null &&
            data.chat !== undefined &&
            data.chat !== "undefined"
          ) {
            fetchchat.current = true;
            mountDataChat.current = true;
            mountInitialChat.current = data.chat;
          }

          // Verifica se o nome que consta no técnico é o mesmo que está logado.
          var nameVer = name_verify.split(" ");

          if (data.responsible_technician !== null) {
            var techVer = data.responsible_technician.split(" ");

            var allFind = true;
            for (var i = 0; i < techVer.length; i++) {
              if (nameVer.indexOf(techVer[i]) === -1) {
                allFind = false;
                break;
              }
            }
          }

          if (allFind && data.open) {
            setChat(true);
          }
          setTicketWindow(true);
          setTicketWindowAtt(false);
        })
        .catch((err) => {
          messageError.current = err;
          typeError.current = "FATAL ERROR";
          setMessage(true);
          return console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  }

  // Evento para fechar dropdowns quando o usuário clica fora deles.
  window.onclick = function (event) {
    if (
      !event.target.matches(".dropbtn") &&
      !event.target.matches(".dropdown-content")
    ) {
      try {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains("showDP")) {
            openDropdown.classList.remove("showDP");
          }
        }
      } catch (err) {
        return console.error(err);
      }
    }
    return;
  };

  async function CloseTicket() {
    if (sectionTicket && sectionTicket.current) {
      sectionTicket.current.style.filter = "blur(0)";
    }
    initialFileData.current = "";
    initialFileName.current = "";
    initialContentFile.current = "";
    initialFileticket.current = false; 
    setBlurNav("");
    setTicketWindow(false);
    equipament.current = "";
    observation.current = "";
    ticketResponsibleTechnician.current = "";
    setChat(false);
    showEquipament.current = false;
    mountInitialChat.current = [];
    return GetNewTickets();
  }

  return (
    <Div className={`position-relative ${theme}`} id="dashboard-ti">
      <div className={blurNav}>
        <Navbar />
      </div>
      {message && (
        <DivZ className="position-fixed top-50 start-50 translate-middle z-3">
          <Message
            CloseMessage={() => {
              setMessage(false);
            }}
          />
        </DivZ>
      )}
      <TitlePage className={`text-center mt-3 ${colorTheme}`}>
        Central de Gerenciamento de Chamados TI
      </TitlePage>
      <div
        className={`d-flex flex-column justify-content-center w-100 ${blurNav} mb-5 position-relative`}
      >
        <div
          className="position-absolute top-0 end-0 d-flex flex-direction-column justify-content-center align-items-center text-align-center"
          id="setting"
        >
          <DivSettings id="setting-2">
            <ImgSettings
              src={setingIMG}
              className="img-fluid pe-auto"
              id="setting-3"
              alt="Configurações da Página"
              onClick={() => {
                if (showPageConfig) {
                  setShowPageConfig(false);
                } else {
                  setShowPageConfig(true);
                }
              }}
            />
            {showPageConfig && (
              <DivShowOptions className="bg-pure-white">
                <div
                  id="setting-4"
                  onClick={() => {
                    setConfigUsers(true);
                    setShowExcludeUser(false);
                    setShowPageConfig(false);
                  }}
                >
                  <b className="pe-none" id="setting-5">
                    Configuração de Usuários
                  </b>
                </div>
              </DivShowOptions>
            )}
          </DivSettings>
        </div>
        <div className="d-flex justify-content-center w-100">
          <DashBoardPie sector={"TI"} clss={colorTheme} />
        </div>
        <div className="d-flex justify-content-center mb-5">
          <DashboardBar />
        </div>
      </div>
      <div className="mt7 position-relative">
        <FilterTickets
          url={"dashboards"}
          blurNav={""}
          themeFilter={themeFilter}
          userName={userData.name}
          moreTickets={moreTickets}
        />
      </div>
      <section ref={sectionTicket} className="mt-3 position-relative">
        {viewList && (
          <div className="w-100 d-flex justify-content-center">
            <ListTable ticket={ticketData} />
          </div>
        )}
        {viewCard && <CardList ticket={ticketData} />}
      </section>
      {ticketWindow && (
        <OpenTicketWindow
          helpdesk={"dashboard"}
          ticketID={ticketID.current}
          token={token.current}
          CloseTicket={CloseTicket}
          ticketNAME={ticketNAME.current}
          ticketDEPARTMENT={ticketDEPARTMENT.current}
          ticketMAIL={ticketMAIL.current}
          ticketCOMPANY={ticketCOMPANY.current}
          ticketOCCURRENCE={ticketOCCURRENCE.current}
          ticketPROBLEMN={ticketPROBLEMN.current}
          ticketSECTOR={ticketSECTOR.current}
          equipament={equipament.current}
          dateAlocate={dateAlocate.current}
          lifeTime={lifeTime.current}
          ticketResponsible_Technician={ticketResponsibleTechnician.current}
          initialFileticket={initialFileticket.current}
          showEquipament={showEquipament.current}
          observation={observation.current}
          mountDataChat={mountDataChat.current}
          chat={chat}
          fetchchat={fetchchat.current}
          userName={userData.name}
          userMail={userData.mail}
          initialFileData={initialFileData.current}
          initialFileName={initialFileName.current}
          initialContentFile={initialContentFile.current}
          mountInitialChat={mountInitialChat.current}
          techsNames={techsNames.current}
        />
      )}
      <div className={`w-100 text-center ${blurNav} mt-5`}>
        <button
          className="btn btn-info mb-5"
          onClick={() => {
            var quantity = localStorage.getItem("quantity");
            quantity = Number(quantity);
            quantity += 10;
            return SetMoreTickets(quantity);
          }}
        >
          Carregar Mais
        </button>
      </div>      
      {configUsers && <ManageUser />}
      {showExcludeUser && <ExcludeUser token={token.current} />}
    </Div>
  );
}
