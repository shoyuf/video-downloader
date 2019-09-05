<template>
  <div class="download-video">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item
        label="URL"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'url',
            {
              rules: [
                {
                  required: true,
                  message: 'Please input your URL!'
                },
                {
                  type: 'url',
                  message: 'Please input correct URL!'
                }
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item
        label="Download Tool"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-radio-group
          v-decorator="[
            'download-tool',
            {
              initialValue: 'youtube-dl',
              rules: [{ required: true }]
            }
          ]"
        >
          <a-radio value="annie">
            annie
          </a-radio>
          <a-radio value="youtube-dl">
            youtube-dl
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit" @click="handleSubmit">
          Test Download
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this)
    };
  },
  methods: {
    async handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        } else {
          this.handleTestDownload({
            // url,
            type: values["download-tool"]
          });
        }
      });
    }
    // handleTestDownload({ type }) {
    //   if (type === "youtube-dl") {
    //   }
    // },
    // handleSelectChange() {}
  }
};
</script>

<style></style>
