<template>
  <div class="bg-light px-4 pt-4">
    <div
      v-if="!items.length"
      class="rounded-card gray-container text-light-gray py-4"
    >
      <div class="pb-2 mt-4 text-center">
        <FolderOutline :size="100" />
      </div>
      <h3 class="col-12 pb-1 my-4 text-center">No advert found</h3>
    </div>
    <template v-else>
      <draggable
        v-if="isDraggable"
        :list="items"
        tag="div"
        :group="{ name: 'row' }"
        v-bind="dragOptions"
        class="row wrap justify-space-around"
        @change="change"
      >
        <div
          v-for="(item, key) in items"
          :key="item.title"
          class="col-3 position-relative"
        >
          <div class="bg-primary small text-light p-1">
            {{ item.name }}
          </div>
          <div class="img-wrapper mb-4">
            <div class="caption position-relative">
              <img :src="`${item.img}`" />
              <div class="rounded-circle bg-light px-3 priority">
                {{ key + 1 }}
              </div>
            </div>
            <div class="action-button">
              <div class="text-light bg-primary d-inline-block py-1 px-2">
                <router-link
                  :to="{ name: 'af-adverts-edit', params: { id: item.id } }"
                  class="text-light"
                >
                  <pen class="cursor-pointer" :size="20" />
                </router-link>
              </div>
              <div
                class="text-light bg-danger d-inline-block wrapper-btn-trash py-1 px-2"
              >
                <trash-can
                  class="cursor-pointer"
                  :size="20"
                  @click="onItemDelete(item)"
                />
              </div>
            </div>
          </div>
        </div>
      </draggable>

      <div v-else class="row">
        <div
          v-for="item in items"
          :key="item.title"
          class="col-3 position-relative"
        >
          <div class="bg-primary small text-light p-1">
            {{ item.name }}
          </div>
          <div class="img-wrapper mb-4">
            <div class="caption position-relative py-3">
              <img :src="`${item.img}`" />
            </div>
            <div class="action-button">
              <div class="text-light bg-primary d-inline-block py-1 px-2">
                <router-link
                  :to="{ name: 'af-adverts-edit', params: { id: item.id } }"
                  class="text-light"
                >
                  <pen class="cursor-pointer" :size="20" />
                </router-link>
              </div>
              <div
                class="text-light bg-danger d-inline-block wrapper-btn-trash py-1 px-2"
              >
                <trash-can
                  class="cursor-pointer"
                  :size="20"
                  @click="onItemDelete(item)"
                />
              </div>
            </div>
          </div>
        </div>

        <Observer
          v-if="showObserver"
          :on-observed="onListEnd"
          :custom-css="observerCustomCss"
        />
      </div>
    </template>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Observer from "@/components/Misc/Observer";
import Pen from "vue-material-design-icons/Pen";
import TrashCan from "vue-material-design-icons/TrashCan";
import FolderOutline from "vue-material-design-icons/FolderOutline";

export default {
  name: "AdvertTable",
  components: {
    draggable,
    Observer,
    Pen,
    TrashCan,
    FolderOutline,
  },
  props: {
    items: { type: Array },
    isDraggable: { type: Boolean },
  },
  data() {
    return {
      showObserver: true,
      observerCustomCss:
        "height: 0px; width: 50px; position: relative; bottom: 20px",
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  watch: {
    items() {
      setTimeout(() => {
        this.showObserver = true;
      }, 100);
    },
  },
  methods: {
    change() {
      this.$emit("on-drag-drop", this.items);
    },
    onListEnd() {
      this.$emit("on-list-end");
      this.showObserver = false;
    },
    onItemDelete(item) {
      this.$emit("on-item-delete", item);
    },
  },
};
</script>
<style lang="scss" scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.img-wrapper {
  height: 100%;
  width: 100%;
  max-height: 200px;
}

.action-button {
  position: absolute;
  bottom: 24px;
  right: 12px;
}

.wrapper-btn-trash:hover {
  color: #cbd3da !important;
}

.caption {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-size: 19px;
  height: 200px;
  width: 100%;
  img {
    max-height: 100%;
    width: 100%;
    position: absolute;
    object-fit: cover;
  }
}

.caption .priority {
  height: 60px;
  line-height: 60px;
  text-align: center;
  width: 62px;
  z-index: 100;
}
</style>
