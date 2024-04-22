export default {
  methods: {
    $displayServerResponse(response) {
      if (response.error && Array.isArray(response.error))
        return this.$displayResponseDetailedError(response);
      if (response.error) return this.$displayErrorToast(response.error);
      if (response.message) this.$displaySuccessToast(response.message);
    },
    $displayErrorToast(message) {
      this.$toast.open({
        message,
        type: "error",
      });
    },
    $displaySuccessToast(message) {
      this.$toast.open({
        message,
        type: "success",
      });
    },
    $clearAllToast() {
      this.$toast.clear();
    },
    $displayError(response) {
      if (
        response.errors &&
        typeof response.errors === "object" &&
        !Array.isArray(response.errors)
      )
        return this.$displayResponseDetailedError(response);

      const errors = response.errors ? response.errors : response.error.message;
      return this.$displayErrorToast(errors ? errors : response.error);
    },
    $displayResponseDetailedError(response) {
      for (const key in response.errors)
        for (const error of response.errors[key])
          this.$displayErrorToast(error);
    },
  },
};
