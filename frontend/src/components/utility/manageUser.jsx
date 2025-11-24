// Imports de pacotes principais (React, hooks)
import { useContext, useEffect, useRef, useState } from "react";
// Imports de contextos
import { UserManagementContext } from "../../context/UserManagement";
// Imports de componentes
import LoadingChat from "../loading/loadingChat";
// Imports de estilos (styled components, CSS)
import { Table, TR } from "../../styles/historyStyle";
import {
  DivConfigUsers,
  DivTable,
  TDButtonOptions,
  TD,
  TH,
} from "../../styles/manageUser/manageUser";
import "../../styles/manageUser/manageUser.css";
// Imports de imagens e assets
import FixDeskLogo from "../../images/logos/fixdesk.png";
import CloseIMG from "../../images/components/close.png";

/**
 * Este componente exibe todos os usuários cadastrados, mostrando o nome e o grupo ativo
 * de cada um. Além disso, oferece opções de gerenciamento individual que redirecionam
 * para as operações escolhidas, permitindo alterar ou visualizar detalhes do usuário.
 */
export default function ManageUser() {
  // Estados (useState)
  const [dataUsers, setDataUsers] = useState({});
  const [loadingChat, setLoadingChat] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [showUserTable, setShowUserTable] = useState(false);

  // Contexto
  const { setConfigUsers, setCurrentUserAlteration, setShowExcludeUser } =
    useContext(UserManagementContext);

  // Referências (Refs)
  const tbodyRef = useRef(null);
  const divTableRef = useRef(null);

  /**
   * useEffect para carregar a lista de usuários ao montar o componente.
   * Executa a função GenList() uma única vez, quando o componente é inicializado.
   */
  useEffect(() => {
    GenList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Adiciona o listener para capturar cliques e chamar CloseOption
  document.getElementById("root").addEventListener("click", CloseOption);

  /**
   * CloseOption
   *
   * Fecha a opção de usuário selecionada quando o clique ocorre fora dos elementos
   * com as classes "tr-option-user" ou "td-option-user". Reseta a seleção da linha.
   *
   * @param {MouseEvent} event - Evento de clique disparado na raiz da aplicação.
   */
  function CloseOption(event) {
    // Se o clique NÃO foi em elementos com as classes específicas, limpa a seleção
    if (
      !event.target.classList.contains("tr-option-user") &&
      !event.target.classList.contains("td-option-user")
    ) {
      setSelectedRowId(0);
    } else {
      return;
    }
  }

  /**
   * GenList
   *
   * Realiza uma requisição GET para buscar a lista de usuários da ferramenta.
   * Atualiza os estados com os dados recebidos, controla o loading e a exibição da tabela.
   * Trata erros exibindo no console caso a requisição falhe.
   */
  function GenList() {
    // Faz a requisição para buscar usuários
    fetch("get-users-fixdesk/", {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        // Converte a resposta para JSON
        return response.json();
      })
      .then((data) => {
        // Atualiza o estado com os dados recebidos
        setDataUsers(data);
        // Desativa o indicador de carregamento
        setLoadingChat(false);
        // Exibe a tabela de usuários
        setShowUserTable(true);
      })
      .catch((err) => {
        // Em caso de erro, loga no console
        return console.error(err);
      });
  }

  /**
   * SetValueAndPosition
   *
   * Ativa a seleção de uma linha da lista e calcula a posição relativa do clique
   * dentro dessa linha para posicionar a caixa de opções exatamente onde o usuário clicou.
   *
   * @param {MouseEvent} event - Evento de clique na linha da tabela.
   * @param {number} id - ID da linha clicada.
   */
  function SetValueAndPosition(event, id) {
    // Define a linha selecionada pelo ID
    setSelectedRowId(id);

    // Obtém o elemento <tr> clicado
    const tr = event.currentTarget;

    // Obtém as dimensões e posição do <tr> na viewport
    const trRect = tr.getBoundingClientRect();

    // Coordenadas do clique na viewport
    const clickX = event.clientX;
    const clickY = event.clientY;

    // Calcula a posição do clique relativa ao canto superior esquerdo do <tr>
    const relativeX = clickX - trRect.left;
    const relativeY = clickY - trRect.top;

    // Atualiza o estado com a posição relativa para posicionar a caixa de opções
    setMousePosition({ x: relativeX, y: relativeY });
  }

  /**
   * ExcludeUser
   *
   * Prepara o estado para a exclusão de um usuário quando a opção de excluir é selecionada.
   * Encontra o usuário pelo ID, limpa a seleção atual, oculta a tabela de usuários,
   * exibe a tela/modal de exclusão, define o usuário atual para alteração e sinaliza que
   * os usuários precisam ser recarregados.
   *
   * @param {number} id - ID do usuário a ser excluído.
   */
  function ExcludeUser(id) {
    // Encontra o usuário na lista pelo ID
    const user = dataUsers.find((item) => item.id === id);

    // Limpa a linha selecionada
    setSelectedRowId(0);
    // Oculta a tabela de usuários
    setShowUserTable(false);
    // Exibe o modal/tela de exclusão
    setShowExcludeUser(true);
    // Define o usuário atual que será alterado/excluído
    setCurrentUserAlteration(user);
    // Indica que a lista de usuários precisa ser recarregada
    setConfigUsers(false);
  }

  return (
    <DivConfigUsers className="position-fixed top-50 start-50 translate-middle bg-pure-white">
      <div className="d-flex flex-column position-relative">
        <div className="bg-pure-white position-absolute top-50 start-0 translate-middle d-flex flex-column bd-cls">
          <span>
            <b>HelpDesk</b>
          </span>
          <span>
            <b>User:</b> Usuario
          </span>
          <span>
            <b>Technician_TI:</b> Equipe de TI
          </span>
        </div>
        <div className="d-flex justify-content-between pd-1">
          <img src={FixDeskLogo} className="img-fluid w-3" alt="FixDesk" />
          <h4 className="text-uppercase">lista de usuários fixdesk</h4>
          <img
            src={CloseIMG}
            className="img-fluid w-2-5 h-2-5 pointer"
            alt="Fechar"
            onClick={() => {
              document
                .getElementById("root")
                .addEventListener("click", CloseOption);
              setConfigUsers(false);
            }}
          />
        </div>
        <div>
          <section className="mt-3">
            <Table className="container">
              <thead className="cla">
                <TH>Usuario</TH>
                <TH>Grupo</TH>
              </thead>
            </Table>
            <DivTable ref={divTableRef}>
              <Table>
                <tbody ref={tbodyRef}>
                  {loadingChat && (
                    <div className="d-flex justify-content-center mt-16">
                      <LoadingChat />
                    </div>
                  )}
                  {showUserTable &&
                    dataUsers.map((element) => (
                      <TR
                        className="tr-dashboard position-relative tr-dashboard tr-option-user"
                        key={element.id}
                        id={`tr-${element.id}`}
                        onClick={(e) => {
                          SetValueAndPosition(e, element["id"]);
                        }}
                      >
                        <TD className="td-option-user">
                          {element.first_name} {element.last_name}
                        </TD>
                        <TD className="td-option-user">
                          {element.groups.join(", ")}
                        </TD>
                        {selectedRowId === element.id && (
                          <TDButtonOptions
                            className="position-absolute bg-light-gray td-option-user z-3"
                            style={{
                              top: mousePosition.y,
                              left: mousePosition.x,
                            }}
                          >
                            <span
                              className="pointer text-uppercase cl-hv-crimson-red td-option-user"
                              onClick={() => {
                                ExcludeUser(element.id);
                              }}
                            >
                              <b>excluir usuário</b>
                            </span>
                          </TDButtonOptions>
                        )}
                      </TR>
                    ))}
                </tbody>
              </Table>
            </DivTable>
          </section>
        </div>
      </div>
    </DivConfigUsers>
  );
}
