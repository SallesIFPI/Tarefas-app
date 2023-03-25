from fastapi import APIRouter, HTTPException, status

from app.persistence.tarefa_mongodb_repositorio import TarefaMongoDBRepositorio

from ..viewmodels import Tarefa

routes = APIRouter()
prefix = '/tarefas'

#Banco de dados
tarefa_repositorio = TarefaMongoDBRepositorio()


#CRUD básico
@routes.get('/')
def todas_tarefas(skip: int | None = 0, take: int | None = 0):
    return tarefa_repositorio.todos(skip, take)


@routes.get('/{tarefa_id}')
def obter_tarefa(tarefa_id: int | str):
    tarefa = tarefa_repositorio.obter_um(tarefa_id)

    #fail fast
    if not tarefa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Não há tarefa com id = {tarefa_id}")

    return tarefa
    

@routes.post('/', status_code=status.HTTP_201_CREATED)
def criar_tarefa(tarefa: Tarefa):
    tarefa.situacao = "Nova"
    return tarefa_repositorio.salvar(tarefa)


@routes.delete('/{tarefa_id}', status_code=status.HTTP_204_NO_CONTENT)
def excluir_tarefa(tarefa_id: int | str):
    tarefa = tarefa_repositorio.obter_um(tarefa_id)

    if not tarefa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='Tarefa não encontrada')
    
    return tarefa_repositorio.remover(tarefa_id)


@routes.put('/{tarefa_id}')
def atualizar_tarefa(tarefa_id: int | str, tarefa: Tarefa):
    tarefa_encontrada = tarefa_repositorio.obter_um(tarefa_id)

    if not tarefa_encontrada:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='Tarefa não encontrada')
    
    return tarefa_repositorio.atualizar(tarefa_id, tarefa)


@routes.put('/mudar_situacao/{tarefa_id}/{situacao}')
def mudar_situacao(tarefa_id: int | str, situacao: str):
    tarefa_encontrada = tarefa_repositorio.obter_um(tarefa_id)

    if not tarefa_encontrada:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='Tarefa não encontrada')
    
    return tarefa_repositorio.mudar_situacao(tarefa_id, situacao)


@routes.put('/{tarefa_id}/completar')
def completar(tarefa_id: int | str):
    tarefa_encontrada = tarefa_repositorio.obter_um(tarefa_id)

    if not tarefa_encontrada:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='Tarefa não encontrada')
    
    return tarefa_repositorio.completar_tarefa(tarefa_id)


#Métodos para obter tarefa por situação, nivel ou prioridade
@routes.get('/nivel/{nivel}')
def pesquisar_nivel(nivel: int):
    return tarefa_repositorio.por_nivel(nivel)


@routes.get('/prioridade/{prioridade}')
def pesquisar_prioridade(prioridade: int):
    return tarefa_repositorio.por_prioridade(prioridade)


@routes.get('/situacao/{situacao}')
def pesquisar_situacao(situacao: str):
    return tarefa_repositorio.por_situacao(situacao)
