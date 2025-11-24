// Módulos externos (bibliotecas)
import { useContext, useRef, useState } from "react";
// Módulos internos (contextos e componentes)
import { MessageContext } from "../../context/MessageContext.js";
import { UserManagementContext } from "../../context/UserManagement";
import LoadingChat from "../loading/loadingChat.jsx";
// Módulos internos (imagens)
import CloseIMG from "../../images/components/close.png";

/**
 * Componente ExcludeUser
 *
 * Exibe uma lista de usuários cadastrados na ferramenta, permitindo a visualização
 * e a exclusão de usuários diretamente pela interface. Também pode exibir mensagens
 * de carregamento e feedback para ações realizadas.
 *
 * Features:
 * - Lista usuários cadastrados
 * - Permite excluir usuários
 * - Mostra estado de carregamento (loading)
 * - Usa contextos para gerenciar usuários e mensagens globais
 */
export default function ExcludeUser({ token }) {
  // Declaração de variáveis de estado booleanas
  const [hiddenAllInformation, setHiddenAllInformation] = useState(true);
  const [inputCredentials, setInputCredentials] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  // Contextos
  const { currentUserAlteration, setShowExcludeUser, setConfigUsers } =
    useContext(UserManagementContext);

  const { setTypeError, setMessageError, setMessage } =
    useContext(MessageContext);

  // Referências (Refs)
  const checkboxConfirm = useRef(null);
  const h5Ref = useRef(null);

  /**
   * Envia uma requisição POST para excluir o usuário atualmente selecionado
   * no contexto (currentUserAlteration).
   *
   * - Atualiza a lista de usuários ao concluir.
   * - Exibe mensagens de erro caso o usuário não exista ou a operação seja inválida.
   * - Fecha o modal/tela de exclusão após a resposta.
   */
  function ExcludeUserConfirm() {
    // Faz a requisição POST para o endpoint de exclusão, passando o nome completo do usuário
    fetch(
      "exclude-user/" +
        currentUserAlteration.first_name +
        " " +
        currentUserAlteration.last_name,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-CSRFToken": token,
        },
      }
    )
      .then((response) => {
        // Se exclusão foi bem-sucedida
        if (response.status === 200) {
          setConfigUsers(true); // Atualiza lista de usuários
          setShowExcludeUser(false); // Fecha modal/tela de exclusão
        }
        // Se usuário não existe ou operação não permitida
        else if (response.status === 402) {
          setTypeError("Operação Inválida");
          setMessageError("Usuário não existe");
          setMessage(true); // Exibe mensagem de erro
          setConfigUsers(true); // Atualiza lista
          setShowExcludeUser(false); // Fecha modal/tela
        }
        return response.json();
      })
      .catch((err) => {
        // Loga erro no console em caso de falha na requisição
        return console.error("Erro ao tentar excluir o usuario: ", err);
      });
  }

  return (
    <div className="position-fixed top-50 start-50 translate-middle bg-pure-white bd-rd-1 pd-1 wd-35 pd-b-3 mn-h-20">
      <div>
        <div className="d-flex justify-content-center position-relative pd-1">
          <h5 ref={h5Ref}>Configuração de Usuário</h5>
          <button
            className="position-absolute top-0 end-0 mg-1 bg-pure-white bd-none"
            onClick={() => {
              setConfigUsers(true);
              setShowExcludeUser(false);
            }}
          >
            <img className="img-fluid hg-2 w-2" src={CloseIMG} alt="Fechar" />
          </button>
        </div>
        {hiddenAllInformation && (
          <>
            <h6 className="mt-5">
              {`Usuario: ${currentUserAlteration.first_name} ${currentUserAlteration.last_name}`}
            </h6>
            <div>
              {!inputCredentials && (
                <h6>
                  Você esta optando por excluir esse usuario da ferramenta de
                  chamados, você tem certeza?
                </h6>
              )}
              <div class="form-check mt-4">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="checkChecked"
                  ref={checkboxConfirm}
                  onChange={() => {
                    if (checkboxConfirm.current.checked) {
                      setInputCredentials(true);
                    } else {
                      setInputCredentials(false);
                    }
                  }}
                />
                <label class="form-check-label" for="checkChecked">
                  Confirmo.
                </label>
              </div>
            </div>
            {inputCredentials && (
              <div className="d-flex justify-content-center mt-5">
                <button
                  className="btn btn-danger w-100"
                  onClick={() => {
                    h5Ref.current.innerText = `Removendo Usuario: ${currentUserAlteration.first_name} ${currentUserAlteration.last_name}`;
                    setHiddenAllInformation(false);
                    setShowLoading(true);
                    ExcludeUserConfirm();
                  }}
                >
                  Remover
                </button>
              </div>
            )}
          </>
        )}
        {showLoading && <LoadingChat />}
      </div>
    </div>
  );
}
