import { linksToPath } from "@/utils/urlUtils";
import { removeDuplicatesByKey } from "@/utils/generalUtils";

import toastMixin from "@/mixins/toastMixin";

import { getNextPage } from "@/services/generalService";

export const getApiState = (defaultData) => {
  return {
    data: defaultData,
    meta: null,
    loading: false,
    error: null,
    is404: false,
  };
};

export default {
  mixins: [toastMixin],
  methods: {
    async $fetchApiData(
      state,
      service,
      defaultData = null,
      showErrorToast = true
    ) {
      Object.assign(state, getApiState(defaultData));
      state.loading = true;
      const response = await service();
      state.loading = false;

      if (response.error)
        return this.$handleApiError(state, response, showErrorToast);

      if (response.data)
        return this.$handleApiPaginationSuccess(state, response);
      this.$handleApiFetchSuccess(state, response);
    },
    $handleApiPaginationSuccess(state, response) {
      const { data, ...meta } = response;
      state.data = data;
      state.meta = meta;

      if (state.meta.links)
        state.links = linksToPath(this.$route.path, state.meta.links);
    },
    $handleApiFetchSuccess(state, response) {
      state.data = response;
    },
    $handleApiError(state, response, showErrorToast) {
      state.error = response.error;

      if (response.status == 404) state.is404 = true;
      if (showErrorToast) this.$displayError(response);
    },
    async $postApiData(
      state,
      service,
      showSuccessToast = true,
      showErrorToast = true
    ) {
      state.error = null;
      state.loading = true;
      const response = await service();
      state.loading = false;

      if (response.error)
        return this.$handleApiError(state, response, showErrorToast);

      if (response.message && showSuccessToast)
        return this.$displayServerResponse(response);

      return response;
    },
    async $fetchNextPageApi(state) {
      if (!state.meta?.next_page_url) return;

      state.loading = true;
      const response = await getNextPage(state.meta.next_page_url);
      state.loading = false;

      if (response.error) return this.$handleApiError(state, response, true);

      const { data, ...meta } = response;

      state.data = removeDuplicatesByKey([...state.data, ...data], "id");
      state.meta = meta;
    },
  },
};
