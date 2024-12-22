<template>
  <div class="login-page">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input
            id="username"
            v-model="username"
            type="text"
            required
            pattern="[a-zA-Z]+"
            placeholder="Enter username"
        />
      </div>
      <div>
        <label for="phone">Phone Number:</label>
        <input
            id="phone"
            v-model="phone"
            type="text"
            required
            placeholder="Enter phone number"
        />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      phone: '',
      error: null,
    };
  },
  methods: {
    async login() {
      try {
        const { data: users } = await axios.get('https://jsonplaceholder.typicode.com/users');
        const user = users.find(({ username, phone }) => username === this.username && phone === this.phone);
        if (user) {
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          this.$router.push('/data');
        } else {
          this.error = 'Invalid username or phone number.';
        }
      } catch (err) {
        this.error = 'Failed to connect to the server.';
      }
    },
  },
};
</script>

<style>
.login-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.error {
  color: red;
}
</style>
