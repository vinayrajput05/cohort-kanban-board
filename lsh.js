class LSHelper {

    #store;
    #pid;

    constructor(pid) {
        this.#store = JSON.parse(localStorage.getItem('store')) ?? []
        this.#pid = pid;
    }

    // Project methods
    fetchProjects() {
        return this.#store;
    }

    createProject(name, desc) {
        const pid = `pid-${this.#store?.length + 1}`;
        const createdAt = new Date();
        const project = {
            pid,
            name,
            desc,
            createdAt,
            tasks: [],
            boards: []
        }
        this.#store.push(project)
        localStorage.setItem('store', JSON.stringify(this.#store))
    }

    updateProject(index, name, desc) {
        this.#store[index].name = name;
        this.#store[index].desc = desc;
        localStorage.setItem('store', JSON.stringify(this.#store))
    }

    deleteProject(pid) {
        const index = this.#store.findIndex(item => item.pid === pid);
        this.#store.splice(index, 1)
        localStorage.setItem('store', JSON.stringify(this.#store))
    }

    fetchProject() {
        return this.#store.find(item => item.pid === this.#pid);
    }

    // Board methods
    createBoard(title, subtitle, color) {
        const project = this.#store.find(item => item.pid === this.#pid);
        project.boards.push({ title, subtitle, color })
        localStorage.setItem('store', JSON.stringify(this.#store))
    }

    updateBoard(index, title, subtitle, color) {
        const project = this.#store.find(item => item.pid === this.#pid);
        project.boards[index] = { title, subtitle, color };
        localStorage.setItem('store', JSON.stringify(this.#store))
    }

    deleteBoard(index) {
        const project = this.#store.find(item => item.pid === this.#pid);
        const board = project.boards.splice(index, 1)
        project.tasks = project.tasks.filter(item => item.board !== board[0].title)
        localStorage.setItem('store', JSON.stringify(this.#store))
    }

    // Task methods
    addTask(status, content) {
        const project = this.#store.find(item => item.pid === this.#pid);
        const createdAt = new Date();
        project.tasks.push({ status, content, createdAt })
        localStorage.setItem('store', JSON.stringify(this.#store))
    }

    deleteTask(index) {
        const project = this.#store.find(item => item.pid === this.#pid);
        project.tasks.splice(index, 1)
        localStorage.setItem('store', JSON.stringify(this.#store))
    }

    updateTaskStatus(index, status) {
        const project = this.#store.find(item => item.pid === this.#pid);
        project.tasks[index].status = status;
        localStorage.setItem('store', JSON.stringify(this.#store))
    }

    updateTask(index, content) {
        const project = this.#store.find(item => item.pid === this.#pid);
        project.tasks[index].content = content;
        localStorage.setItem('store', JSON.stringify(this.#store))
    }

    // File methods
    export() {
        try {
            const json = JSON.stringify(this.#store, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a')
            link.download = "kandan-board.json";
            link.href = url;
            link.click();
        } catch (error) {
            console.error('Failed to export', error);
        }
    }
    import(file) {
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = (evt) => {  // Use arrow function to keep "this"
            this.#store = JSON.parse(evt.target.result);
            localStorage.setItem('store', JSON.stringify(this.#store));
        };

        reader.onerror = () => {
            console.error('Error reading file');
        };
    }
}
export default LSHelper;
