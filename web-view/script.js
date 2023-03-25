baseURL = 'http://127.0.0.1:8000/tarefas'

// Elementos
const task_Create = document.querySelector('.task-list');
const input_description = document.querySelector('#form-description')
const input_responsible = document.querySelector('#form-responsible')
const criar_task = document.querySelector('.criar-task');
const editar_task = document.querySelector('.editar-task');

let tasks = [];

//funções

function mostrar_task(tarefa){
    const task_div = document.createElement('div')
    task_div.classList.add('task')

    const task_conteudo = document.createElement('div')
    task_conteudo.classList.add('task-content')

    const description = document.createElement('h3')
    description.innerText = tarefa.descricao
    task_conteudo.appendChild(description)

    const responsible = document.createElement('h5')
    if (tarefa.resposavel != null){
        responsible.innerText = `Responsible: ${tarefa.responsavel}`
        task_conteudo.appendChild(responsible)
    }

    const level = document.createElement('span')
    level.innerText = `Level: ${tarefa.nivel}`
    task_conteudo.appendChild(level)

    const situation = document.createElement('span')
    situation.innerText = `Situation: ${tarefa.situacao}`
    if (tarefa.situacao === 'Completa'){
        task_div.classList.add('done')
    }
    else if (tarefa.situacao === 'Cancelada'){
        task_div.classList.add('cancel')
    }
    task_conteudo.appendChild(situation)
        
    const priority = document.createElement('span')
    priority.innerText = `Priority: ${tarefa.prioridade}`
    task_conteudo.appendChild(priority)

    task_div.appendChild(task_conteudo)

    return task_div
}

function btns_task(task) {
    criar_btns_div = document.createElement('div')
    criar_btns_div.classList.add('task-btns')

    if (task.situacao === 'Cancelada'){

    }

    //botões da div task
    const done_btn = document.createElement("button")
    if (task.situacao === 'Completa'){
        done_btn.innerHTML = '<i class="bx bxs-check-circle"></i>'
        criar_btns_div.appendChild(done_btn)
    }
    else {
        done_btn.classList.add('finish-task')
        done_btn.innerHTML = '<i class="bx bx-check-circle"></i>'
        //completar task
        done_btn.onclick = async (event) => {
            event.preventDefault();

            if (task.situacao != 'Em andamento'){
                alert("Apenas tasks 'Em andamento' podem ser concluídas")
            }

            else if (task.situacao === 'Em andamento') {
                const confirmou = confirm('Deseja marcar como concluida a tasks selecionada?');
    
                if (!confirmou){
                    return
                }
        
                const response = await fetch(baseURL+'/'+task.id+'/completar', {method: 'PUT'});
                console.log(response)
                if (response.ok){
                    carregar_tasks();
                }
            }

        }

        criar_btns_div.appendChild(done_btn)
    }
    
    //edit btn
    const edit_btn = document.createElement("button")
    edit_btn.classList.add('edit-task')
    edit_btn.innerHTML = '<i class="bx bx-edit"></i>'
    criar_btns_div.appendChild(edit_btn)
    if (task.situacao === 'Completa' || task.situacao=== 'Cancelada'){
        edit_btn.parentNode.removeChild(edit_btn);
    }

    edit_btn.onclick = async (event) => {
        event.preventDefault()
        criar_task.classList.add('toggle')
        editar_task.classList.remove('toggle')

        const form_create = document.querySelector('.form-situation')
        form_create.addEventListener("submit", async function(event){


            event.preventDefault();

            if (task.situation === 'Canceled'){
                alert("Only new or in progress tasks can be in suspend")
            }
            else {
                const selected = document.querySelector('input[name=situation]:checked').value
        
                const response = await fetch(baseURL+'/mudar_situacao/'+task.id+'/'+selected, {method: 'PUT'});
                console.log(response)
                if (response.ok){
                    carregar_tasks()
                    editar_task.classList.add('toggle')
                    criar_task.classList.remove('toggle')
                }
            }
        })
    }

    //delete btn
    const delete_btn = document.createElement("button")
    delete_btn.classList.add('remove-task')
    delete_btn.innerHTML = '<i class="bx bx-task-x"></i>'

    delete_btn.onclick = async (event) => {
        event.preventDefault();
        const confirmou = confirm('Deseja remover a task selecionada?');

        if (!confirmou){
            return
        }

        const response = await fetch(baseURL+'/'+task.id, {method: 'DELETE'});

        if (response.ok){
            alert('Task removida com sucesso!');
            carregar_tasks();
        }
    }

    criar_btns_div.appendChild(delete_btn)

    return criar_btns_div
} 


//funções de funcionamento do script

function atualizar_tela() {
    task_Create.innerHTML = []

    for (let task of tasks){
        var task_criada = mostrar_task(task)
        var btns = btns_task(task)

        task_Create.appendChild(task_criada)
        task_criada.appendChild(btns)
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
