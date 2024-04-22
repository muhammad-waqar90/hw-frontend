<template>
  <div ref="qaRef" class="rounded-card bg-white blue-border p-5">
    <div class="row">
      <textarea
        ref="textarea"
        :key="updateKey"
        v-model.trim.lazy="$v.question.$model"
        :disabled="questionDisabled || this.qaApi.loading"
        :placeholder="
          resetNewText
            ? $t('iu.lesson.qaNewQuestionExample')
            : $t('iu.lesson.qaQuestionExample')
        "
        class="qa-textarea font-weight-600 text-dark-gray"
        :class="[
          { 'red-border-input': $v.question.$error },
          { 'pb-4': $isPhone },
        ]"
        :rows="textareaRows"
        @input="adjustTextfield()"
      />
      <p v-if="$v.question.$error" class="mb-0 text-red">
        <small v-if="!$v.question.required">
          {{ $t("errors.requiredFields") }}
        </small>
        <small v-else-if="!$v.question.minLength">
          {{
            $t("iu.lesson.errors.qaMinLetters", {
              num: $v.question.$params.minLength.min,
            })
          }}
        </small>
        <small v-else-if="!$v.question.maxLength">
          {{
            $t("iu.lesson.errors.qaMaxLetters", {
              num: $v.question.$params.maxLength.max,
            })
          }}
        </small>
        <small v-else-if="!$v.question.isSanitizeInput" class="text-danger">{{
          $t("errors.invalidFields")
        }}</small>
      </p>
    </div>
    <div
      class="row mt-3"
      :class="{
        'justify-content-center align-items-center ': $isPhone,
      }"
    >
      <button
        v-if="!answerSubmitted"
        class="col-auto btn btn-text rounded-pill text-uppercase font-weight-600 ms-auto px-3"
        :class="[
          questionDisabled ? 'light-gray-btn' : 'blue-btn',
          { 'sml-btn-text col-12': $isPhone },
        ]"
        :disabled="questionDisabled || qaApi.loading || $v.$invalid"
        @click="submit"
      >
        {{ $t("iu.lesson.qaSubmit") }}
      </button>
      <button
        v-else
        class="col-auto btn orange-btn btn-text rounded-pill text-uppercase font-weight-600 ms-auto px-3"
        :class="{ 'sml-btn-text col-12': $isPhone }"
        @click="reset()"
      >
        {{ $t("iu.lesson.qaReset") }}
      </button>
    </div>

    <div class="row mt-3">
      <div class="col-12 bg-gray rounded-card p-4">
        <div class="row">
          <div class="col d-flex align-items-center">
            <h5 class="mb-0 font-weight-600 text-dark-gray">
              {{ $t("iu.lesson.answer") }}
            </h5>
          </div>
          <div
            v-if="!answerSubmitted && questionDisabled && !disabledRefresh"
            class="col-auto d-flex justify-content-center align-items-center"
            @click="init()"
          >
            <svg-blue-reload class="icon-medium cursor-pointer" />
          </div>
          <div
            v-else-if="answerSubmitted || !questionDisabled || disabledRefresh"
            class="col-auto d-flex justify-content-center align-items-center"
          >
            <svg-gray-reload class="icon-medium" />
          </div>
        </div>
        <hr />
        <div v-if="answerSubmitted && questionDisabled" class="row">
          <p class="answer-text">
            {{ answerText }}
          </p>

          <div
            class="col rounded-card bg-light-blue font-weight-600 blue-section-text px-4 py-3 my-4"
            :class="$isPhone ? 'mx-1' : 'mx-5'"
          >
            <div class="row align-items-center justify-content-center">
              <div class="col-auto">
                {{ $t("iu.lesson.satisfiedWithAnswer") }}
              </div>
              <div class="col-auto">
                <button
                  class="btn blue-btn sml-btn-text rounded-pill text-uppercase font-weight-600 px-3 py-1"
                  @click="reset(true)"
                >
                  {{ $t("iu.lesson.clickHere") }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else-if="!answerSubmitted && questionDisabled"
          class="row justify-content-center align-items-center py-4"
        >
          <!-- Todo: -->
          <!-- we need to replace this loader with loadingcomponent modal -->
          <div class="col-auto">
            <lottie-logo-loader
              v-if="disabledRefresh"
              path="anims/hw-loader.json"
              :width="80"
              :height="80"
            />
          </div>
          <div class="col-lg-7 col-md-7 col-sm-10 col-xs-10 text-black">
            {{ $t("iu.lesson.qaLoading") }}
          </div>
        </div>
        <div v-else class="loading-height py-4" />
      </div>
    </div>
    <QaHistory :key="updateQaList" />
  </div>
</template>

<script>
import LottieLogoLoader from "lottie-vuejs/src/LottieAnimation.vue";

import { getLessonQA, submitLessonQA } from "@/services/iuService";

import apiMixin, { getApiState } from "@/mixins/apiMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import toastMixin from "@/mixins/toastMixin";
import SvgBlueReload from "@/assets/svg/blue-reload.svg";
import SvgGrayReload from "@/assets/svg/gray-reload.svg";

import QaHistory from "@/components/IU/Lessons/QaHistory";
import { validationMixin } from "vuelidate";
import { required, maxLength, minLength } from "vuelidate/lib/validators";
import dompurifyMixin from "@/mixins/dompurifyMixin";
import {
  autoAdjustTextareaHeightOnInput,
  autoAdjustTextareaHeightOnModelValue,
} from "@/utils/generalUtils";

export default {
  components: { LottieLogoLoader, SvgBlueReload, SvgGrayReload, QaHistory },
  mixins: [apiMixin, toastMixin, validationMixin, dompurifyMixin, devicesMixin],
  validations() {
    return {
      question: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(4000),
        isSanitizeInput: function (value) {
          return this.sanitizeWithBusinesslogic(value);
        },
      },
    };
  },
  computed: {
    textareaRows() {
      return this.$isPhone ? (this.resetNewText ? 3 : 2) : 1;
    },
  },
  data() {
    return {
      qaApi: getApiState(),
      question: "",
      answerText: "",

      answerSubmitted: false,
      questionDisabled: false,

      resetNewText: false,
      disabledRefresh: false,

      updateQaList: false,
      updateKey: false,
    };
  },
  mounted() {
    if (this.$route.hash) {
      const top = this.$refs.qaRef.offsetTop;
      window.scrollTo({
        top: top,
        behavior: "smooth",
      });
    }
    this.init(0);
  },
  methods: {
    async init() {
      this.resetNewText = false;

      this.disabledRefresh = true;

      await this.$fetchApiData(this.qaApi, () =>
        getLessonQA(this.$route.params.courseId, this.$route.params.lessonId)
      );

      if (this.qaApi?.data) {
        if (this.qaApi?.data?.question != null) {
          this.question = this.qaApi.data.question;
          autoAdjustTextareaHeightOnModelValue(
            this.$refs.textarea,
            this.question
          );
          this.questionDisabled = true;
          this.updateQaList = !this.updateQaList;
        } else {
          this.questionDisabled = false;
        }
        if (this.qaApi.data.answer != null) {
          this.answerText = this.qaApi.data.answer;
          this.answerSubmitted = true;
        } else {
          this.answerSubmitted = false;
        }
      } else {
        this.answerSubmitted = false;
        this.questionDisabled = false;
      }
      this.disabledRefresh = false;
    },

    async submit(time = 20000) {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.answerSubmitted = false;
      this.questionDisabled = true;
      this.disabledRefresh = true;
      const response = await submitLessonQA(
        this.$route.params.courseId,
        this.$route.params.lessonId,
        { question: this.question }
      );

      this.questionDisabled = true;
      this.disabledRefresh = false;
      if (response.error) {
        if (response.status == 422) {
          //As per business requirement we are using success toast there
          this.$displaySuccessToast(response.error);
        } else {
          this.$displayErrorToast(response.error);
        }
        return this.reset(true);
      }
      if (response?.data?.answer != null) {
        setTimeout(() => {
          this.answerText = response.data.answer;
          this.answerSubmitted = true;
          this.questionDisabled = true;
          this.updateQaList = !this.updateQaList;
        }, time);
      }
    },

    reset(newReset = false) {
      if (newReset) this.resetNewText = true;
      this.answerSubmitted = false;
      this.questionDisabled = false;
      this.question = "";
      this.answerText = "";
      this.qaApi.data = {};
      this.updateKey = !this.updateKey;
      this.$v.$reset();
    },

    adjustTextfield() {
      autoAdjustTextareaHeightOnInput(this.$refs.textarea);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.blue-border {
  border: 2px solid $blue;
}

.bg-gray {
  background-color: $bs-lightwhite;
}

.bg-light-blue {
  background-color: #bfdffe;
}

.blue-circle-icon {
  background-color: $blue;
  border-radius: 20px;
  padding: 0.5em;
}

.blue-section-text {
  font-size: 13px;
  color: #4d4d4d;
}

.sml-btn-text {
  font-size: 12px !important;
}

.qa-textarea {
  background-color: $bs-lightwhite;
  resize: none;
  border: none;
  outline: none;
  border-radius: 30px;
  padding: 0.8em 1em;
  overflow-y: hidden;
}

.btn-text {
  font-size: 14px;
}

hr {
  border-color: $blue;
  border-width: 2px;
  opacity: 1;
}

.answer-text {
  font-size: 14px;
  color: $black;
}

.red-border-input {
  border: 1px solid $red !important;
}

.loading-height {
  height: 128px;
}
</style>
