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
import { getArticles, getArticlesFeed } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'
import ArticlePreview from '@/components/article-preview'

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
  components: {
    ArticlePreview
  }
}
</script>

<style>
</style>
