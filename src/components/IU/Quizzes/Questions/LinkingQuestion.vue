<template>
  <section class="form-group my-3">
    <h6>{{ question.question }}</h6>

    <div class="d-flex mt-4 justify-content-center">
      <div class="mx-1 d-flex flex-column justify-content-between">
        <div v-for="option in leftSide" :key="option.id" class="my-1">
          <div
            class="p-2 rounded matchingItem"
            :class="[
              activeLeftIndex == option.id &&
              !activeLeftIndexes.includes(option.id)
                ? 'border border-primary activeItem'
                : '',
            ]"
            @click="getLeftElementRect($event, option.id)"
          >
            <div class="form-check-opposite text-end">
              <label class="mb-0">
                {{ option.value }}
              </label>
              <input
                :checked="activeLeftIndexes.includes(option.id)"
                type="radio"
              />
            </div>
          </div>
        </div>
      </div>
      <canvas id="canvas" />
      <div class="mx-1 d-flex flex-column justify-content-between">
        <div v-for="option in rightSide" :key="option.id" class="my-1">
          <div
            class="p-2 rounded matchingItem"
            :class="[
              activeRightIndex == option.id &&
              !activeRightIndexes.includes(option.id)
                ? 'border border-primary activeItem'
                : '',
            ]"
            @click="getRightElementRect($event, option.id)"
          >
            <div class="form-check">
              <input
                :checked="activeRightIndexes.includes(option.id)"
                type="radio"
              />
              <label class="form-check-label">
                {{ option.value }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: { question: Object },

  data() {
    return {
      answer: null,
      leftElRect: null,
      rightElRect: null,
      activeLeftIndex: null,
      activeRightIndex: null,
      itemHeight: null,
      activeLeftIndexes: [],
      activeRightIndexes: [],
      matchedItems: [],
    };
  },

  computed: {
    leftSide() {
      return this.question.options.leftSide;
    },
    rightSide() {
      return this.question.options.rightSide;
    },
  },
  watch: {
    matchedItems() {
      this.initializeAnswers();
      this.matchedItems.forEach((item) => {
        this.answer[item.leftIndex] = item.rightIndex;
      });
      this.$emit("on-answer-change", this.answer);
    },
  },
  mounted() {
    this.initializeCanvas();

    this.initializeAnswers();
  },

  methods: {
    initializeAnswers() {
      const initAnswer = {};
      for (let i = 0; i < this.leftSide.length; i++) {
        initAnswer[this.leftSide[i].id] = null;
      }
      this.answer = initAnswer;
    },
    initializeCanvas() {
      var canvas = document.querySelector("canvas");
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      this.itemHeight = document.querySelector(".matchingItem").clientHeight;
    },

    refreshRect() {
      this.activeLeftIndex = null;
      this.leftElRect = null;

      this.activeRightIndex = null;
      this.rightElRect = null;
    },

    refreshIndexes() {
      this.activeLeftIndexes = [];
      this.activeRightIndexes = [];
    },

    checkPatternLeft(index) {
      this.matchedItems = this.matchedItems.filter(function (item) {
        return item.leftIndex != index;
      });

      this.redrawCanvas();
    },

    checkPatternRight(index) {
      this.matchedItems = this.matchedItems.filter(function (item) {
        return item.rightIndex != index;
      });

      this.redrawCanvas();
    },

    getLeftElementRect(e, index) {
      if (this.activeLeftIndexes.includes(index)) {
        this.checkPatternLeft(index);
        return;
      }

      if (this.activeLeftIndex === index) {
        return (this.activeLeftIndex = null);
      }

      (this.activeLeftIndex = index),
        (this.leftElRect = e.target.getBoundingClientRect());

      this.startDrawing();
    },

    getRightElementRect(e, index) {
      if (this.activeRightIndexes.includes(index)) {
        this.checkPatternRight(index);
        return;
      }

      if (this.activeRightIndex === index) {
        return (this.activeRightIndex = null);
      }

      (this.activeRightIndex = index),
        (this.rightElRect = e.target.getBoundingClientRect());

      this.startDrawing();
    },

    redrawCanvas() {
      this.refreshRect();

      var canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");

      context.clearRect(0, 0, canvas.width, canvas.height);

      this.refreshIndexes();

      this.matchedItems.forEach((item) => {
        this.activeLeftIndexes.push(item.leftIndex);
        this.activeRightIndexes.push(item.rightIndex);
        this.drawLine(item.leftRec, item.rightRec);
      });
    },

    startDrawing() {
      if (!this.activeLeftIndex || !this.activeRightIndex) return;

      if (this.leftElRect && this.rightElRect) {
        if (this.activeLeftIndexes.includes(this.activeLeftIndex)) {
          return;
        }
        if (this.activeRightIndexes.includes(this.activeRightIndex)) {
          return;
        }

        this.matchedItems.push({
          leftIndex: this.activeLeftIndex,
          rightIndex: this.activeRightIndex,
          leftRec: this.leftElRect,
          rightRec: this.rightElRect,
        });

        this.activeLeftIndexes.push(this.activeLeftIndex);
        this.activeRightIndexes.push(this.activeRightIndex);

        this.drawLine();
      }
    },

    drawLine(leftRect = null, rightRect = null) {
      var c = document.getElementById("canvas");
      var ctx = c.getContext("2d");
      this.vueCanvas = ctx;

      const targetRect = c.getBoundingClientRect();

      let left, topLeft, right, topRight;

      if (!leftRect && !rightRect) {
        topLeft = this.leftElRect.top - targetRect.top + this.itemHeight / 3;
        left = this.leftElRect.left - targetRect.left;
        topRight = this.rightElRect.top - targetRect.top + this.itemHeight / 3;
        right = this.rightElRect.left - targetRect.left;
      } else {
        topLeft = leftRect.top - targetRect.top + this.itemHeight / 3;
        left = leftRect.left - targetRect.left;
        topRight = rightRect.top - targetRect.top + this.itemHeight / 3;
        right = rightRect.left - targetRect.left;
      }

      ctx.beginPath();
      ctx.moveTo(left, topLeft);
      ctx.lineTo(right, topRight);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#1982ef";
      // ctx.strokeStyle = '#'+(Math.random()*0xFFFFFF<<0).toString(16); //INFO: Random color generator
      ctx.stroke();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.matchingItem {
  cursor: pointer;
  * {
    cursor: pointer;
  }
  &:hover {
    opacity: 0.7;
  }
  &.activeItem {
    margin: -1px;
  }
}

.form-check {
  padding-left: 0;
}

.form-check-opposite {
  position: relative;
  display: block;
  padding-right: 1.25rem;

  input {
    position: absolute;
    margin-top: 0.3rem;
    right: 0;
    pointer-events: none;
  }
}

label {
  max-width: 250px;
  white-space: normal;
  overflow-wrap: break-word;
}

@media (max-width: $tabletWidth) {
  #canvas {
    width: 35%;
  }
  label {
    max-width: 90px;
  }
}
</style>
