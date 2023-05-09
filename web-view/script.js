baseURL = 'https://tarefasappgs.onrender.com/tarefas'

// Elementos
const task_Create = document.querySelector('.task-list');
const input_description = document.querySelector('#form-description')
const input_responsible = document.querySelector('#form-responsible')
const criar_task = document.querySelector('.criar-task');
const editar_task = document.querySelector('.editar-task');

let tasks = [];
let tarefa_id;

//funções

function exibir_tarefa(tarefa) {
    //div tarefa
    const div_tarefa = document.createElement('div');
    if (tarefa.situacao === 'Cancelada'){
        div_tarefa.classList.add('cancel')
    }
    else if (tarefa.situacao === 'Completa'){
        div_tarefa.classList.add('done')
    }
    div_tarefa.classList.add('task');

    //div task-content
    const task_conteudo = document.createElement('div')
    task_conteudo.classList.add('task-content')
    div_tarefa.appendChild(task_conteudo)
    
    //descrição
    const descricao = document.createElement('h3');
    descricao.innerText = tarefa.descricao;
    task_conteudo.appendChild(descricao);

    //responsável
    if (tarefa.responsavel != ''){
        const responsavel = document.createElement('h5');
        responsavel.innerText = 'Responsável: ' + tarefa.responsavel;
        task_conteudo.appendChild(responsavel);
    }


    //Prioridade
    const prioridade = document.createElement('span');
    prioridade.innerText = 'Prioridade: ' + tarefa.prioridade;
    task_conteudo.appendChild(prioridade);

    //Nível
    const nivel = document.createElement('span');
    nivel.innerText = 'Nível: ' + tarefa.nivel;
    task_conteudo.appendChild(nivel);

    //Situação
    const situacao = document.createElement('span');
    situacao.innerText = 'Situação: ' + tarefa.situacao;
    task_conteudo.appendChild(situacao);

    //div btn
    const div_btn = document.createElement('div');
    div_btn.classList.add('task-btns')
    div_tarefa.appendChild(div_btn)

    //btn editar
    const btn_editar = document.createElement('button');
    btn_editar.innerHTML = '<i class="bx bx-edit"></i>'
    div_btn.appendChild(btn_editar);
    if (tarefa.situacao === 'Cancelada' || tarefa.situacao === 'Completa'){
        div_btn.removeChild(btn_editar)
    }
    btn_editar.onclick = async (event) => {
        event.preventDefault();
        window.scrollTo(0, 0);
        tarefa_id = tarefa.id

        criar_task.classList.add('toggle')
        editar_task.classList.remove('toggle')

        const form_create = document.querySelector('.form-situation')
        form_create.addEventListener("submit", async function(event){
            event.preventDefault();

            if (tarefa.situation === 'Cancelada'){
                alert("Apenas tarefas novas ou em andamento podem ser suspensas")
            }
            else {
                const selected = document.querySelector('input[name=situation]:checked').value
        
                const response = await fetch(baseURL+'/mudar_situacao/'+tarefa_id+'/'+selected, {method: 'PUT'});
                console.log(response)
                if (response.ok){
                    carregar_tasks()
                    editar_task.classList.add('toggle')
                    criar_task.classList.remove('toggle')
                }
            }
        })
    }

    //btn excluir
    const btn_excluir = document.createElement('button');
    btn_excluir.innerHTML = '<i class="bx bx-task-x"></i>';
    div_btn.appendChild(btn_excluir);

    btn_excluir.onclick = async (event) => {
        // chamar API método DELETE passando o ID URL
        event.preventDefault()
        const confirmou = confirm('Deseja mesmo excluir a tarefa?')

        if (!confirmou) {
            return
        }

        const response = await fetch(baseURL+'/'+tarefa.id, {method: 'DELETE'})

        // se deu certo..
        if (response.ok){
            alert('Tarefa removida com sucesso!')
            carregar_tasks()
        }
    }


    //btn completar
    const btn_completar = document.createElement('button');
    btn_completar.innerText = 'completar';
    div_btn.appendChild(btn_completar);
    if (tarefa.situacao === 'Cancelada'){
        div_btn.removeChild(btn_completar)
    }

    if (tarefa.situacao === 'Completa'){
        btn_completar.innerHTML = '<i class="bx bxs-check-circle"></i>'
        div_btn.appendChild(btn_completar)
    }
    else {
        btn_completar.classList.add('finish-task')
        btn_completar.innerHTML = '<i class="bx bx-check-circle"></i>'
        div_btn.appendChild(btn_completar)
        //completar task
        btn_completar.onclick = async (event) => {

            tarefa_id = tarefa.id
            event.preventDefault();

            if (tarefa.situacao != 'Em andamento'){
                alert("Apenas tasks 'Em andamento' podem ser concluídas")
            }

            else if (tarefa.situacao === 'Em andamento') {
                const confirmou = confirm('Deseja marcar como concluida a task selecionada?');
    
                if (!confirmou){
                    return
                }
        
                const response = await fetch(baseURL+'/'+tarefa_id+'/completar', {method: 'PUT'});
                console.log(response)
                if (response.ok){
                    carregar_tasks();
                }
            }

        }
    }


    return div_tarefa
}



//funções de funcionamento do script

function atualizar_tela() {
    task_Create.innerHTML = []

    for (let task of tasks){
        let mostrar_tarefa = exibir_tarefa(task)

        task_Create.appendChild(mostrar_tarefa)
    }

}

async function carregar_tasks(){
    const response = await fetch(baseURL);

    const status = response.status;
    tasks = await response.json()

    atualizar_tela()
}

//função para criar task a partir do form
function configurar_formulario() {
    const form_task = document.querySelector('.form-create')
    const level_Select = document.getElementById('level')
    const priority_Select = document.getElementById('priority')

    form_task.onsubmit = async function(event){

        event.preventDefault();
        
        const descricao = input_description.value;
        const responsavel = input_responsible.value;
        const nivel = Number(level_Select.options[level_Select.selectedIndex].text);
        const prioridade = Number(priority_Select.options[priority_Select.selectedIndex].text);

        const task = {descricao, responsavel, nivel, prioridade};

        const response = await fetch(baseURL+"/", {
                                                method: 'POST',
                                                body: JSON.stringify(task),
                                                headers: {'Content-Type': 'application/json'}
                                                }
                                    )
                                    console.log(response)
        if (response.status === 201){
            alert('Task adicionada com sucesso');
            carregar_tasks();
            form_task.reset()
        }else {
            alert('Não foi possível adicionar :(')
        }
    }
}

function app(){
    configurar_formulario();
    carregar_tasks();
}

app()
