<template>
  <div class="login">
    <div class="login-page">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div>
          <input
              id="username"
              class="login-page-input"
              v-model="username"
              type="text"
              required
              pattern="[a-zA-Z]+"
              placeholder="Username"
          />
        </div>
        <div>
          <input
              id="phone"
              class="login-page-input"
              v-model="phone"
              type="text"
              required
              placeholder="Phone number"
          />
        </div>
        <button class="login-page-button" type="submit">Register</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
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

<style lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background: #545454;

  &-page {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 15px;
    background-color: #c3c3c3;

    &-input {
      margin: 7px 0;
      padding: 5px;
      border-radius: 10px;
      border: 1px solid #ddd;
    }

    &-button {
      margin: 7px 0;
      width: 100%;
      padding: 5px;
      border-radius: 10px;
      border: 1px solid #519945;
      background: #519945;
      color: #fff;
    }

    .error {
      color: red;
    }
  }
}
</style>
