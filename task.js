import LSHelper from "./lsh.js";

const pid = window.location.search.slice(5)
const lsHelper = new LSHelper(pid);

const projectName = document.getElementById('projectName')
const boards = document.querySelectorAll('.board')
boards.forEach(board => {
    let timeoutId = null
    board.addEventListener('dragleave', () => {
        const item = document.querySelector('.dragging')
        board.querySelector('.board-items').appendChild(item)
        const index = item.getAttribute('t-index');
        const status = board.getAttribute('data-status');
        item.querySelector('.status').textContent = status;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            lsHelper.updateTaskStatus(index, status)
        }, 1000)
    })
})

function createList(task, index) {
    const listContainer = document.getElementById(`${task.status}Items`);

    const container = document.createElement('div');
    container.setAttribute('t-index', index)
    container.setAttribute('draggable', 'true')
    container.classList.add('container');

    container.addEventListener('dragstart', function () {
        container.classList.add('dragging')
    })
    container.addEventListener('dragend', function () {
        container.classList.remove('dragging')
    })

    const leftDiv = document.createElement('div');
    const h5 = document.createElement('h5');
    const p = document.createElement('p');
    h5.classList.add('status')
    h5.textContent = task.status;
    p.classList.add('content')
    p.textContent = task.content
    leftDiv.appendChild(h5)
    leftDiv.appendChild(p)

    const rightDiv = document.createElement('div');
    const editBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');
    editBtn.classList.add('edit')
    editBtn.innerHTML = `<i class='bx bx-edit'></i>`
    editBtn.addEventListener('click', function () {
        listContainer.nextElementSibling.firstElementChild.value = task.content;
        listContainer.nextElementSibling.firstElementChild.setAttribute('t-index', index);
    })

    deleteBtn.classList.add('delete')
    deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`
    deleteBtn.addEventListener('click', function () {
        lsHelper.deleteTask(index)
        showTask()
    })
    rightDiv.appendChild(editBtn)
    rightDiv.appendChild(deleteBtn)

    container.appendChild(leftDiv)
    container.appendChild(rightDiv)
    listContainer.appendChild(container)

}

function showTask() {
    const project = lsHelper.fetchProject()
    projectName.textContent = `${project.name}`

    document.getElementById('todoItems').innerHTML = '';
    document.getElementById('inProgressItems').innerHTML = '';
    document.getElementById('doneItems').innerHTML = '';
    project.tasks.forEach((task, index) => createList(task, index))
}
showTask()

function addNewTask(e, type) {
    const input = e.previousElementSibling
    if (input.value === '' || input.value.length === 0) {
        alert("You can't add empty")
    }

    const index = input.getAttribute('t-index')
    if (index !== null) {
        input.removeAttribute('t-index')
        lsHelper.updateTask(index, input.value)
    } else {
        lsHelper.addTask(type, input.value)
    }
    input.value = ''
    showTask()
}
window.addNewTask = addNewTask;