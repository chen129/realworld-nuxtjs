<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>
            <nuxt-link
              v-if="profile.username === $store.state.user.username"
              to="/settings"
              class="btn btn-sm btn-outline-secondary action-btn"
            >
              <i class="ion-gear-a"></i>
              Edit Profile Settings
            </nuxt-link>
            <button
              v-else
              @click="handleFollow"
              class="btn btn-sm btn-outline-secondary action-btn"
            >
              <i class="ion-plus-round"></i>
              &nbsp;
              {{ profile.following ? 'Unfollow' : 'Follow' }} {{ profile.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  :class="['nav-link', { active: tab === 'my_articles' }]"
                  :to="{ name: 'profile', param: { username: profile.username }, query: { tab: 'my_articles' } }"
                  exact
                >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  :class="['nav-link', { active: tab === 'favorited_articles' }]"
                  :to="{ name: 'profile', param: { username: profile.username }, query: { tab: 'favorited_articles' } }"
                  exact
                >Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>
          <article-preview :articles="articles" />

          <nav>
            <ul class="pagination">
              <li
                class="page-item ng-scope"
                :class="{ active: page === item }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                  name: 'profile',
                  param: { username: profile.username },
                  query: {
                    page: item,
                    tab
                  }
                }"
                >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfiles, followUser, unfollowUser } from '@/api/user'
import { getArticles } from '@/api/article'
import ArticlePreview from '@/components/article-preview'

export default {
  name: 'Profile',
  middleware: 'authenticated',
  watchQuery: ['page', 'tab'],
  async asyncData ({ query, params }) {
    const tab = query.tab || 'my_articles'
    const page = Number.parseInt(query.page) || 1
    const limit = 20
    const username = params.username
    const author = tab === 'my_articles' ? 'author' : 'favorited'
    const [{ data: { articles, articlesCount } }, { data: { profile } }] = await Promise.all([
      getArticles({
        limit,
        offset: (page - 1) * limit,
        [author]: username
      }),
      getProfiles(username)
    ])
    // 防止用户在点赞接口未响应时重复点击
    articles.forEach(article => article.favoriteDisabled = false)

    return {
      tab,
      articles,
      articlesCount,
      page,
      limit,
      profile
    }
  },
  computed: {
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    async handleFollow () {
      const username = this.$route.params.username
      const { data: { profile: { following } } } = this.profile.following
        ? await unfollowUser(username)
        : await followUser(username)
      this.profile.following = following
    }
  },
  components: {
    ArticlePreview
  }
}
</script>

<style>
</style>
