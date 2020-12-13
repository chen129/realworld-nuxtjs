<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  required
                  minlength="1"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.description"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  required
                  minlength="1"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="article.body"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  required
                  minlength="1"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="tag"
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  @keydown.enter.prevent="addTag"
                />
                <div class="tag-list">
                  <span
                    class="tag-default tag-pill"
                    v-for="(item, index) in article.tagList"
                    :key="item"
                  >
                    <i class="ion-close-round" @click="deleteTag(index)"></i>
                    {{ item }}
                  </span>
                </div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="submit">Publish Article</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addArticles } from '@/api/article'

export default {
  name: 'Editor',
  middleware: 'authenticated',
  data () {
    return {
      tag: '',
      article: {
        title: '',
        description: '',
        body: '',
        tagList: []
      }
    }
  },
  methods: {
    deleteTag (index) {
      this.article.tagList.splice(index, 1)
    },
    addTag () {
      if (this.article.tagList.includes(this.tag)) return
      this.article.tagList.push(this.tag)
      this.tag = ''
    },
    async onSubmit () {
      try {
        await addArticles({
          article: this.article
        })
        this.$router.push('/')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
</style>