const modal = document.querySelector(".janelaaddtransac");

function abrirnovatransacao() {
  modal.classList.add("abrir");

  modal.addEventListener("click", (e) => {
    if (e.target.id == "janelaadd-transac") {
      modal.classList.remove("abrir");
    }
  });
}

const transacoesUL = document.querySelector("#transactions");
const balancaDisplay = document.querySelector("#balance");
const rendaDisplay = document.querySelector("#money-plus");
const despesaDisplay = document.querySelector("#money-minus");
const form = document.querySelector("#form");
const inputtransacaonome = document.querySelector("#text");
const inputtransacaodata = document.querySelector("#data");
const inputtransacaomontante = document.querySelector("#amount");

const localstoragetransacoes = JSON.parse(localStorage.getItem("transactions"));

let transactions =
  localStorage.getItem("transactions") !== null ? localstoragetransacoes : [];

const removertransacao = (ID) => {
  transactions = transactions.filter((transacao) => transacao.id !== ID);

  atualizarlocalstorage();
  init();
};

const addtransacaonoDOM = (transacao) => {
  const operacao = transacao.montante < 0 ? "-" : "+";
  const CSSClass = transacao.montante < 0 ? "menor" : "maior";
  const montantesemoperador = Math.abs(transacao.montante);
  const li = document.createElement("li");
  li.classList.add(CSSClass);
  li.innerHTML = ` <span>
 <p> Nome objeto:</p> ${transacao.name}   <br> <p> Data:</p> ${transacao.data}<br> <p>Valor:</p>  ${operacao} R$ ${montantesemoperador} </span>
  <button class="delete-btn" onClick="removertransacao(${transacao.id})" >x</button>
  `;
  transacoesUL.prepend(li);

  modal.classList.remove("abrir");
};

const atualizarvalores = () => {
  const montante_de_transacoes = transactions.map(
    (transacao) => transacao.montante
  );

  const total = montante_de_transacoes.reduce(
    (accumulator, transacao) => accumulator + transacao,
    0
  );

  const renda = montante_de_transacoes
    .filter((valor) => valor > 0)
    .reduce((accumulator, valor) => accumulator + valor, 0)
    .toFixed(2);

  const despesa = Math.abs(
    montante_de_transacoes
      .filter((valor) => valor < 0)
      .reduce((accumulator, valor) => accumulator + valor, 0)
      .toFixed(2)
  );

  balancaDisplay.textContent = `R$ ${total}`;
  rendaDisplay.textContent = `R$ ${renda}`;
  despesaDisplay.textContent = `R$ ${despesa}`;
};

const init = () => {
  transacoesUL.innerHTML = "";
  transactions.forEach(addtransacaonoDOM);
  atualizarvalores();
};
init();

const atualizarlocalstorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const generateID = () => Math.round(Math.random() * 1000);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const transactionname = inputtransacaonome.value.trim();
  const transactiondata = inputtransacaodata.value.trim();
  const transactionmontante = inputtransacaomontante.value.trim();

  if (
    inputtransacaonome.value.trim() === "" ||
    inputtransacaodata.value.trim() === "" ||
    inputtransacaomontante.value.trim() === ""
  ) {
    alert("porfavor preencha o nome e/ou valor da transacao");
    return;
  }
  const transaction = {
    id: generateID(),
    name: transactionname,
    data: Date(inputtransacaodata),
    montante: Number(transactionmontante),
  };
  transactions.push(transaction);
  init();
  atualizarlocalstorage();

  inputtransacaonome.value = "";
  inputtransacaodata.value = "";
  inputtransacaomontante.value = "";
});
