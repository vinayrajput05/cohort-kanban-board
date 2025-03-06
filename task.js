import LSHelper from "./lsh.js";

const pid = window.location.search.slice(5)
const lsHelper = new LSHelper(pid);

const projectName = document.getElementById('projectName')
const boardModal = document.getElementById('boardModal');
const boardInputColor = document.getElementById('boardInputColor');
const boardInputTitle = document.getElementById('boardInputTitle');
const boardInputSubtitle = document.getElementById('boardInputSubtitle');
const boardCreateBtn = document.getElementById('boardCreateBtn');
const createNewBoardBtn = document.getElementById('createNewBoardBtn');
const boardList = document.querySelector('.board-list')

function createList(items, tasks, ids) {
    tasks && tasks.forEach((task, i) => {
        const index = ids.index;
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

        const now = new Date(task.createdAt);
        const dateTime = now.toLocaleDateString(undefined, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })

        const leftDiv = document.createElement('div');
        const time = document.createElement('small');
        const p = document.createElement('p');
        time.classList.add('status')
        time.textContent = dateTime;
        p.classList.add('content')
        p.textContent = task.content
        leftDiv.appendChild(time)
        leftDiv.appendChild(p)

        const rightDiv = document.createElement('div');
        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');

        rightDiv.style.display = 'flex'

        editBtn.classList.add('edit')
        editBtn.innerHTML = `<i class='bx bx-edit'></i>`
        editBtn.addEventListener('click', function () {
            items.nextElementSibling.firstElementChild.value = task.content;
            items.nextElementSibling.lastElementChild.textContent = 'Update Task';
            items.nextElementSibling.firstElementChild.setAttribute('t-index', index);
        })

        deleteBtn.classList.add('delete')
        deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`
        deleteBtn.addEventListener('click', function () {
            lsHelper.deleteTask(index)
            showBoard()
        })
        rightDiv.appendChild(editBtn)
        rightDiv.appendChild(deleteBtn)

        container.appendChild(leftDiv)
        container.appendChild(rightDiv)
        items.appendChild(container)
        ids.index++;
    })
}

function showBoard() {
    const project = lsHelper.fetchProject()
    projectName.textContent = `${project.name}`

    const groupedTasks = project.tasks.reduce((grouped, task) => {
        grouped[task.status] = grouped[task.status] || []
        grouped[task.status].push(task)
        return grouped;
    }, {});

    boardList.innerHTML = '';
    const ids = { index: 0 };
    project.boards.forEach((boardItem, index) => {
        const key = boardItem.title.toLowerCase()
        const board = document.createElement('div')
        const header = document.createElement('div')
        const headerLeft = document.createElement('div')
        const headerRight = document.createElement('div')
        const title = document.createElement('p')
        const subtitle = document.createElement('p')
        const items = document.createElement('div')
        const footer = document.createElement('div')
        const input = document.createElement('input')
        const button = document.createElement('button')
        const editBoard = document.createElement('button')
        const deleteBoard = document.createElement('button')

        board.classList.add('board');
        board.style.backgroundColor = boardItem.color;
        header.classList.add('board-header');
        title.classList.add('board-title');
        subtitle.classList.add('board-subtitle');
        items.classList.add('board-items');
        footer.classList.add('board-footer');

        if (groupedTasks[key]?.length) {
            title.textContent = `${boardItem.title} (${groupedTasks[key]?.length})`
        } else {
            title.textContent = boardItem.title
        }
        subtitle.textContent = boardItem.subtitle;
        editBoard.innerHTML = `<i class='bx bx-pencil'></i>`;
        deleteBoard.innerHTML = `<i class='bx bx-trash-alt' ></i>`;
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Write here...');
        button.setAttribute('onclick', `addNewTask(this,'${key}')`)
        button.textContent = 'Add Task';
        editBoard.classList.add('edit-board')
        deleteBoard.classList.add('delete-board')

        editBoard.addEventListener('click', function () {
            boardInputTitle.setAttribute('t-index', index)
            boardInputTitle.value = boardItem.title;
            boardInputSubtitle.value = boardItem.subtitle;
            boardInputColor.value = boardItem.color;
            boardCreateBtn.textContent = 'Update'
            toggleBoardModal()
        })

        deleteBoard.addEventListener('click', function () {
            lsHelper.deleteBoard(index);
            setTimeout(showBoard, 100);
        })

        let timeoutId = null
        board.addEventListener('dragleave', () => {
            const item = document.querySelector('.dragging')
            board.querySelector('.board-items').appendChild(item)
            const index = item.getAttribute('t-index');
            const status = board.getAttribute('data-status');

            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                lsHelper.updateTaskStatus(index, status)
            }, 1000)
        })

        headerLeft.appendChild(title)
        headerLeft.appendChild(subtitle)
        headerRight.appendChild(editBoard)
        headerRight.appendChild(deleteBoard)
        header.appendChild(headerLeft)
        header.appendChild(headerRight)
        footer.appendChild(input)
        footer.appendChild(button);
        board.appendChild(header)
        board.appendChild(items)
        board.appendChild(footer)
        boardList.appendChild(board)
        createList(items, groupedTasks[key], ids)
    })
    if (project.boards.length === 0) {
        boardList.innerHTML = `<div class="empty-task">Create New Board</div>`
    }

}
showBoard()

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
    showBoard()
}
window.addNewTask = addNewTask;

function toggleBoardModal() {
    boardModal.classList.toggle('modal-active')
}
window.toggleBoardModal = toggleBoardModal;

function createBoard() {
    const color = boardInputColor.value;
    const title = boardInputTitle.value;
    const subtitle = boardInputSubtitle.value;

    // validation
    if (title === '' || title.length === 0) {
        alert('Board title is required')
        return;
    }
    if (subtitle === '' || subtitle.length === 0) {
        alert('Board subtitle is required')
        return;
    }

    const index = boardInputTitle.getAttribute('t-index')
    if (index !== null) {
        boardInputTitle.removeAttribute('t-index')
        lsHelper.updateBoard(index, title, subtitle, color)
    } else {
        lsHelper.createBoard(title, subtitle, color)
    }
    boardInputColor.value = ''
    boardInputTitle.value = ''
    boardInputSubtitle.value = ''

    toggleBoardModal();
    showBoard();
}

boardCreateBtn.addEventListener('click', createBoard)
createNewBoardBtn.addEventListener('click', () => {
    boardInputTitle.value = ''
    boardInputSubtitle.value = ''
    boardCreateBtn.textContent = 'Create'
    toggleBoardModal();
})