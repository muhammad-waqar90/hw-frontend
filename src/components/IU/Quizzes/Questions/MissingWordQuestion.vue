<template>
  <section class="form-group my-2 my-md-3">
    <div>
      <div class="col-12 mb-3 mb-lg-5 white-space-no-wrap">
        <div class="d-flex flex-column">
          <div class="d-flex flex-wrap align-items-center white-space-normal">
            <div>
              <span class="">
                {{ parsedQuestion[0] }}
              </span>
              <span class="position-relative d-inline-block">
                <draggable
                  class="dragArea my-1 my-md-0 mx-1 border rounded d-flex position-relative"
                  :list="dragArea"
                  :style="'width:' + dragAreaWidth + 'px'"
                  group="people"
                  @change="change"
                >
                  <span class="placeholderText" />
                  <div
                    class="draggedWord w-100 h-100 d-flex justify-content-center align-items-center"
                  >
                    <div v-if="!dragArea.length" />
                    <div v-for="element in dragArea" :key="element.id">
                      {{ element.value }}
                    </div>
                  </div>
                </draggable>
              </span>
              <span class="">
                {{ parsedQuestion[1] }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <draggable
          class="dragItems"
          :list="answerList"
          :clone="clone"
          :group="{ name: 'people', pull: pullFunction }"
          @start="start"
        >
          <div
            v-for="element in answerList"
            :key="element.id"
            class="draggedItems rounded border m-2 py-2 text-center answerDrag cursor-pointer d-flex align-items-center justify-content-center"
          >
            {{ element.value }}
          </div>
        </draggable>
      </div>
    </div>
  </section>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
  },
  props: { question: Object },

  order: 4,
  data() {
    return {
      answer: null,
      answerList: [],
      dragArea: [],
      controlOnStart: true,
      dragAreaWidth: 100,
    };
  },

  computed: {
    answers() {
      return this.question.options;
    },
    parsedQuestion() {
      return this.question.question.split("____");
    },
  },

  created() {
    this.answerList = this.answers;
    this.calculateDropAreaWidth();
  },

  methods: {
    calculateDropAreaWidth() {
      let draggedItems = document.getElementsByClassName("draggedItems");

      for (let i = 0; i < draggedItems.length; i++) {
        let elWidth = draggedItems[i].getBoundingClientRect().width;
        if (elWidth > this.dragAreaWidth) {
          this.dragAreaWidth = elWidth;
        }
      }
    },

    clone({ value, id }) {
      return { value, id };
    },

    pullFunction() {
      return this.controlOnStart ? "clone" : true;
    },

    start({ originalEvent }) {
      this.controlOnStart = originalEvent.ctrlKey;
    },

    change({ added }) {
      if (this.dragArea.length > 1) {
        this.dragArea.forEach((item, index) => {
          if (item.id !== added.element.id) {
            this.answerList.push(item);
            this.dragArea.splice(index, 1);
          }
        });
      }
      this.$emit("on-answer-change", this.dragArea[0].id.toString());
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.questionContainer {
  padding-right: 15px;
  padding-left: 15px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  box-shadow: 1px 1px 10px #dedede;
  cursor: pointer;
}

.dragItems {
  display: flex;
  flex-wrap: wrap;
}

.answerDrag {
  min-width: 150px;
  background: $lightgray;
  &:hover {
    background: #b3b2b2;
  }
}

.dragArea {
  min-width: 150px;
  height: 40px;
  background: $lightgray;
  overflow: hidden;
  &:hover {
    width: 160px;
  }
}
.placeholderText {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  font-size: 14px;
}
.draggedWord {
  z-index: 1;
  background: $lightgray;
  max-width: 150px;
  min-height: 40px;
}
.white-space-no-wrap {
  white-space: nowrap;
}
.white-space-normal {
  white-space: normal;
}

@media (max-width: $laptopWidth) {
  .answerDrag {
    min-width: 120px;
  }
  .dragArea {
    min-width: 120px;
    height: 40px;
    &:hover {
      width: 130px;
    }
  }
}

@media (max-width: $tabletWidth) {
  .answerDrag {
    width: 100px;
    font-size: 0.9rem;
  }
  .dragItems {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
  }
  .dragArea {
    width: 100px;
    height: 40px;
    font-size: 0.9rem;
    &:hover {
      width: 110px;
    }
  }
}
</style>
