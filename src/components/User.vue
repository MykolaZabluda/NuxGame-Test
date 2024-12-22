<template>
  <div class="data-page">
    <section v-if="user">
      <h2>Welcome, {{ user.name }}</h2>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Phone:</strong> {{ user.phone }}</p>
      <p><strong>Address:</strong> {{ user.address.street }}, {{ user.address.city }}</p>
      <p><strong>Company:</strong> {{ user.company.name }}</p>
    </section>

    <section class="todo-section">
      <h3>Todo List</h3>

      <div class="filters">
        <select v-model="filters.status">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="uncompleted">Uncompleted</option>
          <option value="favorites">Favorites</option>
        </select>

        <select v-model="filters.userId">
          <option value="all">All Users</option>
          <option v-for="id in userIds" :key="id" :value="id">User {{ id }}</option>
        </select>

        <input
            v-model="filters.search"
            type="text"
            placeholder="Search by title..." />
      </div>

      <ul>
        <li v-for="todo in filteredTodos" :key="todo.id">
          <label>
            <input type="checkbox" v-model="todo.completed" disabled />
            {{ todo.title }}
          </label>
          <button @click="toggleFavorite(todo.id)">
            {{ isFavorite(todo.id) ? 'Unfavorite' : 'Favorite' }}
          </button>
        </li>
      </ul>

      <div class="create-todo">
        <h4>Create Todo</h4>
        <input v-model="newTodo.userId" type="number" placeholder="User ID" />
        <input v-model="newTodo.title" type="text" placeholder="Title" />
        <button @click="addTodo">Add</button>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: null,
      todos: [],
      filters: {
        status: 'all',
        userId: 'all',
        search: '',
      },
      newTodo: {
        userId: '',
        title: '',
      },
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    };
  },
  computed: {
    userIds() {
      return [...new Set(this.todos.map(todo => todo.userId))];
    },
    filteredTodos() {
      const { status, userId, search } = this.filters;
      const lowerCaseSearch = search.toLowerCase();

      return this.todos.filter(todo => {
        const isFavorite = this.favorites.includes(todo.id);

        const matchesStatus = {
          all: true,
          completed: todo.completed,
          uncompleted: !todo.completed,
          favorites: isFavorite,
        }[status];

        const matchesUserId = userId === 'all' || todo.userId === parseInt(userId);
        const matchesSearch = todo.title.toLowerCase().includes(lowerCaseSearch);

        return matchesStatus && matchesUserId && matchesSearch;
      });
    },

  },
  methods: {
    async fetchUser() {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      if (loggedInUser) {
        this.user = loggedInUser;
      } else {
        this.$router.push('/');
      }
    },
    async fetchTodos() {
      const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos');
      this.todos = data;
    },
    toggleFavorite(id) {
      if (this.favorites.includes(id)) {
        this.favorites = this.favorites.filter(favId => favId !== id);
      } else {
        this.favorites.push(id);
      }
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    async addTodo() {
      const { userId, title } = this.newTodo;

      if (!userId || !title) {
        return;
      }

      try {
        const body = { userId, title, completed: false };

        const { data } = await axios.post('https://jsonplaceholder.typicode.com/todos', body);

        this.todos.push(data);
        Object.assign(this.newTodo, { userId: '', title: '' });
      } catch (error) {
        alert('Failed to create Todo');
      }
    },
    isFavorite(id) {
      return this.favorites.includes(id);
    },
  },
  async created() {
    await this.fetchUser();
    await this.fetchTodos();
  },
};
</script>

<style>
.data-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.todo-section ul {
  list-style: none;
  padding: 0;
}
.todo-section li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
}
.create-todo {
  margin-top: 20px;
}
.create-todo input {
  margin-right: 10px;
}
</style>
