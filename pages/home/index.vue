<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link
                  :class="['nav-link', { active: tab === 'your_feed' }]"
                  :to="{ name: 'home', query: { tab: 'your_feed' } }"
                  exact
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  :class="['nav-link', { active: tab === 'global_feed' }]"
                  :to="{ name: 'home', query: { tab: 'global_feed' } }"
                  exact
                >Global Feed</nuxt-link>
              </li>
              <li class="nav-item" v-if="tag">
                <nuxt-link
                  :class="['nav-link', { active: tab === 'tag' }]"
                  :to="{ name: 'home', query: { tab: 'tag', tag } }"
                  exact
                >#{{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link
                :to="{
                name: 'profile',
                params: {
                  username: article.author.username
                }
              }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="{
                name: 'profile',
                params: {
                  username: article.author.username
                }
              }"
                >{{ article.author.username }}</nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
                @click="onFavorited(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i>
                {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
              name: 'article',
              params: {
                slug: article.slug
              }
            }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          
          <div class="article-preview" v-if="!articles.length">
            No articles are here... yet.
          </div>

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
                  name: 'home',
                  query: {
                    page: item,
                    tag: $route.query.tag,
                    tab
                  }
                }"
                >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                :to="{
                  name: 'home',
                  query: { tag: tag, tab: 'tag' }
                }"
                class="tag-pill tag-default"
                v-for="tag in tags"
                :key="tag"
              >{{ tag }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getArticlesFeed, addFavorite, deleteFavorite } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  watchQuery: ['page', 'tag', 'tab'],
  async asyncData ({ query, store }) {
    const page = Number.parseInt(query.page) || 1
    const tag = query.tag
    const tab = query.tab
    const limit = 20
    const getArticlesList = store.state.user && tab === 'your_feed'
      ? getArticlesFeed
      : getArticles
    const [{ data: { articles, articlesCount } }, { data: { tags } }] = await Promise.all([
      getArticlesList({
        limit,
        offset: (page - 1) * limit,
        tag
      }),
      await getTags()
    ])

    // 防止用户在点赞接口未响应时重复点击
    articles.forEach(article => article.favoriteDisabled = false)

    return {
      articles,
      articlesCount,
      limit,
      page,
      tags,
      tag,
      tab: tab || 'global_feed'
    }
  },
  computed: {
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    },
    ...mapState(['user'])
  },
  methods: {
    async onFavorited (article) {
      article.favoriteDisabled = true
      if (article.favorited) {
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    }
  }
}
</script>

<style>
</style>
