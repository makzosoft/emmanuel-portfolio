// ============================================
// Academic Planner
// In-memory task list, demonstrates arrays, functions,
// event handling, and dynamic DOM updates.
//
// Note: task creation is bound directly to the button's
// click event (and Enter on the input) rather than the
// form's submit event, so it keeps working even inside
// restricted/sandboxed viewers that block form submission.
// ============================================

(function () {
  var tasks = []; // array of { id, text, done }
  var nextId = 1;

  var form = document.getElementById('taskForm');
  var input = document.getElementById('taskInput');
  var addBtn = document.getElementById('addTaskBtn');
  var list = document.getElementById('taskList');
  var emptyState = document.getElementById('emptyState');
  var statTotal = document.getElementById('statTotal');
  var statPending = document.getElementById('statPending');
  var statDone = document.getElementById('statDone');

  if (!input || !addBtn) return; // not on the planner page

  // Belt-and-braces: prevent any native form submission from reloading
  // the page, but the real "add" logic lives in the handlers below.
  if (form) {
    form.addEventListener('submit', function (e) { e.preventDefault(); });
  }

  addBtn.addEventListener('click', function (e) {
    e.preventDefault();
    handleAdd();
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  });

  function handleAdd() {
    addTask(input.value);
    input.value = '';
    input.focus();
  }

  function addTask(rawText) {
    var text = rawText.trim();
    if (!text) return;

    tasks.push({ id: nextId++, text: text, done: false });
    render();
  }

  function toggleTask(id) {
    var task = findTask(id);
    if (task) task.done = !task.done;
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    render();
  }

  function findTask(id) {
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === id) return tasks[i];
    }
    return null;
  }

  function render() {
    list.innerHTML = '';

    if (tasks.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      tasks.forEach(function (task) {
        list.appendChild(buildTaskElement(task));
      });
    }

    updateStats();
  }

  function buildTaskElement(task) {
    var item = document.createElement('div');
    item.className = 'task-item' + (task.done ? ' done' : '');

    var check = document.createElement('button');
    check.type = 'button';
    check.className = 'task-check';
    check.setAttribute('aria-label', task.done ? 'Mark as not done' : 'Mark as done');
    check.textContent = task.done ? '✓' : '';
    check.addEventListener('click', function () { toggleTask(task.id); });

    var text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    var tag = document.createElement('span');
    tag.className = 'task-tag';
    tag.textContent = task.done ? 'done' : 'pending';

    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'task-delete';
    del.setAttribute('aria-label', 'Delete task: ' + task.text);
    del.textContent = '✕';
    del.addEventListener('click', function () { deleteTask(task.id); });

    item.appendChild(check);
    item.appendChild(text);
    item.appendChild(tag);
    item.appendChild(del);
    return item;
  }

  function updateStats() {
    var done = tasks.filter(function (t) { return t.done; }).length;
    statTotal.textContent = tasks.length;
    statDone.textContent = done;
    statPending.textContent = tasks.length - done;
  }

  // Seed a couple of example tasks so the panel is not empty on first load
  addTask('Finish COS 106 term project');
  addTask('Review JavaScript DOM notes');
  tasks[1].done = true;
  render();
})();
