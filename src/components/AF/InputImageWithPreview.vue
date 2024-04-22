<template>
  <div class="mb-3">
    <label>{{ label }}</label>
    <div
      :key="imagePreview"
      v-if="imgPreview && !error"
      class="position-relative pb-2"
    >
      <img
        :src="imgPreview"
        class="rounded-card shadow-sm"
        style="width: 40%"
      />
    </div>
    <div class="position-relative">
      <input
        type="file"
        class="form-control w-100"
        :class="{ 'is-invalid': error }"
        :accept="types"
        @change="handleImage"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "InputImageWithPreview",

  props: {
    types: {
      type: String,
      default: "image/jpeg, image/jpg, image/png, image/gif",
    },
    error: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "Image (max:10MB, jpeg, jpg, png, gif):",
    },
    imagePreview: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      imgPreview: null,
      image: null,
    };
  },

  mounted() {
    this.imgPreview = this.imagePreview;
  },

  methods: {
    handleImage(e) {
      this.image = e.target.files[0];
      if (this.image) {
        this.imgPreview = URL.createObjectURL(this.image);
      }
      this.$emit("on-image", this.image);
    },
  },
};
</script>
