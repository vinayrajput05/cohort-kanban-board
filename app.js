import LSHelper from "./lsh.js";

// DOM References
const projectList = document.getElementById('projectList');
const projectModal = document.getElementById('projectModal');
const projectInputName = document.getElementById('project-input-name');
const projectInputDesc = document.getElementById('project-input-desc');
const projectCreateBtn = document.getElementById('project-create-btn');
const createNewProjectBtn = document.getElementById('createNewProjectBtn');
// DOM References End

const lsHelper = new LSHelper();

function importData() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file')
    input.click();
    input.onchange = (e) => {
        lsHelper.import(e.target.files[0])
        setTimeout(showProjects, 100);
    }
}

function exportData() {
    lsHelper.export()
}
window.importData = importData;
window.exportData = exportData;

function showProjects() {
    const projects = lsHelper.fetchProjects();
    projectList.innerHTML = ''
    projects.forEach((project, index) => {
        const container = document.createElement('div');
        const leftContainer = document.createElement('div')
        const name = document.createElement('a')
        const desc = document.createElement('p')
        const rightContainer = document.createElement('div')
        const date = document.createElement('p')
        const btnEdit = document.createElement('button')

        btnEdit.addEventListener('click', function () {
            projectInputName.setAttribute('t-index', index)
            projectInputName.value = project.name;
            projectInputDesc.value = project.desc;
            projectCreateBtn.textContent = 'Update'
            toggleProjectModal()
        })

        const btnDelete = document.createElement('button')
        btnDelete.addEventListener('click', function () {
            lsHelper.deleteProject(project.pid);
            setTimeout(showProjects, 100);
        })

        container.classList.add('project-item')
        leftContainer.classList.add('left')
        name.classList.add('name')
        desc.classList.add('desc')
        rightContainer.classList.add('right')
        date.classList.add('date')
        btnEdit.className = 'action edit'
        btnDelete.className = 'action delete'

        const createdAt = new Date(project.createdAt)
            .toLocaleDateString(undefined, {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });

        name.href = `./task.html?pid=${project.pid}`
        name.setAttribute('target', 'blank')
        name.textContent = project.name;
        desc.textContent = project.desc;
        date.textContent = createdAt;
        btnEdit.textContent = 'Edit'
        btnDelete.textContent = 'Delete'

        leftContainer.appendChild(name)
        leftContainer.appendChild(desc)
        rightContainer.appendChild(date)
        rightContainer.appendChild(btnEdit)
        rightContainer.appendChild(btnDelete)
        container.appendChild(leftContainer)
        container.appendChild(rightContainer)
        projectList.appendChild(container)
    })
    
    if (projects.length === 0) {
        projectList.innerHTML = `<div class="empty-project">Create New Project</div>`
    }
}
showProjects()

function toggleProjectModal() {
    projectModal.classList.toggle('modal-active')
}
window.toggleProjectModal = toggleProjectModal;

function createProject() {
    const name = projectInputName.value;
    const desc = projectInputDesc.value;

    // validation
    if (name === '' || name.length === 0) {
        alert('Project name is required')
        return;
    }
    if (desc === '' || desc.length === 0) {
        alert('Project description is required')
        return;
    }

    const index = projectInputName.getAttribute('t-index')
    if (index !== null) {
        projectInputName.removeAttribute('t-index')
        lsHelper.updateProject(index, name, desc)
    } else {
        lsHelper.createProject(name, desc)
    }
    projectInputName.value = ''
    projectInputDesc.value = ''

    toggleProjectModal();
    showProjects();
}

projectCreateBtn.addEventListener('click', createProject)
createNewProjectBtn.addEventListener('click', () => {
    projectInputName.value = ''
    projectInputDesc.value = ''
    projectCreateBtn.textContent = 'Create'
    toggleProjectModal();
})