<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="user.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.email"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
import { updateUser } from '@/api/user'

export default {
  name: 'Settings',
  middleware: 'authenticated',
  data () {
    return {
      user: {
        image: '',
        email: '',
        username: '',
        password: '',
        image: '',
        bio: ''
      }
    }
  },
  created () {
    Object.keys(this.user).forEach(key => {
      this.user[key] = this.$store.state.user[key]
    })
  },
  methods: {
    async onSubmit () {
      const { data: { user } } = await updateUser({
        user: this.user
      })
      this.$store.commit('setUser', user)
      Cookie.set('user', user)
      this.$router.push({
        name: 'profile',
        params: {
          username: user.username
        }
      })
    }
  }
}
</script>

<style>
</style>